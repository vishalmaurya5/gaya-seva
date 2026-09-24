import { NextResponse } from 'next/server';
import { readCustomerAccess, writeCustomerAccess, getFilePath } from '@/lib/serverPaymentService';
import fs from 'fs';
import path from 'path';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, accessId, newStatus, adminUserId } = body;

    if ((!userId && !accessId) || !newStatus) {
      return NextResponse.json({ error: 'userId or accessId and newStatus are required' }, { status: 400, headers: corsHeaders() });
    }

    if (!['ACTIVE', 'REVOKED', 'EXPIRED'].includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid access status value' }, { status: 400, headers: corsHeaders() });
    }

    const records = readCustomerAccess();
    let updated = false;

    const modified = records.map((rec) => {
      if ((accessId && rec.id === accessId) || (userId && rec.userId === userId)) {
        updated = true;
        return {
          ...rec,
          status: newStatus as any,
          updatedAt: new Date().toISOString(),
        };
      }
      return rec;
    });

    if (!updated) {
      return NextResponse.json({ error: 'Customer access pass record not found' }, { status: 404, headers: corsHeaders() });
    }

    writeCustomerAccess(modified);

    return NextResponse.json(
      {
        success: true,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to update access status' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
