import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDbStatus } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import adminRoutes, { globalBrandConfig, globalBanners } from './routes/adminRoutes.js';
import Product from './models/Product.js';
import { productsData } from './data/productsData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded reference photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'M.S Fashion - Bespoke Ethnic Menswear',
    timestamp: new Date().toISOString(),
    databaseConnected: getDbStatus()
  });
});

// Brand configuration endpoint
app.get('/api/brand-config', (req, res) => {
  res.json(globalBrandConfig);
});

// Public Banners endpoint
app.get('/api/banners', (req, res) => {
  res.json({ success: true, data: globalBanners });
});

// API Routes
app.use('/api', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);

// Seed database helper if MongoDB is connected
const seedDatabaseIfEmpty = async () => {
  if (!getDbStatus()) return;
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Seed] Seeding initial bespoke catalog into MongoDB...');
      await Product.insertMany(productsData);
      console.log(`[Seed] Seeded ${productsData.length} bespoke garments successfully.`);
    }
  } catch (err) {
    console.error('[Seed Error]', err.message);
  }
};

// Start Server
const startServer = async () => {
  await connectDB();
  await seedDatabaseIfEmpty();

  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`👑 M.S FASHION BESPOKE BACKEND SERVER RUNNING`);
    console.log(`📍 Port: http://localhost:${PORT}`);
    console.log(`🌐 API Endpoints: http://localhost:${PORT}/api/products`);
    console.log(`📂 Static Uploads: http://localhost:${PORT}/uploads/references/`);
    console.log(`===================================================`);
  });
};

startServer();
