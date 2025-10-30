// Quick script to print recent rows from the `bookings` table.
// Usage: node scripts/print_bookings.js

require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bookit',
      port: parseInt(process.env.DB_PORT || '3306', 10),
    });

    const [rows] = await conn.execute('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200');
    if (!rows || rows.length === 0) {
      console.log('No bookings found.');
    } else {
      console.table(rows);
    }

    await conn.end();
  } catch (err) {
    console.error('Error connecting to DB:', err.message || err);
    process.exit(1);
  }
})();
