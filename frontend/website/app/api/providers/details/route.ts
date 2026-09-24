import { NextResponse } from 'next/server';
import { canViewProviderDetails, readUsersFromFile, readSystemConfig } from '@/lib/serverPaymentService';

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
    const { providerId, userId } = body;

    const systemConfig = readSystemConfig();

    // Verify server-side authorization: User must have ACTIVE customer access
    const isAuthorized = canViewProviderDetails(userId);

    // If providerId is omitted, caller is just checking overall directory/contact access status
    if (!providerId) {
      return NextResponse.json(
        {
          locked: !isAuthorized,
          hasAccess: isAuthorized,
          accessFee: systemConfig.customer_access_fee,
          currency: systemConfig.currency || 'INR',
        },
        { headers: corsHeaders() }
      );
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          locked: true,
          error: `Full contact details locked. Please activate ₹${systemConfig.customer_access_fee} Access Pass to view phone number and WhatsApp contact.`,
          accessFee: systemConfig.customer_access_fee,
          currency: systemConfig.currency || 'INR',
        },
        { status: 403, headers: corsHeaders() }
      );
    }

    const allUsers = readUsersFromFile();
    const provider = allUsers.find((u) => u.id === providerId);

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404, headers: corsHeaders() });
    }

    return NextResponse.json(
      {
        locked: false,
        id: provider.id,
        name: provider.name,
        phone: provider.phone,
        email: provider.email,
        documentUrl: provider.documentUrl,
        city: provider.city,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch provider details' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
