import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readPayments, writePayments, readCustomerAccess, writeCustomerAccess, readSystemConfig } from '@/lib/serverPaymentService';

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const bodyText = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(bodyText)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(bodyText);
    const eventType = event.event;

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const payload = event.payload.payment ? event.payload.payment.entity : event.payload.order.entity;
      const orderId = payload.order_id || payload.id;
      const paymentId = payload.id || payload.payment_id;
      const notes = payload.notes || {};

      const userId = notes.userId;
      const purpose = notes.purpose || 'CUSTOMER_ACCESS';

      if (userId) {
        const payments = readPayments();
        const existingIndex = payments.findIndex(
          (p) => p.razorpayOrderId === orderId || (p.userId === userId && p.purpose === purpose && p.status === 'PENDING')
        );

        const nowIso = new Date().toISOString();

        if (existingIndex !== -1) {
          if (payments[existingIndex].status !== 'SUCCESS') {
            payments[existingIndex].status = 'SUCCESS';
            payments[existingIndex].razorpayPaymentId = paymentId;
            payments[existingIndex].paidAt = nowIso;
            writePayments(payments);
          }
        }

        if (purpose === 'CUSTOMER_ACCESS') {
          const accessRecords = readCustomerAccess();
          const systemConfig = readSystemConfig();

          const existingAccess = accessRecords.find((a) => a.userId === userId);
          if (!existingAccess || existingAccess.status !== 'ACTIVE') {
            let expiresAt: string | null = null;
            if (systemConfig.customer_access_duration_days > 0) {
              const exp = new Date();
              exp.setDate(exp.getDate() + systemConfig.customer_access_duration_days);
              expiresAt = exp.toISOString();
            }

            const newAccess = {
              id: existingAccess ? existingAccess.id : `acc_${Date.now()}`,
              userId,
              accessType: systemConfig.customer_access_duration_days > 0 ? ('SUBSCRIPTION' as const) : ('LIFETIME' as const),
              status: 'ACTIVE' as const,
              amount: systemConfig.customer_access_fee,
              currency: systemConfig.currency || 'INR',
              paymentId: paymentId,
              orderId: orderId,
              activatedAt: nowIso,
              expiresAt,
              createdAt: existingAccess ? existingAccess.createdAt : nowIso,
              updatedAt: nowIso,
            };

            if (existingAccess) {
              const idx = accessRecords.findIndex((a) => a.userId === userId);
              accessRecords[idx] = newAccess;
            } else {
              accessRecords.unshift(newAccess);
            }

            writeCustomerAccess(accessRecords);
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: err?.message || 'Webhook processing failed' }, { status: 500 });
  }
}
