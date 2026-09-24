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
    keywords: ['language', 'english', 'hindi', 'bengali', 'telugu', 'tamil', 'भाषा', 'भाषा चुनें', 'bhasha'],
    title: '🌐 Select Your Language / अपनी भाषा चुनें',
    answer: `Welcome to GayaSeva AI Assistant! Please select your language / अपनी भाषा चुनें / আপনার ভাষা বেছে নিন / మీ భాషను ఎంచుకోండి / உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:

• 🇬🇧 English: Full guidance on functions, service provider registration, access passes & services.
• 🇮🇳 हिंदी: गया सेवा की सम्पूर्ण कार्यप्रणाली, सेवा प्रदाता (पार्टनर) पंजीकरण, एक्सेस पास एवं सभी सेवाओं की जानकारी।
• 🇮🇳 বাংলা: সেবা প্রদানকারী নিবন্ধন, অ্যাক্সেস পাস এবং গয়া সেবার সমস্ত পরিষেবার বিস্তারিত তথ্য।
• 🇮🇳 తెలుగు: సేవా ప్రదాత రిజిస్ట్రేషన్, యాక్సెస్ పాస్ మరియు గయా సేవ యొక్క అన్ని సేవల వివరాలు.
• 🇮🇳 தமிழ்: சேவை வழங்குநர் பதிவு, அணுகல் பாస్ এবং கயா சேவையின் அனைத்து சேவைகள்.`,
    links: [
      { label: '🚀 Complete GayaSeva Guide & Overview', url: '/services' },
      { label: '📝 Register as Service Provider (₹49)', url: '/auth/register' },
      { label: '🎫 Pilgrim Access Pass (₹49)', url: '/pass' },
    ],
  },
  {
    keywords: ['register provider', 'become partner', 'join provider', 'pandit registration', 'driver registration', 'hotel registration', 'partner fee', 'profile pic optional', 'optional photo', 'registration fee', 'how to register', 'how to become member', 'provider member', 'member as server provider'],
    title: '📝 Step-by-Step: How to Register & Become a Member as a Service Provider',
    answer: `Joining GayaSeva as a Service Provider (सेवा प्रदाता/पार्टनर) is fast, simple, and transparent:

1. **Choose Your Service Role**:
   • Pandit Ji (तीर्थ पुरोहित / पिंडदान विशेषज्ञ)
   • Cab / Taxi / E-Rickshaw Driver (पिक एंड ड्रॉप वाहन मालिक)
   • Hotel / Dharamshala / Guest House (आवास प्रदाता)
   • Mundan Barber / Thakur / Nai (नाई / क्षौर कर्म)
   • Satvik Food Restaurant / Cook (सात्विक भोजनालय)
   • Puja Material & Tilkut Shop (पूजा सामग्री विक्रेता)

2. **Fill Basic Details & Profile Info**:
   • Provide your Business Name, Phone Number, WhatsApp Number, and Service Location.
   • **PROFILE PICTURE IS 100% OPTIONAL (ऐच्छिक)**: Photo upload is NOT mandatory during registration! You can upload it anytime later from your Dashboard.

3. **Govt Photo ID Verification**:
   • Upload one valid Govt Photo ID (Aadhaar Card, Voter ID, PAN Card, or Driving License).

4. **One-Time Registration Fee**:
   • Pay a nominal ₹49 one-time registration fee via Razorpay secure gateway.

5. **0% Commission & Lifetime Direct Bookings**:
   • Once verified, pilgrims visiting Gaya Ji directly call or WhatsApp you.
   • **0% Commission Fee**: You keep 100% of your earned money! No middlemen agencies.`,
    links: [
      { label: 'Register as Partner Now (₹49)', url: '/auth/register' },
      { label: 'Partner Login', url: '/auth/login' },
      { label: 'Provider Dashboard Guide', url: '/provider/dashboard' },
    ],
  },
  {
    keywords: ['pass', 'access pass', 'unlock', 'lock', 'price', 'plan', 'subscription', 'contact pass', '49', '99', '199', 'day pass', 'trip pass', 'family pass', 'directory pass', 'how pilgrims use', 'yatri pass'],
    title: '🎫 Pilgrim Access Passes & 0% Direct Contact Model',
    answer: `GayaSeva provides Pilgrims (Yatris) direct access to thousands of verified local service providers:

1. **0% Commission Direct Booking**:
   • Pilgrims directly contact verified Pandits, Taxi Drivers, Hotels, and Barbers via phone or WhatsApp.

2. **Access Pass Options**:
   • ₹49 Day Pass: 24 Hours Unlimited Directory Access
   • ₹99 Trip Pass: 7 Days Full Teerth Access + Saved Itineraries
   • ₹199 Family Pass: 30 Days Family Access + Priority Support

3. **Instant Phone & WhatsApp Unlock**:
   • Once activated, phone numbers and 1-tap WhatsApp buttons unlock automatically across all pages.`,
    links: [
      { label: 'Unlock Access Pass', url: '/pass' },
      { label: 'View Trip Planner', url: '/my-trip' },
    ],
  },
  {
    keywords: ['all services', 'all functions', 'website flow', 'website services', 'what is available', 'available services', 'available on website', 'function and serrvics', 'all available'],
    title: '🧰 Complete Catalog of Services & Functions Available on GayaSeva',
    answer: `Here is everything available on GayaSeva for Pilgrims and Service Providers:

1. **Pind Daan & Tirth Purohit (पंडित जी)**: Verified Gaya Ji Pandits for Falgu Devghat, Vishnupad, Akshayavat & Pretshila Shradh rites.
2. **Pick & Drop Cabs & E-Rickshaws (पिक एंड ड्रॉप)**: Station & Airport pickup to Vishnupad (₹250-₹350) & Bodh Gaya (₹500-₹750).
3. **Hotels & Dharamshalas (आवास)**: Budget rooms, AC rooms, and Dharamshalas near Vishnupad temple.
4. **Mundan Barbers / Kshaur Karma (नाई/ठाकुर)**: Verified local barbers for Devghat pre-pinddaan hair rituals.
5. **100% Satvik Pure Veg Food (सात्विक भोजनालय)**: Pure vegetarian no-onion-garlic Bihari & Rajasthani thali.
6. **Gaya Tilkut & Puja Samagri Kits (पूजा सामग्री)**: Pure Jaggery/Sugar Tilkut & 48-Vedi Puja kits.
7. **48-Vedi Shradh & Gaya Guide (गया गाइड)**: Complete guide with timings, maps, and historical significance.
8. **1-Day to 3-Day Custom Trip Planner (यात्रा प्लान)**: Custom itinerary with PDF download/print feature.
9. **🔎 Lost & Found Portal (खोया-पाया)**: Report lost luggage, items, or missing persons.
10. **24/7 Emergency & Hospitals (आपातकालीन सेवा)**: Ambulance 108, Police 112, Railway 139 & ANMMCH Hospital.`,
    links: [
      { label: 'Explore All Services', url: '/services' },
      { label: 'Find Verified Pandits', url: '/pandit' },
      { label: 'Book Pick & Drop Cab', url: '/pick-drop' },
      { label: 'Hotels & Dharamshalas', url: '/stay' },
      { label: 'Lost & Found Portal', url: '/help/lost-and-found' },
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
          text: topic.title ? `${topic.title}\n\n${topic.answer}` : topic.answer,
          links: topic.links,
          gpsQuery: topic.gpsQuery,
          phone: topic.phone,
          whatsapp: topic.whatsapp,
        };
      }
    }

    // 4. Fallback Comprehensive Dynamic Knowledge Synthesis
    return {
      text: `🙏 **Welcome to GayaSeva AI Assistant**\n\nHere is a complete summary of GayaSeva functions & services:\n\n1. **🌐 Choose Language**: English (default), Hindi, Bengali, Telugu, Tamil.\n2. **📝 Service Provider Registration**: Fast registration for Pandits, Drivers, Hotels, Barbers, Restaurants & Shops with ₹49 fee and 100% OPTIONAL photo upload.\n3. **🎫 Pilgrim Access Pass**: Unlock verified contact directory for 0% commission direct calls & WhatsApp.\n4. **🚕 Pick & Drop Cabs**: Station to Vishnupad & Bodh Gaya rides.\n5. **🧰 All Available Services**: Pandits, Stays, Mundan Barbers, Satvik Food, Tilkut, 48 Vedis & Lost-Found Portal.\n\nPlease click any prompt button below for detailed step-by-step guidance!`,
      links: [
        { label: '📝 How to Register as Provider', url: '/auth/register' },
        { label: '🧰 All Available Services', url: '/services' },
        { label: '🎫 Pilgrim Access Pass', url: '/pass' },
        { label: '🗺️ Gaya 1-3 Day Trip Plan', url: '/my-trip' },
      ],
      phone: '+919876543200',
      whatsapp: '919876543200',
    };
  }
}
