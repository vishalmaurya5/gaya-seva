import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'PILGRIM' | 'PANDIT' | 'BARBER' | 'DRIVER' | 'HOTEL' | 'SHOP' | 'GUIDE' | 'FOOD' | 'ADMIN' | 'SUPER_ADMIN' | 'OTHER';
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
  password?: string;
}

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr_super_vishal',
    name: 'Vishal Verma',
    email: 'vishalverma5359@gayaseva.com',
    password: 'Babu@730123',
    phone: '+917301230000',
    role: 'SUPER_ADMIN',
    status: 'VERIFIED',
    city: 'Gaya Ji',
    createdAt: '2026-01-01T00:00:00.000Z',
    rating: 5.0,
  },
  {
    id: 'usr_super',
    name: 'Vikramaditya Sharma',
    email: 'superadmin@gayaseva.org',
    password: 'Babu@730123',
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
    password: 'password123',
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
    id: 'usr_brb1',
    name: 'Ramu Thakur (Kshaur Karma)',
    email: 'ramu.barber@gayaseva.org',
    password: 'password123',
    phone: '+919876543250',
    role: 'BARBER',
    customRole: 'Kshaur Karma & Mundan Specialist (नाई / ठाकुर)',
    status: 'VERIFIED',
    city: 'Vishnupad Ghat Area',
    languages: ['Hindi', 'Magahi'],
    createdAt: '2026-03-10T00:00:00.000Z',
    rating: 4.9,
  },
  {
    id: 'usr_1790016112398',
    name: 'Chanda Thakur',
    email: '9939778855@provider.gayaseva.org',
    phone: '+919939778855',
    password: '123456',
    role: 'BARBER',
    customRole: 'Kshaur Karma & Mundan Specialist (नाई / ठाकुर)',
    status: 'VERIFIED',
    city: 'Gaya Ji / Falgu Ghat',
    languages: ['Hindi', 'English'],
    createdAt: '2026-09-21T18:41:52.747Z',
    avatarUrl: '/uploads/gayaseva-partner-profiles/IMG_20240829_204658_1790016073002_xpy2mvg_1790016075236.jpg',
    profilePicUrl: '/uploads/gayaseva-partner-profiles/IMG_20240829_204658_1790016073002_xpy2mvg_1790016075236.jpg',
    documentUrl: '/uploads/gayaseva-partner-documents/id1_1790016080376_1cq50v0_1790016081457.jpg',
    rating: 5,
  },
  {
    id: 'usr_drv1',
    name: 'Ramesh Kumar (Taxi Service)',
    email: 'ramesh.cab@gayaseva.org',
    password: 'password123',
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
    password: 'password123',
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
    password: 'password123',
    phone: '+919876543240',
    role: 'PILGRIM',
    status: 'VERIFIED',
    city: 'Kolkata',
    createdAt: '2026-03-05T00:00:00.000Z',
  }
];

function getFilePath(): string {
  const possiblePaths = [
    path.resolve(process.cwd(), '..', '..', 'data', 'users.json'),
    path.resolve(process.cwd(), '..', 'data', 'users.json'),
    path.resolve(process.cwd(), 'data', 'users.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  const primary = possiblePaths[0];
  const dir = path.dirname(primary);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return primary;
}

function readUsers(): UserAccount[] {
  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read users from file store in admin:', e);
  }
  return DEFAULT_USERS;
}

function writeUsers(users: UserAccount[]) {
  try {
    const filePath = getFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dataStr = JSON.stringify(users, null, 2);
    fs.writeFileSync(filePath, dataStr, 'utf-8');

    // Also sync to website data directory if present
    const websiteDataPath = path.join(process.cwd(), '..', 'website', 'data', 'users.json');
    if (fs.existsSync(path.dirname(websiteDataPath))) {
      fs.writeFileSync(websiteDataPath, dataStr, 'utf-8');
    }
  } catch (e) {
    console.error('Failed to write users to file store in admin:', e);
  }
}

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
    const { name, email, phone, role, customRole, city, languages, password, avatarUrl, profilePicUrl, documentUrl, googleMapsUrl, lat, lng } = body;

    if (!name || !role) {
      return NextResponse.json({ error: 'Name and Role are required fields' }, { status: 400, headers: corsHeaders() });
    }

    const users = readUsers();
    const newUser: UserAccount = {
      id: body.id || `usr_${Date.now()}`,
      name,
      email: email || '',
      phone: phone || '',
      password: password || undefined,
      role: role.toUpperCase(),
      customRole: customRole || '',
      status: body.status || 'PENDING',
      city: city || 'Gaya Ji',
      languages: Array.isArray(languages) ? languages : ['Hindi'],
      createdAt: new Date().toISOString(),
      avatarUrl: avatarUrl || profilePicUrl || undefined,
      profilePicUrl: profilePicUrl || avatarUrl || undefined,
      documentUrl: documentUrl || undefined,
      googleMapsUrl: googleMapsUrl || undefined,
      lat: lat || undefined,
      lng: lng || undefined,
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
