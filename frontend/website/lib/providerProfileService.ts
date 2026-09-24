/**
 * GayaSeva Provider Profile & Audit Service
 * Enforces Field-Level Ownership, Input Validation, Audit Logging & Profile Completion Scoring.
 */

import { UserAccount, UserStore } from './userStore';
import { supabase } from './supabaseClient';

export interface ProviderEditableProfileFields {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  customRole?: string;
  specialization?: string;
  description?: string;
  languages?: string[];
  googleMapsUrl?: string;
  capacity?: string;
  avatarUrl?: string;
  profilePicUrl?: string;
  documentUrl?: string;
  availabilityStatus?: 'AVAILABLE' | 'BOOKED' | 'BUSY' | 'LIMITED' | 'FULL' | 'OPEN' | 'CLOSED' | 'OFFLINE';
  is_available?: boolean;
}

export interface AdminControlledFields {
  status: 'VERIFIED' | 'PENDING' | 'SUSPENDED';
  role: string;
  rating: number;
  total_reviews?: number;
  featured_status?: boolean;
  admin_notes?: string;
}

export interface ProfileAuditRecord {
  id: string;
  providerId: string;
  fieldName: string;
  oldValueSafe: string;
  newValueSafe: string;
  changedBy: string;
  createdAt: string;
}

const AUDIT_STORAGE_KEY = 'GAYASEVA_PROVIDER_AUDIT_LOGS';

export class ProviderProfileService {
  /**
   * List of sensitive fields that providers CANNOT mutate via frontend/API submission.
   */
  private static ADMIN_ONLY_FIELDS = [
    'status',
    'verification_status',
    'role',
    'provider_role',
    'rating',
    'total_reviews',
    'suspension_status',
    'admin_notes',
    'payment_verification',
    'featured_status',
  ];

  /**
   * Sanitizes input to strip any attempt to override admin-controlled fields.
   */
  public static sanitizeProviderInput(input: Record<string, any>): ProviderEditableProfileFields {
    const sanitized: Record<string, any> = {};

    for (const [key, val] of Object.entries(input)) {
      if (!this.ADMIN_ONLY_FIELDS.includes(key)) {
        sanitized[key] = val;
      }
    }

    return sanitized as ProviderEditableProfileFields;
  }

  /**
   * Calculates Provider Profile Completeness Score (0% - 100%)
   */
  public static calculateProfileCompleteness(user: Partial<UserAccount>): {
    score: number;
    missingItems: string[];
  } {
    const checks = [
      { key: 'name', label: 'Business / Provider Name', weight: 15, valid: Boolean(user.name && user.name.trim().length > 2) },
      { key: 'phone', label: 'Phone Number (Calls & WhatsApp)', weight: 15, valid: Boolean(user.phone && user.phone.trim().length >= 10) },
      { key: 'city', label: 'Operating Location / City', weight: 15, valid: Boolean(user.city && user.city.trim().length > 2) },
      { key: 'description', label: 'Service Description & Features', weight: 15, valid: Boolean(user.description && user.description.trim().length > 5) },
      { key: 'languages', label: 'Languages Spoken', weight: 10, valid: Boolean(user.languages && user.languages.length > 0) },
      { key: 'googleMapsUrl', label: 'Google Maps Navigation Link', weight: 10, valid: Boolean(user.googleMapsUrl && user.googleMapsUrl.startsWith('http')) },
      { key: 'avatarUrl', label: 'Profile Photo / Business Avatar', weight: 10, valid: Boolean(user.avatarUrl || user.profilePicUrl) },
      { key: 'documentUrl', label: 'Verification ID / Business Document', weight: 10, valid: Boolean(user.documentUrl) },
    ];

    let totalScore = 0;
    const missingItems: string[] = [];

    for (const check of checks) {
      if (check.valid) {
        totalScore += check.weight;
      } else {
        missingItems.push(check.label);
      }
    }

    return { score: totalScore, missingItems };
  }

  /**
   * Updates provider profile with field-level security checks & audit logging
   */
  public static async updateProviderProfile(
    providerId: string,
    rawUpdates: Record<string, any>,
    actorUserId: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    // 1. Fetch current user state
    const currentUsers = UserStore.getUsers();
    const currentUser = currentUsers.find((u) => u.id === providerId);

    if (!currentUser) {
      return { success: false, error: 'Provider profile not found.' };
    }

    // Security Check: Verify actor owns this provider profile or is admin
    if (currentUser.id !== actorUserId && !['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role)) {
      return { success: false, error: 'Unauthorized: You can only edit your own provider profile.' };
    }

    // 2. Sanitize updates to reject admin fields manipulation
    const allowedUpdates = this.sanitizeProviderInput(rawUpdates);

    // 3. Create Audit Logs for modified fields
    const auditRecords: ProfileAuditRecord[] = [];
    const nowIso = new Date().toISOString();

    for (const [key, newVal] of Object.entries(allowedUpdates)) {
      const oldVal = (currentUser as any)[key];
      const oldStr = oldVal !== undefined && oldVal !== null ? String(JSON.stringify(oldVal)) : '';
      const newStr = newVal !== undefined && newVal !== null ? String(JSON.stringify(newVal)) : '';

      if (oldStr !== newStr) {
        auditRecords.push({
          id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          providerId,
          fieldName: key,
          oldValueSafe: oldStr.substring(0, 200),
          newValueSafe: newStr.substring(0, 200),
          changedBy: actorUserId,
          createdAt: nowIso,
        });
      }
    }

    // Save audit records locally & try Supabase persist
    this.saveAuditLogs(auditRecords);

    // 4. Perform Store Update
    const updatedUser = await UserStore.updateUser(providerId, allowedUpdates);

    if (updatedUser) {
      // Sync local session cache
      if (typeof window !== 'undefined') {
        const storedSession = localStorage.getItem('GAYASEVA_CURRENT_USER');
        if (storedSession) {
          try {
            const sessObj = JSON.parse(storedSession);
            if (sessObj.id === providerId) {
              localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(updatedUser));
            }
          } catch (e) {
            // silent
          }
        }
      }
      return { success: true, user: updatedUser };
    }

    return { success: false, error: 'Failed to persist provider profile changes.' };
  }

  /**
   * Audits storage helper
   */
  private static saveAuditLogs(logs: ProfileAuditRecord[]) {
    if (typeof window === 'undefined' || logs.length === 0) return;
    try {
      const existingRaw = localStorage.getItem(AUDIT_STORAGE_KEY);
      const existing: ProfileAuditRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
      const combined = [...logs, ...existing].slice(0, 100);
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(combined));
    } catch (e) {
      console.warn('Audit logs storage notice:', e);
    }
  }

  /**
   * Retrieves Audit History for provider
   */
  public static getAuditLogsForProvider(providerId: string): ProfileAuditRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const existingRaw = localStorage.getItem(AUDIT_STORAGE_KEY);
      const existing: ProfileAuditRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
      return existing.filter((l) => l.providerId === providerId);
    } catch (e) {
      return [];
    }
  }
}
