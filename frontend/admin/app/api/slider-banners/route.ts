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
    path.join(process.cwd(), '..', '..', 'data', 'slider_banners.json'),
    path.join(process.cwd(), '..', 'data', 'slider_banners.json'),
    path.join(process.cwd(), 'data', 'slider_banners.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function readBanners(): any[] {
  try {
    const filePath = getStorePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Admin API error reading slider_banners.json:', e);
  }
  return [];
}

function writeBanners(data: any[]): void {
  try {
    const filePath = getStorePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Admin API error writing slider_banners.json:', e);
  }
}

export async function GET() {
  const banners = readBanners();
  return NextResponse.json(banners, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const banners = readBanners();
    const newBanner = {
      ...body,
      id: body.id || `sld_${Date.now()}`,
      isActive: body.isActive !== undefined ? body.isActive : true,
      sequence: body.sequence || banners.length + 1,
    };
    banners.unshift(newBanner);
    writeBanners(banners);
    return NextResponse.json(newBanner, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create banner' }, { status: 500, headers: corsHeaders() });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400, headers: corsHeaders() });
    }
    const banners = readBanners();
    let updatedBanner = null;
    const updatedList = banners.map((b) => {
      if (b.id === id) {
        updatedBanner = { ...b, ...updates };
        return updatedBanner;
      }
      return b;
    });
    if (!updatedBanner) {
      updatedBanner = { id, ...updates };
      updatedList.push(updatedBanner);
    }
    writeBanners(updatedList);
    return NextResponse.json(updatedBanner, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update banner' }, { status: 500, headers: corsHeaders() });
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
    const banners = readBanners();
    const filtered = banners.filter((b) => b.id !== id);
    writeBanners(filtered);
    return NextResponse.json({ success: true, id }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete banner' }, { status: 500, headers: corsHeaders() });
  }
}
