import { NextResponse } from 'next/server';
import { hasActiveCustomerAccess, readCustomerAccess } from '@/lib/serverPaymentService';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    if (!userId) {
      return NextResponse.json({ hasAccess: false, status: 'UNAUTHENTICATED' }, { headers: corsHeaders() });
    }

    const isAccessActive = hasActiveCustomerAccess(userId);
    const records = readCustomerAccess().filter((r) => r.userId === userId);
    const activeRecord = records.find((r) => r.status === 'ACTIVE');

    return NextResponse.json(
      {
        hasAccess: isAccessActive,
        status: isAccessActive ? 'ACTIVE' : (activeRecord ? activeRecord.status : 'INACTIVE'),
        record: activeRecord || null,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch access status' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
