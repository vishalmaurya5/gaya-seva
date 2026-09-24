export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'PILGRIM' | 'PANDIT' | 'BARBER' | 'DRIVER' | 'AUTO' | 'TRAVEL' | 'HOTEL' | 'SHOP' | 'GUIDE' | 'FOOD' | 'HEALTHCARE' | 'PHOTOGRAPHY' | 'ADMIN' | 'SUPER_ADMIN' | 'OTHER';
  customRole?: string;
  specialization?: string;
  status: 'VERIFIED' | 'PENDING' | 'SUSPENDED';
  city?: string;
  languages?: string[];
  createdAt: string;
  avatarUrl?: string;
  profilePicUrl?: string;
  documentUrl?: string;
  googleMapsUrl?: string;
  lat?: number;
  lng?: number;
  rating?: number;
  password?: string;
  availabilityStatus?: 'AVAILABLE' | 'BUSY' | 'BOOKED' | 'LIMITED' | 'FULL' | 'OPEN' | 'CLOSED' | 'OFFLINE';
  description?: string;
  features?: string[];
  capacity?: string;
}

const STORAGE_KEY = 'GAYASEVA_USERS_STORE';
const API_URL = typeof window !== 'undefined'
  ? '/api/users'
  : (process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users` : '/api/users');

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr_super_vishal',
    name: 'Vishal Verma',
    email: 'vishalverma5359@gayaseva.com',
    password: 'Babu@730123',
    phone: '+917301230000',
    role: 'SUPER_ADMIN',
    status: 'VERIFIED',
    city: 'Gaya Ji',
    createdAt: '2026-01-01T00:00:00.000Z',
    rating: 5.0,
  },
  {
    id: 'usr_super',
    name: 'Vikramaditya Sharma',
    email: 'superadmin@gayaseva.org',
    password: 'Babu@730123',
    phone: '+919876543200',
    role: 'SUPER_ADMIN',
    status: 'VERIFIED',
    city: 'Gaya Ji',
    createdAt: '2026-01-01T00:00:00.000Z',
    rating: 5.0,
  },
  {
    id: 'usr_pnd1',
    name: 'Pandit Rajesh Shastri',
    email: 'rajesh.shastri@gayaseva.org',
    password: 'password123',
    phone: '+919876543210',
    role: 'PANDIT',
    customRole: 'Pinda Daan & Tripindi Shraddha Specialist',
    status: 'VERIFIED',
    city: 'Vishnupad Zone',
    languages: ['Hindi', 'Sanskrit', 'Bengali'],
    createdAt: '2026-02-10T00:00:00.000Z',
    rating: 4.9,
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'usr_brb1',
    name: 'Ramu Thakur (Kshaur Karma)',
    email: 'ramu.barber@gayaseva.org',
    password: 'password123',
    phone: '+919876543250',
    role: 'BARBER',
    customRole: 'Kshaur Karma & Mundan Specialist (नाई / ठाकुर)',
    status: 'VERIFIED',
    city: 'Vishnupad Ghat Area',
    languages: ['Hindi', 'Magahi'],
    createdAt: '2026-03-10T00:00:00.000Z',
    rating: 4.9,
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'usr_1790016112398',
    name: 'Chanda Thakur',
    email: '9939778855@provider.gayaseva.org',
    phone: '+919939778855',
    password: '123456',
    role: 'BARBER',
    customRole: 'Kshaur Karma & Mundan Specialist (नाई / ठाकुर)',
    status: 'VERIFIED',
    city: 'Gaya Ji / Falgu Ghat',
    languages: ['Hindi', 'English'],
    createdAt: '2026-09-21T18:41:52.747Z',
    avatarUrl: '/uploads/gayaseva-partner-profiles/IMG_20240829_204658_1790016073002_xpy2mvg_1790016075236.jpg',
    profilePicUrl: '/uploads/gayaseva-partner-profiles/IMG_20240829_204658_1790016073002_xpy2mvg_1790016075236.jpg',
    documentUrl: '/uploads/gayaseva-partner-documents/id1_1790016080376_1cq50v0_1790016081457.jpg',
    rating: 5,
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'usr_drv1',
    name: 'Ramesh Kumar (Taxi Service)',
    email: 'ramesh.cab@gayaseva.org',
    password: 'password123',
    phone: '+919876543220',
    role: 'DRIVER',
    customRole: 'Ac Dzire / Etios Taxi',
    status: 'VERIFIED',
    city: 'Gaya Junction',
    createdAt: '2026-02-15T00:00:00.000Z',
    rating: 4.8,
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'usr_htl1',
    name: 'Sri Vishnupad Yatri Dharamshala',
    email: 'dharamshala@gayaseva.org',
    password: 'password123',
    phone: '+919876543230',
    role: 'HOTEL',
    customRole: 'AC Yatri Dharamshala & Guest House',
    status: 'VERIFIED',
    city: 'Vishnupad Temple Area',
    createdAt: '2026-03-01T00:00:00.000Z',
    rating: 4.9,
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'usr_pilgrim1',
    name: 'Sunita Banerjee',
    email: 'sunita.banerjee@gmail.com',
    password: 'password123',
    phone: '+919876543240',
    role: 'PILGRIM',
    status: 'VERIFIED',
    city: 'Kolkata',
    createdAt: '2026-03-05T00:00:00.000Z',
    availabilityStatus: 'AVAILABLE',
  }
];

export const UserStore = {
  getUsers(): UserAccount[] {
    if (typeof window === 'undefined') return DEFAULT_USERS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_USERS;
    }
  },

  async fetchUsersFromApi(): Promise<UserAccount[]> {
    if (typeof window === 'undefined') return DEFAULT_USERS;
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      if (res.ok) {
        const users = await res.json();
        if (Array.isArray(users)) {
          const currentStoredUsers = this.getUsers();
          if (JSON.stringify(currentStoredUsers) !== JSON.stringify(users)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
            window.dispatchEvent(new Event('storage'));
          }
          return users;
        }
      }
    } catch (e) {
      // Fallback silently if API server is not running
    }
    return this.getUsers();
  },

  saveUsers(users: UserAccount[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('gayaseva_user_change'));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  },

  async addUser(user: Omit<UserAccount, 'id' | 'createdAt'>): Promise<UserAccount> {
    const users = this.getUsers();
    const newUser: UserAccount = {
      availabilityStatus: 'AVAILABLE',
      ...user,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newUser, ...users];
    this.saveUsers(updated);

    // Sync with Centralized API Server
    if (typeof window !== 'undefined') {
      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });
      } catch (e) {
        console.error('Failed to sync add user with API server:', e);
      }
    }

    return newUser;
  },

  async updateUser(id: string, updates: Partial<UserAccount>): Promise<UserAccount | null> {
    const users = this.getUsers();
    let updatedUser: UserAccount | null = null;
    const updated = users.map((u) => {
      if (u.id === id) {
        updatedUser = { ...u, ...updates };
        return updatedUser;
      }
      return u;
    });
    if (updatedUser) {
      this.saveUsers(updated);

      // Sync update with API Server
      if (typeof window !== 'undefined') {
        try {
          await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates }),
          });
        } catch (e) {
          console.error('Failed to sync update user with API server:', e);
        }
      }
    }
    return updatedUser;
  },

  async deleteUser(id: string): Promise<boolean> {
    const users = this.getUsers();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length !== users.length) {
      this.saveUsers(filtered);

      // Sync deletion with API Server and await completion
      if (typeof window !== 'undefined') {
        try {
          await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE',
          });
        } catch (e) {
          console.error('Failed to sync deletion with API server:', e);
        }
      }
      return true;
    }
    return false;
  },

  findUserByIdentifier(identifier: string): UserAccount | undefined {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    return users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
    );
  }
};
