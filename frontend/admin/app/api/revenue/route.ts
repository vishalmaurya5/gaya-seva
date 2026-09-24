import { NextResponse } from 'next/server';
import { readPayments, readCustomerAccess } from '@/lib/serverPaymentService';

export async function GET() {
  try {
    const payments = readPayments();
    const accessRecords = readCustomerAccess();

    const successPayments = payments.filter((p) => p.status === 'SUCCESS');
    const grossRevenue = successPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Compute refunds
    const refundedPayments = payments.filter((p) => p.status === 'REFUNDED' || p.refundStatus === 'FULL');
    const totalRefunds = refundedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const netRevenue = grossRevenue - totalRefunds;

    // Purpose breakdown
    const customerAccessRevenue = successPayments
      .filter((p) => p.purpose === 'CUSTOMER_ACCESS')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const providerRegistrationRevenue = successPayments
      .filter((p) => p.purpose === 'PROVIDER_REGISTRATION')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const bookingRevenue = successPayments
      .filter((p) => p.purpose === 'BOOKING' || p.purpose === 'SERVICE_PAYMENT')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Timeframe filtering (Today, 7D, 30D)
    const now = new Date();
    const todayStr = now.toDateString();

    const todayRevenue = successPayments
      .filter((p) => new Date(p.createdAt).toDateString() === todayStr)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const weekRevenue = successPayments
      .filter((p) => new Date(p.createdAt) >= sevenDaysAgo)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
    const monthRevenue = successPayments
      .filter((p) => new Date(p.createdAt) >= thirtyDaysAgo)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Daily breakdown for charts
    const dailyMap: Record<string, { date: string; gross: number; count: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      dailyMap[label] = { date: label, gross: 0, count: 0 };
    }

    successPayments.forEach((p) => {
      const label = new Date(p.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      if (dailyMap[label]) {
        dailyMap[label].gross += p.amount;
        dailyMap[label].count += 1;
      }
    });

    return NextResponse.json({
      success: true,
      metrics: {
        grossRevenue,
        totalRefunds,
        netRevenue,
        customerAccessRevenue,
        providerRegistrationRevenue,
        bookingRevenue,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        totalTransactions: payments.length,
        successfulTransactions: successPayments.length,
        pendingTransactions: payments.filter((p) => p.status === 'PENDING').length,
        failedTransactions: payments.filter((p) => p.status === 'FAILED').length,
        activeCustomerPasses: accessRecords.filter((a) => a.status === 'ACTIVE').length,
      },
      chartData: Object.values(dailyMap),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to compute revenue metrics' }, { status: 500 });
  }
}
