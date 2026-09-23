import { NextResponse } from 'next/server';
import { createPaymentOrderServer } from '@/lib/serverPaymentService';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, purpose, providerId } = body;

    if (!userId || !purpose) {
      return NextResponse.json(
        { error: 'userId and purpose are required fields' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const orderData = await createPaymentOrderServer(userId, purpose, providerId);
    return NextResponse.json(orderData, { status: 201, headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to create payment order' },
      { status: 400, headers: corsHeaders() }
    );
  }
}
