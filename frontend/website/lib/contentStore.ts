export interface PopupAd {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  actionUrl: string;
  phone: string;
  whatsapp: string;
  isActive: boolean;
  delaySeconds: number;
}

export interface SliderBanner {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  imageUrl: string;
  actionUrl: string;
  buttonText: string;
  phone: string;
  whatsapp: string;
  isActive: boolean;
  sequence: number;
}

export interface SacredPlace {
  id: string;
  slug: string;
  title: string;
  category: 'TEERTH' | 'MALL' | 'MARKET' | 'TRANSIT' | 'FOOD';
  timing: string;
  description: string;
  lat: string;
  lng: string;
  imageUrl?: string;
  isFeatured: boolean;
}

export interface ServiceConfigItem {
  id: string;
  category: 'PICK_DROP' | 'PANDIT' | 'BARBER' | 'STAY' | 'FOOD' | 'PUJA_KIT' | 'GUIDE';
  title: string;
  subtitle: string;
  priceText: string;
  details: string;
  imageUrl?: string;
  phone?: string;
  whatsapp?: string;
  availabilityStatus?: 'AVAILABLE' | 'BOOKED';
}

export interface LostFoundItem {
  id: string;
  type: 'LOST' | 'FOUND';
  category: 'PERSON' | 'DOCUMENT' | 'VALUABLES' | 'ELECTRONICS' | 'LUGGAGE' | 'OTHER';
  title: string;
  description: string;
  location: string;
  date: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
  imageUrl?: string;
  status: 'REPORTED' | 'VERIFIED' | 'REUNITED' | 'CLOSED';
  createdAt: string;
}

// Initial Default Data (Popup Ads default empty until added by Admin)
const INITIAL_POPUP_ADS: PopupAd[] = [];

const INITIAL_SLIDER_BANNERS: SliderBanner[] = [
  {
    id: 'sld-1',
    title: '🚕 Gaya Railway Station Express Pick & Drop Cab',
    subtitle: '24/7 Guaranteed direct pickup from GAYA Junction to Vishnupad Temple & Bodh Gaya.',
    badgeText: 'EXPRESS TRANSPORT',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
    actionUrl: '/pick-drop',
    buttonText: 'Book Cab Now',
    phone: '+91 8544491413',
    whatsapp: '918544491413',
    isActive: true,
    sequence: 1,
  },
  {
    id: 'sld-2',
    title: '🙏 Verified Gaya Ji Pandits & Pinda Daan Rituals',
    subtitle: 'Experienced Teerth Purohits for Falgu Devghat, Akshayavat & Vishnupad rites.',
    badgeText: 'PURANI PURAAN SHRADH',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    actionUrl: '/pandit',
    buttonText: 'Connect with Pandit',
    phone: '+91 9296804705',
    whatsapp: '919296804705',
    isActive: true,
    sequence: 2,
  },
  {
    id: 'sld-3',
    title: '🏨 Safe Family Stays & Dharamshalas Near Vishnupad',
    subtitle: 'Clean AC family rooms, dormitories & parking for pilgrims.',
    badgeText: 'VERIFIED ROOMS',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    actionUrl: '/stay',
    buttonText: 'Explore Stays',
    phone: '+91 7301232069',
    whatsapp: '917301232069',
    isActive: true,
    sequence: 3,
  },
];

const INITIAL_PLACES: SacredPlace[] = [
  {
    id: 'plc-1',
    slug: 'vishnupad',
    title: 'Vishnupad Temple',
    category: 'TEERTH',
    timing: '5:00 AM - 9:00 PM',
    description: '40-cm basalt footprint of Lord Vishnu. Main hub for Pinda Daan and ancestor salvation.',
    lat: '24.7865',
    lng: '85.0080',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    id: 'plc-2',
    slug: 'falgu-river',
    title: 'Falgu River Devghat',
    category: 'TEERTH',
    timing: 'Open 24 Hours',
    description: 'Holy river for ancestor sand Pinda offerings & evening Falgu Aarti. Antarsalila river bed.',
    lat: '24.7880',
    lng: '85.0120',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    id: 'plc-3',
    slug: 'akshayavat',
    title: 'Akshayavat Banyan Tree',
    category: 'TEERTH',
    timing: '6:00 AM - 7:00 PM',
    description: 'Immortal banyan tree where final Pinda Daan oblations and oblations are completed.',
    lat: '24.7840',
    lng: '85.0090',
    isFeatured: true,
  },
  {
    id: 'plc-4',
    slug: 'pretshila',
    title: 'Pretshila Hill Shrine',
    category: 'TEERTH',
    timing: '6:00 AM - 6:00 PM',
    description: 'Sacred hill shrine dedicated to salvation of souls who suffered untimely demise.',
    lat: '24.8450',
    lng: '84.9850',
    isFeatured: true,
  },
  {
    id: 'plc-5',
    slug: 'bodh-gaya',
    title: 'Bodh Gaya Mahabodhi',
    category: 'TEERTH',
    timing: '5:00 AM - 9:00 PM',
    description: 'UNESCO World Heritage site where Lord Buddha attained supreme enlightenment.',
    lat: '24.6960',
    lng: '84.9915',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    id: 'plc-6',
    slug: 'mgb-mall',
    title: 'MGB Food Mall & Cineplex',
    category: 'MALL',
    timing: '10:00 AM - 10:00 PM',
    description: 'GB Road • Shopping, multi-cuisine food court & movie entertainment center.',
    lat: '24.7950',
    lng: '85.0020',
    isFeatured: true,
  },
  {
    id: 'plc-7',
    slug: 'ramna-tilkut',
    title: 'Ramna Road Tilkut Bazaar',
    category: 'MARKET',
    timing: '8:00 AM - 9:00 PM',
    description: 'Ramna Road • World Famous Gaya Jaggery & Sugar Tilkut, Anarsa & Sweet Market.',
    lat: '24.7980',
    lng: '85.0050',
    isFeatured: true,
  },
  {
    id: 'plc-8',
    slug: 'tibetan-market',
    title: 'Tibetan Refugee Market',
    category: 'MARKET',
    timing: '9:00 AM - 8:00 PM',
    description: 'Bodh Gaya • Authentic Tibetan handicrafts, woolen garments & souvenirs.',
    lat: '24.6980',
    lng: '84.9930',
    isFeatured: true,
  },
];

const INITIAL_SERVICES: ServiceConfigItem[] = [
  {
    id: 'srv-1',
    category: 'PICK_DROP',
    title: 'Gaya Station → Vishnupad Temple',
    subtitle: 'E-Rickshaw / Auto / Sedan Cab',
    priceText: '₹250 - ₹350',
    details: 'Direct transfer from Gaya Junction to Vishnupad Devghat.',
    phone: '+91 8544491413',
    whatsapp: '918544491413',
  },
  {
    id: 'srv-2',
    category: 'PANDIT',
    title: 'Pandit Rajesh Shastri',
    subtitle: '22+ Years Exp • Hindi, Sanskrit, Bengali',
    priceText: 'GayaSeva Verified',
    details: 'Expert in Pinda Daan, Tripindi Shradh & Narayan Bali.',
    phone: '+91 9296804705',
    whatsapp: '919296804705',
  },
  {
    id: 'srv-3',
    category: 'STAY',
    title: 'Gaya Ji Teerth Guest House',
    subtitle: 'Near Vishnupad Temple • Family AC Rooms',
    priceText: '₹1,200 / night',
    details: 'Clean, safe family lodging with hot water and parking.',
    phone: '+91 7301232069',
    whatsapp: '917301232069',
  },
];

const INITIAL_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-1',
    type: 'LOST',
    category: 'PERSON',
    title: 'Ramavtar Sharma (Age 68) — Missing near Falgu Devghat',
    description: 'Wearing white kurta-dhoti and saffron pitambari shawl. Speaks Hindi & Bhojpuri. Separated during morning Pinda Daan Tarpan at Falgu River Ghat 4.',
    location: 'Falgu River Devghat No. 4, Gaya Ji',
    date: '2026-09-21',
    reporterName: 'Pankaj Sharma',
    reporterPhone: '+91 9431200030',
    status: 'VERIFIED',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'lf-2',
    type: 'FOUND',
    category: 'DOCUMENT',
    title: 'Brown Leather Wallet with Aadhaar Card & Train Ticket',
    description: 'Found brown wallet containing Aadhaar Card (Name: S. K. Roy), SBI ATM card, and train ticket to Howrah Jn.',
    location: 'Vishnupad Temple Gate 2 Police Helpdesk',
    date: '2026-09-21',
    reporterName: 'GayaSeva Volunteer Team',
    reporterPhone: '+91 8544491413',
    status: 'VERIFIED',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'lf-3',
    type: 'LOST',
    category: 'ELECTRONICS',
    title: 'Blue Realme Smartphone in Black Leather Case',
    description: 'Lost near Bodh Gaya Mahabodhi temple main entrance bus parking area.',
    location: 'Bodh Gaya Mahabodhi Parking',
    date: '2026-09-20',
    reporterName: 'Anjali Devi',
    reporterPhone: '+91 9123456789',
    status: 'REPORTED',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'lf-4',
    type: 'FOUND',
    category: 'LUGGAGE',
    title: 'Red VIP Travel Trolley Bag (Safely Reunited)',
    description: 'Left behind near Gaya Junction Taxi Stand. Successfully verified and handed over to rightful owner.',
    location: 'Gaya Junction Platform 1 Helpdesk',
    date: '2026-09-19',
    reporterName: 'Gaya Railway Police Helpdesk',
    reporterPhone: '+91 8544491413',
    status: 'REUNITED',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

const KEYS = {
  POPUP_ADS: 'gayaseva_popup_ads_v2',
  SLIDER_BANNERS: 'gayaseva_slider_banners_v2',
  PLACES: 'gayaseva_places_db_v1',
  SERVICES: 'gayaseva_services_db_v1',
  LOST_FOUND: 'gayaseva_lost_found_db_v1',
};

export class ContentStore {
  // POPUP ADS CRUD
  static getPopupAds(): PopupAd[] {
    if (typeof window === 'undefined') return INITIAL_POPUP_ADS;
    try {
      const stored = localStorage.getItem(KEYS.POPUP_ADS);
      if (!stored) {
        localStorage.setItem(KEYS.POPUP_ADS, JSON.stringify(INITIAL_POPUP_ADS));
        return INITIAL_POPUP_ADS;
      }
      const parsed: PopupAd[] = JSON.parse(stored);
      const cleaned = parsed.filter(ad => ad.id !== 'pop-1');
      if (cleaned.length !== parsed.length) {
        this.savePopupAds(cleaned);
      }
      return cleaned;
    } catch {
      return INITIAL_POPUP_ADS;
    }
  }

  static savePopupAds(ads: PopupAd[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.POPUP_ADS, JSON.stringify(ads));
    window.dispatchEvent(new Event('storage'));
  }

  static addPopupAd(ad: Omit<PopupAd, 'id'>): PopupAd {
    const ads = this.getPopupAds();
    const newAd: PopupAd = { ...ad, id: 'pop-' + Date.now() };
    ads.unshift(newAd);
    this.savePopupAds(ads);
    return newAd;
  }

  static updatePopupAd(id: string, updated: Partial<PopupAd>): void {
    const ads = this.getPopupAds().map((a) => (a.id === id ? { ...a, ...updated } : a));
    this.savePopupAds(ads);
  }

  static deletePopupAd(id: string): void {
    const ads = this.getPopupAds().filter((a) => a.id !== id);
    this.savePopupAds(ads);
  }

  static getActivePopupAd(): PopupAd | null {
    const ads = this.getPopupAds();
    return ads.find((a) => a.isActive) || null;
  }

  // HOMEPAGE SLIDER BANNERS CRUD
  static getSliderBanners(): SliderBanner[] {
    if (typeof window === 'undefined') return INITIAL_SLIDER_BANNERS;
    try {
      const stored = localStorage.getItem(KEYS.SLIDER_BANNERS);
      if (!stored) {
        localStorage.setItem(KEYS.SLIDER_BANNERS, JSON.stringify(INITIAL_SLIDER_BANNERS));
        return INITIAL_SLIDER_BANNERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SLIDER_BANNERS;
    }
  }

  static saveSliderBanners(banners: SliderBanner[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.SLIDER_BANNERS, JSON.stringify(banners));
    window.dispatchEvent(new Event('storage'));
  }

  static addSliderBanner(banner: Omit<SliderBanner, 'id'>): SliderBanner {
    const banners = this.getSliderBanners();
    const newBanner: SliderBanner = { ...banner, id: 'sld-' + Date.now() };
    banners.unshift(newBanner);
    this.saveSliderBanners(banners);
    return newBanner;
  }

  static updateSliderBanner(id: string, updated: Partial<SliderBanner>): void {
    const banners = this.getSliderBanners().map((b) => (b.id === id ? { ...b, ...updated } : b));
    this.saveSliderBanners(banners);
  }

  static deleteSliderBanner(id: string): void {
    const banners = this.getSliderBanners().filter((b) => b.id !== id);
    this.saveSliderBanners(banners);
  }

  static getActiveSliderBanners(): SliderBanner[] {
    const banners = this.getSliderBanners();
    return banners.filter((b) => b.isActive).sort((a, b) => a.sequence - b.sequence);
  }

  // PLACES CRUD
  static getPlaces(): SacredPlace[] {
    if (typeof window === 'undefined') return INITIAL_PLACES;
    try {
      const stored = localStorage.getItem(KEYS.PLACES);
      if (!stored) {
        localStorage.setItem(KEYS.PLACES, JSON.stringify(INITIAL_PLACES));
        return INITIAL_PLACES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_PLACES;
    }
  }

  static savePlaces(places: SacredPlace[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.PLACES, JSON.stringify(places));
    window.dispatchEvent(new Event('storage'));
  }

  static addPlace(place: Omit<SacredPlace, 'id'>): SacredPlace {
    const places = this.getPlaces();
    const newPlace: SacredPlace = { ...place, id: 'plc-' + Date.now() };
    places.unshift(newPlace);
    this.savePlaces(places);
    return newPlace;
  }

  static updatePlace(id: string, updated: Partial<SacredPlace>): void {
    const places = this.getPlaces().map((p) => (p.id === id ? { ...p, ...updated } : p));
    this.savePlaces(places);
  }

  static deletePlace(id: string): void {
    const places = this.getPlaces().filter((p) => p.id !== id);
    this.savePlaces(places);
  }

  // SERVICES CRUD
  static getServices(): ServiceConfigItem[] {
    if (typeof window === 'undefined') return INITIAL_SERVICES;
    try {
      const stored = localStorage.getItem(KEYS.SERVICES);
      if (!stored) {
        localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
        return INITIAL_SERVICES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SERVICES;
    }
  }

  static saveServices(services: ServiceConfigItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
    window.dispatchEvent(new Event('storage'));
  }

  static addService(service: Omit<ServiceConfigItem, 'id'>): ServiceConfigItem {
    const services = this.getServices();
    const newService: ServiceConfigItem = { ...service, id: 'srv-' + Date.now() };
    const updated = [newService, ...services];
    this.saveServices(updated);
    return newService;
  }

  static updateService(id: string, updated: Partial<ServiceConfigItem>): void {
    const services = this.getServices().map((s) => (s.id === id ? { ...s, ...updated } : s));
    this.saveServices(services);
  }

  static deleteService(id: string): void {
    const services = this.getServices().filter((s) => s.id !== id);
    this.saveServices(services);
  }

  // LOST & FOUND CRUD
  static getLostFoundItems(): LostFoundItem[] {
    if (typeof window === 'undefined') return INITIAL_LOST_FOUND;
    try {
      const stored = localStorage.getItem(KEYS.LOST_FOUND);
      if (!stored) {
        localStorage.setItem(KEYS.LOST_FOUND, JSON.stringify(INITIAL_LOST_FOUND));
        return INITIAL_LOST_FOUND;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_LOST_FOUND;
    }
  }

  static saveLostFoundItems(items: LostFoundItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.LOST_FOUND, JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
  }

  static addLostFoundItem(item: Omit<LostFoundItem, 'id' | 'createdAt'>): LostFoundItem {
    const items = this.getLostFoundItems();
    const newItem: LostFoundItem = {
      ...item,
      id: 'lf-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...items];
    this.saveLostFoundItems(updated);
    return newItem;
  }

  static updateLostFoundItem(id: string, updated: Partial<LostFoundItem>): void {
    const items = this.getLostFoundItems().map((item) => (item.id === id ? { ...item, ...updated } : item));
    this.saveLostFoundItems(items);
  }

  static deleteLostFoundItem(id: string): void {
    const items = this.getLostFoundItems().filter((item) => item.id !== id);
    this.saveLostFoundItems(items);
  }
}

export class LostFoundStore {
  static getItems(): LostFoundItem[] {
    return ContentStore.getLostFoundItems();
  }

  static addItem(item: Omit<LostFoundItem, 'id' | 'createdAt'>): LostFoundItem {
    return ContentStore.addLostFoundItem(item);
  }

  static updateItem(id: string, updated: Partial<LostFoundItem>): void {
    ContentStore.updateLostFoundItem(id, updated);
  }

  static deleteItem(id: string): void {
    ContentStore.deleteLostFoundItem(id);
  }
}
