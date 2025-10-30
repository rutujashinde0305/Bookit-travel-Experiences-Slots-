const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function insertSampleSlots(connection) {
    const dates = Array.from({ length: 7 }, (_, i) => i + 1);
    const experiences = [1, 2, 3];
    
    for (const expId of experiences) {
        for (const days of dates) {
            // Morning slot
            await connection.query(
                `INSERT INTO slots (experience_id, start_time, end_time, capacity, available_spots)
                VALUES (?, 
                    DATE_ADD(CURDATE(), INTERVAL ? DAY) + INTERVAL 10 HOUR,
                    DATE_ADD(CURDATE(), INTERVAL ? DAY) + INTERVAL 14 HOUR,
                    20, 20)`,
                [expId, days, days]
            );

            // Afternoon slot
            await connection.query(
                `INSERT INTO slots (experience_id, start_time, end_time, capacity, available_spots)
                VALUES (?, 
                    DATE_ADD(CURDATE(), INTERVAL ? DAY) + INTERVAL 15 HOUR,
                    DATE_ADD(CURDATE(), INTERVAL ? DAY) + INTERVAL 19 HOUR,
                    20, 20)`,
                [expId, days, days]
            );
        }
    }
}

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    });

    try {
        // Create and use database
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await connection.query(`USE ${process.env.DB_NAME}`);

        // Create tables
        await connection.query(`
            DROP TABLE IF EXISTS bookings;
            DROP TABLE IF EXISTS slots;
            DROP TABLE IF EXISTS experiences;
            DROP TABLE IF EXISTS promo_codes;

            CREATE TABLE experiences (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                location VARCHAR(255) NOT NULL,
                duration INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;

            CREATE TABLE slots (
                id INT AUTO_INCREMENT PRIMARY KEY,
                experience_id INT NOT NULL,
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP NOT NULL,
                capacity INT NOT NULL,
                available_spots INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (experience_id)
                    REFERENCES experiences(id)
                    ON DELETE CASCADE
            ) ENGINE=InnoDB;

            CREATE TABLE promo_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                discount_amount DECIMAL(10, 2) NOT NULL,
                max_uses INT NOT NULL,
                times_used INT DEFAULT 0,
                valid_from TIMESTAMP NOT NULL,
                valid_until TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;

            CREATE TABLE bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                slot_id INT NOT NULL,
                customer_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255) NOT NULL,
                promo_code_id INT,
                number_of_people INT NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                discount_amount DECIMAL(10, 2) DEFAULT 0,
                final_price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (slot_id)
                    REFERENCES slots(id),
                FOREIGN KEY (promo_code_id)
                    REFERENCES promo_codes(id)
                    ON DELETE SET NULL
            ) ENGINE=InnoDB;
        `);

        // Insert sample experiences
        await connection.query(`
            INSERT INTO experiences (title, description, image_url, price, location, duration) VALUES
            ('Mountain Hiking Adventure', 'Experience the thrill of hiking through scenic mountain trails with experienced guides.', 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3', 75.00, 'Rocky Mountains', 240),
            ('City Food Tour', 'Explore local cuisine and culture through this guided food tour of the city\\'s best spots.', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3', 60.00, 'Downtown', 180),
            ('Sunset Kayaking', 'Paddle through calm waters while watching the beautiful sunset.', 'https://images.unsplash.com/photo-1603503363848-6936997c5546?ixlib=rb-4.0.3', 45.00, 'Lake District', 120);
        `);

        // Insert sample slots
        await insertSampleSlots(connection);

        // Insert sample promo codes
        await connection.query(`
            INSERT INTO promo_codes (code, discount_amount, max_uses, times_used, valid_from, valid_until) VALUES
            ('WELCOME10', 10.00, 100, 0, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
            ('SUMMER25', 25.00, 50, 0, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY));
        `);

        console.log('Database migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

migrate();