import { NextResponse } from 'next/server';
import { getEmailTemplates, saveEmailTemplate } from '@/lib/email/email';
import { EmailEventKey } from '@/lib/email/events';

export async function GET() {
  try {
    const templates = getEmailTemplates();
    return NextResponse.json({ success: true, templates });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch email templates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event_key, subject, preheader, html_body, text_body, active, updated_by } = body;

    if (!event_key) {
      return NextResponse.json({ error: 'event_key is required' }, { status: 400 });
    }

    const saved = saveEmailTemplate({
      event_key: event_key as EmailEventKey,
      subject,
      preheader,
      html_body,
      text_body,
      active,
      updated_by: updated_by || 'admin',
    });

    return NextResponse.json({ success: true, template: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update email template' }, { status: 500 });
  }
}
