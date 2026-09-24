import { NextResponse } from 'next/server';
import { readUsersFromFile, getFilePath } from '@/lib/serverPaymentService';
import fs from 'fs';
import path from 'path';

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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { providerId, status, actorUserId } = body;

    if (!providerId || !status) {
      return NextResponse.json({ error: 'providerId and status are required' }, { status: 400, headers: corsHeaders() });
    }

    // Read user store
    const users = readUsersFromFile();
    const userIdx = users.findIndex((u) => u.id === providerId);

    if (userIdx === -1) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404, headers: corsHeaders() });
    }

    // Ownership Authorization Check
    const provider = users[userIdx];
    if (actorUserId && actorUserId !== provider.id && !['ADMIN', 'SUPER_ADMIN'].includes(provider.role)) {
      return NextResponse.json({ error: 'Unauthorized: Cannot modify availability of another provider' }, { status: 403, headers: corsHeaders() });
    }

    // Suspended check
    if (provider.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'Suspended providers cannot change availability' }, { status: 403, headers: corsHeaders() });
    }

    users[userIdx].availabilityStatus = status;

    // Write back to store
    const filePath = getFilePath('users.json');
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');

    return NextResponse.json(
      {
        success: true,
        providerId,
        availabilityStatus: status,
        updatedAt: new Date().toISOString(),
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to update availability' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
