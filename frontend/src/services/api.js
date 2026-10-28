import axios from 'axios';
import { categoriesData, productsData } from '../data/catalog';

const API_BASE = '/api';

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('ms_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Fetch all categories
  getCategories: async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      if (res.data?.success && res.data.data?.length > 0) {
        return res.data.data;
      }
    } catch (err) {
      console.info('Using local categories cache');
    }
    return categoriesData;
  },

  // Fetch category details and products
  getCategoryDetail: async (categoryId) => {
    try {
      const res = await axios.get(`${API_BASE}/categories/${categoryId}`);
      if (res.data?.success) {
        return res.data.data;
      }
    } catch (err) {
      console.info('Using local category detail cache');
    }
    const cat = categoriesData.find(c => c.id.toLowerCase() === categoryId.toLowerCase() || c.name.toLowerCase() === categoryId.toLowerCase());
    const products = productsData.filter(p => p.category.toLowerCase() === (cat?.name || categoryId).toLowerCase());
    return {
      category: cat || { id: categoryId, name: categoryId, title: categoryId },
      products
    };
  },

  // Fetch products with filters
  getProducts: async ({ category, subCategory, search } = {}) => {
    try {
      const params = {};
      if (category) params.category = category;
      if (subCategory) params.subCategory = subCategory;
      if (search) params.search = search;

      const res = await axios.get(`${API_BASE}/products`, { params });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.info('Using local products cache');
    }

    // Local filter fallback
    return productsData.filter(item => {
      let match = true;
      if (category) {
        const normCat = category.toLowerCase().replace(/[^a-z0-9]/g, '');
        const itemCat = item.category.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normCat !== itemCat) match = false;
      }
      if (subCategory && subCategory.toLowerCase() !== 'all') {
        const clean = (s) => (s || '').toLowerCase().replace(/[-_\s]/g, '');
        if (clean(item.subCategory) !== clean(subCategory)) match = false;
      }
      if (search) {
        const s = search.toLowerCase();
        if (!item.title.toLowerCase().includes(s) && !item.description.toLowerCase().includes(s)) {
          match = false;
        }
      }
      return match;
    });
  },

  // Fetch product by ID
  getProductById: async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/products/${id}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.info('Using local product detail cache');
    }
    return productsData.find(p => p.id === id || p.id === id.toLowerCase()) || null;
  },

  // Send Email OTP for Appointment Verification
  sendOtp: async ({ email, customerName }) => {
    const res = await axios.post(`${API_BASE}/inquiries/send-otp`, { email, customerName });
    return res.data;
  },

  // Verify Email OTP
  verifyOtp: async ({ email, otp }) => {
    const res = await axios.post(`${API_BASE}/inquiries/verify-otp`, { email, otp });
    return res.data;
  },

  // Submit consultation inquiry
  submitInquiry: async (inquiryData) => {
    const res = await axios.post(`${API_BASE}/inquiries`, inquiryData);
    return res.data;
  },

  // Fetch brand settings
  getBrandConfig: async () => {
    try {
      const res = await axios.get(`${API_BASE}/brand-config`);
      if (res.data) {
        return res.data.data || res.data;
      }
    } catch (err) {
      // Default
    }
    return {
      brandName: 'M.S Fashion',
      tagline: 'The Art of Bespoke Ethnic Menswear',
      whatsappPhone: '918999386222',
      displayPhone: '+91 89993 86222',
      email: 'bespoke@msfashion.com',
      boutiqueAddress: 'Ground Floor, 10/A, Sanaullah Compound, Near Sauda Bakery, Dharavi Main Road, Mahim (East), Mumbai - 400017, Maharashtra',
      visitingHours: 'Mon - Sat: 1:00 PM - 7:00 PM',
      tickerMessages: [
        '👑 ATELIER TIMINGS: MON - SAT (1:00 PM - 7:00 PM) • VISIT FOR BESPOKE MEASUREMENTS',
        '✨ M.S FASHION — MASTER CRAFTSMEN OF ROYAL SHERWANIS, JODHPURIS & BESPOKE BLAZERS',
        '📦 BULK & BRAND CONTRACT MANUFACTURING AVAILABLE — EXPLORE BULK ORDERS'
      ]
    };
  },

  // ==================== ADMIN API METHODS ====================

  // Admin Login
  adminLogin: async (username, password) => {
    const res = await axios.post(`${API_BASE}/admin/login`, { username, password });
    return res.data;
  },

  // Admin Dashboard Stats
  getAdminStats: async () => {
    const res = await axios.get(`${API_BASE}/admin/stats`, { headers: getAuthHeaders() });
    return res.data.data;
  },

  // Admin Get All Products
  getAdminProducts: async () => {
    const res = await axios.get(`${API_BASE}/admin/products`, { headers: getAuthHeaders() });
    return res.data.data;
  },

  // Admin Get Next Reference ID for Category
  getNextRef: async (category) => {
    try {
      const res = await axios.get(`${API_BASE}/admin/next-ref`, {
        params: { category },
        headers: getAuthHeaders()
      });
      return res.data?.data || null;
    } catch (e) {
      return null;
    }
  },

  // Admin Create Product
  createProduct: async (productData) => {
    const res = await axios.post(`${API_BASE}/admin/products`, productData, { headers: getAuthHeaders() });
    return res.data;
  },

  // Admin Update Product
  updateProduct: async (id, updateData) => {
    const res = await axios.put(`${API_BASE}/admin/products/${id}`, updateData, { headers: getAuthHeaders() });
    return res.data;
  },

  // Admin Delete Product
  deleteProduct: async (id) => {
    const res = await axios.delete(`${API_BASE}/admin/products/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },

  // Upload Photo from Laptop Storage
  uploadLaptopImage: async (file, category, productId) => {
    const formData = new FormData();
    formData.append('category', category || 'Sherwani');
    if (productId) formData.append('productId', productId);
    formData.append('image', file);

    const res = await axios.post(`${API_BASE}/admin/upload-file`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  // Upload / Fetch Photo from Web URL
  uploadImageUrl: async (imageUrl, category, productId) => {
    const res = await axios.post(
      `${API_BASE}/admin/upload-url`,
      { imageUrl, category, productId },
      { headers: getAuthHeaders() }
    );
    return res.data;
  },

  // Admin Get Inquiries
  getAdminInquiries: async () => {
    const res = await axios.get(`${API_BASE}/admin/inquiries`, { headers: getAuthHeaders() });
    return res.data.data;
  },

  // Admin Update Inquiry Status
  updateInquiryStatus: async (id, status) => {
    const res = await axios.patch(`${API_BASE}/admin/inquiries/${id}/status`, { status }, { headers: getAuthHeaders() });
    return res.data;
  },

  // Admin Delete Inquiry
  deleteInquiry: async (id) => {
    const res = await axios.delete(`${API_BASE}/admin/inquiries/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },

  // Admin Update Brand Config & Announcement Ticker
  updateBrandConfig: async (configData) => {
    const res = await axios.put(`${API_BASE}/admin/brand-config`, configData, { headers: getAuthHeaders() });
    return res.data;
  },

  // Get Hero Banners
  getBanners: async () => {
    try {
      const res = await axios.get(`${API_BASE}/banners`);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },

  // Admin Update Hero Banners
  updateBanners: async (banners) => {
    const res = await axios.put(`${API_BASE}/admin/banners`, { banners }, { headers: getAuthHeaders() });
    return res.data;
  },

  // Admin Send Test Email
  sendTestEmail: async (testEmail) => {
    const res = await axios.post(`${API_BASE}/admin/test-email`, { testEmail }, { headers: getAuthHeaders() });
    return res.data;
  }
};
