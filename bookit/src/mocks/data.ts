export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  max_capacity: number;
  price: number;
  image_url: string;
  created_at: string;
}

export interface Slot {
  id: string;
  experience_id: string;
  date: string;
  start_time: string;
  available_spots: number;
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  max_discount: number;
  min_booking_amount: number;
  valid_from: string;
  valid_until: string;
  created_at: string;
}

export interface Booking {
  id: string;
  slot_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  spots_booked: number;
  total_price: number;
  promo_code: string | null;
  discount_amount: number;
  status: string;
  created_at: string;
  slots: Slot & { experiences: Experience };
}

export const experiences: Experience[] = [
  {
    id: 'exp_10',
    title: 'Santorini Sunset Cruise',
    description:
      'Experience the magic of Santorini from the Aegean Sea. Sail around the caldera on a luxury catamaran, swim in volcanic hot springs, and snorkel in crystal-clear waters. Visit the famous Red and White beaches, and enjoy a freshly prepared Greek BBQ dinner on board while watching one of the most spectacular sunsets in the world. Package includes premium wine, full BBQ meal, snorkeling equipment, and hotel transfers.',
    location: 'Santorini, Greece',
    duration: '5h',
    max_capacity: 12,
    price: 8000, // ₹8,000
    image_url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_11',
    title: 'Machu Picchu Sunrise Tour',
    description:
      'Begin your journey before dawn to witness the mystical Machu Picchu emerging from the morning mist. This exclusive tour allows you to experience the ancient Incan citadel at its most serene. Learn about the sophisticated architectural techniques, astronomical alignments, and the theories behind its purpose. Includes guided tour, all transportation, entrance fees, and breakfast at Sanctuary Lodge.',
    location: 'Cusco, Peru',
    duration: '12h',
    max_capacity: 8,
    price: 15000, // ₹15,000
    image_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_12',
    title: 'Northern Lights Hunt',
    description:
      'Chase the aurora borealis through the pristine Icelandic wilderness. Travel in a super jeep to find the best viewing spots, learn photography tips from experts, and enjoy hot chocolate under the dancing lights. Package includes thermal suits, photography assistance, hot drinks and snacks, and hotel pickup/drop-off.',
    location: 'Reykjavik, Iceland',
    duration: '4h',
    max_capacity: 6,
    price: 12000, // ₹12,000
    image_url: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_1',
    title: 'Taj Mahal Sunrise Tour',
    description:
      'Experience the majestic Taj Mahal at its most beautiful hour - sunrise. Join our expert guides for an intimate tour of this UNESCO World Heritage site. Learn about the incredible love story behind its creation, the intricate Persian and Mughal architecture, and the perfect symmetry in its design. The tour includes skip-the-line entry, professional photography spots, and a visit to the beautiful Mughal gardens. Our guides will share fascinating historical insights and help you capture the perfect photos of this wonder of the world.',
    location: 'Agra, Uttar Pradesh',
    duration: '3h',
    max_capacity: 6,
    price: 1500, // ₹1,500
    image_url:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_2',
    title: 'Old Delhi Food Walk',
    description:
      'Embark on a culinary journey through the bustling streets of Old Delhi. This immersive food walk takes you through the historic Chandni Chowk area, where you\'ll sample over 8 different authentic dishes from century-old establishments. Try the famous Daulat ki Chaat, crispy paranthe from Paranthe Wali Gali, and mouth-watering kebabs from Karim\'s. Learn about the rich history of Mughlai cuisine, the street food culture, and the stories behind these legendary food establishments. The tour includes all food tastings, bottled water, and insider tips about the best local eateries.',
    location: 'Delhi',
    duration: '4h',
    max_capacity: 10,
      price: 800, // ₹800
      image_url:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_3',
    title: 'Kerala Backwater Cruise',
    description:
      'Drift through the tranquil backwaters of Kerala in a traditional houseboat (kettuvallam). This authentic experience includes a full-day cruise through the picturesque waterways, passing by local villages, coconut groves, and paddy fields. Enjoy freshly cooked Kerala cuisine prepared on board by your private chef. Watch traditional fishing techniques, visit a local village, and witness the sunset over the backwaters. The package includes welcome drinks, lunch, evening tea with snacks, and experienced local guides who will share insights about the unique ecosystem and culture of the region.',
    location: 'Alleppey, Kerala',
    duration: '6h',
    max_capacity: 8,
    price: 2000, // ₹2,000
    image_url:
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_4',
    title: 'Rajasthan Desert Safari',
    description:
      'Embark on an unforgettable journey through the golden sands of the Thar Desert. This overnight adventure begins with a camel safari through rolling sand dunes, followed by a magical evening at our luxury desert camp. Experience traditional Rajasthani hospitality with folk music and dance performances under the starlit sky. Enjoy a traditional dinner cooked on desert campfire, sleep in well-appointed tents, and wake up to a spectacular desert sunrise. The package includes camel ride, accommodation, all meals, cultural performances, and experienced guides who share tales of desert life and Rajasthani culture.',
    location: 'Jaisalmer, Rajasthan',
    duration: '24h',
    max_capacity: 6,
      price: 3500, // ₹3,500
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_5',
    title: 'Varanasi Spiritual Walk',
    description:
      'Immerse yourself in the spiritual heart of India with this profound Varanasi experience. Begin your journey before dawn to witness the mesmerizing Ganga Aarti at Dasaswamedh Ghat, followed by a serene boat ride on the holy Ganges during sunrise. Visit ancient temples, walk through the narrow lanes of the old city, and learn about the deep spiritual significance of this sacred place. Watch as the city awakens to the sounds of temple bells and morning prayers. The tour includes private boat ride, guide services, temple visits, and a special blessing ceremony conducted by a local priest.',
    location: 'Varanasi, Uttar Pradesh',
    duration: '4h',
    max_capacity: 10,
    price: 700, // ₹700
    image_url:
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_6',
    title: 'Mysore Palace Tour',
    description:
      'Step into the royal heritage of Karnataka with an expert-guided tour of the magnificent Mysore Palace. Explore this architectural masterpiece that blends Hindu, Muslim, Rajput, and Gothic styles. Learn about the Wadiyar dynasty and their contributions to art and culture. See the durbar hall, the marriage pavilion, and the private quarters with their stunning stained glass, mirrors, and intricate carvings. The tour includes skip-the-line palace entry, guided exploration of the palace museum, and if visiting on Sunday evening, viewing of the spectacular palace illumination with over 100,000 lights.',
    location: 'Mysore, Karnataka',
    duration: '3h',
    max_capacity: 15,
      price: 600, // ₹600
    image_url: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_7',
    title: 'Goa Beach Exploration',
    description:
      'Discover the hidden gems of North Goa on this comprehensive tour that combines beach hopping with cultural exploration. Visit secluded beaches away from the tourist crowds, explore Portuguese-era churches and forts, and experience the unique Indo-Portuguese culture. The tour includes visits to the historic Aguada Fort, the beautiful Vagator and Morjim beaches, and a traditional Goan lunch at a local home. Try water sports (optional), spot dolphins, and end the day at a scenic beach cafe. Our expert guides share insider knowledge about Goan history, culture, and the best local spots for authentic experiences.',
    location: 'North Goa',
    duration: '5h',
    max_capacity: 20,
    price: 1200, // ₹1,200
    image_url:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_8',
    title: 'Hampi Heritage Walk',
    description:
      'Journey through time in the ancient city of Hampi, a UNESCO World Heritage site. This guided walk takes you through magnificent temple complexes, royal enclosures, and bazaars of the Vijayanagara Empire. Explore the iconic Virupaksha Temple, climb Matanga Hill for a panoramic sunset view, and visit the musical pillars of Vittala Temple. Learn about the sophisticated architecture and engineering of the 14th-century metropolis. The tour includes expert archaeological insights, traditional lunch at a local home, and a coracle ride across the Tungabhadra river.',
    location: 'Hampi, Karnataka',
    duration: '6h',
    max_capacity: 12,
      price: 900, // ₹900
    image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp_9',
    title: 'Ladakh Monastery Tour',
    description:
      'Discover the spiritual and cultural heritage of Ladakh through its ancient monasteries (gompas). Visit the iconic Thiksey Monastery, witness early morning prayers and butter lamp ceremonies, and interact with Buddhist monks. Explore the 900-year-old Alchi Monastery known for its unique Kashmiri-style art. The tour includes visits to Hemis Monastery, the largest monastic institution in Ladakh, and Stakna Monastery perched dramatically on a hill. Experience traditional Ladakhi culture, learn about Tibetan Buddhism, and enjoy breathtaking Himalayan views. Package includes monastery entrance fees, traditional lunch, and transport in heated vehicles.',
    location: 'Leh, Ladakh',
    duration: '8h',
    max_capacity: 8,
    price: 2500, // ₹2,500
    image_url: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  }
];

export const slots: Slot[] = [
  // Santorini Sunset Cruise
  {
    id: 'slot_19',
    experience_id: 'exp_10',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '16:00',
    available_spots: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_20',
    experience_id: 'exp_10',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '16:00',
    available_spots: 12,
    created_at: new Date().toISOString(),
  },
  // Machu Picchu Sunrise Tour
  {
    id: 'slot_21',
    experience_id: 'exp_11',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '04:00',
    available_spots: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_22',
    experience_id: 'exp_11',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '04:00',
    available_spots: 8,
    created_at: new Date().toISOString(),
  },
  // Northern Lights Hunt
  {
    id: 'slot_23',
    experience_id: 'exp_12',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '21:00',
    available_spots: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_24',
    experience_id: 'exp_12',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '21:00',
    available_spots: 6,
    created_at: new Date().toISOString(),
  },
  // Taj Mahal
  {
    id: 'slot_1',
    experience_id: 'exp_1',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '05:30',
    available_spots: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_2',
    experience_id: 'exp_1',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '05:30',
    available_spots: 8,
    created_at: new Date().toISOString(),
  },
  // Old Delhi
  {
    id: 'slot_3',
    experience_id: 'exp_2',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '10:00',
    available_spots: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_4',
    experience_id: 'exp_2',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '10:00',
    available_spots: 10,
    created_at: new Date().toISOString(),
  },
  // Kerala
  {
    id: 'slot_5',
    experience_id: 'exp_3',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '09:00',
    available_spots: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_6',
    experience_id: 'exp_3',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '09:00',
    available_spots: 6,
    created_at: new Date().toISOString(),
  },
  // Rajasthan
  {
    id: 'slot_7',
    experience_id: 'exp_4',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '15:00',
    available_spots: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_8',
    experience_id: 'exp_4',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '15:00',
    available_spots: 4,
    created_at: new Date().toISOString(),
  },
  // Varanasi
  {
    id: 'slot_9',
    experience_id: 'exp_5',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '04:30',
    available_spots: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_10',
    experience_id: 'exp_5',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '04:30',
    available_spots: 8,
    created_at: new Date().toISOString(),
  },
  // Mysore
  {
    id: 'slot_11',
    experience_id: 'exp_6',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '10:30',
    available_spots: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_12',
    experience_id: 'exp_6',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '10:30',
    available_spots: 12,
    created_at: new Date().toISOString(),
  },
  // Goa
  {
    id: 'slot_13',
    experience_id: 'exp_7',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '09:00',
    available_spots: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_14',
    experience_id: 'exp_7',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '09:00',
    available_spots: 18,
    created_at: new Date().toISOString(),
  },
  // Hampi
  {
    id: 'slot_15',
    experience_id: 'exp_8',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '07:00',
    available_spots: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_16',
    experience_id: 'exp_8',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '07:00',
    available_spots: 10,
    created_at: new Date().toISOString(),
  },
  // Ladakh
  {
    id: 'slot_17',
    experience_id: 'exp_9',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '08:00',
    available_spots: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot_18',
    experience_id: 'exp_9',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '08:00',
    available_spots: 6,
    created_at: new Date().toISOString(),
  },
];

export const promo_codes: PromoCode[] = [
  {
    id: 'promo_1',
    code: 'WELCOME10',
    discount_percent: 10,
    max_discount: 1000,
    min_booking_amount: 2000,
    valid_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'promo_2',
    code: 'SUMMER20',
    discount_percent: 20,
    max_discount: 2000,
    min_booking_amount: 4000,
    valid_from: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

export const bookings: Booking[] = [];