import { ContentStore, SacredPlace, ServiceConfigItem, SliderBanner } from './contentStore';

export interface AIResponseCard {
  text: string;
  category?: string;
  links?: { label: string; url: string; icon?: string }[];
  phone?: string;
  whatsapp?: string;
  gpsQuery?: string;
}

// Extensive Gaya Ji, Bodh Gaya & Nearby Teerth Knowledge Base
const KNOWLEDGE_TOPICS = [
  {
    keywords: ['pass', 'access pass', 'unlock', 'lock', 'price', 'plan', 'subscription', 'contact pass', '49', '99', '199', 'day pass', 'trip pass', 'family pass', 'directory pass'],
    title: 'GayaSeva Teerth Access Pass & Directory Unlocking',
    answer: 'To directly view verified provider phone numbers, WhatsApp contact links, and unlock custom trip itineraries on GayaSeva, Yatris can choose an Access Pass:\n\n• ₹49 Day Pass: 24 Hours Unlimited Access\n• ₹99 Trip Pass: 7 Days Full Teerth Access\n• ₹199 Family Pass: 30 Days Family Access\n\nOnce activated, contacts and trip plans unlock automatically across all pages!',
    links: [
      { label: 'Unlock Access Pass', url: '/pass' },
      { label: 'View Trip Planner', url: '/my-trip' },
    ],
  },
  {
    keywords: ['direct', 'commission', 'contact', 'book', 'number', 'phone', 'whatsapp', 'zero commission', '0%'],
    title: '0% Commission Direct Booking Model',
    answer: 'GayaSeva operates on a strict 0% Commission Direct Booking model. Yatris directly call or WhatsApp local verified service providers (Pandits, Taxi Cabs, E-Rickshaws, Hotels, Dharamshalas, Tour Guides, Satvik Restaurants, Barbers, Puja Shops, Photographers) without any agency middleman or commission fees.',
    links: [
      { label: 'Find Verified Pandits', url: '/pandit' },
      { label: 'Book Taxi Cab', url: '/pick-drop' },
      { label: 'Stays & Dharamshalas', url: '/stay' },
    ],
  },
  {
    keywords: ['register provider', 'become partner', 'join provider', 'pandit registration', 'driver registration', 'hotel registration', 'partner fee', 'profile pic optional', 'optional photo', 'registration fee', 'get started'],
    title: 'Service Provider Partner Registration (₹49 Fee)',
    answer: 'Local service providers in Gaya Ji (Pandits, Cab Drivers, E-Rickshaw drivers, Hotels/Dharamshalas, Tour Guides, Satvik Restaurants, Barbers for Mundan, Puja Shops, Photographers, etc.) can register as a Service Partner:\n\n• Registration Fee: ₹49 One-Time Fee (via Razorpay)\n• Profile Picture: 100% OPTIONAL (ऐच्छिक) - photo upload is not mandatory!\n• Verification Requirement: Govt Photo ID Upload (Aadhaar/Voter ID/PAN/License) & Shop/Office Location or GPS Auto-Detect\n• Benefits: 0% Commission, 100% Direct Bookings from thousands of visiting pilgrims!',
    links: [
      { label: 'Register as Partner', url: '/auth/register' },
      { label: 'Partner Login', url: '/auth/login' },
    ],
  },
  {
    keywords: ['itinerary', 'trip', 'plan', 'my trip', '1 day', '2 day', '3 day', 'schedule', 'print', 'pdf', 'locked trip'],
    title: 'Custom Gaya Ji Trip Planner & Printing',
    answer: 'GayaSeva offers customized 1-Day, 2-Day, and 3-Day Teerth Itineraries:\n\n• 1-Day Plan: Morning Falgu River Pinda Daan, Vishnupad Temple Darshan, Akshayavat Banyan Tree, Satvik Lunch, Bodh Gaya Mahabodhi & Great Buddha Statue\n• 2-Day & 3-Day Plans: Includes Mangla Gauri Shaktipeeth, Pretshila Hill, Ramna Road Tilkut Market, and Thai/Tibetan Monasteries.\n• Feature: Full Print / Save as PDF capability for offline yatra navigation. Locked for non-pass users and auto-unlocks with an active pass.',
    links: [
      { label: 'Open Trip Planner Tool', url: '/my-trip' },
    ],
  },
  {
    keywords: ['vishnupad', 'footprint', 'charan', 'basalt', 'vayu purana', 'timing', 'temple'],
    title: 'Vishnupad Temple & Lord Vishnu Footprint',
    answer: 'Vishnupad Temple in Gaya Ji houses the 40-cm divine footprint of Lord Vishnu stamped on solid basalt rock. According to Vayu Purana, Lord Vishnu placed his foot on Gayasur’s chest to grant eternal salvation.\n\n• Timings: 5:00 AM to 9:00 PM daily\n• Main Rites: Pinda Daan, Tripindi Shradh, Narayan Bali\n• Location: Chandurchoti, Vishnupad Devghat Area, Gaya Ji',
    links: [
      { label: 'View Vishnupad Guide', url: '/gaya-guide/vishnupad' },
      { label: 'Book Vishnupad Taxi', url: '/pick-drop' },
    ],
    gpsQuery: '24.7865,85.0080',
    phone: '+919876543200',
    whatsapp: '919876543200',
  },
  {
    keywords: ['falgu', 'river', 'sita', 'curse', 'antarsalila', 'aarti', 'sand', 'devghat'],
    title: 'Holy Falgu River & Goddess Sita’s Curse',
    answer: 'Falgu River is the sacred river where Goddess Sita offered sand Pindas to King Dasharatha. Cursed by Goddess Sita, the river flows beneath the sandy bed (Antarsalila).\n\n• Rites: Digging dry sand to draw holy water for Pinda Daan.\n• Evening Falgu Aarti: 6:30 PM daily at Devghat.\n• Open 24 Hours.',
    links: [
      { label: 'View Falgu River Guide', url: '/gaya-guide/falgu-river' },
      { label: 'Book Devghat Pandit', url: '/pandit' },
    ],
    gpsQuery: '24.7880,85.0120',
  },
  {
    keywords: ['bodh gaya', 'buddha', 'mahabodhi', 'enlightenment', 'tree', 'great buddha'],
    title: 'Bodh Gaya Mahabodhi Temple & Bodhi Tree',
    answer: 'Bodh Gaya is a UNESCO World Heritage site located 12 km from Gaya Ji city. It is the holy sanctuary where Prince Siddhartha attained supreme Buddha Enlightenment under the Mahabodhi Tree.\n\n• Timings: 5:00 AM to 9:00 PM\n• Key Spots: Mahabodhi Tree, 80-ft Great Buddha Statue, Thai Monastery, Tibetan Market\n• Cab Fare from Station: ₹500 - ₹750',
    links: [
      { label: 'View Bodh Gaya Guide', url: '/gaya-guide/bodh-gaya' },
      { label: 'Book Bodh Gaya Cab', url: '/pick-drop' },
    ],
    gpsQuery: '24.6960,84.9915',
    phone: '+919876543201',
    whatsapp: '919876543201',
  },
  {
    keywords: ['pinda daan', 'pind', 'shradh', 'ancestor', 'pitru', 'moksha', '48 vedi'],
    title: 'Pinda Daan Ritual Process & Verified Pandits',
    answer: 'Pinda Daan in Gaya Ji releases 21 generations of departed ancestors into Pitru Loka. It involves rice flour & sesame oblation balls, kusha grass, holy Falgu water, and final sealing under Akshayavat banyan tree.\n\n• Best Fortnight: Pitru Paksha (Lunar 16 days)\n• Main Vedis: Vishnupad, Falgu Devghat, Akshayavat, Pretshila, Sita Kund\n• Verified Pandits available directly on GayaSeva (0% Commission).',
    links: [
      { label: 'Find Verified Pandits', url: '/pandit' },
      { label: 'Order Samagri Kit', url: '/puja-material' },
    ],
    phone: '+919876543210',
    whatsapp: '919876543210',
  },
  {
    keywords: ['barber', 'mundan', 'kshaur', 'hair cut', 'sanskar', 'thakur', 'nai'],
    title: 'Barber (नाई/ठाकुर) & Kshaur Karma Mundan Rites',
    answer: 'Kshaur Karma & Mundan Sanskar is a holy pre-requisite before Pinda Daan rites in Gaya Ji.\n\n• Verified Local Barbers (नाई / ठाकुर) available directly on GayaSeva for Falgu Devghat & Vishnupad Mundan rituals.',
    links: [
      { label: 'Find Verified Barbers', url: '/services' },
    ],
  },
  {
    keywords: ['tilkut', 'sweets', 'ramna', 'shopping', 'anarsa', 'market', 'satvik', 'food'],
    title: 'Famous Gaya Tilkut, Satvik Food & Malls',
    answer: 'Gaya Ji is world-famous for organic sesame Tilkut made with Jaggery or Sugar at Ramna Road Tilkut Bazaar.\n\n• Pure Satvik Restaurants: No Onion-Garlic Pure Veg Thali near Vishnupad & Station\n• Ramna Road Tilkut Market: Original fresh Tilkut & Anarsa\n• MGB Food Mall (GB Road): Shopping, food court & cinema\n• Tibetan Refugee Market (Bodh Gaya): Handicrafts & winter woolens',
    links: [
      { label: 'Order Tilkut & Samagri', url: '/puja-material' },
    ],
    gpsQuery: '24.7980,85.0050',
  },
  {
    keywords: ['emergency', 'police', 'hospital', 'doctor', 'help', 'lost', 'ambulance', 'found'],
    title: '24/7 Gaya Emergency & Medical Helplines',
    answer: 'GayaSeva Emergency Support for Yatris:\n\n• Medical Emergency: 108\n• Police Control: 112\n• Railway Inquiry (GAYA Junction): 139\n• ANMMCH Government Medical Hospital: Station Road, Gaya\n• 24/7 Yatri Support: +91 98765 43200\n• Lost & Found Portal: Report lost or found luggage/items on GayaSeva.',
    links: [
      { label: 'Open Emergency Center', url: '/help' },
      { label: 'Lost & Found Portal', url: '/help/lost-and-found' },
    ],
    phone: '+919876543200',
    whatsapp: '919876543200',
  },
];

export class AIKnowledgeEngine {
  static queryAssistant(userQuery: string): AIResponseCard {
    const q = userQuery.toLowerCase().trim();

    // 1. Search Dynamic ContentStore Places
    const dynamicPlaces = ContentStore.getPlaces();
    const matchedPlace = dynamicPlaces.find(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );

    if (matchedPlace) {
      return {
        text: `📍 **${matchedPlace.title}** (${matchedPlace.category})\n\n${matchedPlace.description}\n\n• **Timings/Hours**: ${matchedPlace.timing}\n• **Category**: ${matchedPlace.category}`,
        links: [
          { label: `View ${matchedPlace.title} Details`, url: `/gaya-guide/${matchedPlace.slug}` },
          { label: 'Book Pick & Drop Cab', url: '/pick-drop' },
        ],
        gpsQuery: `${matchedPlace.lat},${matchedPlace.lng}`,
        phone: '+919876543201',
        whatsapp: '919876543201',
      };
    }

    // 2. Search Dynamic ContentStore Services
    const dynamicServices = ContentStore.getServices();
    const matchedService = dynamicServices.find(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.details.toLowerCase().includes(q)
    );

    if (matchedService) {
      return {
        text: `🚕 **${matchedService.title}**\n\n${matchedService.details}\n\n• **Estimate / Fare**: ${matchedService.priceText}\n• **Category**: ${matchedService.subtitle}`,
        links: [
          { label: 'Book Service Now', url: '/pick-drop' },
        ],
        phone: matchedService.phone || '+919876543201',
        whatsapp: matchedService.whatsapp || '919876543201',
      };
    }

    // 3. Search Static Knowledge Base Topics
    for (const topic of KNOWLEDGE_TOPICS) {
      if (topic.keywords.some((kw) => q.includes(kw))) {
        return {
          text: `🙏 **${topic.title}**\n\n${topic.answer}`,
          links: topic.links,
          gpsQuery: topic.gpsQuery,
          phone: topic.phone,
          whatsapp: topic.whatsapp,
        };
      }
    }

    // 4. Fallback Comprehensive Dynamic Knowledge Synthesis
    return {
      text: `GayaJi Assistant Knowledge Base Synthesis:\n\nMain services, access options and sacred places active on GayaSeva:\n\n1. **0% Commission Direct Contact**: Directly call or WhatsApp verified Pandits, Drivers, Hotels, Guides, Barbers, Satvik Restaurants & Shops.\n2. **Teerth Access Passes**: ₹49 Day Pass, ₹99 Trip Pass, ₹199 Family Pass to unlock provider directory contacts & custom trip plans.\n3. **Partner Registration**: ₹49 One-time fee, Profile photo is OPTIONAL (ऐच्छic), Govt ID upload required.\n4. **Pick & Drop Taxis**: Gaya Junction to Vishnupad (₹250-₹350), Bodh Gaya (₹500-₹750).\n5. **Sacred Places**: Vishnupad Temple (5 AM - 9 PM), Falgu River Aarti (6:30 PM), Bodh Gaya Mahabodhi (5 AM - 9 PM).\n\nAapko inme se kiske baare me vistar se jankari chahiye?`,
      links: [
        { label: 'Explore Pick & Drop', url: '/pick-drop' },
        { label: 'Find Verified Pandits', url: '/pandit' },
        { label: 'View Gaya Guide', url: '/gaya-guide' },
        { label: 'Unlock Access Pass', url: '/pass' },
        { label: 'Emergency Support', url: '/help' },
      ],
      phone: '+919876543200',
      whatsapp: '919876543200',
    };
  }
}
