export interface PopupAd {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageSizeKb?: number;
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
  availabilityStatus?: 'AVAILABLE' | 'BUSY' | 'BOOKED' | 'LIMITED' | 'FULL' | 'OPEN' | 'CLOSED' | 'OFFLINE';
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
const INITIAL_POPUP_ADS: PopupAd[] = [
  {
    id: 'pop-promo-1',
    title: '🙏 Gaya Ji Pinda Daan & Yatra Special Offer',
    subtitle: 'Book Verified Teerth Pandits, Safe Hotel Stays, and Express Pickup Taxi Direct at 0% Commission.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    actionUrl: '/services',
    phone: '+91 9117588242',
    whatsapp: '919117588242',
    isActive: true,
    delaySeconds: 1,
  },
];

const INITIAL_SLIDER_BANNERS: SliderBanner[] = [
  {
    id: 'sld-1',
    title: '🚖 Gaya Railway Station Express Pick & Drop Cab',
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
  {
    id: 'sld-4',
    title: 'Apne Business ka Promotion GayaSeva Homepage par Karwayein!',
    subtitle: 'Agar aap Hotel, Dharamshala, Restaurant, Taxi/Bike Service, Pandit Ji, Pooja Samagri, Travel Service, Local Shop, Guide ya koi other local service provide karte hain, to aapka promotional slider GayaSeva Homepage par display kiya ja sakta hai.',
    badgeText: 'SPECIAL OFFER',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    actionUrl: '/provider/register',
    buttonText: 'Enquiry Now',
    phone: '+91 9117588242',
    whatsapp: '919117588242',
    isActive: true,
    sequence: 4,
  },
];

const INITIAL_PLACES: SacredPlace[] = [
  {
    id: 'plc-1',
    slug: 'vishnupad',
    title: 'Vishnupad Temple',
    category: 'TEERTH',
    timing: '5:00 AM - 9:00 PM',
    description: 'Chand Chaura, Gaya • Major Hindu pilgrimage site; 40-cm basalt footprint of Lord Vishnu for Pind Daan.',
    lat: '24.7865',
    lng: '85.0080',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    id: 'plc-2',
    slug: 'akshayavat',
    title: 'Akshay Vat',
    category: 'TEERTH',
    timing: '6:00 AM - 7:00 PM',
    description: 'Vishnupad area, Gaya • Sacred banyan tree and important final Pind Daan oblation location.',
    lat: '24.7840',
    lng: '85.0090',
    isFeatured: true,
  },
  {
    id: 'plc-3',
    slug: 'sitakund',
    title: 'Sita Kund',
    category: 'TEERTH',
    timing: '5:30 AM - 7:30 PM',
    description: 'Falgu River, Gaya • Religious site associated with Goddess Sita and sand Pind Daan.',
    lat: '24.7870',
    lng: '85.0130',
    isFeatured: true,
  },
  {
    id: 'plc-4',
    slug: 'ramshila',
    title: 'Ramshila Hill',
    category: 'TEERTH',
    timing: '6:00 AM - 7:00 PM',
    description: 'Ramshila, Gaya • Religious hill associated with Lord Rama Pind Daan and Rameshwar Mahadev shrine.',
    lat: '24.8150',
    lng: '85.0110',
    isFeatured: true,
  },
  {
    id: 'plc-5',
    slug: 'pretshila',
    title: 'Pretshila Hill',
    category: 'TEERTH',
    timing: '6:00 AM - 6:00 PM',
    description: 'Pretshila, Gaya • Important Pind Daan/Pitru ritual location for premature and unnatural deaths.',
    lat: '24.8450',
    lng: '84.9850',
    isFeatured: true,
  },
  {
    id: 'plc-6',
    slug: 'brahmayoni',
    title: 'Brahmayoni Hill',
    category: 'TEERTH',
    timing: '6:00 AM - 6:00 PM',
    description: 'Godawari Area, Gaya • Hill and pilgrimage destination with 424 steps & Ashtabhuja Devi shrine.',
    lat: '24.7790',
    lng: '84.9960',
    isFeatured: true,
  },
  {
    id: 'plc-7',
    slug: 'mangla-gauri',
    title: 'Mangla Gauri Temple',
    category: 'TEERTH',
    timing: '5:00 AM - 10:00 PM',
    description: 'Godawari, Gaya • Famous 51 Shakti Peeth pilgrimage site where breast of Sati fell.',
    lat: '24.7830',
    lng: '85.0010',
    isFeatured: true,
  },
  {
    id: 'plc-8',
    slug: 'falgu-river',
    title: 'Phalgu River',
    category: 'TEERTH',
    timing: 'Open 24 Hours',
    description: 'Devghat, Gaya • Major religious and cultural landmark for holy bath, tarpan, and sand Pinda offerings.',
    lat: '24.7880',
    lng: '85.0120',
    isFeatured: true,
  },
  {
    id: 'plc-9',
    slug: 'mahabodhi-temple',
    title: 'Mahabodhi Temple',
    category: 'TEERTH',
    timing: '5:00 AM - 9:00 PM',
    description: 'Bodh Gaya • Buddhist pilgrimage site and UNESCO World Heritage Site where Buddha attained enlightenment.',
    lat: '24.6960',
    lng: '84.9915',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    id: 'plc-10',
    slug: 'bodh-gaya',
    title: 'Bodh Gaya',
    category: 'TEERTH',
    timing: '5:00 AM - 9:00 PM',
    description: 'Gaya District • Major international Buddhist pilgrimage destination with international monasteries.',
    lat: '24.6960',
    lng: '84.9915',
    isFeatured: true,
  },
  {
    id: 'plc-11',
    slug: 'dungeshwari-caves',
    title: 'Dungeshwari Cave Temples',
    category: 'TEERTH',
    timing: '6:00 AM - 5:30 PM',
    description: 'Dungeshwari, Gaya • Buddhist meditation/pilgrimage location (Mahakala Caves) where Siddhartha meditated.',
    lat: '24.7080',
    lng: '85.0510',
    isFeatured: true,
  },
  {
    id: 'plc-12',
    slug: 'sujata-stupa',
    title: 'Sujata Stupa',
    category: 'TEERTH',
    timing: '6:00 AM - 6:30 PM',
    description: 'Bakraur, Bodh Gaya • Buddhist historical site commemorating Sujata offering kheer milk rice to Buddha.',
    lat: '24.6975',
    lng: '84.9995',
    isFeatured: true,
  },
  {
    id: 'plc-13',
    slug: 'muchalinda-lake',
    title: 'Muchalinda Lake',
    category: 'TEERTH',
    timing: '5:00 AM - 9:00 PM',
    description: 'Bodh Gaya • Important Buddhist site featuring Buddha statue protected by Snake King Muchalinda.',
    lat: '24.6955',
    lng: '84.9910',
    isFeatured: true,
  },
  {
    id: 'plc-14',
    slug: 'bhutan-monastery',
    title: 'Royal Bhutan Monastery',
    category: 'TEERTH',
    timing: '7:00 AM - 7:00 PM',
    description: 'Bodh Gaya • Serene Buddhist monastery featuring traditional Bhutanese clay reliefs and 7-foot Buddha.',
    lat: '24.6985',
    lng: '84.9900',
    isFeatured: true,
  },
  {
    id: 'plc-15',
    slug: 'tibetan-temple',
    title: 'Tibetan Temple',
    category: 'TEERTH',
    timing: '6:00 AM - 6:00 PM',
    description: 'Bodh Gaya • Vibrant Tibetan Buddhist temple featuring 20,000 kg bronze Prayer Wheel of Law.',
    lat: '24.6970',
    lng: '84.9920',
    isFeatured: true,
  },
  {
    id: 'plc-16',
    slug: 'thai-temple',
    title: 'Thai Temple (Wat Thai)',
    category: 'TEERTH',
    timing: '6:00 AM - 6:00 PM',
    description: 'Bodh Gaya • Exquisite Thai Buddhist temple with sloping gold-tiled roof & 25-meter bronze Buddha.',
    lat: '24.6965',
    lng: '84.9890',
    isFeatured: true,
  },
  {
    id: 'plc-17',
    slug: 'japanese-temple',
    title: 'Japanese Temple / Indosan Nipponji',
    category: 'TEERTH',
    timing: '6:00 AM - 6:00 PM',
    description: 'Bodh Gaya • Peaceful Japanese Zen Buddhist temple built in 1972 showcasing wooden pagoda architecture.',
    lat: '24.6990',
    lng: '84.9880',
    isFeatured: true,
  },
  {
    id: 'plc-18',
    slug: 'chinese-temple',
    title: 'Chinese Temple',
    category: 'TEERTH',
    timing: '7:00 AM - 6:00 PM',
    description: 'Bodh Gaya • Traditional Han-style Chinese Buddhist temple housing 200-year-old marble Buddha icons.',
    lat: '24.6968',
    lng: '84.9925',
    isFeatured: true,
  },
  {
    id: 'plc-19',
    slug: '80-feet-buddha',
    title: '80 Feet Buddha Statue',
    category: 'TEERTH',
    timing: '6:00 AM - 6:30 PM',
    description: 'Bodh Gaya • Major tourist attraction featuring an imposing 80-foot carved red sandstone Buddha statue.',
    lat: '24.6995',
    lng: '84.9870',
    isFeatured: true,
  },
  {
    id: 'plc-20',
    slug: 'gurpa-hill',
    title: 'Gurpa Hill',
    category: 'TEERTH',
    timing: '6:00 AM - 5:00 PM',
    description: 'Gurpa, Gaya District • Buddhist pilgrimage & natural rock summit destination (Gurupada Giri).',
    lat: '24.6720',
    lng: '85.2850',
    isFeatured: true,
  },
  {
    id: 'plc-21',
    slug: 'tapovan-gaya',
    title: 'Tapovan',
    category: 'TEERTH',
    timing: '6:00 AM - 6:00 PM',
    description: 'Tapovan, Gaya District • Religious & natural destination famous for ancient sulphur hot springs (Kunds).',
    lat: '24.9010',
    lng: '85.2310',
    isFeatured: true,
  },
  {
    id: 'plc-22',
    slug: 'koteshwar-nath',
    title: 'Koteshwar Nath Temple',
    category: 'TEERTH',
    timing: '5:00 AM - 8:30 PM',
    description: 'Morhar River, Gaya District • Hindu religious destination housing millions of swayambhu Shiva lingams.',
    lat: '24.9520',
    lng: '84.9810',
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
      if (stored === null) {
        localStorage.setItem(KEYS.POPUP_ADS, JSON.stringify(INITIAL_POPUP_ADS));
        return INITIAL_POPUP_ADS;
      }
      const parsed: PopupAd[] = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return INITIAL_POPUP_ADS;
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

  static async fetchItemsFromApi(): Promise<LostFoundItem[]> {
    try {
      const res = await fetch('/api/lost-found', { cache: 'no-store' });
      if (res.ok) {
        const items: LostFoundItem[] = await res.json();
        if (Array.isArray(items)) {
          ContentStore.saveLostFoundItems(items);
          return items;
        }
      }
    } catch (e) {
      console.error('Failed to fetch Lost & Found items from API:', e);
    }
    return ContentStore.getLostFoundItems();
  }

  static async addItem(item: Omit<LostFoundItem, 'id' | 'createdAt'>): Promise<LostFoundItem> {
    const local = ContentStore.addLostFoundItem(item);
    try {
      const res = await fetch('/api/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const serverItem = await res.json();
        const items = ContentStore.getLostFoundItems();
        const idx = items.findIndex(i => i.id === local.id);
        if (idx !== -1) items[idx] = serverItem;
        ContentStore.saveLostFoundItems(items);
        return serverItem;
      }
    } catch (e) {
      console.error('Failed to save Lost & Found item to API:', e);
    }
    return local;
  }

  static async updateItem(id: string, updated: Partial<LostFoundItem>): Promise<void> {
    ContentStore.updateLostFoundItem(id, updated);
    try {
      await fetch('/api/lost-found', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updated }),
      });
    } catch (e) {
      console.error('Failed to update Lost & Found item on API:', e);
    }
  }

  static async deleteItem(id: string): Promise<void> {
    ContentStore.deleteLostFoundItem(id);
    try {
      await fetch(`/api/lost-found?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Failed to delete Lost & Found item on API:', e);
    }
  }
}

export class SliderBannerStore {
  static getBanners(): SliderBanner[] {
    return ContentStore.getSliderBanners();
  }

  static getActiveBanners(): SliderBanner[] {
    return ContentStore.getActiveSliderBanners();
  }

  static async fetchBannersFromApi(): Promise<SliderBanner[]> {
    try {
      const res = await fetch('/api/slider-banners', { cache: 'no-store' });
      if (res.ok) {
        const banners: SliderBanner[] = await res.json();
        if (Array.isArray(banners) && banners.length > 0) {
          ContentStore.saveSliderBanners(banners);
          return banners;
        }
      }
    } catch (e) {
      console.error('Failed to fetch slider banners from API:', e);
    }
    return ContentStore.getSliderBanners();
  }

  static async addBanner(banner: Omit<SliderBanner, 'id'>): Promise<SliderBanner> {
    const local = ContentStore.addSliderBanner(banner);
    try {
      const res = await fetch('/api/slider-banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      });
      if (res.ok) {
        const serverBanner = await res.json();
        const banners = ContentStore.getSliderBanners();
        const idx = banners.findIndex(b => b.id === local.id);
        if (idx !== -1) banners[idx] = serverBanner;
        ContentStore.saveSliderBanners(banners);
        return serverBanner;
      }
    } catch (e) {
      console.error('Failed to save slider banner to API:', e);
    }
    return local;
  }

  static async updateBanner(id: string, updated: Partial<SliderBanner>): Promise<void> {
    ContentStore.updateSliderBanner(id, updated);
    try {
      await fetch('/api/slider-banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updated }),
      });
    } catch (e) {
      console.error('Failed to update slider banner on API:', e);
    }
  }

  static async deleteBanner(id: string): Promise<void> {
    ContentStore.deleteSliderBanner(id);
    try {
      await fetch(`/api/slider-banners?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Failed to delete slider banner on API:', e);
    }
  }
}

export class PopupAdStore {
  static getAds(): PopupAd[] {
    return ContentStore.getPopupAds();
  }

  static getActiveAd(): PopupAd | null {
    return ContentStore.getActivePopupAd();
  }

  static async fetchAdsFromApi(): Promise<PopupAd[]> {
    try {
      const res = await fetch('/api/popup-ads', { cache: 'no-store' });
      if (res.ok) {
        const ads: PopupAd[] = await res.json();
        if (Array.isArray(ads)) {
          ContentStore.savePopupAds(ads);
          return ads;
        }
      }
    } catch (e) {
      console.error('Failed to fetch popup ads from API:', e);
    }
    return ContentStore.getPopupAds();
  }

  static async addAd(ad: Omit<PopupAd, 'id'>): Promise<PopupAd> {
    const local = ContentStore.addPopupAd(ad);
    try {
      const res = await fetch('/api/popup-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ad),
      });
      if (res.ok) {
        const serverAd = await res.json();
        const ads = ContentStore.getPopupAds();
        const idx = ads.findIndex(a => a.id === local.id);
        if (idx !== -1) ads[idx] = serverAd;
        ContentStore.savePopupAds(ads);
        return serverAd;
      }
    } catch (e) {
      console.error('Failed to save popup ad to API:', e);
    }
    return local;
  }

  static async updateAd(id: string, updated: Partial<PopupAd>): Promise<void> {
    ContentStore.updatePopupAd(id, updated);
    try {
      await fetch('/api/popup-ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updated }),
      });
    } catch (e) {
      console.error('Failed to update popup ad on API:', e);
    }
  }

  static async deleteAd(id: string): Promise<void> {
    ContentStore.deletePopupAd(id);
    try {
      await fetch(`/api/popup-ads?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Failed to delete popup ad on API:', e);
    }
  }
}
