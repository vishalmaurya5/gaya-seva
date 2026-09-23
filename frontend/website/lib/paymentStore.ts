export type PaymentPurpose = 'CUSTOMER_ACCESS' | 'PROVIDER_REGISTRATION' | 'BOOKING' | 'SERVICE_PAYMENT' | 'OTHER';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface PaymentRecord {
  id: string;
  userId: string;
  providerId?: string;
  purpose: PaymentPurpose;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: PaymentStatus;
  refundStatus?: 'NONE' | 'PARTIAL' | 'FULL';
  metadata?: Record<string, any>;
  createdAt: string;
  paidAt?: string;
  updatedAt?: string;
}

export interface CustomerAccessRecord {
  id: string;
  userId: string;
  accessType: 'LIFETIME' | 'SUBSCRIPTION';
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'REVOKED' | 'FAILED';
  amount: number;
  currency: string;
  paymentId?: string;
  orderId?: string;
  activatedAt?: string;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

const PAYMENTS_KEY = 'GAYASEVA_PAYMENTS_STORE';
const ACCESS_KEY = 'GAYASEVA_CUSTOMER_ACCESS_STORE';

export const PaymentStore = {
  getPayments(): PaymentRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(PAYMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async fetchPaymentsFromApi(): Promise<PaymentRecord[]> {
    if (typeof window === 'undefined') return [];
    try {
      const res = await fetch('/api/payments/history', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(PAYMENTS_KEY, JSON.stringify(data));
          window.dispatchEvent(new Event('storage'));
          return data;
        }
      }
    } catch (e) {}
    return this.getPayments();
  },

  getUserPayments(userId: string): PaymentRecord[] {
    return this.getPayments().filter((p) => p.userId === userId);
  },

  getCustomerAccessRecords(): CustomerAccessRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(ACCESS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async fetchAccessRecordsFromApi(): Promise<CustomerAccessRecord[]> {
    if (typeof window === 'undefined') return [];
    try {
      const res = await fetch('/api/payments/access-status', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(ACCESS_KEY, JSON.stringify(data));
          window.dispatchEvent(new Event('storage'));
          return data;
        }
      }
    } catch (e) {}
    return this.getCustomerAccessRecords();
  },

  hasActiveCustomerAccess(userId: string): boolean {
    if (!userId) return false;
    const records = this.getCustomerAccessRecords();
    const userRecord = records.find((r) => r.userId === userId && r.status === 'ACTIVE');
    if (!userRecord) return false;
    if (userRecord.expiresAt && new Date(userRecord.expiresAt) < new Date()) {
      return false;
    }
    return true;
  }
};
