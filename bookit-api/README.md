# BookIt Backend API

This backend API is now using MySQL for the database.

## Setup Steps

1. Install MySQL if you haven't already

2. Create a copy of `.env.example` as `.env`:
   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your MySQL credentials:
   ```
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=bookit
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Run the migration to create database and tables:
   ```bash
   npm run migrate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /experiences` - List all experiences
- `GET /experiences/:id` - Get experience details with available slots
- `POST /bookings` - Create a new booking
- `POST /promo/validate` - Validate a promo code

## Database Schema

```sql
experiences:
  - id (INT, AUTO_INCREMENT)
  - title (VARCHAR)
  - description (TEXT)
  - image_url (TEXT)
  - price (DECIMAL)
  - location (VARCHAR)
  - duration (INT)
  - created_at (TIMESTAMP)

slots:
  - id (INT, AUTO_INCREMENT)
  - experience_id (INT, FK)
  - start_time (TIMESTAMP)
  - end_time (TIMESTAMP)
  - capacity (INT)
  - available_spots (INT)
  - created_at (TIMESTAMP)

promo_codes:
  - id (INT, AUTO_INCREMENT)
  - code (VARCHAR)
  - discount_amount (DECIMAL)
  - max_uses (INT)
  - times_used (INT)
  - valid_from (TIMESTAMP)
  - valid_until (TIMESTAMP)
  - created_at (TIMESTAMP)

bookings:
  - id (INT, AUTO_INCREMENT)
  - slot_id (INT, FK)
  - customer_name (VARCHAR)
  - customer_email (VARCHAR)
  - promo_code_id (INT, FK)
  - number_of_people (INT)
  - total_price (DECIMAL)
  - discount_amount (DECIMAL)
  - final_price (DECIMAL)
  - created_at (TIMESTAMP)
```