import { NextResponse } from 'next/server';
import { verifySmtpConnection } from '@/lib/email/email';

export async function GET() {
  try {
    const health = await verifySmtpConnection();
    return NextResponse.json({ success: true, health });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      health: {
        status: 'ERROR',
        message: err?.message || 'SMTP Health Check Error',
        configured: false,
        host: 'smtp.gmail.com',
        port: 465,
        fromEmail: 'support@gayaseva.com',
        lastChecked: new Date().toISOString(),
      },
    });
  }
}
