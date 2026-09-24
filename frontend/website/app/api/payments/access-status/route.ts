import { NextResponse } from 'next/server';
import { readCustomerAccess } from '@/lib/serverPaymentService';

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

    const records = readCustomerAccess();
    if (!userId) {
      return NextResponse.json(records, { headers: corsHeaders() });
    }

    const userRecords = records.filter((r) => r.userId === userId);
    const activeRecord = userRecords.find(
      (r) => r.status === 'ACTIVE' && (!r.expiresAt || new Date(r.expiresAt) >= new Date())
    );

    return NextResponse.json(
      {
        hasAccess: !!activeRecord,
        record: activeRecord || null,
        records: userRecords,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch customer access records' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    const records = readCustomerAccess();
    const userRecords = userId ? records.filter((r) => r.userId === userId) : [];
    const activeRecord = userRecords.find(
      (r) => r.status === 'ACTIVE' && (!r.expiresAt || new Date(r.expiresAt) >= new Date())
    );

    return NextResponse.json(
      {
        hasAccess: !!activeRecord,
        record: activeRecord || null,
        records: userRecords,
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
