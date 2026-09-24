import { NextResponse } from 'next/server';
import { readUsersFromFile, getFilePath } from '@/lib/serverPaymentService';
import { ProviderProfileService } from '@/lib/providerProfileService';
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
    const { providerId, actorUserId, updates } = body;

    if (!providerId || !updates) {
      return NextResponse.json({ error: 'providerId and updates are required' }, { status: 400, headers: corsHeaders() });
    }

    const users = readUsersFromFile();
    const userIdx = users.findIndex((u) => u.id === providerId);

    if (userIdx === -1) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404, headers: corsHeaders() });
    }

    const currentProvider = users[userIdx];

    // Authorization check
    if (actorUserId && actorUserId !== currentProvider.id && !['ADMIN', 'SUPER_ADMIN'].includes(currentProvider.role)) {
      return NextResponse.json({ error: 'Unauthorized: Cannot edit another provider profile' }, { status: 403, headers: corsHeaders() });
    }

    // Sanitize input to reject direct mutation of admin-controlled fields
    const sanitizedUpdates = ProviderProfileService.sanitizeProviderInput(updates);

    // Apply allowed updates
    const updatedUser = {
      ...currentProvider,
      ...sanitizedUpdates,
    };

    users[userIdx] = updatedUser;

    // Write to users.json file
    const filePath = getFilePath('users.json');
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');

    // Calculate updated completeness score
    const completeness = ProviderProfileService.calculateProfileCompleteness(updatedUser);

    return NextResponse.json(
      {
        success: true,
        user: updatedUser,
        completeness,
        updatedAt: new Date().toISOString(),
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to update provider profile' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
