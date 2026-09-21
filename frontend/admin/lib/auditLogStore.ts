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

const STORAGE_KEY = 'GAYASEVA_AUDIT_LOGS_STORE';
const API_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_WEBSITE_URL ? `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/audit-logs` : 'http://localhost:3000/api/audit-logs')
  : (process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audit-logs` : 'http://localhost:3000/api/audit-logs');

const DEFAULT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_1790011',
    actor: 'Vishal Verma (Super Admin)',
    actorEmail: 'vishalverma5359@gayaseva.com',
    action: 'PROVIDER_VERIFIED',
    category: 'VERIFICATION',
    target: 'Partner: Ramu Thakur (usr_brb1)',
    details: 'Approved Kshaur Karma Mundan Barber partner badge after reviewing Govt Aadhaar document',
    ip: '157.38.190.42',
    timestamp: '2026-09-21T16:45:00.000Z',
  },
  {
    id: 'log_1790012',
    actor: 'Super Admin Console',
    actorEmail: 'superadmin@gayaseva.org',
    action: 'DOCUMENT_UPDATED',
    category: 'VERIFICATION',
    target: 'Partner: Pandit Rajesh Shastri (usr_pnd1)',
    details: 'Updated Govt ID Aadhaar card link and inline document preview',
    ip: '49.36.210.15',
    timestamp: '2026-09-21T15:20:00.000Z',
  },
  {
    id: 'log_1790013',
    actor: 'Vishal Verma (Super Admin)',
    actorEmail: 'vishalverma5359@gayaseva.com',
    action: 'ADMIN_LOGIN',
    category: 'AUTH',
    target: 'Admin Console Dashboard',
    details: 'Authenticated successfully via Super Admin credentials',
    ip: '127.0.0.1',
    timestamp: '2026-09-21T14:10:00.000Z',
  }
];

export const AuditLogStore = {
  getLogs(): AuditLogEntry[] {
    if (typeof window === 'undefined') return DEFAULT_LOGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LOGS));
        return DEFAULT_LOGS;
      }
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_LOGS;
    }
  },

  async fetchLogsFromApi(): Promise<AuditLogEntry[]> {
    if (typeof window === 'undefined') return DEFAULT_LOGS;
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      if (res.ok) {
        const logs = await res.json();
        if (Array.isArray(logs)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
          window.dispatchEvent(new Event('storage'));
          return logs;
        }
      }
    } catch (e) {
      // Fallback silently if API is offline
    }
    return this.getLogs();
  },

  saveLogs(logs: AuditLogEntry[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save audit logs', e);
    }
  },

  log(
    action: string,
    target: string,
    details?: string,
    category: 'VERIFICATION' | 'USER_MANAGEMENT' | 'SYSTEM_CONFIG' | 'AUTH' | 'CONTENT' = 'VERIFICATION'
  ): AuditLogEntry {
    let actorName = 'Super Admin';
    let actorEmail = 'vishalverma5359@gayaseva.com';

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
        if (stored) {
          const user = JSON.parse(stored);
          if (user.name) actorName = user.name;
          if (user.email) actorEmail = user.email;
        }
      } catch (e) {}
    }

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      actor: actorName,
      actorEmail,
      action: action.toUpperCase(),
      category,
      target,
      details: details || '',
      ip: '127.0.0.1',
      timestamp: new Date().toISOString(),
    };

    const current = this.getLogs();
    const updated = [newLog, ...current];
    this.saveLogs(updated);

    // Sync with backend API
    if (typeof window !== 'undefined') {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      }).catch(console.error);
    }

    return newLog;
  },

  clearLogs(): boolean {
    if (typeof window === 'undefined') return false;
    this.saveLogs([]);
    fetch(API_URL, { method: 'DELETE' }).catch(console.error);
    return true;
  }
};
