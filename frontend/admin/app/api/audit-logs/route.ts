import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getAuditLogsPath(): string {
  const possiblePaths = [
    path.resolve(process.cwd(), '..', '..', 'data', 'audit_logs.json'),
    path.resolve(process.cwd(), '..', 'data', 'audit_logs.json'),
    path.resolve(process.cwd(), 'data', 'audit_logs.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  const primary = possiblePaths[0];
  const dir = path.dirname(primary);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return primary;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  actor: string;
  details: string;
  resource?: string;
  resourceId?: string;
  createdAt: string;
}

function readAuditLogs(): AuditLogRecord[] {
  try {
    const filePath = getAuditLogsPath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read audit logs:', e);
  }
  return [];
}

function writeAuditLogs(logs: AuditLogRecord[]) {
  try {
    const filePath = getAuditLogsPath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write audit logs:', e);
  }
}

export async function GET() {
  try {
    const logs = readAuditLogs();
    return NextResponse.json(logs);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch audit logs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, actor, details, resource, resourceId } = body;

    const newLog: AuditLogRecord = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action: action || 'ADMIN_ACTION',
      actor: actor || 'Admin',
      details: details || '',
      resource: resource || 'SYSTEM',
      resourceId: resourceId || undefined,
      createdAt: new Date().toISOString(),
    };

    const logs = readAuditLogs();
    logs.unshift(newLog);
    if (logs.length > 1000) logs.pop();
    writeAuditLogs(logs);

    return NextResponse.json(newLog, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to log audit action' }, { status: 400 });
  }
}
