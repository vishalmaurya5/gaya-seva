/**
 * GayaSeva Server-Side Booking State Machine & Double-Booking Protection
 * Single Source of Truth for Booking States, Valid Transitions & Conflict Detection.
 */

export type BookingStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface BookingStateTransitionRule {
  from: BookingStatus;
  to: BookingStatus;
  allowedRoles: ('PROVIDER' | 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'SYSTEM')[];
}

export const BOOKING_TRANSITION_RULES: BookingStateTransitionRule[] = [
  // Provider accept/reject flow
  { from: 'NEW', to: 'ACCEPTED', allowedRoles: ['PROVIDER', 'ADMIN', 'SUPER_ADMIN'] },
  { from: 'NEW', to: 'REJECTED', allowedRoles: ['PROVIDER', 'ADMIN', 'SUPER_ADMIN'] },
  { from: 'NEW', to: 'EXPIRED', allowedRoles: ['SYSTEM', 'ADMIN', 'SUPER_ADMIN'] },

  // Confirmation flow
  { from: 'ACCEPTED', to: 'CONFIRMED', allowedRoles: ['PROVIDER', 'CUSTOMER', 'ADMIN', 'SUPER_ADMIN'] },
  { from: 'ACCEPTED', to: 'CANCELLED', allowedRoles: ['PROVIDER', 'CUSTOMER', 'ADMIN', 'SUPER_ADMIN'] },

  // Service execution flow
  { from: 'CONFIRMED', to: 'IN_PROGRESS', allowedRoles: ['PROVIDER', 'ADMIN', 'SUPER_ADMIN'] },
  { from: 'CONFIRMED', to: 'CANCELLED', allowedRoles: ['PROVIDER', 'CUSTOMER', 'ADMIN', 'SUPER_ADMIN'] },

  // Completion flow
  { from: 'IN_PROGRESS', to: 'COMPLETED', allowedRoles: ['PROVIDER', 'ADMIN', 'SUPER_ADMIN'] },
];

export interface ServiceBookingRecord {
  id: string;
  requestId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  serviceTitle: string;
  bookingDate: string;
  bookingTime: string;
  pickupAddress?: string;
  dropAddress?: string;
  passengersCount?: number;
  amount: number;
  status: BookingStatus;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'REFUNDED';
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Validates whether a state transition is mathematically & logically allowed.
 */
export function validateBookingStateTransition(
  currentStatus: BookingStatus,
  nextStatus: BookingStatus,
  actorRole: 'PROVIDER' | 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'SYSTEM'
): { valid: boolean; error?: string } {
  // Check if terminal state reached
  if (['COMPLETED', 'REJECTED', 'CANCELLED', 'EXPIRED'].includes(currentStatus)) {
    return {
      valid: false,
      error: `Illegal Transition: Booking is in terminal state (${currentStatus}) and cannot be modified.`,
    };
  }

  const rule = BOOKING_TRANSITION_RULES.find(
    (r) => r.from === currentStatus && r.to === nextStatus
  );

  if (!rule) {
    return {
      valid: false,
      error: `Invalid State Transition: Cannot move booking state from ${currentStatus} to ${nextStatus}.`,
    };
  }

  if (!rule.allowedRoles.includes(actorRole)) {
    return {
      valid: false,
      error: `Unauthorized: Role '${actorRole}' is not permitted to transition booking from ${currentStatus} to ${nextStatus}.`,
    };
  }

  return { valid: true };
}

/**
 * Server-Side Double Booking Conflict Protection
 * Prevents accepting or confirming overlapping bookings for the same provider.
 */
export function checkDoubleBookingConflict(
  existingBookings: ServiceBookingRecord[],
  providerId: string,
  targetDate: string,
  targetTime: string,
  excludeBookingId?: string
): { hasConflict: boolean; conflictingBooking?: ServiceBookingRecord } {
  const activeBookings = existingBookings.filter(
    (b) =>
      b.providerId === providerId &&
      ['ACCEPTED', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status) &&
      b.id !== excludeBookingId
  );

  for (const b of activeBookings) {
    if (b.bookingDate === targetDate) {
      // Check time overlap (same hour or exact time match)
      if (b.bookingTime === targetTime) {
        return { hasConflict: true, conflictingBooking: b };
      }
    }
  }

  return { hasConflict: false };
}

/**
 * Returns human-readable UI badge configuration for booking status
 */
export function getBookingStatusBadge(status: BookingStatus): {
  label: string;
  bgColor: string;
  textColor: string;
  badgeClass: string;
} {
  switch (status) {
    case 'NEW':
      return { label: '🆕 NEW REQUEST', bgColor: 'bg-blue-100', textColor: 'text-blue-900', badgeClass: 'bg-blue-500 text-white font-black' };
    case 'ACCEPTED':
      return { label: '👍 ACCEPTED', bgColor: 'bg-amber-100', textColor: 'text-amber-900', badgeClass: 'bg-amber-500 text-slate-950 font-black' };
    case 'CONFIRMED':
      return { label: '✅ CONFIRMED', bgColor: 'bg-emerald-100', textColor: 'text-emerald-900', badgeClass: 'bg-emerald-600 text-white font-black' };
    case 'IN_PROGRESS':
      return { label: '🚗 IN PROGRESS', bgColor: 'bg-indigo-100', textColor: 'text-indigo-900', badgeClass: 'bg-indigo-600 text-white font-black animate-pulse' };
    case 'COMPLETED':
      return { label: '🎉 COMPLETED', bgColor: 'bg-green-100', textColor: 'text-green-900', badgeClass: 'bg-green-700 text-white font-black' };
    case 'REJECTED':
      return { label: '❌ REJECTED', bgColor: 'bg-rose-100', textColor: 'text-rose-900', badgeClass: 'bg-rose-600 text-white font-black' };
    case 'CANCELLED':
      return { label: '🚫 CANCELLED', bgColor: 'bg-gray-100', textColor: 'text-gray-800', badgeClass: 'bg-gray-600 text-white font-black' };
    case 'EXPIRED':
      return { label: '⌛ EXPIRED', bgColor: 'bg-amber-50', textColor: 'text-amber-800', badgeClass: 'bg-amber-700 text-white font-black' };
  }
}
