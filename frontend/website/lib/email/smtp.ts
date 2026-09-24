/**
 * GayaSeva Server-Side Gmail SMTP Transport
 * STRICT SECURITY: Never expose SMTP credentials to the browser or client-side bundles.
 */

import 'server-only';
import nodemailer from 'nodemailer';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
}

export interface SmtpHealthStatus {
  status: 'HEALTHY' | 'WARNING' | 'ERROR';
  message: string;
  configured: boolean;
  host: string;
  port: number;
  fromEmail: string;
  lastChecked: string;
}

/**
 * Reads server-side SMTP configuration from environment variables.
 */
export function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE !== 'false';
  const user = process.env.SMTP_USER || '';
  const fromEmail = process.env.SMTP_FROM_EMAIL || user || 'support@gayaseva.com';
  const fromName = process.env.SMTP_FROM_NAME || 'GayaSeva';
  const replyTo = process.env.SMTP_REPLY_TO || fromEmail;

  return {
    host,
    port,
    secure,
    user,
    fromEmail,
    fromName,
    replyTo,
  };
}

let cachedTransporter: nodemailer.Transporter | null = null;

/**
 * Returns a singleton Nodemailer transporter instance configured for Gmail SMTP.
 */
export function getSmtpTransporter(): nodemailer.Transporter {
  if (typeof window !== 'undefined') {
    throw new Error('CRITICAL SECURITY ERROR: SMTP Transporter cannot be accessed on the client-side browser!');
  }

  if (cachedTransporter) {
    return cachedTransporter;
  }

  const config = getSmtpConfig();
  const pass = process.env.SMTP_PASSWORD || '';

  // Check if credentials exist
  if (!config.user || !pass) {
    console.warn('⚠️ SMTP Warning: SMTP_USER or SMTP_PASSWORD is not configured. Emails will be logged locally.');
  }

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: pass,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
    pool: true, // Use pooled connections for performance
    maxConnections: 5,
    maxMessages: 100,
  });

  return cachedTransporter;
}

/**
 * Verifies SMTP connection and authentication health without leaking passwords.
 */
export async function verifySmtpConnection(): Promise<SmtpHealthStatus> {
  const config = getSmtpConfig();
  const pass = process.env.SMTP_PASSWORD || '';
  const now = new Date().toISOString();

  if (!config.user || !pass) {
    return {
      status: 'WARNING',
      message: 'SMTP credentials (SMTP_USER / SMTP_PASSWORD) are not set in environment variables. Email simulation mode active.',
      configured: false,
      host: config.host,
      port: config.port,
      fromEmail: config.fromEmail,
      lastChecked: now,
    };
  }

  try {
    const transporter = getSmtpTransporter();
    await transporter.verify();
    return {
      status: 'HEALTHY',
      message: `Successfully authenticated with Gmail SMTP server (${config.host}:${config.port})`,
      configured: true,
      host: config.host,
      port: config.port,
      fromEmail: config.fromEmail,
      lastChecked: now,
    };
  } catch (err: any) {
    const safeError = err?.message || 'SMTP Authentication failed';
    return {
      status: 'ERROR',
      message: `SMTP Connection Failed: ${safeError}`,
      configured: true,
      host: config.host,
      port: config.port,
      fromEmail: config.fromEmail,
      lastChecked: now,
    };
  }
}
