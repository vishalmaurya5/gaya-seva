import { SITE_SEO_CONFIG } from './config';

// 1. Organization Schema
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_SEO_CONFIG.baseUrl}/#organization`,
    name: SITE_SEO_CONFIG.legalName,
    alternateName: 'GayaSeva Teerth Portal',
    url: SITE_SEO_CONFIG.baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_SEO_CONFIG.baseUrl}/gayaseva.png`,
      width: 512,
      height: 512,
    },
    telephone: SITE_SEO_CONFIG.contact.phone,
    email: SITE_SEO_CONFIG.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_SEO_CONFIG.contact.address.streetAddress,
      addressLocality: SITE_SEO_CONFIG.contact.address.addressLocality,
      addressRegion: SITE_SEO_CONFIG.contact.address.addressRegion,
      postalCode: SITE_SEO_CONFIG.contact.address.postalCode,
      addressCountry: SITE_SEO_CONFIG.contact.address.addressCountry,
    },
    sameAs: [
      SITE_SEO_CONFIG.socialLinks.facebook,
      SITE_SEO_CONFIG.socialLinks.twitter,
      SITE_SEO_CONFIG.socialLinks.instagram,
      SITE_SEO_CONFIG.socialLinks.youtube,
    ],
  };
}

// 2. WebSite Schema with SearchAction
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_SEO_CONFIG.baseUrl}/#website`,
    url: SITE_SEO_CONFIG.baseUrl,
    name: SITE_SEO_CONFIG.siteName,
    description: SITE_SEO_CONFIG.defaultDescription,
    publisher: {
      '@id': `${SITE_SEO_CONFIG.baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_SEO_CONFIG.baseUrl}/services?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['hi', 'en'],
  };
}

// 3. LocalBusiness / TravelAgency Schema
export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_SEO_CONFIG.baseUrl}/#localbusiness`,
    name: 'GayaSeva Gaya Ji Pilgrim & Local Services',
    image: `${SITE_SEO_CONFIG.baseUrl}/gayaseva.png`,
    telephone: SITE_SEO_CONFIG.contact.phone,
    email: SITE_SEO_CONFIG.contact.email,
    url: SITE_SEO_CONFIG.baseUrl,
    priceRange: '₹100 - ₹5000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_SEO_CONFIG.contact.address.streetAddress,
      addressLocality: 'Gaya Ji',
      addressRegion: 'Bihar',
      postalCode: '823001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_SEO_CONFIG.contact.geo.latitude,
      longitude: SITE_SEO_CONFIG.contact.geo.longitude,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  };
}

// 4. TouristAttraction / Place Schema
export function buildTouristAttractionSchema(place: {
  title: string;
  description: string;
  slug: string;
  lat?: string;
  lng?: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.title,
    description: place.description,
    url: `${SITE_SEO_CONFIG.baseUrl}/places/${place.slug}`,
    ...(place.imageUrl && { image: place.imageUrl }),
    location: {
      '@type': 'Place',
      name: place.title,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Gaya Ji',
        addressRegion: 'Bihar',
        addressCountry: 'IN',
      },
      ...(place.lat && place.lng && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: place.lat,
          longitude: place.lng,
        },
      }),
    },
    isAccessibleForFree: true,
  };
}

// 5. Service Schema
export function buildServiceSchema(service: {
  name: string;
  description: string;
  serviceType: string;
  providerName?: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    provider: {
      '@type': 'LocalBusiness',
      name: service.providerName || SITE_SEO_CONFIG.legalName,
      telephone: SITE_SEO_CONFIG.contact.phone,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: service.areaServed || 'Gaya Ji, Bihar',
    },
  };
}

// 6. BreadcrumbList Schema
export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_SEO_CONFIG.baseUrl}${item.url}`,
    })),
  };
}

// 7. FAQPage Schema
export function buildFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// 8. Pitru Paksha Event Schema
export function buildPitruPakshaEventSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Gaya Ji Pitru Paksha Mahasangam 2026',
    description: 'Annual sacred ancestor Pinda Daan Mahasangam at Vishnupad Temple & Falgu Devghat, Gaya Ji.',
    startDate: '2026-09-25',
    endDate: '2026-10-10',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Vishnupad Temple & Falgu River Devghat',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Gaya Ji',
        addressRegion: 'Bihar',
        addressCountry: 'IN',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'GayaSeva Teerth Portal',
      url: SITE_SEO_CONFIG.baseUrl,
    },
  };
}
