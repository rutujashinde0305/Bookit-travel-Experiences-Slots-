import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Experience extends RowDataPacket {
    id: number;
    title: string;
    description: string;
    image_url: string;
    price: number;
    location: string;
    duration: number;
    created_at: Date;
}

export interface Slot extends RowDataPacket {
    id: number;
    experience_id: number;
    start_time: Date;
    end_time: Date;
    capacity: number;
    available_spots: number;
    created_at: Date;
    price?: number; // Added when joining with experiences
}

export interface PromoCode extends RowDataPacket {
    id: number;
    code: string;
    discount_amount: number;
    max_uses: number;
    times_used: number;
    valid_from: Date;
    valid_until: Date;
    created_at: Date;
}

export interface Booking extends RowDataPacket {
    id: number;
    slot_id: number;
    customer_name: string;
    customer_email: string;
    promo_code_id: number | null;
    number_of_people: number;
    total_price: number;
    discount_amount: number;
    final_price: number;
    created_at: Date;
}