import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import Inquiry from '../models/Inquiry.js';
import { productsData, persistProductsData } from '../data/productsData.js';
import { inMemoryInquiries, persistInquiries, getInquiriesList } from './inquiryRoutes.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');
const frontendPublicRoot = path.resolve(backendRoot, '..', 'frontend', 'public');

const dynamicBrandConfigFile = path.join(backendRoot, 'data', 'dynamicBrandConfig.json');

// Global mutable store for brand config & announcements
export let globalBrandConfig = {
  brandName: 'M.S Fashion',
  tagline: 'The Art of Bespoke Ethnic Menswear',
  whatsappPhone: process.env.WHATSAPP_PHONE || '918999386222',
  displayPhone: '+91 89993 86222',
  email: process.env.SMTP_EMAIL || 'msfashionbespoke@gmail.com',
  smtpEmail: process.env.SMTP_EMAIL || 'msfashionbespoke@gmail.com',
  smtpPassword: process.env.SMTP_PASSWORD || 'mcas gpvn oupu ztfb',
  boutiqueAddress: 'Ground Floor, 10/A, Sanaullah Compound, Near Sauda Bakery, Dharavi Main Road, Mahim (East), Mumbai - 400017, Maharashtra',
  visitingHours: 'Mon - Sat: 1:00 PM - 7:00 PM',
  googleMapsUrl: 'https://maps.app.goo.gl/bK6BAQTHtguhqWo19',
  tickerMessages: [
    '👑 ATELIER TIMINGS: MON - SAT (1:00 PM - 7:00 PM) • VISIT FOR BESPOKE MEASUREMENTS',
    '✨ M.S FASHION — MASTER CRAFTSMEN OF ROYAL SHERWANIS, JODHPURIS & BESPOKE BLAZERS',
    '📦 BULK & BRAND CONTRACT MANUFACTURING AVAILABLE — EXPLORE BULK ORDERS'
  ]
};

// Load persisted brand config if available
try {
  if (fs.existsSync(dynamicBrandConfigFile)) {
    const raw = fs.readFileSync(dynamicBrandConfigFile, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      Object.assign(globalBrandConfig, parsed);
      if (parsed.smtpEmail) process.env.SMTP_EMAIL = parsed.smtpEmail;
      if (parsed.smtpPassword) process.env.SMTP_PASSWORD = parsed.smtpPassword;
    }
  }
} catch (e) {
  console.warn('[Dynamic Brand Config Notice]', e.message);
}

export const persistBrandConfig = () => {
  try {
    fs.writeFileSync(dynamicBrandConfigFile, JSON.stringify(globalBrandConfig, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Dynamic Brand Config Save Error]', e.message);
  }
};


// Simple secure token verification helper
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'msfashion2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Admin authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== 'ms_admin_auth_token_secret_2026') {
    return res.status(403).json({ success: false, message: 'Invalid or expired admin session' });
  }
  next();
};

// ==================== MULTER STORAGE CONFIG (LAPTOP UPLOADS) ====================
const tempUploadDir = path.join(backendRoot, 'uploads', 'temp');
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const timestamp = Date.now();
    cb(null, `upload-${timestamp}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|avif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (.jpg, .jpeg, .png, .webp, .avif) are allowed.'));
  }
});

// ==================== 1. ADMIN AUTHENTICATION ====================
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: 'ms_admin_auth_token_secret_2026',
      admin: {
        username: username,
        role: 'Master Atelier Admin',
        name: 'M.S Fashion Master Stylist'
      }
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin username or password/PIN.' });
});

// ==================== 2. FILE UPLOAD FROM LAPTOP ====================
router.post('/upload-file', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const category = req.body.category || 'Sherwani';
    const safeCategory = category.replace(/[^a-zA-Z0-9-_]/g, '');
    const productId = req.body.productId ? req.body.productId.toLowerCase().replace(/[^a-z0-9-_]/g, '') : 'garment';
    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const filename = `${productId}-${Date.now()}${ext}`;

    const destDir = path.join(backendRoot, 'uploads', 'references', safeCategory);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const targetBackendPath = path.join(destDir, filename);
    fs.renameSync(req.file.path, targetBackendPath);

    // Mirror copy to frontend public directory so Vite dev server reflects it instantly
    const frontendDir = path.join(frontendPublicRoot, 'uploads', 'references', safeCategory);
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    const frontendTarget = path.join(frontendDir, filename);
    fs.copyFileSync(targetBackendPath, frontendTarget);

    const relativeUrl = `/uploads/references/${safeCategory}/${filename}`;

    res.json({
      success: true,
      message: 'Photo uploaded successfully from laptop media.',
      imageUrl: relativeUrl,
      fileName: filename,
      folderPath: `uploads/references/${safeCategory}`
    });
  } catch (error) {
    console.error('File Upload Error:', error);
    res.status(500).json({ success: false, message: error.message || 'File upload failed.' });
  }
});

// ==================== 3. WEB IMAGE URL FETCH & SAVE ====================
router.post('/upload-url', authMiddleware, async (req, res) => {
  try {
    const { imageUrl, category = 'Sherwani', productId = 'garment' } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL is required.' });
    }

    const safeCategory = category.replace(/[^a-zA-Z0-9-_]/g, '');
    const uploadDir = path.join(backendRoot, 'uploads', 'references', safeCategory);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(new URL(imageUrl, 'http://dummy.com').pathname) || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext.toLowerCase()) ? ext.toLowerCase() : '.jpg';
    const filename = `${productId.toLowerCase().replace(/[^a-z0-9-_]/g, '')}-url-${Date.now()}${safeExt}`;
    const targetPath = path.join(uploadDir, filename);

    // Try downloading image
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(targetPath, buffer);

      // Mirror to frontend
      const frontendDir = path.join(frontendPublicRoot, 'uploads', 'references', safeCategory);
      if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });
      fs.writeFileSync(path.join(frontendDir, filename), buffer);

      return res.json({
        success: true,
        message: 'Web image downloaded and saved successfully.',
        imageUrl: `/uploads/references/${safeCategory}/${filename}`,
        fileName: filename,
        folderPath: `uploads/references/${safeCategory}`
      });
    } catch (fetchErr) {
      // If fetching binary failed, fallback to direct URL
      console.warn('[Web Fetch Fallback]', fetchErr.message);
      return res.json({
        success: true,
        message: 'Using external web image link directly.',
        imageUrl: imageUrl,
        fileName: '',
        folderPath: `uploads/references/${safeCategory}`
      });
    }
  } catch (error) {
    console.error('URL Upload Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to process web image.' });
  }
});

// ==================== 4. PRODUCT CRUD & ACCESSORIES ====================

// Helper to normalize category to uniform prefix
export const getCategoryPrefix = (category = '') => {
  const norm = (category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (norm.includes('sherwani')) return 'sherwani';
  if (norm.includes('jodhpuri')) return 'jodhpuri';
  if (norm.includes('indo')) return 'indo';
  if (norm.includes('blazer') || norm.includes('coat')) return 'blazer';
  return norm || 'item';
};

// Sequential Reference ID generator strictly scoped by primary category (ignoring subcategories)
export const getNextRefForCategory = (category, catalog = productsData) => {
  if (!category) return { refNumber: 1, id: 'item-01', prefix: 'item' };
  const prefix = getCategoryPrefix(category);

  // Filter all items belonging to this primary category
  const categoryItems = (catalog || []).filter(p => {
    if (!p || !p.category) return false;
    return getCategoryPrefix(p.category) === prefix;
  });

  let maxRef = 0;
  categoryItems.forEach(p => {
    if (typeof p.refNumber === 'number' && p.refNumber > 0 && p.refNumber < 100000) {
      if (p.refNumber > maxRef) maxRef = p.refNumber;
    } else if (p.id) {
      // Extract numeric suffix from id (e.g. sherwani-05 -> 5)
      const parts = String(p.id).split('-');
      const last = parts[parts.length - 1];
      const parsed = parseInt(last, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed < 100000) {
        if (parsed > maxRef) maxRef = parsed;
      }
    }
  });

  const nextRefNumber = maxRef + 1;
  const nextId = `${prefix}-${String(nextRefNumber).padStart(2, '0')}`;
  return { refNumber: nextRefNumber, id: nextId, prefix };
};

// GET /api/admin/products - Get all products with full admin details
router.get('/products', authMiddleware, async (req, res) => {
  try {
    let items = [];
    if (getDbStatus()) {
      items = await Product.find().lean();
      if (items.length === 0) items = productsData;
    } else {
      items = productsData;
    }

    // Sort items sequentially per category
    const sortOrder = ['sherwani', 'jodhpuri', 'indo', 'blazer'];
    const sorted = [...items].sort((a, b) => {
      const catA = getCategoryPrefix(a.category || '');
      const catB = getCategoryPrefix(b.category || '');
      if (catA !== catB) {
        const idxA = sortOrder.indexOf(catA);
        const idxB = sortOrder.indexOf(catB);
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      }
      const numA = a.refNumber || parseInt(String(a.id || '').split('-').pop(), 10) || 0;
      const numB = b.refNumber || parseInt(String(b.id || '').split('-').pop(), 10) || 0;
      return numA - numB;
    });

    res.json({
      success: true,
      count: sorted.length,
      data: sorted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/next-ref - Query next reference number for category
router.get('/next-ref', authMiddleware, (req, res) => {
  try {
    const { category } = req.query;
    const nextInfo = getNextRefForCategory(category || 'Sherwani', productsData);
    res.json({
      success: true,
      data: nextInfo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/products - Create a new garment
router.post('/products', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      category,
      subCategory,
      basePrice,
      tagline,
      description,
      fabric,
      embroidery,
      fit,
      leadTime,
      realImageUrl,
      imageFileName,
      accessories
    } = req.body;

    if (!title || !category || !basePrice) {
      return res.status(400).json({ success: false, message: 'Title, Category, and Base Price are required.' });
    }

    // Calculate sequential category reference ID (previous no + 1)
    const { refNumber, id } = getNextRefForCategory(category, productsData);
    const folderPath = `uploads/references/${category}`;

    const newProductData = {
      id,
      refNumber,
      title,
      category,
      subCategory: subCategory || category,
      folderPath,
      placeholderLabel: `[${category} - ${title}]`,
      imageFileName: imageFileName || '',
      realImageUrl: realImageUrl || null,
      hasRealImage: Boolean(realImageUrl),
      basePrice: Number(basePrice),
      tagline: tagline || '',
      description: description || '',
      fabric: fabric || 'Pure Silk & Handloom Brocade',
      embroidery: embroidery || 'Handcrafted Zardozi & Resham',
      fit: fit || 'Bespoke Tailored Fit',
      leadTime: leadTime || '15 - 20 Working Days',
      accessories: Array.isArray(accessories) ? accessories : []
    };

    // Save to DB if connected
    if (getDbStatus()) {
      const p = new Product(newProductData);
      await p.save();
    }

    // Append to in-memory catalog (push ensures chronological addition)
    productsData.push(newProductData);
    persistProductsData();

    res.status(201).json({
      success: true,
      message: 'New bespoke garment created successfully.',
      data: newProductData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/products/:id - Update garment & accessories
router.put('/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Sanitize numeric and boolean fields
    if (updateData.basePrice) updateData.basePrice = Number(updateData.basePrice);
    if (updateData.realImageUrl) {
      updateData.hasRealImage = true;
    } else if (updateData.realImageUrl === null || updateData.realImageUrl === '') {
      updateData.hasRealImage = false;
      updateData.realImageUrl = null;
      updateData.imageFileName = '';
    }

    // Update in MongoDB if available
    let updatedInDb = null;
    if (getDbStatus()) {
      updatedInDb = await Product.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true }).lean();
    }

    // Update in static in-memory catalog
    const index = productsData.findIndex(p => p.id === id);
    if (index !== -1) {
      productsData[index] = {
        ...productsData[index],
        ...updateData
      };
    } else if (updatedInDb) {
      productsData.push(updatedInDb);
    }

    persistProductsData();

    const finalProduct = productsData[index] || updatedInDb;

    if (!finalProduct) {
      return res.status(404).json({ success: false, message: 'Garment not found.' });
    }

    res.json({
      success: true,
      message: 'Garment and customization options updated successfully.',
      data: finalProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/products/:id - Remove garment
router.delete('/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      await Product.findOneAndDelete({ id });
    }

    const index = productsData.findIndex(p => p.id === id);
    if (index !== -1) {
      productsData.splice(index, 1);
    }

    persistProductsData();

    res.json({
      success: true,
      message: 'Garment removed from catalog.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 5. INQUIRIES & LEADS CRM ====================

// GET /api/admin/inquiries
router.get('/inquiries', authMiddleware, async (req, res) => {
  try {
    let list = [];
    if (getDbStatus()) {
      list = await Inquiry.find().sort({ createdAt: -1 }).lean();
    }
    const memoryList = getInquiriesList();
    if (list.length === 0 || memoryList.length > list.length) {
      list = memoryList;
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/inquiries/:id/status
router.patch('/inquiries/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    if (getDbStatus() && id.length === 24) {
      await Inquiry.findByIdAndUpdate(id, { status });
    }

    const inq = inMemoryInquiries.find(i => (i._id && i._id.toString() === id) || i.id === id);
    if (inq) {
      inq.status = status;
      persistInquiries();
    }

    res.json({
      success: true,
      message: `Inquiry status updated to ${status}.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/inquiries/:id
router.delete('/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus() && id.length === 24) {
      await Inquiry.findByIdAndDelete(id);
    }

    const index = inMemoryInquiries.findIndex(i => (i._id && i._id.toString() === id) || i.id === id);
    if (index !== -1) {
      inMemoryInquiries.splice(index, 1);
      persistInquiries();
    }

    res.json({
      success: true,
      message: 'Inquiry archived/deleted.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 6. DASHBOARD STATS ====================
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const products = productsData;
    let inquiries = getInquiriesList();
    if (getDbStatus()) {
      const dbInqs = await Inquiry.find().lean();
      if (dbInqs.length > 0) inquiries = dbInqs;
    }

    const totalProducts = products.length;
    const realPhotosCount = products.filter(p => p.hasRealImage || p.realImageUrl).length;
    const pendingPlaceholders = totalProducts - realPhotosCount;

    const categoryBreakdown = {
      Sherwani: products.filter(p => p.category === 'Sherwani').length,
      Jodhpuri: products.filter(p => p.category === 'Jodhpuri').length,
      'Indo-Western': products.filter(p => p.category === 'Indo-Western').length,
      Blazer: products.filter(p => p.category === 'Blazer').length
    };

    const newInquiries = inquiries.filter(i => i.status === 'pending' || i.status === 'new').length;
    const contactedInquiries = inquiries.filter(i => i.status === 'contacted' || i.status === 'scheduled').length;
    const completedOrders = inquiries.filter(i => i.status === 'completed').length;

    const pipelineTotal = inquiries.reduce((sum, i) => sum + (Number(i.estimatedTotal) || 0), 0);

    res.json({
      success: true,
      data: {
        totalProducts,
        realPhotosCount,
        pendingPlaceholders,
        categoryBreakdown,
        totalInquiries: inquiries.length,
        newInquiries,
        contactedInquiries,
        completedOrders,
        pipelineTotal
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 8. HERO BANNERS & SLIDER MANAGER ====================
const dynamicBannersFile = path.join(backendRoot, 'data', 'dynamicBanners.json');

export let globalBanners = [
  {
    id: 'banner-sherwani',
    title: 'The Sovereignty Of',
    highlight: 'Sherwani',
    description: 'Regal silhouettes, exquisite detailing and master craftsmanship. Each sherwani is individually tailored to create a distinguished look for your most memorable celebrations.',
    primaryText: 'Explore Sherwanis',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring',
    image: '/banners/sherwani-banner.png'
  },
  {
    id: 'banner-jodhpuri',
    title: 'The Power Of',
    highlight: 'Jodhpuri',
    description: 'Regal silhouettes, refined detailing and impeccable craftsmanship, tailored for unforgettable celebrations.',
    primaryText: 'Explore Jodhpuri',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring',
    image: '/banners/jodhpuri-banner.png'
  },
  {
    id: 'banner-indo',
    title: 'The Legacy Of',
    highlight: 'Indo-Western',
    description: 'A contemporary interpretation of Indian occasionwear, blending timeless craftsmanship with modern silhouettes.',
    primaryText: 'Explore Indo-Western',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring',
    image: '/banners/indo-banner.png'
  },
  {
    id: 'banner-blazer',
    title: 'The Royality Of',
    highlight: 'Formalwear',
    description: 'Sharp silhouettes, luxurious fabrics and precision tailoring designed for the modern gentleman.',
    primaryText: 'Explore Blazers',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring',
    image: '/banners/blazer-banner.png'
  }
];

// Load persisted banners if available
try {
  if (fs.existsSync(dynamicBannersFile)) {
    const raw = fs.readFileSync(dynamicBannersFile, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalBanners = parsed;
    }
  }
} catch (e) {
  console.warn('[Dynamic Banners Notice]', e.message);
}

const persistBanners = () => {
  try {
    fs.writeFileSync(dynamicBannersFile, JSON.stringify(globalBanners, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Dynamic Banners Save Error]', e.message);
  }
};

router.get('/banners', (req, res) => {
  res.json({
    success: true,
    data: globalBanners
  });
});

router.put('/banners', authMiddleware, (req, res) => {
  try {
    const { banners } = req.body;
    if (Array.isArray(banners) && banners.length > 0) {
      globalBanners = banners;
      persistBanners();
      return res.json({
        success: true,
        message: 'Hero banners updated and published live.',
        data: globalBanners
      });
    }
    res.status(400).json({ success: false, message: 'Invalid banners array.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== 9. BRAND CONFIGURATION & STORE SETTINGS ====================
router.get('/brand-config', (req, res) => {
  res.json({
    success: true,
    data: globalBrandConfig
  });
});

router.put('/brand-config', authMiddleware, (req, res) => {
  try {
    const {
      brandName,
      tagline,
      tickerMessages,
      visitingHours,
      displayPhone,
      whatsappPhone,
      email,
      boutiqueAddress,
      googleMapsUrl,
      smtpEmail,
      smtpPassword
    } = req.body;

    if (brandName) globalBrandConfig.brandName = brandName;
    if (tagline) globalBrandConfig.tagline = tagline;
    if (Array.isArray(tickerMessages)) globalBrandConfig.tickerMessages = tickerMessages;
    if (visitingHours) globalBrandConfig.visitingHours = visitingHours;
    if (displayPhone) globalBrandConfig.displayPhone = displayPhone;
    if (whatsappPhone) globalBrandConfig.whatsappPhone = whatsappPhone;
    if (email) globalBrandConfig.email = email.trim();
    if (boutiqueAddress) globalBrandConfig.boutiqueAddress = boutiqueAddress;
    if (googleMapsUrl) globalBrandConfig.googleMapsUrl = googleMapsUrl;

    if (smtpEmail !== undefined) {
      globalBrandConfig.smtpEmail = smtpEmail.trim();
      process.env.SMTP_EMAIL = smtpEmail.trim();
    }
    if (smtpPassword !== undefined) {
      globalBrandConfig.smtpPassword = smtpPassword.trim();
      process.env.SMTP_PASSWORD = smtpPassword.replace(/\s+/g, '');
    }

    persistBrandConfig();

    console.log('[Admin] Store settings and email updated successfully. Email:', globalBrandConfig.email);

    res.json({
      success: true,
      message: 'Store settings and email updated successfully.',
      data: globalBrandConfig
    });
  } catch (err) {
    console.error('[Admin Brand Config Update Error]', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Test Email Verification Endpoint
router.post('/test-email', authMiddleware, async (req, res) => {
  try {
    const { testEmail } = req.body;
    const target = testEmail || globalBrandConfig.smtpEmail || globalBrandConfig.email;
    if (!target) {
      return res.status(400).json({ success: false, message: 'Recipient email is required for test.' });
    }

    const { sendOtpEmail } = await import('../services/mailer.js');
    const result = await sendOtpEmail(target, 'M.S Fashion Master Admin', Math.floor(100000 + Math.random() * 900000).toString());

    res.json({
      success: true,
      message: result.mode === 'live'
        ? `Live verification email sent successfully to ${target} via Gmail SMTP!`
        : `Email dispatched in ${result.mode} mode. (${result.message})`,
      details: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: `Failed to send test email: ${err.message}` });
  }
});

export default router;
