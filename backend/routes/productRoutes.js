import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import { categoriesData, productsData } from '../data/productsData.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dynamicCatalogFile = path.join(rootDir, 'data', 'dynamicCatalog.json');

// Helper to check if the specific product's image exists
const resolveProductImage = (product) => {
  try {
    if (product.realImageUrl && typeof product.realImageUrl === 'string' && product.realImageUrl.trim() !== '') {
      return {
        ...product,
        hasRealImage: true,
        realImageUrl: product.realImageUrl
      };
    }
    if (product.imageFileName && typeof product.imageFileName === 'string' && product.imageFileName.trim() !== '') {
      const candidatePaths = [
        path.join(rootDir, product.folderPath || '', product.imageFileName),
        path.join(rootDir, 'uploads', 'references', product.category || '', product.imageFileName)
      ];
      for (const cp of candidatePaths) {
        if (fs.existsSync(cp)) {
          const rel = cp.includes('uploads')
            ? '/' + cp.slice(cp.indexOf('uploads')).replace(/\\/g, '/')
            : `/uploads/references/${product.category}/${product.imageFileName}`;
          return {
            ...product,
            hasRealImage: true,
            realImageUrl: rel
          };
        }
      }
    }
  } catch (err) {
    // Ignore fs errors, fallback to placeholder
  }
  return {
    ...product,
    hasRealImage: false,
    realImageUrl: null
  };
};

// GET /api/categories - list 4 primary categories with 1st product representative image
router.get('/categories', (req, res) => {
  let catalog = productsData;
  if (fs.existsSync(dynamicCatalogFile)) {
    try {
      const raw = fs.readFileSync(dynamicCatalogFile, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        catalog = parsed;
      }
    } catch (e) {}
  }

  const enrichedCategories = categoriesData.map((cat) => {
    const catProds = catalog.filter((p) => p.category && p.category.toLowerCase() === cat.name.toLowerCase());
    const firstWithImg = catProds.find((p) => p.realImageUrl && p.realImageUrl.trim() !== '') || catProds[0];
    const resolved = firstWithImg ? resolveProductImage(firstWithImg) : null;
    const finalImg = resolved?.realImageUrl || cat.realImageUrl || null;

    return {
      ...cat,
      realImageUrl: finalImg,
      hasRealImage: !!finalImg
    };
  });

  res.json({
    success: true,
    count: enrichedCategories.length,
    data: enrichedCategories
  });
});

const getActiveCatalog = () => {
  if (fs.existsSync(dynamicCatalogFile)) {
    try {
      const raw = fs.readFileSync(dynamicCatalogFile, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {}
  }
  return productsData;
};

// GET /api/categories/:categoryId - get single category
router.get('/categories/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId.toLowerCase();
  const category = categoriesData.find(c => c.id.toLowerCase() === categoryId || c.name.toLowerCase() === categoryId);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  // Get matching products from active dynamic catalog
  const catalog = getActiveCatalog();
  let categoryProducts = catalog.filter(p => p.category && p.category.toLowerCase() === category.name.toLowerCase());
  categoryProducts = categoryProducts.map(resolveProductImage);

  // Sort category products strictly in ascending sequential ref order (1, 2, 3...)
  categoryProducts.sort((a, b) => {
    const numA = a.refNumber || parseInt(String(a.id || '').split('-').pop(), 10) || 0;
    const numB = b.refNumber || parseInt(String(b.id || '').split('-').pop(), 10) || 0;
    return numA - numB;
  });

  res.json({
    success: true,
    data: {
      category,
      products: categoryProducts
    }
  });
});

// GET /api/products - list all products with optional filters
router.get('/products', async (req, res) => {
  try {
    const { category, subCategory, search } = req.query;
    let results = [];

    if (getDbStatus()) {
      const query = {};
      if (category) {
        query.category = new RegExp(`^${category}$`, 'i');
      }
      if (subCategory && subCategory !== 'all') {
        const escaped = subCategory.replace(/[-_ ]/g, '[-_ ]?');
        query.subCategory = new RegExp(`^${escaped}$`, 'i');
      }
      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { fabric: new RegExp(search, 'i') }
        ];
      }
      const dbProducts = await Product.find(query).lean();
      if (dbProducts.length > 0) {
        results = dbProducts;
      } else {
        // Fallback to active catalog if DB is empty
        results = filterStaticProducts(category, subCategory, search);
      }
    } else {
      results = filterStaticProducts(category, subCategory, search);
    }

    results = results.map(p => resolveProductImage(typeof p.toObject === 'function' ? p.toObject() : p));

    // Sort results sequentially
    results.sort((a, b) => {
      const numA = a.refNumber || parseInt(String(a.id || '').split('-').pop(), 10) || 0;
      const numB = b.refNumber || parseInt(String(b.id || '').split('-').pop(), 10) || 0;
      return numA - numB;
    });

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving products' });
  }
});

// Helper for filtering products strictly by subCategory
function filterStaticProducts(category, subCategory, search) {
  const catalog = getActiveCatalog();
  const clean = (s) => (s || '').toLowerCase().replace(/[-_\s]/g, '');

  return catalog.filter(item => {
    let match = true;
    if (category) {
      const normCat = clean(category);
      const itemCat = clean(item.category);
      if (normCat !== itemCat) match = false;
    }
    if (subCategory && subCategory.toLowerCase() !== 'all') {
      const normSub = clean(subCategory);
      const itemSub = clean(item.subCategory);
      if (itemSub !== normSub) match = false;
    }
    if (search) {
      const s = search.toLowerCase();
      if (!item.title.toLowerCase().includes(s) && !item.description.toLowerCase().includes(s)) {
        match = false;
      }
    }
    return match;
  });
}

// GET /api/products/:id - get product by ID with backward-compatible aliases
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reqId = (id || '').toLowerCase().trim();
    let product = null;

    if (getDbStatus()) {
      product = await Product.findOne({ id }).lean();
    }

    if (!product) {
      const catalog = getActiveCatalog();

      // 1. Exact ID match
      product = catalog.find(p => p.id && p.id.toLowerCase() === reqId);

      // 2. Aliases array match (e.g. ['coat-01'] or ['sherwani-1791715600917'])
      if (!product) {
        product = catalog.find(p => Array.isArray(p.aliases) && p.aliases.some(al => String(al).toLowerCase() === reqId));
      }

      // 3. Coat <-> Blazer interchangeable alias
      if (!product) {
        if (reqId.startsWith('coat-')) {
          const altId = reqId.replace(/^coat-/, 'blazer-');
          product = catalog.find(p => p.id && p.id.toLowerCase() === altId);
        } else if (reqId.startsWith('blazer-')) {
          const altId = reqId.replace(/^blazer-/, 'coat-');
          product = catalog.find(p => p.id && p.id.toLowerCase() === altId);
        }
      }

      // 4. Unpadded numeric alias (e.g. sherwani-1 matching sherwani-01)
      if (!product) {
        product = catalog.find(p => {
          const pParts = String(p.id || '').toLowerCase().split('-');
          const reqParts = reqId.split('-');
          if (pParts.length >= 2 && reqParts.length >= 2) {
            const pPrefix = pParts.slice(0, -1).join('-');
            const reqPrefix = reqParts.slice(0, -1).join('-');
            const pNum = parseInt(pParts[pParts.length - 1], 10);
            const reqNum = parseInt(reqParts[reqParts.length - 1], 10);
            return pPrefix === reqPrefix && !isNaN(pNum) && !isNaN(reqNum) && pNum === reqNum;
          }
          return false;
        });
      }
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const resolved = resolveProductImage(product);
    res.json({
      success: true,
      data: resolved
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving product' });
  }
});

export default router;
