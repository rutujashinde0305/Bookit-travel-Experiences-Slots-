import express, { Request, Response } from 'express';
import cors from 'cors';
import db from './db';
import { Experience, Slot, PromoCode } from './types';
import { ResultSetHeader } from 'mysql2';
import { setupBookingRoutes } from './routes/booking';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /experiences
app.get('/experiences', async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<Experience[]>('SELECT * FROM experiences ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /experiences/:id
app.get('/experiences/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Get experience details
        const [experienceRows] = await db.query<Experience[]>(
            'SELECT * FROM experiences WHERE id = ?',
            [id]
        );
        
        if (!experienceRows || experienceRows.length === 0) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        // Get upcoming slots for this experience
        const [slotsRows] = await db.query<Slot[]>(
            `SELECT * FROM slots 
             WHERE experience_id = ? 
             AND start_time > NOW()
             ORDER BY start_time ASC`,
            [id]
        );

        res.json({
            ...experienceRows[0],
            slots: slotsRows
        });
    } catch (error) {
        console.error('Error fetching experience details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /slots/:id
app.get('/slots/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query<Slot[]>(
            `SELECT s.*, e.price, e.title, e.image_url, e.location, e.duration
             FROM slots s
             JOIN experiences e ON s.experience_id = e.id
             WHERE s.id = ?`,
            [id]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching slot:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Setup booking routes
setupBookingRoutes(app);

interface PromoValidateRequest {
    code: string;
}

// POST /promo/validate
app.post('/promo/validate', async (req: Request<{}, {}, PromoValidateRequest>, res: Response) => {
    try {
        const { code } = req.body;
        
        const [rows] = await db.query<PromoCode[]>(
            `SELECT * FROM promo_codes 
             WHERE code = ? 
             AND times_used < max_uses 
             AND NOW() BETWEEN valid_from AND valid_until`,
            [code]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Invalid or expired promo code' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error validating promo code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});