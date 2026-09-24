/**
 * GayaSeva Central Email Service Orchestrator
 * Server-side transaction-safe email delivery pipeline with logging & retry queue.
 */

import fs from 'fs';
import path from 'path';
import { EmailEventKey } from './events';
import { getSmtpTransporter, getSmtpConfig, verifySmtpConnection, SmtpHealthStatus } from './smtp';
import { renderEmailTemplate, EmailTemplateRecord, getDefaultTemplatesList } from './templates';
import { validateRecipientEmail, isRateLimited } from './validation';
import { sanitizeVariables } from './variables';

export interface SendEmailPayload {
  event: EmailEventKey;
  recipient: string;
  variables?: Record<string, any>;
  relatedType?: string;
  relatedId?: string;
  asyncQueue?: boolean;
}

export interface EmailLogRecord {
  id: string;
  event_key: EmailEventKey;
  recipient: string;
  subject: string;
  status: 'QUEUED' | 'SENDING' | 'SENT' | 'FAILED' | 'RETRYING';
  provider_message_id?: string;
  related_type?: string;
  related_id?: string;
  error_message_safe?: string;
  retry_count: number;
  created_at: string;
  sent_at?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  logId: string;
  error?: string;
  queued?: boolean;
}

// Data persistence paths
function getStorePath(filename: string): string {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'data', filename),
    path.join(process.cwd(), 'data', filename),
    path.join(process.cwd(), '..', '..', 'data', filename),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = getStorePath(filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (e) {
    console.error(`Error reading ${filename}:`, e);
  }
  return fallback;
}

function writeJsonFile<T>(filename: string, data: T): void {
  try {
    const filePath = getStorePath(filename);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Error writing ${filename}:`, e);
  }
}

/**
 * Reads email templates store
 */
export function getEmailTemplates(): EmailTemplateRecord[] {
  const custom = readJsonFile<EmailTemplateRecord[]>('email_templates.json', []);
  const defaults = getDefaultTemplatesList();

  // Merge custom over defaults
  const mergedMap = new Map<string, EmailTemplateRecord>();
  defaults.forEach((d) => mergedMap.set(d.event_key, d));
  custom.forEach((c) => mergedMap.set(c.event_key, c));

  return Array.from(mergedMap.values());
}

/**
 * Saves or updates an email template
 */
export function saveEmailTemplate(updated: Partial<EmailTemplateRecord> & { event_key: EmailEventKey }): EmailTemplateRecord {
  const current = getEmailTemplates();
  const existingIdx = current.findIndex((t) => t.event_key === updated.event_key);
  const now = new Date().toISOString();

  let target: EmailTemplateRecord;

  if (existingIdx !== -1) {
    target = {
      ...current[existingIdx],
      ...updated,
      version: (current[existingIdx].version || 1) + 1,
      updated_at: now,
    };
    current[existingIdx] = target;
  } else {
    target = {
      id: `tpl_${Date.now()}`,
      event_key: updated.event_key,
      subject: updated.subject || '',
      preheader: updated.preheader || '',
      html_body: updated.html_body || '',
      text_body: updated.text_body || '',
      active: updated.active ?? true,
      version: 1,
      created_at: now,
      updated_at: now,
      updated_by: updated.updated_by || 'admin',
    };
    current.push(target);
  }

  writeJsonFile('email_templates.json', current);
  return target;
}

/**
 * Gets email logs
 */
export function getEmailLogs(): EmailLogRecord[] {
  return readJsonFile<EmailLogRecord[]>('email_logs.json', []);
}

function saveEmailLog(log: EmailLogRecord): void {
  const logs = getEmailLogs();
  const idx = logs.findIndex((l) => l.id === log.id);
  if (idx !== -1) {
    logs[idx] = log;
  } else {
    logs.unshift(log); // newest first
  }
  // Keep last 1000 logs
  if (logs.length > 1000) logs.pop();
  writeJsonFile('email_logs.json', logs);
}

/**
 * Central function to send emails safely across the application
 */
export async function sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  const { event, recipient, variables = {}, relatedType, relatedId } = payload;
  const nowIso = new Date().toISOString();
  const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Validate Recipient Email
  const validation = validateRecipientEmail(recipient);
  if (!validation.valid) {
    const errorMsg = validation.error || 'Invalid recipient email format';
    const failLog: EmailLogRecord = {
      id: logId,
      event_key: event,
      recipient: recipient || 'unknown',
      subject: 'Validation Failed',
      status: 'FAILED',
      related_type: relatedType,
      related_id: relatedId,
      error_message_safe: errorMsg,
      retry_count: 0,
      created_at: nowIso,
    };
    saveEmailLog(failLog);
    return { success: false, logId, error: errorMsg };
  }

  // 2. Rate Limiting Check for sensitive triggers
  if (['PASSWORD_RESET', 'EMAIL_VERIFICATION'].includes(event)) {
    if (isRateLimited(`${event}:${recipient.toLowerCase()}`, 4, 15 * 60 * 1000)) {
      const errorMsg = 'Rate limit exceeded for recipient. Please try again after 15 minutes.';
      const failLog: EmailLogRecord = {
        id: logId,
        event_key: event,
        recipient,
        subject: 'Rate Limit Exceeded',
        status: 'FAILED',
        related_type: relatedType,
        related_id: relatedId,
        error_message_safe: errorMsg,
        retry_count: 0,
        created_at: nowIso,
      };
      saveEmailLog(failLog);
      return { success: false, logId, error: errorMsg };
    }
  }

  // 3. Load Template & Render
  const templates = getEmailTemplates();
  const templateRecord = templates.find((t) => t.event_key === event);
  const cleanVars = sanitizeVariables(variables);
  const rendered = renderEmailTemplate(event, cleanVars, templateRecord);

  // Initial Log Entry
  const initialLog: EmailLogRecord = {
    id: logId,
    event_key: event,
    recipient,
    subject: rendered.subject,
    status: 'SENDING',
    related_type: relatedType,
    related_id: relatedId,
    retry_count: 0,
    created_at: nowIso,
  };
  saveEmailLog(initialLog);

  // 4. Send Email via Gmail SMTP Transporter
  try {
    const transporter = getSmtpTransporter();
    const smtpConfig = getSmtpConfig();

    const mailOptions = {
      from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
      replyTo: smtpConfig.replyTo,
      to: recipient,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    };

    const info = await transporter.sendMail(mailOptions);
    const messageId = info.messageId || `msg_${Date.now()}`;

    // Update Log to SENT
    initialLog.status = 'SENT';
    initialLog.provider_message_id = messageId;
    initialLog.sent_at = new Date().toISOString();
    saveEmailLog(initialLog);

    return {
      success: true,
      messageId,
      logId,
    };
  } catch (err: any) {
    const rawError = err?.message || String(err);
    // Redact sensitive secrets from error string if present
    const safeError = rawError.replace(/pass(word)?\s*[:=]\s*\S+/gi, 'pass=[REDACTED]');

    console.warn(`[GayaSeva Email] Send failed for ${event} to ${recipient}: ${safeError}`);

    // Update Log to FAILED
    initialLog.status = 'FAILED';
    initialLog.error_message_safe = safeError;
    saveEmailLog(initialLog);

    return {
      success: false,
      logId,
      queued: true,
      error: safeError,
    };
  }
}

/**
 * Super Admin function to send a test email
 */
export async function sendTestEmail(recipient: string): Promise<SendEmailResult> {
  const testVars = {
    user_name: 'GayaSeva Admin Tester',
    provider_name: 'Rahul Kumar Pandit',
    provider_type: 'Pandit Ji',
    service_name: 'Pind Daan & Vedic Rituals',
    amount: '49',
    currency: 'INR',
    payment_id: `pay_test_${Date.now()}`,
    order_id: `ord_test_${Date.now()}`,
    payment_date: new Date().toLocaleDateString('en-IN'),
    status: 'VERIFIED SUCCESSFUL',
    reset_url: 'https://gayaseva.com/auth/reset-password?token=test_token',
    verification_url: 'https://gayaseva.com/auth/verify?token=test_token',
    reason: 'Test email system connection benchmark',
  };

  return sendEmail({
    event: 'PROVIDER_REGISTERED',
    recipient,
    variables: testVars,
    relatedType: 'SMTP_TEST',
    relatedId: 'test_admin_trigger',
  });
}

/**
 * Retries failed emails in background queue
 */
export async function retryFailedEmails(): Promise<{ retried: number; succeeded: number }> {
  const logs = getEmailLogs();
  const failedLogs = logs.filter((l) => l.status === 'FAILED' && l.retry_count < 3);

  let retried = 0;
  let succeeded = 0;

  for (const log of failedLogs) {
    retried++;
    log.status = 'RETRYING';
    log.retry_count += 1;
    saveEmailLog(log);

    const res = await sendEmail({
      event: log.event_key,
      recipient: log.recipient,
      relatedType: log.related_type,
      relatedId: log.related_id,
    });

    if (res.success) {
      succeeded++;
    }
  }

  return { retried, succeeded };
}

export { verifySmtpConnection };
