import { NextResponse } from 'next/server';

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

let inMemoryUsersStore: UserAccount[] = [...DEFAULT_USERS];

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

function readUsers(): UserAccount[] {
  return inMemoryUsersStore;
}

function writeUsers(users: UserAccount[]) {
  inMemoryUsersStore = users;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    let users = readUsers();

    if (role && role !== 'ALL') {
      users = users.filter((u) => u.role === role.toUpperCase());
    }

    if (status && status !== 'ALL') {
      users = users.filter((u) => u.status === status.toUpperCase());
    }

    return NextResponse.json(users, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch users' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, role, customRole, city, languages } = body;

    if (!name || !role) {
      return NextResponse.json({ error: 'Name and Role are required fields' }, { status: 400, headers: corsHeaders() });
    }

    const users = readUsers();
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name,
      email: email || '',
      phone: phone || '',
      role: role.toUpperCase(),
      customRole: customRole || '',
      status: 'VERIFIED',
      city: city || 'Gaya Ji',
      languages: Array.isArray(languages) ? languages : ['Hindi'],
      createdAt: new Date().toISOString(),
      rating: 5.0,
    };

    users.push(newUser);
    writeUsers(users);

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
      return NextResponse.json({ error: 'User ID is required for update' }, { status: 400, headers: corsHeaders() });
    }

    const users = readUsers();
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

    writeUsers(updatedUsers);
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

    const users = readUsers();
    const filteredUsers = users.filter((u) => u.id !== id);

    if (filteredUsers.length === users.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders() });
    }

    writeUsers(filteredUsers);
    return NextResponse.json({ success: true, deletedId: id }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete user' }, { status: 400, headers: corsHeaders() });
  }
}
