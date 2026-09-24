/**
 * GayaSeva Email Variable Substitutor & Sanitizer
 * Safe variable handling preventing credential leaks or unallowed environment values.
 */

export interface SystemDefaultVariables {
  brand_name: string;
  support_email: string;
  website_url: string;
  support_phone: string;
  address_line: string;
  current_year: string;
  privacy_url: string;
  terms_url: string;
  login_url: string;
  dashboard_url: string;
}

export const DEFAULT_EMAIL_VARIABLES: SystemDefaultVariables = {
  brand_name: 'GayaSeva',
  support_email: process.env.SMTP_REPLY_TO || 'support@gayaseva.com',
  website_url: process.env.NEXT_PUBLIC_APP_URL || 'https://gayaseva.com',
  support_phone: '+91 94310 12345',
  address_line: 'Vishnupad Temple Road, Chand Chaura, Gaya, Bihar 823001',
  current_year: new Date().getFullYear().toString(),
  privacy_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gayaseva.com'}/privacy`,
  terms_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gayaseva.com'}/terms`,
  login_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gayaseva.com'}/auth/login`,
  dashboard_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gayaseva.com'}/dashboard`,
};

// List of strictly prohibited keys that must never be interpolated into templates
const PROHIBITED_KEYS = new Set([
  'smtp_password',
  'smtp_user',
  'smtp_host',
  'clerk_secret_key',
  'supabase_service_role_key',
  'razorpay_key_secret',
  'password',
  'token',
  'raw_password',
  'secret',
]);

/**
 * Replaces placeholders in double curly braces {{var_name}} with sanitized values.
 */
export function substituteVariables(
  templateStr: string,
  userVariables: Record<string, any> = {}
): string {
  if (!templateStr) return '';

  const merged: Record<string, any> = {
    ...DEFAULT_EMAIL_VARIABLES,
    ...sanitizeVariables(userVariables),
  };

  return templateStr.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (match, key) => {
    const lowerKey = key.toLowerCase();
    if (PROHIBITED_KEYS.has(lowerKey)) {
      return '[REDACTED]';
    }
    const val = merged[key] ?? merged[lowerKey];
    if (val !== undefined && val !== null) {
      return String(val);
    }
    return match; // Keep unresolved placeholder if not provided
  });
}

/**
 * Sanitizes input variables object, removing non-serializable objects and dangerous keys.
 */
export function sanitizeVariables(rawVariables: Record<string, any> = {}): Record<string, string> {
  const result: Record<string, string> = {};

  if (!rawVariables || typeof rawVariables !== 'object') {
    return result;
  }

  for (const [key, value] of Object.entries(rawVariables)) {
    const lower = key.toLowerCase();
    if (PROHIBITED_KEYS.has(lower)) {
      continue; // Skip security sensitive keys
    }

    if (value === null || value === undefined) {
      result[key] = '';
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      result[key] = String(value);
    } else if (value instanceof Date) {
      result[key] = value.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      // Avoid printing raw JSON of credentials or complex objects
      result[key] = '[Data]';
    }
  }

  return result;
}
