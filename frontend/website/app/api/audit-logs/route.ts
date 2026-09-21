import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorEmail?: string;
  action: string;
  category: 'VERIFICATION' | 'USER_MANAGEMENT' | 'SYSTEM_CONFIG' | 'AUTH' | 'CONTENT';
  target: string;
  details?: string;
  ip?: string;
  timestamp: string;
}

const DEFAULT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_init_1',
    actor: 'Vishal Verma (Super Admin)',
    actorEmail: 'vishalverma5359@gayaseva.com',
    action: 'SYSTEM_INITIALIZED',
    category: 'SYSTEM_CONFIG',
    target: 'GayaSeva Engine v2.4',
    details: 'Central Admin Audit Logger engine initialized successfully',
    ip: '127.0.0.1',
    timestamp: '2026-09-21T10:00:00.000Z',
  },
  {
    id: 'log_init_2',
    actor: 'System Auto Guard',
    action: 'SECURITY_CHECK_PASSED',
    category: 'AUTH',
    target: 'Node Sync Server',
    details: 'RBAC Access permissions verified for Super Admin',
    ip: '127.0.0.1',
    timestamp: '2026-09-21T11:15:30.000Z',
  }
];

function getFilePath(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'data', 'audit_logs.json'),
    path.join(process.cwd(), '..', '..', 'data', 'audit_logs.json'),
  ];
  return possiblePaths[0];
}

function readLogs(): AuditLogEntry[] {
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
    console.error('Failed to read audit logs from file store:', e);
  }
  return DEFAULT_LOGS;
}

function writeLogs(logs: AuditLogEntry[]) {
  try {
    const filePath = getFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write audit logs to file store:', e);
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: Request) {
  try {
    const logs = readLogs();
    return NextResponse.json(logs, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch audit logs' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { actor, action, category, target, details, ip, actorEmail } = body;

    if (!action || !target) {
      return NextResponse.json({ error: 'Action and Target are required fields' }, { status: 400, headers: corsHeaders() });
    }

    const logs = readLogs();
    const newLog: AuditLogEntry = {
      id: body.id || `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      actor: actor || 'Super Admin',
      actorEmail: actorEmail || 'admin@gayaseva.org',
      action: action.toUpperCase(),
      category: category || 'SYSTEM_CONFIG',
      target,
      details: details || '',
      ip: ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...logs];
    writeLogs(updatedLogs);

    return NextResponse.json(newLog, { status: 201, headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to record audit log' }, { status: 400, headers: corsHeaders() });
  }
}

export async function DELETE() {
  try {
    writeLogs([]);
    return NextResponse.json({ success: true, message: 'All audit logs cleared' }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to clear logs' }, { status: 500, headers: corsHeaders() });
  }
}
