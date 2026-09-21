export const SITE_SEO_CONFIG = {
  siteName: 'GayaSeva',
  legalName: 'GayaSeva Teerth & Local Services Portal',
  domain: 'gayaseva.com',
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.gayaseva.com',
  defaultLocale: 'hi_IN',
  supportedLocales: ['hi_IN', 'en_IN'],
  
  defaultTitle: 'GayaSeva — Gaya Ji Local Services, Pind Daan & Teerth Portal',
  titleTemplate: '%s | GayaSeva — Gaya Ji Teerth & Travel',
  
  defaultDescription: 'Official Gaya Ji pilgrim portal for Pind Daan Pandit booking, Gaya Railway Station taxi, AC Dharamshala stays, Vishnupad Temple guide & 24/7 Yatri helpline.',
  
  keywords: [
    'Gaya',
    'Gaya Bihar',
    'Gaya Ji',
    'Gaya Pind Daan',
    'Pind Daan in Gaya',
    'Gaya Pind Daan booking',
    'Gaya Pandit',
    'Pind Daan Pandit Gaya',
    'Vishnupad Temple Gaya',
    'Falgu River Gaya',
    'Gaya taxi service',
    'Gaya railway station taxi',
    'Gaya airport taxi',
    'Gaya to Bodh Gaya taxi',
    'Gaya hotel',
    'Gaya Dharamshala',
    'Pitru Paksha Gaya 2026',
    'Gaya travel guide',
  ],

  contact: {
    phone: '+91 8544491413',
    whatsapp: '918544491413',
    email: 'support@gayaseva.org',
    address: {
      streetAddress: 'Devghat Road, Near Vishnupad Temple',
      addressLocality: 'Gaya Ji',
      addressRegion: 'Bihar',
      postalCode: '823001',
      addressCountry: 'IN',
    },
    geo: {
      latitude: '24.7865',
      longitude: '85.0080',
    },
  },

  socialLinks: {
    facebook: 'https://facebook.com/gayasevaofficial',
    twitter: 'https://twitter.com/gayaseva',
    instagram: 'https://instagram.com/gayaseva',
    youtube: 'https://youtube.com/@gayaseva',
  },

  defaultOgImage: 'https://gayaseva.org/gayaseva.png',
};
