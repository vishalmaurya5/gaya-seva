import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface LostFoundItem {
  id: string;
  type: 'LOST' | 'FOUND';
  category: 'PERSON' | 'DOCUMENT' | 'VALUABLES' | 'ELECTRONICS' | 'LUGGAGE' | 'OTHER';
  title: string;
  description: string;
  location: string;
  date: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
  imageUrl?: string;
  status: 'REPORTED' | 'VERIFIED' | 'REUNITED' | 'CLOSED';
  createdAt: string;
}

const DEFAULT_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-1',
    type: 'LOST',
    category: 'PERSON',
    title: 'Ramavtar Sharma (Age 68) — Missing near Falgu Devghat',
    description: 'Wearing white kurta-dhoti and saffron pitambari shawl. Speaks Hindi & Bhojpuri. Separated during morning Pinda Daan Tarpan at Falgu River Ghat 4.',
    location: 'Falgu River Devghat No. 4, Gaya Ji',
    date: '2026-09-21',
    reporterName: 'Pankaj Sharma',
    reporterPhone: '+91 9431200030',
    status: 'VERIFIED',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'lf-2',
    type: 'FOUND',
    category: 'DOCUMENT',
    title: 'Brown Leather Wallet with Aadhaar Card & Train Ticket',
    description: 'Found brown wallet containing Aadhaar Card (Name: S. K. Roy), SBI ATM card, and train ticket to Howrah Jn.',
    location: 'Vishnupad Temple Gate 2 Police Helpdesk',
    date: '2026-09-21',
    reporterName: 'GayaSeva Volunteer Team',
    reporterPhone: '+91 8544491413',
    status: 'VERIFIED',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'lf-3',
    type: 'LOST',
    category: 'ELECTRONICS',
    title: 'Blue Realme Smartphone in Black Leather Case',
    description: 'Lost near Bodh Gaya Mahabodhi temple main entrance bus parking area.',
    location: 'Bodh Gaya Mahabodhi Parking',
    date: '2026-09-20',
    reporterName: 'Anjali Devi',
    reporterPhone: '+91 9123456789',
    status: 'REPORTED',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'lf-4',
    type: 'FOUND',
    category: 'LUGGAGE',
    title: 'Red VIP Travel Trolley Bag (Safely Reunited)',
    description: 'Left behind near Gaya Junction Taxi Stand. Successfully verified and handed over to rightful owner.',
    location: 'Gaya Junction Platform 1 Helpdesk',
    date: '2026-09-19',
    reporterName: 'Gaya Railway Police Helpdesk',
    reporterPhone: '+91 8544491413',
    status: 'REUNITED',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

function getFilePath(): string {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'data', 'lost_found.json'),
    path.join(process.cwd(), 'data', 'lost_found.json'),
    path.join(process.cwd(), '..', '..', 'data', 'lost_found.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function readLostFound(): LostFoundItem[] {
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
    console.error('Failed to read lost_found.json:', e);
  }
  return DEFAULT_LOST_FOUND;
}

function writeLostFound(items: LostFoundItem[]) {
  try {
    const filePath = getFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dataStr = JSON.stringify(items, null, 2);
    fs.writeFileSync(filePath, dataStr, 'utf-8');

    const localWebPath = path.join(process.cwd(), 'data', 'lost_found.json');
    if (localWebPath !== filePath && fs.existsSync(path.dirname(localWebPath))) {
      fs.writeFileSync(localWebPath, dataStr, 'utf-8');
    }
  } catch (e) {
    console.error('Failed to write lost_found.json:', e);
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
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let items = readLostFound();

    if (type && type !== 'ALL') {
      items = items.filter((i) => i.type === type.toUpperCase());
    }

    if (status && status !== 'ALL') {
      items = items.filter((i) => i.status === status.toUpperCase());
    }

    return NextResponse.json(items, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch lost & found items' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, category, title, description, location, date, reporterName, reporterPhone, reporterEmail, imageUrl, status } = body;

    if (!title || !reporterPhone) {
      return NextResponse.json({ error: 'Title and reporter phone number are required' }, { status: 400, headers: corsHeaders() });
    }

    const items = readLostFound();
    const newItem: LostFoundItem = {
      id: body.id || `lf-${Date.now()}`,
      type: type || 'LOST',
      category: category || 'PERSON',
      title: title.trim(),
      description: (description || '').trim(),
      location: (location || 'Gaya Ji').trim(),
      date: date || new Date().toISOString().split('T')[0],
      reporterName: (reporterName || 'Anonymous Yatri').trim(),
      reporterPhone: reporterPhone.trim(),
      reporterEmail: reporterEmail || undefined,
      imageUrl: imageUrl || undefined,
      status: status || 'VERIFIED',
      createdAt: new Date().toISOString(),
    };

    items.unshift(newItem);
    writeLostFound(items);

    return NextResponse.json(newItem, { status: 201, headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create lost & found item' }, { status: 400, headers: corsHeaders() });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required for update' }, { status: 400, headers: corsHeaders() });
    }

    const items = readLostFound();
    let updatedItem: LostFoundItem | null = null;

    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const merged: LostFoundItem = { ...item, ...updates };
        updatedItem = merged;
        return merged;
      }
      return item;
    });

    if (!updatedItem) {
      return NextResponse.json({ error: 'Lost & found item not found' }, { status: 404, headers: corsHeaders() });
    }

    writeLostFound(updatedItems);
    return NextResponse.json(updatedItem, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update lost & found item' }, { status: 400, headers: corsHeaders() });
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
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400, headers: corsHeaders() });
    }

    const items = readLostFound();
    const filteredItems = items.filter((i) => i.id !== id);

    if (filteredItems.length === items.length) {
      return NextResponse.json({ error: 'Lost & found item not found' }, { status: 404, headers: corsHeaders() });
    }

    writeLostFound(filteredItems);
    return NextResponse.json({ success: true, deletedId: id }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete lost & found item' }, { status: 400, headers: corsHeaders() });
  }
}
