/**
 * GayaSeva Realtime Live Availability Subsystem
 * Handles Live Availability Status broadcasting via Supabase Realtime, window storage sync, and connection loss fallback.
 */

import { supabase } from './supabaseClient';
import { UserAccount, UserStore } from './userStore';
import { AvailabilityStatusType } from './providerRoleMap';

export interface AvailabilityChangePayload {
  providerId: string;
  status: AvailabilityStatusType;
  isAvailable: boolean;
  updatedAt: string;
}

export type AvailabilityCallback = (payload: AvailabilityChangePayload) => void;

class RealtimeAvailabilityEngine {
  private static instance: RealtimeAvailabilityEngine;
  private channel: any = null;
  private listeners: Set<AvailabilityCallback> = new Set();
  private pollInterval: any = null;

  private constructor() {
    this.initRealtimeChannel();
    this.initStorageListener();
  }

  public static getInstance(): RealtimeAvailabilityEngine {
    if (!RealtimeAvailabilityEngine.instance) {
      RealtimeAvailabilityEngine.instance = new RealtimeAvailabilityEngine();
    }
    return RealtimeAvailabilityEngine.instance;
  }

  /**
   * Initializes Supabase Realtime channel for live availability
   */
  private initRealtimeChannel() {
    if (typeof window === 'undefined') return;

    try {
      this.channel = supabase.channel('gayaseva-provider-availability', {
        config: {
          broadcast: { self: true },
        },
      });

      this.channel
        .on('broadcast', { event: 'availability-change' }, (payload: any) => {
          if (payload?.payload) {
            this.notifyListeners(payload.payload);
          }
        })
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Supabase Realtime Provider Availability channel connected.');
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.warn('⚠️ Supabase Realtime disconnected. Activating safe fallback refresh.');
            this.startFallbackPolling();
          }
        });
    } catch (e) {
      console.warn('Realtime channel init warning:', e);
      this.startFallbackPolling();
    }
  }

  /**
   * Multi-tab window storage listener for local synchronization
   */
  private initStorageListener() {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', (e) => {
      if (e.key === 'GAYASEVA_USERS_STORE' || e.key === 'GAYASEVA_CURRENT_USER') {
        const users = UserStore.getUsers();
        users.forEach((u) => {
          this.notifyListeners({
            providerId: u.id,
            status: (u.availabilityStatus as AvailabilityStatusType) || (u.availabilityStatus !== 'BOOKED' ? 'AVAILABLE' : 'BOOKED'),
            isAvailable: u.availabilityStatus !== 'BOOKED' && u.availabilityStatus !== 'OFFLINE' && u.availabilityStatus !== 'CLOSED',
            updatedAt: new Date().toISOString(),
          });
        });
      }
    });
  }

  /**
   * Fallback polling if Realtime is disconnected
   */
  private startFallbackPolling() {
    if (this.pollInterval || typeof window === 'undefined') return;
    this.pollInterval = setInterval(async () => {
      try {
        const users = await UserStore.fetchUsersFromApi();
        users.forEach((u) => {
          this.notifyListeners({
            providerId: u.id,
            status: (u.availabilityStatus as AvailabilityStatusType) || 'AVAILABLE',
            isAvailable: u.availabilityStatus !== 'BOOKED' && u.availabilityStatus !== 'OFFLINE',
            updatedAt: new Date().toISOString(),
          });
        });
      } catch (e) {
        // silent
      }
    }, 10000); // 10 second fallback poll
  }

  /**
   * Broadcasts status change to all open browser windows & website provider cards
   */
  public async setProviderAvailability(
    providerId: string,
    status: AvailabilityStatusType
  ): Promise<boolean> {
    const isAvailable = !['BOOKED', 'BUSY', 'FULL', 'CLOSED', 'OFFLINE'].includes(status);
    const updatedAt = new Date().toISOString();

    const payload: AvailabilityChangePayload = {
      providerId,
      status,
      isAvailable,
      updatedAt,
    };

    // 1. Update UserStore & local storage
    await UserStore.updateUser(providerId, {
      availabilityStatus: status as any,
    });

    // 2. Broadcast via Supabase Realtime
    if (this.channel) {
      try {
        await this.channel.send({
          type: 'broadcast',
          event: 'availability-change',
          payload,
        });
      } catch (e) {
        console.warn('Supabase broadcast failed:', e);
      }
    }

    // 3. Notify local subscribers instantly
    this.notifyListeners(payload);

    return true;
  }

  /**
   * Subscribe component / provider card to availability updates
   */
  public subscribe(callback: AvailabilityCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(payload: AvailabilityChangePayload) {
    this.listeners.forEach((cb) => {
      try {
        cb(payload);
      } catch (e) {
        console.error('Error notifying availability listener:', e);
      }
    });
  }
}

export const realtimeAvailabilityEngine = RealtimeAvailabilityEngine.getInstance();
