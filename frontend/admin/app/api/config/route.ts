import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface SystemConfig {
  customer_access_fee: number;
  provider_registration_fee: number;
  customer_access_duration_days: number;
  currency: string;
  payment_enabled: boolean;
  refund_enabled: boolean;
  updatedAt?: string;
}

const DEFAULT_CONFIG: SystemConfig = {
  customer_access_fee: 5,
  provider_registration_fee: 49,
  customer_access_duration_days: 0,
  currency: 'INR',
  payment_enabled: true,
  refund_enabled: true,
};

function getConfigPath(): string {
  const possiblePaths = [
    path.resolve(process.cwd(), '..', '..', 'data', 'system_config.json'),
    path.resolve(process.cwd(), '..', 'data', 'system_config.json'),
    path.resolve(process.cwd(), 'data', 'system_config.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  const primary = possiblePaths[0];
  const dir = path.dirname(primary);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return primary;
}

function readSystemConfig(): SystemConfig {
  try {
    const configPath = getConfigPath();
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Error reading system config in admin:', e);
  }
  return DEFAULT_CONFIG;
}

function writeSystemConfig(config: SystemConfig) {
  try {
    const configPath = getConfigPath();
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const payload = JSON.stringify({ ...config, updatedAt: new Date().toISOString() }, null, 2);
    fs.writeFileSync(configPath, payload, 'utf-8');
  } catch (e) {
    console.error('Error writing system config in admin:', e);
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  const config = readSystemConfig();
  return NextResponse.json(config, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = readSystemConfig();
    const updated: SystemConfig = {
      customer_access_fee: typeof body.customer_access_fee === 'number' ? body.customer_access_fee : current.customer_access_fee,
      provider_registration_fee: typeof body.provider_registration_fee === 'number' ? body.provider_registration_fee : current.provider_registration_fee,
      customer_access_duration_days: typeof body.customer_access_duration_days === 'number' ? body.customer_access_duration_days : current.customer_access_duration_days,
      currency: body.currency || current.currency,
      payment_enabled: typeof body.payment_enabled === 'boolean' ? body.payment_enabled : current.payment_enabled,
      refund_enabled: typeof body.refund_enabled === 'boolean' ? body.refund_enabled : current.refund_enabled,
    };
    writeSystemConfig(updated);
    return NextResponse.json(updated, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update config' }, { status: 400, headers: corsHeaders() });
  }
}
