"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const booking_1 = require("./routes/booking");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// GET /experiences
app.get('/experiences', async (req, res) => {
    try {
        const [rows] = await db_1.default.query('SELECT * FROM experiences ORDER BY created_at DESC');
        res.json(rows);
    }
    catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /experiences/:id
app.get('/experiences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Get experience details
        const [experienceRows] = await db_1.default.query('SELECT * FROM experiences WHERE id = ?', [id]);
        if (!experienceRows || experienceRows.length === 0) {
            return res.status(404).json({ error: 'Experience not found' });
        }
        // Get upcoming slots for this experience
        const [slotsRows] = await db_1.default.query(`SELECT * FROM slots 
             WHERE experience_id = ? 
             AND start_time > NOW()
             ORDER BY start_time ASC`, [id]);
        res.json({
            ...experienceRows[0],
            slots: slotsRows
        });
    }
    catch (error) {
        console.error('Error fetching experience details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /slots/:id
app.get('/slots/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db_1.default.query(`SELECT s.*, e.price, e.title, e.image_url, e.location, e.duration
             FROM slots s
             JOIN experiences e ON s.experience_id = e.id
             WHERE s.id = ?`, [id]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Slot not found' });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error('Error fetching slot:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Setup booking routes
(0, booking_1.setupBookingRoutes)(app);
// POST /promo/validate
app.post('/promo/validate', async (req, res) => {
    try {
        const { code } = req.body;
        const [rows] = await db_1.default.query(`SELECT * FROM promo_codes 
             WHERE code = ? 
             AND times_used < max_uses 
             AND NOW() BETWEEN valid_from AND valid_until`, [code]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Invalid or expired promo code' });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error('Error validating promo code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
