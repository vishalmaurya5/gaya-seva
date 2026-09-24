import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { sendEmail } from '@/lib/email/email';
import { validateRecipientEmail, isRateLimited } from '@/lib/email/validation';

function getResetTokensPath(): string {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'data', 'password_reset_tokens.json'),
    path.join(process.cwd(), 'data', 'password_reset_tokens.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

interface ResetTokenRecord {
  token: string;
  email: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

function saveResetToken(email: string, token: string): void {
  const filePath = getResetTokensPath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let tokens: ResetTokenRecord[] = [];
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      tokens = JSON.parse(raw);
    } catch (e) {
      tokens = [];
    }
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // 1 hour validity

  tokens.push({
    token,
    email: email.toLowerCase(),
    expiresAt,
    used: false,
    createdAt: now.toISOString(),
  });

  // Keep recent tokens only
  if (tokens.length > 500) tokens = tokens.slice(-500);

  fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2), 'utf-8');
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    // 1. Input check
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'If an account exists for this email, you will receive a password reset link.' },
        { status: 200 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Validate email syntax
    const validation = validateRecipientEmail(cleanEmail);
    if (!validation.valid) {
      // Generic response to prevent account enumeration
      return NextResponse.json(
        { message: 'If an account exists for this email, you will receive a password reset link.' },
        { status: 200 }
      );
    }

    // 3. Rate limiting check (max 3 reset attempts per email per 15 minutes)
    if (isRateLimited(`forgot_password:${cleanEmail}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { message: 'Too many reset requests. If an account exists, please check your inbox or try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // 4. Generate secure 256-bit random reset token
    const token = crypto.randomBytes(32).toString('hex');
    saveResetToken(cleanEmail, token);

    // 5. Construct HTTPS reset URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gayaseva.com';
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    // 6. Send Password Reset Email via server-side Gmail SMTP
    await sendEmail({
      event: 'PASSWORD_RESET',
      recipient: cleanEmail,
      variables: {
        user_name: cleanEmail.split('@')[0],
        reset_url: resetUrl,
      },
      relatedType: 'PASSWORD_RESET_REQUEST',
      relatedId: token.substring(0, 8),
    });

    // 7. Security: Always return generic response without revealing account existence
    return NextResponse.json(
      { message: 'If an account exists for this email, you will receive a password reset link.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { message: 'If an account exists for this email, you will receive a password reset link.' },
      { status: 200 }
    );
  }
}
