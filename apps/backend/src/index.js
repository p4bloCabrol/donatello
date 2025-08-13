import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

import authRoutes from './routes/auth.js';


import listingsRoutes from './routes/listings.js';
import usersRoutes from './routes/users.js';
import donationsRoutes from './routes/donations.js';

dotenv.config();

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const { Pool } = pkg;
const db = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

const app = express();
app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Donatello API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/auth', authRoutes);
app.use('/listings', listingsRoutes);
app.use('/users', usersRoutes);
app.use('/donations', donationsRoutes);

app.get('/', (req, res) => {
  res.send('Donatello backend running');
});

// Test DB connection endpoint
app.get('/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
