import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'PILGRIM' | 'PANDIT' | 'DRIVER' | 'HOTEL' | 'ADMIN' | 'SUPER_ADMIN';
  customRole?: string;
  status: 'VERIFIED' | 'PENDING' | 'SUSPENDED';
  city?: string;
  languages?: string[];
  createdAt: string;
  avatarUrl?: string;
  profilePicUrl?: string;
  documentUrl?: string;
  googleMapsUrl?: string;
  lat?: number;
  lng?: number;
  rating?: number;
}

import os from 'os';

const DATA_FILE_PATH = path.join(os.tmpdir(), 'gayaseva_users_store.json');

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr_super',
    name: 'Vikramaditya Sharma',
    email: 'superadmin@gayaseva.org',
    phone: '+919876543200',
    role: 'SUPER_ADMIN',
    status: 'VERIFIED',
    city: 'Gaya Ji',
    createdAt: '2026-01-01T00:00:00.000Z',
    rating: 5.0,
  },
  {
    id: 'usr_pnd1',
    name: 'Pandit Rajesh Shastri',
    email: 'rajesh.shastri@gayaseva.org',
    phone: '+919876543210',
    role: 'PANDIT',
    customRole: 'Pinda Daan & Tripindi Shraddha Specialist',
    status: 'VERIFIED',
    city: 'Vishnupad Zone',
    languages: ['Hindi', 'Sanskrit', 'Bengali'],
    createdAt: '2026-02-10T00:00:00.000Z',
    rating: 4.9,
  },
  {
    id: 'usr_drv1',
    name: 'Ramesh Kumar (Taxi Service)',
    email: 'ramesh.cab@gayaseva.org',
    phone: '+919876543220',
    role: 'DRIVER',
    customRole: 'Ac Dzire / Etios Taxi',
    status: 'VERIFIED',
    city: 'Gaya Junction',
    createdAt: '2026-02-15T00:00:00.000Z',
    rating: 4.8,
  },
  {
    id: 'usr_htl1',
    name: 'Sri Vishnupad Yatri Dharamshala',
    email: 'dharamshala@gayaseva.org',
    phone: '+919876543230',
    role: 'HOTEL',
    customRole: 'AC Yatri Dharamshala & Guest House',
    status: 'VERIFIED',
    city: 'Vishnupad Temple Area',
    createdAt: '2026-03-01T00:00:00.000Z',
    rating: 4.9,
  },
  {
    id: 'usr_pilgrim1',
    name: 'Sunita Banerjee',
    email: 'sunita.banerjee@gmail.com',
    phone: '+919876543240',
    role: 'PILGRIM',
    status: 'VERIFIED',
    city: 'Kolkata',
    createdAt: '2026-03-05T00:00:00.000Z',
  }
];

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

function readUsersFromFile(): UserAccount[] {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DEFAULT_USERS, null, 2), 'utf-8');
      return DEFAULT_USERS;
    }
    const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to read users_store.json:', err);
    return DEFAULT_USERS;
  }
}

function writeUsersToFile(users: UserAccount[]) {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write users_store.json:', err);
  }
}

export async function GET() {
  const users = readUsersFromFile();
  return NextResponse.json(users, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const users = readUsersFromFile();

    const newUser: UserAccount = {
      ...body,
      id: body.id || `usr_${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const updatedUsers = [newUser, ...users];
    writeUsersToFile(updatedUsers);

    return NextResponse.json(newUser, { status: 201, headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create user' }, { status: 400, headers: corsHeaders() });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400, headers: corsHeaders() });
    }

    const users = readUsersFromFile();
    let updatedUser: UserAccount | null = null;

    const updatedUsers: UserAccount[] = users.map((u) => {
      if (u.id === id) {
        const merged: UserAccount = { ...u, ...updates };
        updatedUser = merged;
        return merged;
      }
      return u;
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders() });
    }

    writeUsersToFile(updatedUsers);
    return NextResponse.json(updatedUser, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update user' }, { status: 400, headers: corsHeaders() });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400, headers: corsHeaders() });
    }

    const users = readUsersFromFile();
    const filteredUsers = users.filter((u) => u.id !== id);

    if (filteredUsers.length === users.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders() });
    }

    writeUsersToFile(filteredUsers);
    return NextResponse.json({ success: true, deletedId: id }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete user' }, { status: 400, headers: corsHeaders() });
  }
}
