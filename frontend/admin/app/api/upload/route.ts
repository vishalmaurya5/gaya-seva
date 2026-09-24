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
    const bucket = (formData.get('bucket') as string) || 'gayaseva-partner-documents';
    const rawFilename = (formData.get('filename') as string) || file?.name || `file_${Date.now()}`;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: corsHeaders() });
    }

    // 1. File Size Enforcement (Max 10MB for documents)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400, headers: corsHeaders() });
    }

    // 2. Allowed Extensions & Mime types
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    const ext = (path.extname(rawFilename) || '.jpg').toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: `File extension ${ext} is not allowed` }, { status: 400, headers: corsHeaders() });
    }

    // 3. Sanitized Bucket Path & Safe Filename
    const safeBucket = bucket.replace(/[^a-zA-Z0-9_-]/g, '');
    const baseName = path.basename(rawFilename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
    const sanitizedFileName = `${baseName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write to both website and admin uploads directories for absolute consistency
    const targetDirs = [
      path.join(process.cwd(), '..', 'website', 'public', 'uploads', safeBucket),
      path.join(process.cwd(), 'public', 'uploads', safeBucket),
    ];

    for (const dir of targetDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(path.join(dir, sanitizedFileName), buffer);
    }

    const publicUrl = `/uploads/${safeBucket}/${sanitizedFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: sanitizedFileName,
      bucket: safeBucket,
      size: file.size,
    }, { headers: corsHeaders() });
  } catch (err: any) {
    console.error('Admin API upload error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to upload document' }, { status: 500, headers: corsHeaders() });
  }
}
