import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/email/email';
import { validateRecipientEmail } from '@/lib/email/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { recipient } = body;

    if (!recipient || typeof recipient !== 'string') {
      return NextResponse.json({ error: 'Test recipient email address is required' }, { status: 400 });
    }

    const val = validateRecipientEmail(recipient);
    if (!val.valid) {
      return NextResponse.json({ error: val.error || 'Invalid test recipient email' }, { status: 400 });
    }

    const result = await sendTestEmail(recipient.trim());

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `SMTP connection successful! Test email delivered to ${recipient}`,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'SMTP delivery attempt failed',
          queued: result.queued,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to trigger test email' }, { status: 500 });
  }
}
