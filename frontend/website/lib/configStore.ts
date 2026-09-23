export interface SystemConfig {
  customer_access_fee: number;
  provider_registration_fee: number;
  customer_access_duration_days: number; // 0 = lifetime access
  currency: string;
  payment_enabled: boolean;
  refund_enabled: boolean;
  updatedAt?: string;
}

export const DEFAULT_CONFIG: SystemConfig = {
  customer_access_fee: 5,
  provider_registration_fee: 49,
  customer_access_duration_days: 0,
  currency: 'INR',
  payment_enabled: true,
  refund_enabled: true,
};

const STORAGE_KEY = 'GAYASEVA_SYSTEM_CONFIG';

export const ConfigStore = {
  getConfig(): SystemConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_CONFIG;
  },

  async fetchConfig(): Promise<SystemConfig> {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    try {
      const res = await fetch('/api/config', { cache: 'no-store' });
      if (res.ok) {
        const config = await res.json();
        if (config && typeof config.customer_access_fee === 'number') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
          return config;
        }
      }
    } catch (e) {}
    return this.getConfig();
  },

  saveConfig(config: SystemConfig) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('storage'));
  }
};
