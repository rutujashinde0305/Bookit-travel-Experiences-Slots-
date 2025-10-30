import { Request, Response } from 'express';
import db from '../db';
import { Booking } from '../types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface SlotWithPrice extends RowDataPacket {
    id: number;
    available_spots: number;
    price: number;
}

interface PromoCode extends RowDataPacket {
    id: number;
    discount_amount: number;
}

interface BookingWithDetails extends RowDataPacket {
    id: number;
    slot_id: number;
    customer_name: string;
    customer_email: string;
    number_of_people: number;
    total_price: number;
    promo_code_id: number | null;
    discount_amount: number;
    final_price: number;
    start_time: string;
    end_time: string;
    capacity: number;
    available_spots: number;
    title: string;
    description: string;
    image_url: string;
    location: string;
    duration: number;
}

export function setupBookingRoutes(app: any) {
    // POST /bookings - Create a new booking
    app.post('/bookings', async (req: Request, res: Response) => {
        const connection = await db.getConnection();
        
        try {
            const {
                slotId,
                customerName,
                customerEmail,
                numberOfPeople,
                promoCodeId = null
            } = req.body;

            await connection.beginTransaction();

            // Check if slot exists and has enough spots
            const [slotRows] = await connection.query<SlotWithPrice[]>(
                `SELECT s.*, e.price 
                 FROM slots s 
                 JOIN experiences e ON s.experience_id = e.id 
                 WHERE s.id = ?
                 FOR UPDATE`,
                [slotId]
            );

            if (!slotRows || slotRows.length === 0) {
                throw new Error('Slot not found');
            }

            const slot = slotRows[0];
            if (slot.available_spots < numberOfPeople) {
                throw new Error('Not enough available spots');
            }

            const totalPrice = slot.price * numberOfPeople;
            let discountAmount = 0;

            // Calculate discount if promo code is provided
            if (promoCodeId) {
                const [promoRows] = await connection.query<PromoCode[]>(
                    `SELECT * FROM promo_codes 
                     WHERE id = ? AND times_used < max_uses 
                     AND NOW() BETWEEN valid_from AND valid_until 
                     FOR UPDATE`,
                    [promoCodeId]
                );

                if (promoRows && promoRows.length > 0) {
                    discountAmount = promoRows[0].discount_amount;
                    // Increment promo code usage
                    await connection.query(
                        'UPDATE promo_codes SET times_used = times_used + 1 WHERE id = ?',
                        [promoCodeId]
                    );
                }
            }

            const finalPrice = totalPrice - discountAmount;

            // Create booking
            const [result] = await connection.query<ResultSetHeader>(
                `INSERT INTO bookings (
                    slot_id, customer_name, customer_email, number_of_people,
                    total_price, promo_code_id, discount_amount, final_price
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [slotId, customerName, customerEmail, numberOfPeople, 
                 totalPrice, promoCodeId, discountAmount, finalPrice]
            );

            // Update slot availability
            await connection.query(
                'UPDATE slots SET available_spots = available_spots - ? WHERE id = ?',
                [numberOfPeople, slotId]
            );

            await connection.commit();

            // Get the created booking with all related information
            const [bookingRows] = await connection.query<BookingWithDetails[]>(
                `SELECT b.*, 
                        s.start_time, s.end_time, s.capacity, s.available_spots,
                        e.title, e.description, e.image_url, e.location, e.duration
                 FROM bookings b
                 JOIN slots s ON b.slot_id = s.id
                 JOIN experiences e ON s.experience_id = e.id
                 WHERE b.id = ?`,
                [result.insertId]
            );

            if (!bookingRows || bookingRows.length === 0) {
                throw new Error('Booking created but not found');
            }

            res.status(201).json(bookingRows[0]);
        } catch (error: any) {
            await connection.rollback();
            console.error('Error creating booking:', error);
            res.status(400).json({ error: error.message || 'Failed to create booking' });
        } finally {
            connection.release();
        }
    });

    // GET /bookings/:id
    app.get('/bookings/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const [bookingRows] = await db.query<BookingWithDetails[]>(
                `SELECT b.*, 
                        s.start_time, s.end_time, s.capacity, s.available_spots,
                        e.title, e.description, e.image_url, e.location, e.duration
                 FROM bookings b
                 JOIN slots s ON b.slot_id = s.id
                 JOIN experiences e ON s.experience_id = e.id
                 WHERE b.id = ?`,
                [id]
            );

            if (!bookingRows || bookingRows.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            res.json(bookingRows[0]);
        } catch (error) {
            console.error('Error fetching booking:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}