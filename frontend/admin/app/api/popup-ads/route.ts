import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

function getStorePath(): string {
  const possiblePaths = [
    path.join(process.cwd(), '..', '..', 'data', 'popup_ads.json'),
    path.join(process.cwd(), '..', 'data', 'popup_ads.json'),
    path.join(process.cwd(), 'data', 'popup_ads.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function readAds(): any[] {
  try {
    const filePath = getStorePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Admin API error reading popup_ads.json:', e);
  }
  return [];
}

function writeAds(data: any[]): void {
  try {
    const filePath = getStorePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Admin API error writing popup_ads.json:', e);
  }
}

export async function GET() {
  const ads = readAds();
  return NextResponse.json(ads, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ads = readAds();
    const newAd = {
      ...body,
      id: body.id || `pop_${Date.now()}`,
      isActive: body.isActive !== undefined ? body.isActive : true,
    };
    ads.unshift(newAd);
    writeAds(ads);
    return NextResponse.json(newAd, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create popup ad' }, { status: 500, headers: corsHeaders() });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400, headers: corsHeaders() });
    }
    const ads = readAds();
    let updatedAd = null;
    const updatedList = ads.map((a) => {
      if (a.id === id) {
        updatedAd = { ...a, ...updates };
        return updatedAd;
      }
      return a;
    });
    if (!updatedAd) {
      updatedAd = { id, ...updates };
      updatedList.push(updatedAd);
    }
    writeAds(updatedList);
    return NextResponse.json(updatedAd, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update popup ad' }, { status: 500, headers: corsHeaders() });
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
      return NextResponse.json({ error: 'ID required' }, { status: 400, headers: corsHeaders() });
    }
    const ads = readAds();
    const filtered = ads.filter((a) => a.id !== id);
    writeAds(filtered);
    return NextResponse.json({ success: true, id }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete popup ad' }, { status: 500, headers: corsHeaders() });
  }
}
