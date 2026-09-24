/**
 * GayaSeva Role-Based Provider Dashboard Architecture
 * Single Source of Truth for Provider Roles, Permissions, Modules & Status Options.
 */

export type ProviderRoleKey =
  | 'DRIVER'
  | 'TOTO_DRIVER'
  | 'TAXI_PROVIDER'
  | 'PANDIT'
  | 'RELIGIOUS_SERVICE_PROVIDER'
  | 'HOTEL'
  | 'DHARAMSHALA'
  | 'GUEST_HOUSE'
  | 'PUJA_MATERIAL_SHOP'
  | 'FOOD_PROVIDER'
  | 'GUIDE'
  | 'BARBER'
  | 'OTHER_SERVICE_PROVIDER';

export type AvailabilityStatusType =
  | 'AVAILABLE'
  | 'BUSY'
  | 'BOOKED'
  | 'LIMITED'
  | 'FULL'
  | 'OPEN'
  | 'CLOSED'
  | 'OFFLINE';

export interface DashboardModule {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface ProviderRoleConfig {
  roleKey: ProviderRoleKey;
  title: string;
  category: 'TRANSPORT' | 'RELIGIOUS' | 'ACCOMMODATION' | 'SHOPPING' | 'GUIDANCE' | 'GENERAL';
  availableStatuses: { key: AvailabilityStatusType; label: string; color: string; badgeClass: string }[];
  modules: DashboardModule[];
}

const COMMON_MODULES: DashboardModule[] = [
  { id: 'overview', name: 'Overview', iconName: 'LayoutDashboard', description: 'Dashboard metrics & quick actions' },
  { id: 'profile', name: 'Profile Management', iconName: 'User', description: 'Update business profile & contact' },
  { id: 'availability', name: 'Live Availability', iconName: 'Power', description: 'Control online/busy availability status' },
  { id: 'requests', name: 'Requests & Bookings', iconName: 'CalendarCheck', description: 'Manage incoming customer requests' },
  { id: 'reviews', name: 'Reviews & Rating', iconName: 'Star', description: 'Customer feedback & ratings' },
  { id: 'earnings', name: 'Earnings & Payments', iconName: 'Wallet', description: 'Payment history & earnings summary' },
  { id: 'notifications', name: 'Notifications', iconName: 'Bell', description: 'System & customer alerts' },
  { id: 'support', name: 'Support & Help', iconName: 'HelpCircle', description: 'Contact GayaSeva support' },
];

export const PROVIDER_ROLE_CONFIGS: Record<ProviderRoleKey, ProviderRoleConfig> = {
  DRIVER: {
    roleKey: 'DRIVER',
    title: 'Taxi & Driver Partner',
    category: 'TRANSPORT',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 ONLINE & AVAILABLE', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'BUSY', label: '🟠 BUSY / ON RIDE', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'OFFLINE', label: '⚪ OFFLINE', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'vehicle', name: 'Vehicle & Cab Info', iconName: 'Car', description: 'Vehicle model, plate & capacity' },
      { id: 'services', name: 'Route & Rate Card', iconName: 'MapPin', description: 'Pickup & drop destinations' },
      { id: 'active_ride', name: 'Active Ride & Live GPS', iconName: 'Navigation', description: 'Live ride navigation & location sharing' },
    ],
  },
  TOTO_DRIVER: {
    roleKey: 'TOTO_DRIVER',
    title: 'E-Rickshaw & Toto Partner',
    category: 'TRANSPORT',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 ONLINE & AVAILABLE', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'BUSY', label: '🟠 BUSY / ON TRIP', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'OFFLINE', label: '⚪ OFFLINE', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'vehicle', name: 'Toto / Auto Details', iconName: 'Car', description: 'E-rickshaw specs & passenger capacity' },
      { id: 'services', name: 'Local Stand & Routes', iconName: 'MapPin', description: 'Local Gaya Ji area routes' },
      { id: 'active_ride', name: 'Active Trip & GPS', iconName: 'Navigation', description: 'Active ride tracking' },
    ],
  },
  TAXI_PROVIDER: {
    roleKey: 'TAXI_PROVIDER',
    title: 'Outstation & Airport Taxi Provider',
    category: 'TRANSPORT',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 AVAILABLE FOR BOOKING', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'BUSY', label: '🟠 FULLY BOOKED', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'OFFLINE', label: '⚪ SERVICE CLOSED', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'vehicle', name: 'Fleet & Cabs', iconName: 'Car', description: 'Manage cabs & drivers' },
      { id: 'services', name: 'Packages & Tariffs', iconName: 'Tag', description: 'Airport & Bodh Gaya packages' },
      { id: 'active_ride', name: 'Active Trips', iconName: 'Navigation', description: 'Track ongoing trips' },
    ],
  },
  PANDIT: {
    roleKey: 'PANDIT',
    title: 'Tirth Purohit & Pandit Ji',
    category: 'RELIGIOUS',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 AVAILABLE FOR PUJA', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'BOOKED', label: '🟠 IN PUJA / BOOKED', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'OFFLINE', label: '⚪ OFFLINE / UNAVAILABLE', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'services', name: 'Puja & Ritual Services', iconName: 'Flame', description: 'Pinda Daan, Tripindi & Tarpan' },
      { id: 'upcoming_pujas', name: 'Scheduled Pujas', iconName: 'Calendar', description: 'Calendar of upcoming rituals' },
    ],
  },
  RELIGIOUS_SERVICE_PROVIDER: {
    roleKey: 'RELIGIOUS_SERVICE_PROVIDER',
    title: 'Religious Ritual Provider',
    category: 'RELIGIOUS',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 ACCEPTING REQUESTS', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'BOOKED', label: '🟠 BUSY / BOOKED', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'OFFLINE', label: '⚪ CLOSED', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'services', name: 'Ritual Packages', iconName: 'Flame', description: 'Specialized ritual arrangements' },
    ],
  },
  HOTEL: {
    roleKey: 'HOTEL',
    title: 'Hotel & Yatri Niwas Partner',
    category: 'ACCOMMODATION',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 ROOMS AVAILABLE', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'LIMITED', label: '🟠 LIMITED ROOMS LEFT', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'FULL', label: '🔴 FULLY BOOKED', color: 'red', badgeClass: 'bg-red-600 text-white font-black' },
      { key: 'CLOSED', label: '⚪ CLOSED', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'rooms', name: 'Rooms & Capacity', iconName: 'Hotel', description: 'AC / Non-AC rooms & bed capacity' },
      { id: 'services', name: 'Amenities & Parking', iconName: 'Coffee', description: 'Parking, meals & hot water' },
    ],
  },
  DHARAMSHALA: {
    roleKey: 'DHARAMSHALA',
    title: 'Pilgrim Dharamshala Partner',
    category: 'ACCOMMODATION',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 BEDS & ROOMS AVAILABLE', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'LIMITED', label: '🟠 FEW SEATS LEFT', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'FULL', label: '🔴 HOUSE FULL', color: 'red', badgeClass: 'bg-red-600 text-white font-black' },
      { key: 'CLOSED', label: '⚪ CLOSED', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'rooms', name: 'Hall & Room Booking', iconName: 'Hotel', description: 'Dharamshala halls & pilgrim rooms' },
      { id: 'services', name: 'Facilities & Kitchen', iconName: 'Utensils', description: 'Pure veg kitchen & vessel access' },
    ],
  },
  GUEST_HOUSE: {
    roleKey: 'GUEST_HOUSE',
    title: 'Family Guest House Partner',
    category: 'ACCOMMODATION',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 ROOMS AVAILABLE', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'LIMITED', label: '🟠 FEW ROOMS LEFT', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'FULL', label: '🔴 FULLY BOOKED', color: 'red', badgeClass: 'bg-red-600 text-white font-black' },
      { key: 'CLOSED', label: '⚪ CLOSED', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'rooms', name: 'Family Rooms', iconName: 'Hotel', description: 'Private guest rooms & suites' },
    ],
  },
  PUJA_MATERIAL_SHOP: {
    roleKey: 'PUJA_MATERIAL_SHOP',
    title: 'Puja Samagri & Material Shop',
    category: 'SHOPPING',
    availableStatuses: [
      { key: 'OPEN', label: '🟢 SHOP OPEN', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'BUSY', label: '🟠 HIGH DEMAND', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'CLOSED', label: '⚪ SHOP CLOSED', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'products', name: 'Samagri Products & Price', iconName: 'ShoppingBag', description: 'Pinda Daan kits & items' },
      { id: 'services', name: 'Delivery / Pickup', iconName: 'Truck', description: 'Ghat delivery options' },
    ],
  },
  FOOD_PROVIDER: {
    roleKey: 'FOOD_PROVIDER',
    title: 'Pure Sattvik Food & Bhojanalaya',
    category: 'SHOPPING',
    availableStatuses: [
      { key: 'OPEN', label: '🟢 SERVING MEALS', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'BUSY', label: '🟠 BUSY / PREPARING', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'CLOSED', label: '⚪ KITCHEN CLOSED', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'products', name: 'Menu & Thali List', iconName: 'Utensils', description: 'Sattvik thalis & food items' },
    ],
  },
  GUIDE: {
    roleKey: 'GUIDE',
    title: 'Gaya Ji Teerth & Cultural Guide',
    category: 'GUIDANCE',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 AVAILABLE FOR TOUR', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'BUSY', label: '🟠 ON TOUR / BUSY', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'OFFLINE', label: '⚪ OFFLINE', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'services', name: 'Guided Tour Packages', iconName: 'Compass', description: 'Vishnupad, Falgu, Mangla Gauri & Bodh Gaya' },
      { id: 'languages', name: 'Languages Spoken', iconName: 'Globe', description: 'Hindi, Bengali, English, Tamil etc.' },
    ],
  },
  BARBER: {
    roleKey: 'BARBER',
    title: 'Kshaur Karma & Mundan Specialist',
    category: 'RELIGIOUS',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 AVAILABLE AT GHAT', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'BUSY', label: '🟠 PERFORMING KSHAUR', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'OFFLINE', label: '⚪ OFFLINE', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: [
      ...COMMON_MODULES,
      { id: 'services', name: 'Kshaur / Mundan Services', iconName: 'Scissors', description: 'Ritual shaving & mundan' },
    ],
  },
  OTHER_SERVICE_PROVIDER: {
    roleKey: 'OTHER_SERVICE_PROVIDER',
    title: 'GayaSeva Verified Partner',
    category: 'GENERAL',
    availableStatuses: [
      { key: 'AVAILABLE', label: '🟢 AVAILABLE', color: 'emerald', badgeClass: 'bg-emerald-500 text-slate-950 font-black' },
      { key: 'BUSY', label: '🟠 BUSY', color: 'amber', badgeClass: 'bg-amber-500 text-slate-950 font-black' },
      { key: 'OFFLINE', label: '⚪ OFFLINE', color: 'slate', badgeClass: 'bg-slate-600 text-white font-black' },
    ],
    modules: COMMON_MODULES,
  },
};

/**
 * Normalizes input role string to valid ProviderRoleKey
 */
export function normalizeProviderRole(rawRole?: string): ProviderRoleKey {
  if (!rawRole) return 'DRIVER';
  const clean = rawRole.trim().toUpperCase().replace(/[-\s]/g, '_');

  if (clean in PROVIDER_ROLE_CONFIGS) {
    return clean as ProviderRoleKey;
  }

  // Common aliases
  if (clean === 'AUTO' || clean === 'TAXI' || clean === 'CAB' || clean === 'TRAVEL') return 'DRIVER';
  if (clean === 'SHOP' || clean === 'SAMAGRI') return 'PUJA_MATERIAL_SHOP';
  if (clean === 'FOOD' || clean === 'BHOJANALAYA') return 'FOOD_PROVIDER';
  if (clean === 'STAY' || clean === 'LODGE') return 'HOTEL';
  if (clean === 'PUROHIT') return 'PANDIT';

  return 'OTHER_SERVICE_PROVIDER';
}

/**
 * Resolves full role configuration for a provider
 */
export function getProviderRoleConfig(rawRole?: string): ProviderRoleConfig {
  const normalizedKey = normalizeProviderRole(rawRole);
  return PROVIDER_ROLE_CONFIGS[normalizedKey];
}
