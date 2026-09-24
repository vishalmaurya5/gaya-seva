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
import { PaymentStore } from '@/lib/paymentStore';

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
          descriptionEn: 'Ascend Bhasmakoot hill to visit one of India\'s 18 Mahashaktipeeths. Experience magnificent evening Maha Aarti and sunset views over Gaya city.',
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
            descriptionEn: 'Marvel at India\'s majestic 80-foot high red-granite Great Buddha statue set in peaceful Japanese gardens near Daijokyo Buddhist Temple.',
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

  const [hasAccess, setHasAccess] = useState<boolean>(false);

  const syncAccessState = async () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
      if (stored) {
        const usr = JSON.parse(stored);
        if (usr && usr.id) {
          // 1. Fast local check
          if (PaymentStore.hasActiveCustomerAccess(usr.id)) {
            setHasAccess(true);
            return;
          }
          // 2. Fetch fresh status from backend API
          const res = await fetch(`/api/payments/access-status?userId=${encodeURIComponent(usr.id)}`, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data.hasAccess) {
              setHasAccess(true);
              const key = 'GAYASEVA_CUSTOMER_ACCESS_STORE';
              const localStored = localStorage.getItem(key);
              let records: any[] = localStored ? JSON.parse(localStored) : [];
              if (!Array.isArray(records)) records = [];
              if (!records.some((r) => r.userId === usr.id && r.status === 'ACTIVE')) {
                records.push({
                  id: 'access_' + usr.id,
                  userId: usr.id,
                  accessType: 'LIFETIME',
                  status: 'ACTIVE',
                  amount: 5,
                  currency: 'INR',
                  createdAt: new Date().toISOString(),
                });
                localStorage.setItem(key, JSON.stringify(records));
              }
              return;
            }
          }
        }
      }
    } catch (e) {}
    setHasAccess(false);
  };

  React.useEffect(() => {
    syncAccessState();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', syncAccessState);
      window.addEventListener('gayaseva_access_change', syncAccessState);
      window.addEventListener('focus', syncAccessState);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', syncAccessState);
        window.removeEventListener('gayaseva_access_change', syncAccessState);
        window.removeEventListener('focus', syncAccessState);
      }
    };
  }, []);

  const checkHasAccess = (): boolean => {
    return hasAccess;
  };

  const promptUnlockAccess = () => {
    const banner = document.getElementById('unlock-access-banner');
    if (banner) {
      banner.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert(
        isHindi
          ? 'सम्पूर्ण गया यात्रा प्लान एवं गाइड अनलॉक करने के लिए कृपया ₹5 Access Pass चालू करें।'
          : 'Please activate ₹5 Access Pass to unlock, save, share & print the complete trip itinerary.'
      );
    }
  };

  const handleShareWhatsApp = () => {
    if (!checkHasAccess()) {
      promptUnlockAccess();
      return;
    }
    const title = `🚩 My Gaya ${activeDaysCount}-Day Trip Itinerary (GayaSeva.org)\n\n`;
    const details = itineraryData.map(d => `${isHindi ? d.titleHi : d.titleEn}:\n` + d.activities.map(a => `• ${a.timeBlock}: ${isHindi ? a.titleHi : a.titleEn} (${a.distanceKm})`).join('\n')).join('\n\n');
    const fullText = title + details + `\n\nPlan your custom trip at: https://gayaseva.org/my-trip`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`, '_blank');
  };

  const handleSavePlan = () => {
    if (!checkHasAccess()) {
      promptUnlockAccess();
      return;
    }
    try {
      localStorage.setItem('GAYASEVA_SAVED_TRIP_PLAN', JSON.stringify({
        days: activeDaysCount,
        selectedPurposes,
        savedAt: new Date().toISOString()
      }));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save plan:', e);
    }
  };

  const handlePrintPlan = () => {
    if (!checkHasAccess()) {
      promptUnlockAccess();
      return;
    }

    const printWin = window.open('', '_blank', 'width=900,height=800');
    if (!printWin) {
      alert(isHindi ? 'कृपया प्रिंट विंडो खोलने की अनुमति दें।' : 'Please allow popups to print the itinerary PDF.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>GayaSeva - ${activeDaysCount}-Day Gaya Trip Itinerary</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
            body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 24px; color: #0f172a; line-height: 1.5; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #f58220; padding-bottom: 16px; margin-bottom: 24px; }
            .logo { font-size: 24px; font-weight: 800; color: #2a180b; }
            .logo span { color: #f58220; }
            .sub { font-size: 12px; color: #64748b; font-weight: 600; }
            .badge { background: #fff7ed; border: 1px solid #ffedd5; color: #c2410c; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
            .day-card { border: 1px solid #e2e8f0; border-radius: 16px; margin-bottom: 24px; overflow: hidden; page-break-inside: avoid; }
            .day-title { background: #2a180b; color: #fff; padding: 14px 20px; font-size: 16px; font-weight: 800; }
            .day-subtitle { font-size: 12px; color: #fde68a; font-weight: 500; margin-top: 2px; }
            .act-list { padding: 16px 20px; }
            .act-item { border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; margin-bottom: 14px; }
            .act-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .act-tag { display: inline-block; background: #fef3c7; color: #78350f; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 4px; }
            .act-name { font-size: 14px; font-weight: 700; color: #0f172a; margin: 2px 0 4px 0; }
            .act-desc { font-size: 12px; color: #475569; margin-bottom: 6px; }
            .act-meta { font-size: 11px; color: #64748b; font-weight: 600; display: flex; gap: 16px; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 32px; font-size: 11px; color: #94a3b8; text-align: center; }
            @media print {
              body { padding: 0; }
              .day-card { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Gaya<span>Seva</span></div>
              <div class="sub">Verified Pilgrimage & Tourism Directory • Gaya, Bihar</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">${activeDaysCount}-Day Customized Itinerary</span>
              <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Generated on: ${new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          ${itineraryData.map(day => `
            <div class="day-card">
              <div class="day-title">
                ${isHindi ? day.titleHi : day.titleEn}
                <div class="day-subtitle">${isHindi ? day.subtitleHi : day.subtitleEn}</div>
              </div>
              <div class="act-list">
                ${day.activities.map(act => `
                  <div class="act-item">
                    <span class="act-tag">${act.timeBlock} • ${act.categoryTag}</span>
                    <div class="act-name">${isHindi ? act.titleHi : act.titleEn}</div>
                    <div class="act-desc">${isHindi ? act.descriptionHi : act.descriptionEn}</div>
                    <div class="act-meta">
                      <span>📍 ${act.distanceKm}</span>
                      <span>⏱️ ${act.travelTimeMin}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <div class="footer">
            <p><strong>GayaSeva.org</strong> — Direct Zero-Commission Booking for Pandits, Cabs, Hotels & Satvik Food</p>
            <p>Need assistance during your trip? Visit https://gayaseva.org or call our helpline.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      
      {/* Banner & Header Card */}
      <div className="bg-gradient-to-r from-slate-950 via-[#2A180B] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              📅 {isHindi ? 'अपनी गया जी यात्रा प्लान करें' : 'Plan My Gaya Trip'}
            </h1>
            <p className="text-xs sm:text-sm text-[#F8F6EF]/80 max-w-2xl font-medium">
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Step 1: Duration Selector */}
        <div className="space-y-3">
          <label className="font-extrabold text-sm text-slate-900 flex items-center gap-2 tracking-tight">
            <Calendar className="w-4 h-4 text-[#F58220]" />
            <span>1. {isHindi ? 'यात्रा कितने दिनों की है?' : 'How many days is your trip?'}</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <button
              type="button"
              onClick={() => { setDays(1); setIsCustomDays(false); setActiveDayTab(0); }}
              className={`p-3.5 rounded-2xl border transition-all text-center space-y-1 cursor-pointer ${
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
              className={`p-3.5 rounded-2xl border transition-all text-center space-y-1 relative cursor-pointer ${
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
              className={`p-3.5 rounded-2xl border transition-all text-center space-y-1 cursor-pointer ${
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
              className={`p-3.5 rounded-2xl border transition-all text-center space-y-1 cursor-pointer ${
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
          <label className="font-extrabold text-sm text-slate-900 flex items-center gap-2 tracking-tight">
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
                  className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 cursor-pointer ${
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
        {checkHasAccess() ? (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                {isHindi ? 'कस्टमाइज्ड यात्रा विवरण नीचे अनलॉक्ड है:' : 'Dynamic itinerary unlocked below:'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 bg-emerald-600 text-white px-3.5 py-2 rounded-xl font-bold hover:bg-emerald-700 transition shadow-2xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'WhatsApp शेयर' : 'Share WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={handleSavePlan}
                className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-950 px-3.5 py-2 rounded-xl font-bold hover:bg-amber-100 transition cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>{savedSuccess ? (isHindi ? 'सेव हो गया!' : 'Saved!') : (isHindi ? 'सेव करें' : 'Save Plan')}</span>
              </button>

              <button
                type="button"
                onClick={handlePrintPlan}
                className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 text-slate-800 px-3.5 py-2 rounded-xl font-bold hover:bg-slate-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-700" />
                <span>{isHindi ? 'प्रिंट / PDF' : 'Print PDF'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold bg-amber-50 px-3.5 py-2.5 rounded-xl border border-amber-200/80">
              <Lock className="w-4 h-4 text-[#F58220] shrink-0" />
              <span>
                {isHindi
                  ? '🔒 सम्पूर्ण कस्टमाइज्ड गया यात्रा प्लान एवं गाइड विवरण देखने के लिए ₹5 Access Pass चालू करें'
                  : '🔒 Full Customized Trip Plan & Guide Details Locked (Activate ₹5 Pass)'}
              </span>
            </div>

            <button
              type="button"
              onClick={promptUnlockAccess}
              className="px-4 py-2.5 bg-gradient-to-r from-[#F58220] to-[#F6C343] hover:from-[#E07210] hover:to-[#E5B232] text-slate-950 font-black rounded-xl shadow-md text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isHindi ? 'अभी अनलॉक करें' : 'Unlock Pass Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Generated Itinerary Output Display (Fully Locked via DirectoryGatedView) */}
      <div className="space-y-6">
        <DirectoryGatedView
          categoryName={isHindi ? 'गया यात्रा प्लान एवं संपूर्ण गाइड' : 'Custom Gaya Trip Plan & Itinerary'}
          totalCount={displayedDays.length}
          maxPreviewCount={0}
        >
          {(visibleItemsCount, hasAccess) => {
            if (!hasAccess) {
              return (
                <div className="bg-slate-50 border-2 border-dashed border-amber-300/80 p-8 rounded-3xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-[#F58220] flex items-center justify-center mx-auto border border-amber-300">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {isHindi ? '🔒 संपूर्ण यात्रा विवरण लॉक है' : '🔒 Full Itinerary Details Locked'}
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
                      {isHindi
                        ? 'दूरी, समय, गूगल मैप्स नेविगेशन एवं पंडा जी / टैक्सी संपर्क के साथ पूरा शेड्यूल अनलॉक करने के लिए नीचे पास सक्रिय करें।'
                        : 'Unlock exact day-by-day activity timelines, distances, travel times & Pandit/Cab contacts with the ₹5 Access Pass below.'}
                    </p>
                  </div>
                </div>
              );
            }

            const itemsToShow = displayedDays.slice(0, visibleItemsCount);

            return (
              <div className="space-y-6">
                {/* Day Filter Tabs Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                    <Navigation className="w-5 h-5 text-[#F58220]" />
                    <span>{activeDaysCount}-Day Gaya Trip Itinerary</span>
                  </h2>

                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setActiveDayTab(0)}
                      className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                        activeDayTab === 0 ? 'bg-[#2A180B] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All Days ({activeDaysCount})
                    </button>

                    {itineraryData.map(d => (
                      <button
                        key={d.dayNumber}
                        type="button"
                        onClick={() => setActiveDayTab(d.dayNumber)}
                        className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                          activeDayTab === d.dayNumber ? 'bg-[#2A180B] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Day {d.dayNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Day Cards */}
                <div className="space-y-8">
                  {itemsToShow.map((day) => (
                    <div key={day.dayNumber} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      
                      {/* Day Header Banner */}
                      <div className="bg-gradient-to-r from-slate-950 via-[#2A180B] to-slate-900 text-white p-5 sm:p-6 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-md inline-block">
                            DAY {day.dayNumber} ITINERARY
                          </span>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                            {isHindi ? day.titleHi : day.titleEn}
                          </h3>
                          <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
                            {isHindi ? day.subtitleHi : day.subtitleEn}
                          </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-xs font-bold text-amber-300 flex items-center gap-1.5 shrink-0">
                          <Sparkles className="w-3.5 h-3.5 text-[#F58220]" />
                          <span>{day.activities.length} Key Rites &amp; Stops</span>
                        </div>
                      </div>

                      {/* Activity Timeline List */}
                      <div className="p-6 sm:p-8 space-y-6">
                        {day.activities.map((act, idx) => (
                          <div key={idx} className="relative pl-7 sm:pl-9 border-l-2 border-amber-400/40 pb-6 last:pb-0 last:border-l-0">
                            {/* Timeblock Indicator Circle */}
                            <div className="absolute -left-[18px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-[#F58220] flex items-center justify-center text-xs shadow-md">
                              {act.timeBlock === 'MORNING' ? '🌅' : act.timeBlock === 'AFTERNOON' ? '☀️' : '🌆'}
                            </div>

                            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3.5">
                              
                              {/* Title & Tag */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg tracking-wider">
                                    {act.timeBlock} • {act.categoryTag}
                                  </span>
                                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 pt-1 tracking-tight">
                                    {isHindi ? act.titleHi : act.titleEn}
                                  </h4>
                                </div>

                                {/* Directions Link */}
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.googleMapsQuery)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 transition-all shadow-2xs"
                                >
                                  <Navigation className="w-3.5 h-3.5 text-[#F58220]" />
                                  <span>Google Maps</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                </a>
                              </div>

                              {/* Description */}
                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                                {isHindi ? act.descriptionHi : act.descriptionEn}
                              </p>

                              {/* Distance & Travel Time Badges */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
                                <div className="flex flex-wrap items-center gap-3 text-slate-600 text-xs font-semibold">
                                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                                    <MapPin className="w-3.5 h-3.5 text-[#F58220]" />
                                    <span>{act.distanceKm}</span>
                                  </span>

                                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>{act.travelTimeMin}</span>
                                  </span>
                                </div>

                                {/* Action Quick Button */}
                                {act.actionUrl && (
                                  <Link
                                    href={act.actionUrl}
                                    className="flex items-center gap-1.5 font-extrabold text-xs text-[#2A180B] hover:text-[#F58220] transition-all group"
                                  >
                                    <span>{isHindi ? act.actionLabelHi : act.actionLabelEn}</span>
                                    <ArrowRight className="w-4 h-4 text-[#F58220] group-hover:translate-x-1 transition-transform" />
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

        <h3 className="text-xl font-extrabold text-white tracking-tight">
          {isHindi ? 'अपनी यात्रा हेतु सत्यापित सेवा साझेदार बुक करें' : 'Book Verified Partners for Your Itinerary'}
        </h3>
        <p className="text-xs text-[#F8F6EF]/80 max-w-2xl font-medium">
          {isHindi
            ? '0% कमीशन पर सीधे गयावाल पंडा जी, ड्राइवर, होटल एवं सात्विक भोजनालय से संपर्क करें।'
            : 'Connect directly with verified Pandits, pick & drop cabs, AC rooms, and satvik restaurants with zero hidden fees.'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <Link href="/pandit" className="bg-white/10 p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition flex items-center gap-2 text-white font-semibold">
            <Flame className="w-4 h-4 text-[#F6C343]" />
            <span>Pandit Ji (/pandit)</span>
          </Link>
          <Link href="/pick-drop" className="bg-white/10 p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition flex items-center gap-2 text-white font-semibold">
            <Car className="w-4 h-4 text-[#F6C343]" />
            <span>Taxi &amp; Auto (/pick-drop)</span>
          </Link>
          <Link href="/stay" className="bg-white/10 p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition flex items-center gap-2 text-white font-semibold">
            <Hotel className="w-4 h-4 text-[#F6C343]" />
            <span>Hotels &amp; Rooms (/stay)</span>
          </Link>
          <Link href="/food" className="bg-white/10 p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition flex items-center gap-2 text-white font-semibold">
            <UtensilsCrossed className="w-4 h-4 text-[#F6C343]" />
            <span>Satvik Food (/food)</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
