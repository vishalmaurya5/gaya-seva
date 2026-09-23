import { NextResponse } from 'next/server';
import { verifyPaymentServer } from '@/lib/serverPaymentService';

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, purpose } = body;

    if (!razorpay_order_id || !userId || !purpose) {
      return NextResponse.json(
        { error: 'razorpay_order_id, userId, and purpose are required for verification' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const result = await verifyPaymentServer({
      razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id || `pay_mock_${Date.now()}`,
      razorpay_signature: razorpay_signature || '',
      userId,
      purpose,
    });

    return NextResponse.json(result, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Payment verification failed' },
      { status: 400, headers: corsHeaders() }
    );
  }
}
