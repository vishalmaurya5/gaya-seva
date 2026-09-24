import { NextResponse } from 'next/server';
import { readCustomerAccess } from '@/lib/serverPaymentService';

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

    let records = readCustomerAccess();

    if (userId) {
      records = records.filter((r) => r.userId === userId);
    }

    return NextResponse.json(records, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch customer access records' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
