import { NextResponse } from 'next/server';
import { 
  ServiceBookingRecord, 
  validateBookingStateTransition, 
  checkDoubleBookingConflict, 
  BookingStatus 
} from '@/lib/bookingStateMachine';
import fs from 'fs';
import path from 'path';

function getBookingsFilePath(): string {
  const possiblePaths = [
    path.resolve(process.cwd(), '..', '..', 'data', 'service_bookings.json'),
    path.resolve(process.cwd(), '..', 'data', 'service_bookings.json'),
    path.resolve(process.cwd(), 'data', 'service_bookings.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  const primary = possiblePaths[0];
  const dir = path.dirname(primary);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return primary;
}

function readBookings(): ServiceBookingRecord[] {
  try {
    const p = getBookingsFilePath();
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading bookings:', e);
  }
  return [
    {
      id: 'bk_101',
      requestId: 'req_101',
      customerId: 'usr_pilgrim1',
      customerName: 'Sunita Banerjee',
      customerPhone: '+919876543240',
      providerId: 'usr_pnd1',
      serviceTitle: 'Pind Daan & Tripindi Shraddha Puja',
      bookingDate: new Date().toISOString().split('T')[0],
      bookingTime: '08:00 AM',
      pickupAddress: 'Vishnupad Temple Main Ghat',
      amount: 1500,
      status: 'NEW',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'bk_102',
      requestId: 'req_102',
      customerId: 'usr_pilgrim1',
      customerName: 'Amitabha Ray',
      customerPhone: '+919812345678',
      providerId: 'usr_drv1',
      serviceTitle: 'Gaya Junction → Vishnupad Pick & Drop',
      bookingDate: new Date().toISOString().split('T')[0],
      bookingTime: '10:30 AM',
      pickupAddress: 'Gaya Junction Exit Gate 1',
      dropAddress: 'Vishnupad Temple Parking',
      passengersCount: 4,
      amount: 450,
      status: 'ACCEPTED',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
}

function writeBookings(bookings: ServiceBookingRecord[]) {
  try {
    const p = getBookingsFilePath();
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing bookings:', e);
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('providerId');
    const customerId = searchParams.get('customerId');

    const allBookings = readBookings();

    let filtered = allBookings;
    if (providerId) {
      filtered = filtered.filter((b) => b.providerId === providerId);
    }
    if (customerId) {
      filtered = filtered.filter((b) => b.customerId === customerId);
    }

    return NextResponse.json(filtered, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch bookings' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, customerName, customerPhone, providerId, serviceTitle, bookingDate, bookingTime, pickupAddress, dropAddress, passengersCount, amount, idempotencyKey } = body;

    if (!customerId || !providerId || !serviceTitle) {
      return NextResponse.json({ error: 'Missing required booking parameters' }, { status: 400, headers: corsHeaders() });
    }

    const allBookings = readBookings();

    // Idempotency Check
    if (idempotencyKey) {
      const existing = allBookings.find((b) => b.idempotencyKey === idempotencyKey);
      if (existing) {
        return NextResponse.json(existing, { headers: corsHeaders() });
      }
    }

    // Double Booking Prevention Check
    const conflictResult = checkDoubleBookingConflict(allBookings, providerId, bookingDate, bookingTime);
    if (conflictResult.hasConflict) {
      return NextResponse.json(
        {
          error: 'Double Booking Conflict: Provider already has a confirmed booking for the selected date and time.',
          conflictingBookingId: conflictResult.conflictingBooking?.id,
        },
        { status: 409, headers: corsHeaders() }
      );
    }

    const newBooking: ServiceBookingRecord = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      requestId: `req_${Date.now()}`,
      customerId,
      customerName: customerName || 'Gaya Ji Pilgrim',
      customerPhone: customerPhone || '+919546101002',
      providerId,
      serviceTitle,
      bookingDate: bookingDate || new Date().toISOString().split('T')[0],
      bookingTime: bookingTime || '10:00 AM',
      pickupAddress,
      dropAddress,
      passengersCount,
      amount: amount || 0,
      status: 'NEW',
      paymentStatus: 'PENDING',
      idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    allBookings.unshift(newBooking);
    writeBookings(allBookings);

    return NextResponse.json(newBooking, { status: 201, headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create booking' }, { status: 500, headers: corsHeaders() });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, nextStatus, actorUserId, actorRole } = body;

    if (!bookingId || !nextStatus) {
      return NextResponse.json({ error: 'bookingId and nextStatus are required' }, { status: 400, headers: corsHeaders() });
    }

    const allBookings = readBookings();
    const bookingIdx = allBookings.findIndex((b) => b.id === bookingId);

    if (bookingIdx === -1) {
      return NextResponse.json({ error: 'Booking record not found' }, { status: 404, headers: corsHeaders() });
    }

    const targetBooking = allBookings[bookingIdx];

    // Validate state machine transition
    const transitionCheck = validateBookingStateTransition(
      targetBooking.status,
      nextStatus as BookingStatus,
      actorRole || 'PROVIDER'
    );

    if (!transitionCheck.valid) {
      return NextResponse.json(
        { error: transitionCheck.error },
        { status: 422, headers: corsHeaders() }
      );
    }

    // Double booking check when transitioning to ACCEPTED or CONFIRMED
    if (nextStatus === 'ACCEPTED' || nextStatus === 'CONFIRMED') {
      const conflictCheck = checkDoubleBookingConflict(
        allBookings,
        targetBooking.providerId,
        targetBooking.bookingDate,
        targetBooking.bookingTime,
        targetBooking.id
      );

      if (conflictCheck.hasConflict) {
        return NextResponse.json(
          { error: 'Double Booking Conflict: Cannot accept booking because provider has a conflicting schedule.' },
          { status: 409, headers: corsHeaders() }
        );
      }
    }

    // Perform status update
    targetBooking.status = nextStatus as BookingStatus;
    targetBooking.updatedAt = new Date().toISOString();

    allBookings[bookingIdx] = targetBooking;
    writeBookings(allBookings);

    return NextResponse.json(targetBooking, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update booking status' }, { status: 500, headers: corsHeaders() });
  }
}
