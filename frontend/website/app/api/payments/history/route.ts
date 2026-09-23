import { NextResponse } from 'next/server';
import { readPayments } from '@/lib/serverPaymentService';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const purpose = searchParams.get('purpose');

    let payments = readPayments();

    if (userId) {
      payments = payments.filter((p) => p.userId === userId);
    }

    if (purpose && purpose !== 'ALL') {
      payments = payments.filter((p) => p.purpose === purpose);
    }

    return NextResponse.json(payments, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch payment history' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
