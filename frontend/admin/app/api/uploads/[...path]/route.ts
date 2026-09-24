import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const fileSegments = params.path || [];
    if (fileSegments.length === 0) {
      return NextResponse.json({ error: 'File path required' }, { status: 400 });
    }

    const relativePath = fileSegments.join('/');
    
    // Candidate locations where uploaded files may exist
    const candidates = [
      path.join(process.cwd(), '..', 'website', 'public', 'uploads', relativePath),
      path.join(process.cwd(), 'public', 'uploads', relativePath),
      path.join(process.cwd(), '..', '..', 'data', 'uploads', relativePath),
      path.join(process.cwd(), 'data', 'uploads', relativePath),
    ];

    let foundPath: string | null = null;
    for (const p of candidates) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      return NextResponse.json({ error: 'Uploaded file not found on disk' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(foundPath);
    const ext = path.extname(foundPath).toLowerCase();

    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, must-revalidate',
      },
    });
  } catch (err: any) {
    console.error('Error serving upload file:', err);
    return NextResponse.json({ error: 'Server error serving file' }, { status: 500 });
  }
}
