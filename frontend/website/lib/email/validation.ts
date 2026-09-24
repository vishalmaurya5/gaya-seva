/**
 * GayaSeva Email Validation & Rate Limiting System
 * Prevents spam relays, abusive triggers, and malformed email attempts.
 */

import { z } from 'zod';

const emailSchema = z.string().trim().email('Invalid email address format');

// In-memory rate limiter for server runtime (resets on process restart)
const rateLimitMap = new Map<string, { count: number; firstSeen: number }>();

/**
 * Validates recipient email address format.
 */
export function validateRecipientEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Recipient email address is required' };
  }

  const clean = email.trim();
  const parsed = emailSchema.safeParse(clean);
  if (!parsed.success) {
    return { valid: false, error: 'Invalid recipient email address syntax' };
  }

  // Prevent internal domain spoofing or dummy example domains in production
  if (clean.endsWith('@example.com') || clean.endsWith('@test.com') || clean.endsWith('@localhost')) {
    if (process.env.NODE_ENV === 'production') {
      return { valid: false, error: 'Test/example domain emails are prohibited in production environment' };
    }
  }

  return { valid: true };
}

/**
 * Rate limiting check to prevent spam relay attacks.
 * @param identifier e.g. "password_reset:user@domain.com" or "ip:192.168.1.1"
 * @param maxRequests max allowed requests per window
 * @param windowMs time window in milliseconds (default 15 minutes)
 */
export function isRateLimited(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record) {
    rateLimitMap.set(identifier, { count: 1, firstSeen: now });
    return false;
  }

  if (now - record.firstSeen > windowMs) {
    // Window expired, reset counter
    rateLimitMap.set(identifier, { count: 1, firstSeen: now });
    return false;
  }

  if (record.count >= maxRequests) {
    return true; // Rate limit exceeded!
  }

  record.count += 1;
  return false;
}

/**
 * Sanitizes generic user text input to prevent XSS/Script tags inside email templates.
 */
export function sanitizeTextInput(input?: string): string {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}
