import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'general';
    const rawFilename = (formData.get('filename') as string) || file?.name || `file_${Date.now()}`;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: corsHeaders() });
    }

    // Sanitize filename
    const ext = path.extname(rawFilename) || '.jpg';
    const baseName = path.basename(rawFilename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const sanitizedFileName = `${baseName}_${Date.now()}${ext}`;

    // Target upload directory: public/uploads/<bucket>
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', bucket);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, sanitizedFileName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${bucket}/${sanitizedFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: sanitizedFileName,
      bucket,
      size: file.size,
    }, { headers: corsHeaders() });
  } catch (err: any) {
    console.error('API upload route error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to upload file' }, { status: 500, headers: corsHeaders() });
  }
}
