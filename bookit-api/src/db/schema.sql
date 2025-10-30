-- Drop existing tables if they exist
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS slots;
DROP TABLE IF EXISTS experiences;
DROP TABLE IF EXISTS promo_codes;

-- Create experiences table
CREATE TABLE experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    duration INT NOT NULL, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create slots table
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

-- Create promo_codes table
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

-- Create bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    number_of_people INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    promo_code_id INT,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (slot_id)
        REFERENCES slots(id),
    FOREIGN KEY (promo_code_id)
        REFERENCES promo_codes(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- Insert sample data for experiences
INSERT INTO experiences (title, description, image_url, price, location, duration) VALUES
('Mountain Hiking Adventure', 'Experience the thrill of hiking through scenic mountain trails with experienced guides.', 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3', 75.00, 'Rocky Mountains', 240),
('City Food Tour', 'Explore local cuisine and culture through this guided food tour of the city\'s best spots.', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3', 60.00, 'Downtown', 180),
('Sunset Kayaking', 'Paddle through calm waters while watching the beautiful sunset.', 'https://images.unsplash.com/photo-1603503363848-6936997c5546?ixlib=rb-4.0.3', 45.00, 'Lake District', 120);

-- Create a procedure to insert sample slots
DELIMITER //
CREATE PROCEDURE InsertSampleSlots()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE exp_id INT;
    DECLARE cur_date DATE;
    
    SET cur_date = CURDATE();
    
    -- Get each experience
    SELECT id INTO exp_id FROM experiences WHERE id = 1;
    WHILE i <= 7 DO
        -- Morning slot
        INSERT INTO slots (experience_id, start_time, end_time, capacity, available_spots)
        VALUES (
            exp_id,
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '10:00:00'),
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '14:00:00'),
            20,
            20
        );
        
        -- Afternoon slot
        INSERT INTO slots (experience_id, start_time, end_time, capacity, available_spots)
        VALUES (
            exp_id,
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '15:00:00'),
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '19:00:00'),
            20,
            20
        );
        
        SET i = i + 1;
    END WHILE;
    
    -- Reset counter for next experience
    SET i = 1;
    SELECT id INTO exp_id FROM experiences WHERE id = 2;
    WHILE i <= 7 DO
        INSERT INTO slots (experience_id, start_time, end_time, capacity, available_spots)
        VALUES (
            exp_id,
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '10:00:00'),
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '14:00:00'),
            20,
            20
        ),
        (
            exp_id,
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '15:00:00'),
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '19:00:00'),
            20,
            20
        );
        SET i = i + 1;
    END WHILE;
    
    -- Reset counter for next experience
    SET i = 1;
    SELECT id INTO exp_id FROM experiences WHERE id = 3;
    WHILE i <= 7 DO
        INSERT INTO slots (experience_id, start_time, end_time, capacity, available_spots)
        VALUES (
            exp_id,
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '10:00:00'),
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '14:00:00'),
            20,
            20
        ),
        (
            exp_id,
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '15:00:00'),
            TIMESTAMP(DATE_ADD(cur_date, INTERVAL i DAY), '19:00:00'),
            20,
            20
        );
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

-- Call the procedure to insert slots
CALL InsertSampleSlots();

-- Drop the procedure as we don't need it anymore
DROP PROCEDURE IF EXISTS InsertSampleSlots;

-- Insert sample promo codes
INSERT INTO promo_codes (code, discount_amount, max_uses, times_used, valid_from, valid_until) VALUES
('WELCOME10', 10.00, 100, 0, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('SUMMER25', 25.00, 50, 0, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY));
