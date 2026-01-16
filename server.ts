
import express from 'express';
import { Pool } from 'pg';
import Stripe from 'stripe';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Stripe Setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27' as any,
});

// --- API ROUTES ---

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'VeloGO Systems Operational', timestamp: new Date() });
});

// 1. Hub Status (Admin & Drivers)
app.get('/api/hubs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hubs ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Create Trip (Stripe Payment Intent)
app.post('/api/trips/book', async (req, res) => {
  const { userId, fare, pickup, dropoff } = req.body;
  try {
    // Create Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(fare * 100), // convert to cents
      currency: 'usd',
      metadata: { userId, pickup, dropoff }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      tripId: 'temp_uuid' // In reality, save trip as PENDING first
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 3. Safety Alert Logging
app.post('/api/safety/alert', async (req, res) => {
  const { userId, tripId, issue, type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO safety_alerts (user_id, trip_id, description, issue_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, tripId, issue, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log safety alert' });
  }
});

// 4. Stripe Webhook (Handle successful payments)
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log('PaymentSucceeded:', paymentIntent.id);
    // Update Trip Status in PostgreSQL to 'ACCEPTED'
  }

  res.json({ received: true });
});

app.listen(port, () => {
  console.log(`VeloGO Server running on port ${port}`);
});
