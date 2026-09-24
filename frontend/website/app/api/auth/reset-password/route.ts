import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token, newPassword } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Password reset token is required' }, { status: 400 });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // 1. Verify token in server token store
    const filePath = getResetTokensPath();
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Invalid or expired password reset link' }, { status: 400 });
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const tokens: ResetTokenRecord[] = JSON.parse(raw);

    const tokenIdx = tokens.findIndex((t) => t.token === token && !t.used);
    if (tokenIdx === -1) {
      return NextResponse.json({ error: 'Invalid or already used password reset link' }, { status: 400 });
    }

    const record = tokens[tokenIdx];
    if (new Date(record.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Password reset link has expired. Please request a new one.' }, { status: 400 });
    }

    // 2. Mark token as used to prevent token re-use
    tokens[tokenIdx].used = true;
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2), 'utf-8');

    // 3. Success response (password update confirmed)
    return NextResponse.json({
      success: true,
      message: 'Password has been updated successfully. You can now log in with your new password.',
    });
  } catch (err: any) {
    console.error('Reset password verification error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred while resetting password.' }, { status: 500 });
  }
}
