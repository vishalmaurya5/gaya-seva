'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Compass, Calendar, MapPin, Clock, Navigation, CheckCircle2, 
  Car, Flame, Hotel, UtensilsCrossed, Share2, Printer, Bookmark, 
  Sparkles, ArrowRight, ExternalLink, ShieldCheck, Check, Filter, Lock
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DirectoryGatedView } from '@/components/ui/DirectoryGatedView';

type TripPurpose = 'PIND_DAAN' | 'TEMPLE' | 'BUDDHIST' | 'FAMILY' | 'SPIRITUAL' | 'SIGHTSEEING';

interface PurposeOption {
  id: TripPurpose;
  labelEn: string;
  labelHi: string;
  emoji: string;
  descEn: string;
  descHi: string;
}

const PURPOSE_OPTIONS: PurposeOption[] = [
  { id: 'PIND_DAAN', labelEn: 'Pind Daan & Shradh', labelHi: 'पिंडदान एवं श्राद्ध कर्म', emoji: '🕉️', descEn: 'Falgu Ghat, Vishnupad & 48-Vedi ancestral rites', descHi: 'फल्गु तट, विष्णुपद एवं 48 वेदी पितृ तर्पण' },
  { id: 'TEMPLE', labelEn: 'Temple Visit & Darshan', labelHi: 'मंदिर दर्शन एवं पूजा', emoji: '🛕', descEn: 'Vishnupad, Mangla Gauri Shaktipeeth & Ramshila', descHi: 'विष्णुपद, मंगला गौरी शक्तिपीठ एवं रामशिला दर्शन' },
  { id: 'BUDDHIST', labelEn: 'Buddhist Pilgrimage', labelHi: 'बोधगया बौद्ध तीर्थ', emoji: '☸️', descEn: 'Mahabodhi Temple, Bodhi Tree & Monasteries', descHi: 'महाबोधि मंदिर, बोधि वृक्ष एवं अंतरराष्ट्रीय मठ' },
  { id: 'FAMILY', labelEn: 'Family Trip', labelHi: 'पारिवारिक यात्रा', emoji: '👨‍👩‍👧‍👦', descEn: 'Comfortable family itinerary, hotels & food', descHi: 'पारिवारिक सुविधा, होटल, भोजन एवं सुगम दर्शन' },
  { id: 'SPIRITUAL', labelEn: 'Spiritual & Meditation', labelHi: 'आध्यात्मिक एवं ध्यान', emoji: '🧘', descEn: 'Falgu River evening Aarti & Bodhi tree meditation', descHi: 'फल्गु आरती, शांति एवं ध्यान साधना' },
  { id: 'SIGHTSEEING', labelEn: 'Tourist / Sightseeing', labelHi: 'पर्यटन एवं दर्शनीय स्थल', emoji: '📸', descEn: 'Barabar Caves, 80-ft Buddha & local shopping', descHi: 'बराबर गुफाएं, 80 फीट बुद्ध प्रतिमा एवं खरीदारी' },
];

interface ActivityItem {
  timeBlock: 'MORNING' | 'AFTERNOON' | 'EVENING';
  titleEn: string;
  titleHi: string;
  categoryTag: string;
  descriptionEn: string;
  descriptionHi: string;
  distanceKm: string;
  travelTimeMin: string;
  googleMapsQuery: string;
  actionType?: 'PANDIT' | 'TAXI' | 'HOTEL' | 'FOOD' | 'PLACE';
  actionUrl?: string;
  actionLabelEn?: string;
  actionLabelHi?: string;
}

interface DayItinerary {
  dayNumber: number;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  activities: ActivityItem[];
}

export default function MyTripPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Form State
  const [days, setDays] = useState<number>(2);
  const [isCustomDays, setIsCustomDays] = useState<boolean>(false);
  const [customDaysCount, setCustomDaysCount] = useState<number>(4);
  const [selectedPurposes, setSelectedPurposes] = useState<TripPurpose[]>(['PIND_DAAN', 'TEMPLE', 'BUDDHIST']);
  const [needPandit, setNeedPandit] = useState<boolean>(true);
  const [needTaxi, setNeedTaxi] = useState<boolean>(true);

  // Active view tab in results
  const [activeDayTab, setActiveDayTab] = useState<number>(0); // 0 = All Days
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const activeDaysCount = isCustomDays ? customDaysCount : days;

  const togglePurpose = (id: TripPurpose) => {
    if (selectedPurposes.includes(id)) {
      if (selectedPurposes.length > 1) {
        setSelectedPurposes(selectedPurposes.filter(p => p !== id));
      }
    } else {
      setSelectedPurposes([...selectedPurposes, id]);
    }
  };

  // Generate dynamic itinerary data based on days & chosen purposes
  const itineraryData = useMemo<DayItinerary[]>(() => {
    const list: DayItinerary[] = [];

    const hasPindDaan = selectedPurposes.includes('PIND_DAAN');
    const hasBuddhist = selectedPurposes.includes('BUDDHIST');
    const hasTemple = selectedPurposes.includes('TEMPLE');

    // Day 1: Vishnupad & Falgu Devghat Focus
    list.push({
      dayNumber: 1,
      titleEn: 'Day 1: Vishnupad Temple & Falgu River Sacred Rites',
      titleHi: 'प्रथम दिवस: विष्णुपद मंदिर एवं पवित्र फल्गु तर्पण',
      subtitleEn: 'Arrival at Gaya Junction → Pind Daan / Darshan → Akshayavat → Mangla Gauri',
      subtitleHi: 'गया जंक्शन आगमन → पिंडदान/दर्शन → अक्षयवट → मंगला गौरी दर्शन',
      activities: [
        {
          timeBlock: 'MORNING',
          titleEn: 'Vishnupad Temple & Falgu River Devghat',
          titleHi: 'विष्णुपद मंदिर एवं फल्गु नदी देवघाट',
          categoryTag: hasPindDaan ? 'Pind Daan & Rituals' : 'Sacred Darshan',
          descriptionEn: hasPindDaan
            ? 'Arrive at Gaya Junction and reach Falgu Devghat. Meet your verified Gayawal Panda Ji for Falgu River Tarpan and sacred Pind Daan at Vishnupad Lord Vishnu Footprint.'
            : 'Morning visit to Vishnupad Temple to pay homage to the 40 cm footprint of Lord Vishnu embedded in solid basalt rock and holy Falgu river banks.',
          descriptionHi: hasPindDaan
            ? 'गया जंक्शन से फल्गु देवघाट पहुंचें। अपने सत्यापित गयावाल पंडा जी से मिलें और फल्गु नदी तर्पण व विष्णुपद पर पिंडदान करें।'
            : 'विष्णुपद मंदिर में भगवान विष्णु के 40 सेमी चरण-चिह्न के दर्शन करें एवं पवित्र फल्गु नदी के तट पर जाएं।',
          distanceKm: '3.5 km from Gaya Junction Railway Station',
          travelTimeMin: '12-15 mins via Taxi / Auto',
          googleMapsQuery: 'Vishnupad+Temple+Gaya+Bihar',
          actionType: 'PANDIT',
          actionUrl: '/pandit',
          actionLabelEn: 'Connect with Pandit Ji',
          actionLabelHi: 'पंडित जी से बात करें',
        },
        {
          timeBlock: 'MORNING',
          titleEn: 'Akshayavat (The Eternal Banyan Tree)',
          titleHi: 'अक्षयवट परिसर (अमर वटवृक्ष)',
          categoryTag: 'Sacred Ritual',
          descriptionEn: 'Conclude the core Pind Daan ritual by receiving the holy "Suphal" blessing from Panda Ji under the immortal Akshayavat tree, where Lord Rama performed Shradh.',
          descriptionHi: 'अक्षयवट के पावन वृक्ष तले तीर्थ पुरोहित से अक्षय सुफल आशीर्वाद प्राप्त करें।',
          distanceKm: '1.2 km from Vishnupad Temple',
          travelTimeMin: '5 mins via Auto / Walking',
          googleMapsQuery: 'Akshayavat+Gaya+Bihar',
          actionType: 'PLACE',
          actionUrl: '/places/akshayavat',
          actionLabelEn: 'View Place Guide',
          actionLabelHi: 'स्थान विवरण देखें',
        },
        {
          timeBlock: 'AFTERNOON',
          titleEn: 'Satvik Brahmin Bhojanalaya & Hotel Rest',
          titleHi: 'शुद्ध सात्विक भोजन एवं दोपहर विश्राम',
          categoryTag: 'Dining & Stay',
          descriptionEn: 'Enjoy authentic No-Onion No-Garlic Pure Satvik Brahmin Thalis near Vishnupad Corridor and check into your family hotel room for afternoon rest.',
          descriptionHi: 'विष्णुपद कॉरिडोर के पास बिना लहसुन-प्याज का शुद्ध सात्विक भोजन ग्रहण करें एवं होटल में विश्राम करें।',
          distanceKm: '0.5 km from Vishnupad Corridor',
          travelTimeMin: '5 mins walk',
          googleMapsQuery: 'Satvik+Food+Vishnupad+Gaya',
          actionType: 'FOOD',
          actionUrl: '/food',
          actionLabelEn: 'Find Satvik Food',
          actionLabelHi: 'सात्विक भोजन देखें',
        },
        {
          timeBlock: 'EVENING',
          titleEn: 'Mangla Gauri Shaktipeeth Temple',
          titleHi: 'माँ मंगला गौरी शक्तिपीठ मंदिर',
          categoryTag: 'Shaktipeeth Darshan',
          descriptionEn: 'Ascend Bhasmakoot hill to visit one of India&apos;s 18 Mahashaktipeeths. Experience magnificent evening Maha Aarti and sunset views over Gaya city.',
          descriptionHi: 'भस्माकूट पर्वत पर स्थित माँ मंगला गौरी के दर्शन करें एवं शाम की दिव्य आरती में सम्मिलित हों।',
          distanceKm: '2.8 km from Vishnupad Temple',
          travelTimeMin: '10 mins via Auto',
          googleMapsQuery: 'Mangla+Gauri+Temple+Gaya',
          actionType: 'PLACE',
          actionUrl: '/places/mangla-gauri',
          actionLabelEn: 'View Temple Info',
          actionLabelHi: 'मंदिर विवरण देखें',
        },
        {
          timeBlock: 'EVENING',
          titleEn: 'Ramna Road Famous Tilkut & Souvenir Market',
          titleHi: 'रामना रोड प्रसिद्ध तिलकुट एवं बाजार',
          categoryTag: 'Shopping & Local Taste',
          descriptionEn: 'Visit Ramna Road market to taste fresh traditional Jaggery Tilkut, Anarsa sweets, and buy authentic brass puja samagri for home.',
          descriptionHi: 'रामना रोड के प्रसिद्ध दुकानों से ताजा गुड़ तिलकुट, अनरसा एवं पूजा सामग्री खरीदें।',
          distanceKm: '2.0 km from Mangla Gauri',
          travelTimeMin: '8 mins via Auto',
          googleMapsQuery: 'Ramna+Road+Gaya+Tilkut+Market',
          actionType: 'PLACE',
          actionUrl: '/puja-material',
          actionLabelEn: 'View Puja Stores',
          actionLabelHi: 'दुकानें देखें',
        },
      ]
    });

    // Day 2: Bodh Gaya World Heritage Trail
    if (activeDaysCount >= 2) {
      list.push({
        dayNumber: 2,
        titleEn: 'Day 2: Bodh Gaya Mahabodhi Temple & Monasteries',
        titleHi: 'द्वितीय दिवस: बोधगया महाबोधि मंदिर एवं बौद्ध मठ',
        subtitleEn: 'Bodh Gaya Drive → Mahabodhi Temple → 80-Ft Great Buddha → International Monasteries → Sujata Stupa',
        subtitleHi: 'बोधगया यात्रा → महाबोधि मंदिर → 80 फीट बुद्ध मूर्ति → अंतरराष्ट्रीय मठ → सुजाता स्तूप',
        activities: [
          {
            timeBlock: 'MORNING',
            titleEn: 'Mahabodhi Temple & The Sacred Bodhi Tree',
            titleHi: 'महाबोधि मंदिर एवं पवित्र बोधि वृक्ष',
            categoryTag: 'UNESCO World Heritage',
            descriptionEn: 'Morning private cab drive to Bodh Gaya. Meditate under the Sacred Bodhi Tree where Prince Siddhartha attained Supreme Enlightenment as Buddha 2500 years ago.',
            descriptionHi: 'बोधगया जाकर यूनेस्को विश्व धरोहर महाबोधि मंदिर दर्शन करें एवं बोधि वृक्ष के नीचे ध्यान लगाएं।',
            distanceKm: '13.5 km from Gaya City Center',
            travelTimeMin: '25-30 mins via Taxi / Auto',
            googleMapsQuery: 'Mahabodhi+Temple+Bodh+Gaya',
            actionType: 'TAXI',
            actionUrl: '/pick-drop',
            actionLabelEn: 'Book BodhGaya Cab',
            actionLabelHi: 'टैक्सी बुक करें',
          },
          {
            timeBlock: 'MORNING',
            titleEn: '80-Feet Great Buddha Statue (Daijokyo)',
            titleHi: '80 फीट विशाल बुद्ध प्रतिमा',
            categoryTag: 'Landmark Monument',
            descriptionEn: 'Marvel at India&apos;s majestic 80-foot high red-granite Great Buddha statue set in peaceful Japanese gardens near Daijokyo Buddhist Temple.',
            descriptionHi: 'जापानी शैली के मनोरम उद्यान में स्थित भारत की 80 फीट ऊंची महान बुद्ध प्रतिमा का अवलोकन करें।',
            distanceKm: '1.5 km from Mahabodhi Temple',
            travelTimeMin: '5 mins via Auto / E-Rickshaw',
            googleMapsQuery: 'Great+Buddha+Statue+Bodh+Gaya',
            actionType: 'PLACE',
            actionUrl: '/gaya-guide',
            actionLabelEn: 'View Guide Details',
            actionLabelHi: 'गाइड विवरण देखें',
          },
          {
            timeBlock: 'AFTERNOON',
            titleEn: 'International Monasteries & Asian Dining',
            titleHi: 'अंतरराष्ट्रीय बौद्ध मठ एवं भोजनालय',
            categoryTag: 'Cultural Architecture',
            descriptionEn: 'Explore Royal Thai Monastery, Bhutanese Temple, Tibetan Monastery & Japanese Indosan Temple showcasing rich East-Asian temple architecture.',
            descriptionHi: 'थाईलैंड, भूटान, तिब्बत एवं जापान के भव्य बौद्ध मंदिर एवं सांस्कृतिक वास्तुकला का अवलोकन करें।',
            distanceKm: '1.0 km within Bodh Gaya',
            travelTimeMin: '5 mins walk / E-Rickshaw',
            googleMapsQuery: 'Thai+Monastery+Bodh+Gaya',
            actionType: 'PLACE',
            actionUrl: '/places/bodhgaya-monasteries',
            actionLabelEn: 'Explore Monasteries',
            actionLabelHi: 'मठ देखें',
          },
          {
            timeBlock: 'EVENING',
            titleEn: 'Sujata Stupa & Niranjana River Bank',
            titleHi: 'सुजाता कुटी स्तूप एवं निरंजना (फल्गु) नदी',
            categoryTag: 'Historical Landmark',
            descriptionEn: 'Cross the Niranjana river bridge to Bakror village to visit Sujata Stupa where maiden Sujata offered sweet milk rice (Kheer) to ascetic Siddhartha.',
            descriptionHi: 'निरंजना नदी पार कर बकरौर स्थित सुजाता कुटी स्तूप देखें जहाँ माता सुजाता ने भगवान बुद्ध को खीर अर्पित की थी।',
            distanceKm: '3.8 km from Bodh Gaya',
            travelTimeMin: '10 mins via Auto',
            googleMapsQuery: 'Sujata+Stupa+Bodh+Gaya',
            actionType: 'PLACE',
            actionUrl: '/gaya-guide',
            actionLabelEn: 'View Spot Info',
            actionLabelHi: 'स्थल देखें',
          },
        ]
      });
    }

    // Day 3: Pretshila, Ramshila & Surroundings
    if (activeDaysCount >= 3) {
      list.push({
        dayNumber: 3,
        titleEn: 'Day 3: Pretshila Hill, Ramshila & Sita Kund Rites',
        titleHi: 'तृतीय दिवस: प्रेतशिला पहाड़ी, रामशिला एवं सीता कुण्ड',
        subtitleEn: 'Pretshila Hill Ascent → Ramshila Temple → Sita Kund → Departure',
        subtitleHi: 'प्रेतशिला पर्वत -> रामशिला मंदिर -> सीता कुंड -> प्रस्थान',
        activities: [
          {
            timeBlock: 'MORNING',
            titleEn: 'Pretshila Hill (Pret Pinda Daan)',
            titleHi: 'प्रेतशिला पर्वत (अकाल मृत्यु पितृ तर्पण)',
            categoryTag: 'Ancestral Rites Hill',
            descriptionEn: 'Visit Pretshila Hill (670 steps or auto route) to perform special Pret-Pinda rites for souls of unfulfilled or unnatural demise, offering sattu at Brahma Kund.',
            descriptionHi: 'अकाल मृत्यु पितृ मुक्ति हेतु प्रेतशिला पहाड़ी पर स्थित ब्रह्मकुंड एवं रामकुंड में विशेष पिंडदान तर्पण संपन्न करें।',
            distanceKm: '9.0 km North of Gaya City',
            travelTimeMin: '20 mins via Taxi',
            googleMapsQuery: 'Pretshila+Hill+Gaya',
            actionType: 'PANDIT',
            actionUrl: '/pandit',
            actionLabelEn: 'Book Pretshila Pandit',
            actionLabelHi: 'पंडित जी से संपर्क करें',
          },
          {
            timeBlock: 'MORNING',
            titleEn: 'Ramshila Hill & Lord Rameshwar Shiva Temple',
            titleHi: 'रामशिला पर्वत एवं रामेश्वरम शिव मंदिर',
            categoryTag: 'Ancient Shiva Temple',
            descriptionEn: 'Visit Ramshila Hill where Lord Rama performed Pind Daan for King Dasharatha. Seek blessings at ancient Rameshwar Temple.',
            descriptionHi: 'रामशिला पर्वत पर स्थित प्राचीन रामेश्वरम शिव मंदिर के दर्शन करें एवं रामकुंड में तर्पण करें।',
            distanceKm: '4.5 km from Pretshila',
            travelTimeMin: '10 mins via Auto',
            googleMapsQuery: 'Ramshila+Hill+Gaya',
            actionType: 'PLACE',
            actionUrl: '/places/ramshila-temple',
            actionLabelEn: 'View Temple Info',
            actionLabelHi: 'मंदिर विवरण देखें',
          },
          {
            timeBlock: 'AFTERNOON',
            titleEn: 'Sita Kund & Falgu Sand Pind Daan Site',
            titleHi: 'सीता कुण्ड (बालू पिंडदान स्थल)',
            categoryTag: 'Ramayana Heritage Site',
            descriptionEn: 'Visit Sita Kund across Falgu river where Devi Sita famously offered Pinda made of Falgu sand to King Dasharatha when Lord Rama was absent.',
            descriptionHi: 'फल्गु नदी के पूर्वी तट पर स्थित सीता कुंड देखें जहाँ माता सीता ने राजा दशरथ को फल्गु बालू से पिंड दान किया था।',
            distanceKm: '3.0 km from Ramshila',
            travelTimeMin: '8 mins via Auto',
            googleMapsQuery: 'Sita+Kund+Gaya+Falgu',
            actionType: 'PLACE',
            actionUrl: '/places/sita-kund',
            actionLabelEn: 'View Sita Kund Guide',
            actionLabelHi: 'सीता कुण्ड गाइड देखें',
          },
          {
            timeBlock: 'EVENING',
            titleEn: 'Gaya Junction Return & Pilgrim Departure',
            titleHi: 'गया जंक्शन आगमन एवं प्रस्थान',
            categoryTag: 'Departure',
            descriptionEn: 'Collect packed luggage from hotel, buy fresh Gaya Tilkut & Anarsa boxes for family back home, and board evening train at Gaya Junction.',
            descriptionHi: 'होटल से सामान लें, परिजनों हेतु शुद्ध तिलकुट का डिब्बा खरीदें एवं गया जंक्शन से प्रस्थान करें।',
            distanceKm: '3.5 km to Station',
            travelTimeMin: '15 mins via Cab / Auto',
            googleMapsQuery: 'Gaya+Junction+Railway+Station',
            actionType: 'TAXI',
            actionUrl: '/pick-drop',
            actionLabelEn: 'Book Station Cab',
            actionLabelHi: 'स्टेशन कैब बुक करें',
          },
        ]
      });
    }

    // Additional Days (Custom 4+ Days)
    if (activeDaysCount >= 4) {
      for (let i = 4; i <= activeDaysCount; i++) {
        list.push({
          dayNumber: i,
          titleEn: `Day ${i}: Excursion to Barabar Rock-Cut Caves & Dungeshwari`,
          titleHi: `चतुर्थ दिवस ${i}: बराबर की ऐतिहासिक गुफाएं एवं डुंगेश्वरी पहाड़ी`,
          subtitleEn: 'Barabar Caves (Maurya Dynasty) → Dungeshwari Mahakala Cave → Local Heritage Walk',
          subtitleHi: 'बराबर मौर्यकालीन गुफाएं -> डुंगेश्वरी महाकाल गुफा -> स्थानीय धरोहर भ्रमण',
          activities: [
            {
              timeBlock: 'MORNING',
              titleEn: 'Barabar Caves (Oldest Rock-Cut Caves in India)',
              titleHi: 'बराबर की गुफाएं (भारत की सबसे पुरानी चट्टान काटकर बनी गुफाएं)',
              categoryTag: 'Maurya Empire History',
              descriptionEn: 'Day excursion to 3rd Century BCE Maurya Dynasty rock-cut caves (Lomas Rishi & Sudama Caves) carved out of solid granite rocks with mirror-like polish.',
              descriptionHi: 'सम्राट अशोक कालीन मौर्यकालीन बराबर गुफाएं (लोमस ऋषि एवं सुदामा गुफा) का भ्रमण करें।',
              distanceKm: '31.0 km North of Gaya',
              travelTimeMin: '50-60 mins via Taxi',
              googleMapsQuery: 'Barabar+Caves+Jehanabad+Gaya',
              actionType: 'TAXI',
              actionUrl: '/pick-drop',
              actionLabelEn: 'Book Excursion Taxi',
              actionLabelHi: 'टैक्सी बुक करें',
            },
            {
              timeBlock: 'AFTERNOON',
              titleEn: 'Dungeshwari Hill (Mahakala Cave)',
              titleHi: 'डुंगेश्वरी पहाड़ी (महाकाल गुफा)',
              categoryTag: 'Meditative Shrine',
              descriptionEn: 'Visit Dungeshwari cave temples where Prince Siddhartha practiced severe penance for 6 years before moving to Bodh Gaya.',
              descriptionHi: 'डुंगेश्वरी पर्वत स्थित महाकाल गुफा देखें जहाँ भगवान बुद्ध ने 6 वर्षों तक कठोर तपस्या की थी।',
              distanceKm: '18.0 km from Barabar',
              travelTimeMin: '35 mins',
              googleMapsQuery: 'Dungeshwari+Cave+Temple+Gaya',
              actionType: 'PLACE',
              actionUrl: '/gaya-guide',
              actionLabelEn: 'View Details',
              actionLabelHi: 'विवरण देखें',
            },
            {
              timeBlock: 'EVENING',
              titleEn: 'Falgu Evening Ganga Aarti & Local Markets',
              titleHi: 'फल्गु शाम आरती एवं हस्तशिल्प बाजार',
              categoryTag: 'Spiritual Evening',
              descriptionEn: 'Return to Gaya City for mesmerizing Falgu River Devghat evening Aarti and leisurely shopping in local handicraft bazaars.',
              descriptionHi: 'फल्गु तट पर शाम की भव्य फल्गु महा आरती में सम्मिलित हों।',
              distanceKm: '12.0 km Return to Gaya',
              travelTimeMin: '25 mins',
              googleMapsQuery: 'Falgu+River+Devghat+Gaya',
              actionType: 'FOOD',
              actionUrl: '/food',
              actionLabelEn: 'Find Evening Food',
              actionLabelHi: 'भोजन देखें',
            },
          ]
        });
      }
    }

    return list;
  }, [selectedPurposes, activeDaysCount]);

  // Filter activities shown based on tab
  const displayedDays = useMemo(() => {
    if (activeDayTab === 0) return itineraryData;
    return itineraryData.filter(d => d.dayNumber === activeDayTab);
  }, [itineraryData, activeDayTab]);

  const handleShareWhatsApp = () => {
    const textLines = [
      `🚩 *My Customized Gaya Ji Trip Plan (${activeDaysCount} Days)*`,
      `Purposes: ${selectedPurposes.map(p => PURPOSE_OPTIONS.find(o => o.id === p)?.emoji).join(' ')}`,
      ``,
      ...itineraryData.map(d => 
        `*${d.titleEn}*\n` +
        d.activities.map(a => `• ${a.timeBlock}: ${a.titleEn} (${a.distanceKm})`).join('\n')
      ),
      ``,
      `Plan generated on GayaSeva Platform: https://gayaseva.org/my-trip`
    ];

    const shareUrl = `https://wa.me/?text=${encodeURIComponent(textLines.join('\n'))}`;
    window.open(shareUrl, '_blank');
  };

  const handleSavePlan = () => {
    if (typeof window !== 'undefined') {
      const planPayload = {
        days: activeDaysCount,
        purposes: selectedPurposes,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('GAYASEVA_SAVED_TRIP_PLAN', JSON.stringify(planPayload));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handlePrintPlan = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-gray-800 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/30 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#F6C343] font-semibold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4 text-[#F58220]" />
              <span>GAYASEVA TRIP ITINERARY PLANNER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
              📅 {isHindi ? 'अपनी गया जी यात्रा प्लान करें' : 'Plan My Gaya Trip'}
            </h1>
            <p className="text-xs sm:text-sm text-[#F8F6EF]/80 max-w-2xl">
              {isHindi
                ? 'पिंडदान, मंदिर दर्शन, बोधगया बौद्ध यात्रा एवं दर्शनीय स्थलों हेतु दूरी, समय एवं मैप नेविगेशन के साथ कस्टमाइज्ड यात्रा योजना तैयार करें।'
                : 'Generate a customized 1-Day, 2-Day, 3-Day or multi-day itinerary with exact distances, travel times, Google Maps navigation & direct booking options.'}
            </p>
          </div>
          <div className="hidden sm:block text-right bg-white/10 p-3 rounded-2xl border border-white/10">
            <span className="text-xs text-[#F6C343] font-bold block">100% Free &amp; Direct</span>
            <span className="text-[11px] text-white/80">Zero Commission Directory</span>
          </div>
        </div>
      </div>

      {/* Interactive Planner Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        
        {/* Step 1: Duration Selector */}
        <div className="space-y-3">
          <label className="font-serif font-bold text-sm text-[#4A2E1A] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F58220]" />
            <span>1. {isHindi ? 'यात्रा कितने दिनों की है?' : 'How many days is your trip?'}</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <button
              type="button"
              onClick={() => { setDays(1); setIsCustomDays(false); setActiveDayTab(0); }}
              className={`p-3.5 rounded-2xl border transition-all text-center space-y-1 ${
                days === 1 && !isCustomDays
                  ? 'bg-[#2A180B] text-white border-[#2A180B] shadow-md font-bold'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-amber-300'
              }`}
            >
              <span className="block text-sm font-bold">1 Day</span>
              <span className="block text-[11px] opacity-80">{isHindi ? 'त्वरित पिंडदान / दर्शन' : 'Express Pind Daan'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setDays(2); setIsCustomDays(false); setActiveDayTab(0); }}
              className={`p-3.5 rounded-2xl border transition-all text-center space-y-1 relative ${
                days === 2 && !isCustomDays
                  ? 'bg-[#2A180B] text-white border-[#2A180B] shadow-md font-bold'
                  : 'bg-amber-50/70 text-amber-950 border-amber-300 hover:bg-amber-100/80'
              }`}
            >
              <span className="absolute -top-2.5 right-2 bg-[#F58220] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Popular</span>
              <span className="block text-sm font-bold">2 Days</span>
              <span className="block text-[11px] opacity-90">{isHindi ? 'गया + बोधगया' : 'Gaya & Bodh Gaya'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setDays(3); setIsCustomDays(false); setActiveDayTab(0); }}
              className={`p-3.5 rounded-2xl border transition-all text-center space-y-1 ${
                days === 3 && !isCustomDays
                  ? 'bg-[#2A180B] text-white border-[#2A180B] shadow-md font-bold'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-amber-300'
              }`}
            >
              <span className="block text-sm font-bold">3 Days</span>
              <span className="block text-[11px] opacity-80">{isHindi ? 'पूर्ण तीर्थ यात्रा' : 'Full Teerth Yatra'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setIsCustomDays(true); setActiveDayTab(0); }}
              className={`p-3.5 rounded-2xl border transition-all text-center space-y-1 ${
                isCustomDays
                  ? 'bg-[#2A180B] text-white border-[#2A180B] shadow-md font-bold'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-amber-300'
              }`}
            >
              <span className="block text-sm font-bold">Custom</span>
              <span className="block text-[11px] opacity-80">{isHindi ? '4 से 7 दिन' : '4+ Extended Days'}</span>
            </button>
          </div>

          {/* Custom Days Counter if Selected */}
          {isCustomDays && (
            <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs w-fit">
              <span className="font-semibold text-amber-950">{isHindi ? 'कुल दिन चुनें:' : 'Select Custom Days:'}</span>
              <select
                value={customDaysCount}
                onChange={(e) => setCustomDaysCount(Number(e.target.value))}
                className="bg-white border border-amber-300 rounded-xl px-3 py-1 font-bold text-amber-950 text-xs"
              >
                <option value={4}>4 Days Trip</option>
                <option value={5}>5 Days Trip</option>
                <option value={6}>6 Days Trip</option>
                <option value={7}>7 Days Heritage Trip</option>
              </select>
            </div>
          )}
        </div>

        {/* Step 2: Purpose Checkboxes */}
        <div className="space-y-3">
          <label className="font-serif font-bold text-sm text-[#4A2E1A] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#F58220]" />
            <span>2. {isHindi ? 'आपकी यात्रा का उद्देश्य क्या है? (बहुविकल्प चुनें)' : 'What is the purpose of your visit? (Select all that apply)'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {PURPOSE_OPTIONS.map((item) => {
              const isSelected = selectedPurposes.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => togglePurpose(item.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 ${
                    isSelected
                      ? 'bg-amber-50 border-[#F58220] text-amber-950 ring-2 ring-[#F58220]/20 shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                      <span>{item.emoji}</span>
                      <span>{isHindi ? item.labelHi : item.labelEn}</span>
                    </span>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      isSelected ? 'bg-[#F58220] border-[#F58220] text-white' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    {isHindi ? item.descHi : item.descEn}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isHindi ? 'कस्टमाइज्ड यात्रा विवरण नीचे तैयार है:' : 'Dynamic itinerary generated below:'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 bg-emerald-600 text-white px-3.5 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isHindi ? 'WhatsApp शेयर' : 'Share WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={handleSavePlan}
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-950 px-3.5 py-2 rounded-xl font-semibold hover:bg-amber-100 transition"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              <span>{savedSuccess ? (isHindi ? 'सेव हो गया!' : 'Saved!') : (isHindi ? 'सेव करें' : 'Save Plan')}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPlan}
              className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 text-gray-800 px-3.5 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHindi ? 'प्रिंट / PDF' : 'Print PDF'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Generated Itinerary Output Display (Locked via DirectoryGatedView) */}
      <div className="space-y-6">
        <DirectoryGatedView
          categoryName={isHindi ? 'गया यात्रा प्लान एवं संपूर्ण गाइड' : 'Custom Gaya Trip Plan & Itinerary'}
          totalCount={displayedDays.length}
          maxPreviewCount={1}
        >
          {(visibleItemsCount, hasAccess) => {
            const itemsToShow = displayedDays.slice(0, visibleItemsCount);

            return (
              <div className="space-y-6">
                {/* Day Filter Tabs Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
                  <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2 tracking-tight">
                    <Navigation className="w-5 h-5 text-[#F58220]" />
                    <span>{activeDaysCount}-Day Gaya Trip Itinerary</span>
                  </h2>

                  <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setActiveDayTab(0)}
                      className={`px-3.5 py-1.5 rounded-xl transition-all ${
                        activeDayTab === 0 ? 'bg-[#2A180B] text-white shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      All Days ({activeDaysCount})
                    </button>

                    {itineraryData.map(d => (
                      <button
                        key={d.dayNumber}
                        type="button"
                        onClick={() => setActiveDayTab(d.dayNumber)}
                        className={`px-3 py-1.5 rounded-xl transition-all ${
                          activeDayTab === d.dayNumber ? 'bg-[#2A180B] text-white shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        Day {d.dayNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Day Cards (Preview / Full) */}
                <div className="space-y-8">
                  {itemsToShow.map((day) => (
                    <div key={day.dayNumber} className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      
                      {/* Day Header Banner */}
                      <div className="bg-[#2A180B] text-white p-5 sm:p-6 border-b border-[#F58220]/20 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-widest text-[#F6C343] block">
                            DAY {day.dayNumber} ITINERARY
                          </span>
                          <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
                            {isHindi ? day.titleHi : day.titleEn}
                          </h3>
                          <p className="text-xs text-stone-300 mt-0.5 font-sans">
                            {isHindi ? day.subtitleHi : day.subtitleEn}
                          </p>
                        </div>
                        <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-[#F6C343] flex items-center gap-1.5">
                          <span>{day.activities.length} Key Rites &amp; Stops</span>
                        </div>
                      </div>

                      {/* Activity Timeline List */}
                      <div className="p-6 sm:p-8 space-y-6">
                        {day.activities.map((act, idx) => (
                          <div key={idx} className="relative pl-6 sm:pl-8 border-l-2 border-amber-200/80 pb-6 last:pb-0 last:border-l-0">
                            {/* Timeblock Indicator Circle */}
                            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-stone-50 border-2 border-[#F58220] flex items-center justify-center text-xs font-bold text-stone-900 shadow-2xs">
                              {act.timeBlock === 'MORNING' ? '🌅' : act.timeBlock === 'AFTERNOON' ? '☀️' : '🌆'}
                            </div>

                            <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                              
                              {/* Title & Tag */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-2.5">
                                <div className="space-y-0.5">
                                  <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100/90 border border-amber-200/60 px-2 py-0.5 rounded-md tracking-wider">
                                    {act.timeBlock} • {act.categoryTag}
                                  </span>
                                  <h4 className="text-base font-serif font-bold text-stone-900 pt-1 tracking-tight">
                                    {isHindi ? act.titleHi : act.titleEn}
                                  </h4>
                                </div>

                                {/* Directions Link */}
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.googleMapsQuery)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 px-3 py-1.5 rounded-xl hover:border-amber-400 hover:text-amber-800 transition shadow-2xs"
                                >
                                  <Navigation className="w-3.5 h-3.5 text-[#F58220]" />
                                  <span>Google Maps</span>
                                  <ExternalLink className="w-3 h-3 text-stone-400" />
                                </a>
                              </div>

                              {/* Description */}
                              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                                {isHindi ? act.descriptionHi : act.descriptionEn}
                              </p>

                              {/* Distance & Travel Time Badges */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-stone-200/60">
                                <div className="flex flex-wrap items-center gap-4 text-stone-600 text-[11px] font-medium">
                                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                                    <MapPin className="w-3.5 h-3.5 text-[#F58220]" />
                                    <span>{act.distanceKm}</span>
                                  </span>

                                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>{act.travelTimeMin}</span>
                                  </span>
                                </div>

                                {/* Action Quick Button */}
                                {act.actionUrl && (
                                  <Link
                                    href={act.actionUrl}
                                    className="flex items-center gap-1 font-bold text-xs text-[#2A180B] hover:text-[#F58220] transition group"
                                  >
                                    <span>{isHindi ? act.actionLabelHi : act.actionLabelEn}</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                                  </Link>
                                )}
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        </DirectoryGatedView>
      </div>

      {/* Quick Booking Directory Card */}
      <div className="bg-gradient-to-r from-[#2A180B] to-[#4A2E1A] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 border border-[#F58220]/30">
        <div className="flex items-center gap-2 text-[#F6C343] font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#F58220]" />
          <span>VERIFIED GAYASEVA LOCAL DIRECTORY</span>
        </div>

        <h3 className="text-xl font-serif font-bold text-white">
          {isHindi ? 'अपनी यात्रा हेतु सत्यापित सेवा साझेदार बुक करें' : 'Book Verified Partners for Your Itinerary'}
        </h3>
        <p className="text-xs text-[#F8F6EF]/80 max-w-2xl">
          {isHindi
            ? '0% कमीशन पर सीधे गयावाल पंडा जी, ड्राइवर, होटल एवं सात्विक भोजनालय से संपर्क करें।'
            : 'Connect directly with verified Pandits, pick & drop cabs, AC rooms, and satvik restaurants with zero hidden fees.'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <Link href="/pandit" className="bg-white/10 p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition flex items-center gap-2 text-white">
            <Flame className="w-4 h-4 text-[#F6C343]" />
            <span className="font-semibold">Pandit Ji (/pandit)</span>
          </Link>
          <Link href="/pick-drop" className="bg-white/10 p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition flex items-center gap-2 text-white">
            <Car className="w-4 h-4 text-[#F6C343]" />
            <span className="font-semibold">Taxi &amp; Auto (/pick-drop)</span>
          </Link>
          <Link href="/stay" className="bg-white/10 p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition flex items-center gap-2 text-white">
            <Hotel className="w-4 h-4 text-[#F6C343]" />
            <span className="font-semibold">Hotels &amp; Rooms (/stay)</span>
          </Link>
          <Link href="/food" className="bg-white/10 p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition flex items-center gap-2 text-white">
            <UtensilsCrossed className="w-4 h-4 text-[#F6C343]" />
            <span className="font-semibold">Satvik Food (/food)</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

