const mysql = require('mysql2/promise');
require('dotenv').config();

const experiences = [
  {
    title: 'Santorini Sunset Cruise',
    description: 'Experience the magic of Santorini from the Aegean Sea. Sail around the caldera on a luxury catamaran, swim in volcanic hot springs, and snorkel in crystal-clear waters. Visit the famous Red and White beaches, and enjoy a freshly prepared Greek BBQ dinner on board while watching one of the most spectacular sunsets in the world. Package includes premium wine, full BBQ meal, snorkeling equipment, and hotel transfers.',
    location: 'Santorini, Greece',
    duration: 300, // 5h in minutes
    price: 8000,
    image_url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Machu Picchu Sunrise Tour',
    description: 'Begin your journey before dawn to witness the mystical Machu Picchu emerging from the morning mist. This exclusive tour allows you to experience the ancient Incan citadel at its most serene. Learn about the sophisticated architectural techniques, astronomical alignments, and the theories behind its purpose. Includes guided tour, all transportation, entrance fees, and breakfast at Sanctuary Lodge.',
    location: 'Cusco, Peru',
    duration: 720, // 12h in minutes
    price: 15000,
    image_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Northern Lights Hunt',
    description: 'Chase the aurora borealis through the pristine Icelandic wilderness. Travel in a super jeep to find the best viewing spots, learn photography tips from experts, and enjoy hot chocolate under the dancing lights. Package includes thermal suits, photography assistance, hot drinks and snacks, and hotel pickup/drop-off.',
    location: 'Reykjavik, Iceland',
    duration: 240, // 4h in minutes
    price: 12000,
    image_url: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Taj Mahal Sunrise Tour',
    description: 'Experience the majestic Taj Mahal at its most beautiful hour - sunrise. Join our expert guides for an intimate tour of this UNESCO World Heritage site. Learn about the incredible love story behind its creation, the intricate Persian and Mughal architecture, and the perfect symmetry in its design. The tour includes skip-the-line entry, professional photography spots, and a visit to the beautiful Mughal gardens.',
    location: 'Agra, Uttar Pradesh',
    duration: 180, // 3h in minutes
    price: 1500,
    image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Old Delhi Food Walk',
    description: 'Embark on a culinary journey through the bustling streets of Old Delhi. This immersive food walk takes you through the historic Chandni Chowk area, where you\'ll sample over 8 different authentic dishes from century-old establishments.',
    location: 'Delhi',
    duration: 240, // 4h in minutes
    price: 800,
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Kerala Backwater Cruise',
    description: 'Drift through the tranquil backwaters of Kerala in a traditional houseboat (kettuvallam). This authentic experience includes a full-day cruise through the picturesque waterways, passing by local villages, coconut groves, and paddy fields.',
    location: 'Alleppey, Kerala',
    duration: 360, // 6h in minutes
    price: 2000,
    image_url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Rajasthan Desert Safari',
    description: 'Embark on an unforgettable journey through the golden sands of the Thar Desert. This overnight adventure begins with a camel safari through rolling sand dunes, followed by a magical evening at our luxury desert camp.',
    location: 'Jaisalmer, Rajasthan',
    duration: 1440, // 24h in minutes
    price: 3500,
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Varanasi Spiritual Walk',
    description: 'Immerse yourself in the spiritual heart of India with this profound Varanasi experience. Begin your journey before dawn to witness the mesmerizing Ganga Aarti at Dasaswamedh Ghat, followed by a serene boat ride on the holy Ganges during sunrise.',
    location: 'Varanasi, Uttar Pradesh',
    duration: 240, // 4h in minutes
    price: 700,
    image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Mysore Palace Tour',
    description: 'Step into the royal heritage of Karnataka with an expert-guided tour of the magnificent Mysore Palace. Explore this architectural masterpiece that blends Hindu, Muslim, Rajput, and Gothic styles.',
    location: 'Mysore, Karnataka',
    duration: 180, // 3h in minutes
    price: 600,
    image_url: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Goa Beach Exploration',
    description: 'Discover the hidden gems of North Goa on this comprehensive tour that combines beach hopping with cultural exploration. Visit secluded beaches away from the tourist crowds, explore Portuguese-era churches and forts.',
    location: 'North Goa',
    duration: 300, // 5h in minutes
    price: 1200,
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Hampi Heritage Walk',
    description: 'Journey through time in the ancient city of Hampi, a UNESCO World Heritage site. This guided walk takes you through magnificent temple complexes, royal enclosures, and bazaars of the Vijayanagara Empire.',
    location: 'Hampi, Karnataka',
    duration: 360, // 6h in minutes
    price: 900,
    image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Ladakh Monastery Tour',
    description: 'Discover the spiritual and cultural heritage of Ladakh through its ancient monasteries (gompas). Visit the iconic Thiksey Monastery, witness early morning prayers and butter lamp ceremonies, and interact with Buddhist monks.',
    location: 'Leh, Ladakh',
    duration: 480, // 8h in minutes
    price: 2500,
    image_url: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=80'
  }
];

async function seedExperiences() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306')
    });

    console.log('Connected to database');

    // Clear existing experiences
    await connection.execute('DELETE FROM experiences');
    console.log('Cleared existing experiences');

    // Insert new experiences
    for (const exp of experiences) {
      await connection.execute(
        `INSERT INTO experiences (title, description, image_url, price, location, duration) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [exp.title, exp.description, exp.image_url, exp.price, exp.location, exp.duration]
      );
      console.log(`Added experience: ${exp.title}`);
    }

    // Create slots for each experience
    const [rows] = await connection.execute('SELECT id FROM experiences');
    const experienceIds = rows.map(row => row.id);

    // Clear existing slots
    await connection.execute('DELETE FROM slots');
    console.log('Cleared existing slots');

    // Add slots for next 7 days for each experience
    for (const expId of experienceIds) {
      for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        // Format dates for MySQL
        const morningStart = date.toISOString().slice(0, 10) + ' 09:00:00';
        const morningEnd = date.toISOString().slice(0, 10) + ' 13:00:00';
        const afternoonStart = date.toISOString().slice(0, 10) + ' 14:00:00';
        const afternoonEnd = date.toISOString().slice(0, 10) + ' 18:00:00';

        // Morning slot
        await connection.execute(
          `INSERT INTO slots (experience_id, start_time, end_time, capacity, available_spots)
           VALUES (?, ?, ?, ?, ?)`,
          [expId, morningStart, morningEnd, 20, 20]
        );

        // Afternoon slot
        await connection.execute(
          `INSERT INTO slots (experience_id, start_time, end_time, capacity, available_spots)
           VALUES (?, ?, ?, ?, ?)`,
          [expId, afternoonStart, afternoonEnd, 20, 20]
        );
      }
      console.log(`Added slots for experience ID: ${expId}`);
    }

    console.log('Successfully seeded all experiences and slots');
    await connection.end();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedExperiences();