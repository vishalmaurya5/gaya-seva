import { NextResponse } from 'next/server';
import { readSystemConfig, writeSystemConfig } from '@/lib/serverPaymentService';
import { SystemConfig } from '@/lib/configStore';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  const config = readSystemConfig();
  return NextResponse.json(config, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = readSystemConfig();
    const updated: SystemConfig = {
      customer_access_fee: typeof body.customer_access_fee === 'number' ? body.customer_access_fee : current.customer_access_fee,
      provider_registration_fee: typeof body.provider_registration_fee === 'number' ? body.provider_registration_fee : current.provider_registration_fee,
      customer_access_duration_days: typeof body.customer_access_duration_days === 'number' ? body.customer_access_duration_days : current.customer_access_duration_days,
      currency: body.currency || current.currency,
      payment_enabled: typeof body.payment_enabled === 'boolean' ? body.payment_enabled : current.payment_enabled,
      refund_enabled: typeof body.refund_enabled === 'boolean' ? body.refund_enabled : current.refund_enabled,
    };
    writeSystemConfig(updated);
    return NextResponse.json(updated, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update config' }, { status: 400, headers: corsHeaders() });
  }
}
