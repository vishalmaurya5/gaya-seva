import fs from 'fs';
import path from 'path';
import { PaymentRecord, CustomerAccessRecord } from './paymentStore';
import { UserAccount } from './userStore';

function getFilePath(filename: string): string {
  const possiblePaths = [
    path.resolve(process.cwd(), '..', '..', 'data', filename),
    path.resolve(process.cwd(), '..', 'data', filename),
    path.resolve(process.cwd(), 'data', filename),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  const primary = possiblePaths[0];
  const dir = path.dirname(primary);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return primary;
}

export function readPayments(): PaymentRecord[] {
  try {
    const p = getFilePath('payments.json');
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read payments store in admin:', e);
  }
  return [];
}

export function readCustomerAccess(): CustomerAccessRecord[] {
  try {
    const p = getFilePath('customer_access.json');
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read customer access store in admin:', e);
  }
  return [];
}
