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

    // 1. Strict File Size Enforcement (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Security Error: File size exceeds 5MB limit' }, { status: 400, headers: corsHeaders() });
    }

    // 2. Extension & MIME Type Whitelisting
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

    const ext = (path.extname(rawFilename) || '.jpg').toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: `Security Error: Extension ${ext} is not allowed` }, { status: 400, headers: corsHeaders() });
    }

    if (file.type && !allowedMimeTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json({ error: `Security Error: MIME type ${file.type} is disallowed` }, { status: 400, headers: corsHeaders() });
    }

    // 3. Sanitized Bucket Path & Safe Filename
    const safeBucket = bucket.replace(/[^a-zA-Z0-9_-]/g, '');
    const baseName = path.basename(rawFilename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
    const sanitizedFileName = `${baseName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

    // Target upload directory: public/uploads/<safeBucket>
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', safeBucket);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, sanitizedFileName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeBucket}/${sanitizedFileName}`;

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
