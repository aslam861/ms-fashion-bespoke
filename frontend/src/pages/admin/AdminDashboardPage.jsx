import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Package, MessageSquare, Settings, LogOut, Plus, Search,
  Edit, Trash2, CheckCircle2, AlertCircle, Eye, ExternalLink, RefreshCw, Layers, DollarSign, Image as ImageIcon
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useConfig } from '../../context/ConfigContext';
import { api } from '../../services/api';
import ProductEditorPage from './ProductEditorPage';
import InquiriesTab from '../../components/admin/InquiriesTab';
import StoreSettingsTab from '../../components/admin/StoreSettingsTab';
import BannersTab from '../../components/admin/BannersTab';

const CATEGORIES = ['All', 'Sherwani', 'Jodhpuri', 'Indo-Western', 'Blazer'];

const SUB_CATEGORIES_CONFIG = {
  Sherwani: [
    { id: 'all', label: 'All Sherwanis' },
    { id: 'Royal Bridal Sherwani', label: 'Royal Bridal' },
    { id: 'Heritage Velvet Sherwani', label: 'Heritage Velvet' },
    { id: 'Brocade Classic', label: 'Brocade Classic' },
    { id: 'Silk Embroidered', label: 'Silk Embroidered' }
  ],
  Jodhpuri: [
    { id: 'all', label: 'All Jodhpuris' },
    { id: 'Jodhpuri-With-Jacket', label: 'Jodhpuri With Jacket' },
    { id: 'Jodhpuri-Without-Jacket', label: 'Jodhpuri (Suit Only)' }
  ],
  'Indo-Western': [
    { id: 'all', label: 'All Indo-Western' },
    { id: 'Indo-Western-With-Jacket', label: 'Indo-Western With Jacket' },
    { id: 'Indo-Western-Without-Jacket', label: 'Indo-Western (Standard)' }
  ],
  Blazer: [
    { id: 'all', label: 'All Blazers' },
    { id: 'Blazer-Single-Breasted', label: 'Single-Breasted' },
    { id: 'Blazer-Double-Breasted', label: 'Double-Breasted' },
    { id: 'Blazer-Shawl', label: 'Shawl Lapel' }
  ]
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();
  const { formatINR } = useConfig();

  const [activeTab, setActiveTab] = useState('products'); // 'overview' | 'products' | 'inquiries' | 'settings'

  // Products state
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState('all');

  // Full-page Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [inquiriesCount, setInquiriesCount] = useState(0);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [prodsData, statsData, inqsData] = await Promise.all([
        api.getAdminProducts(),
        api.getAdminStats(),
        api.getAdminInquiries().catch(() => [])
      ]);
      setProducts(Array.isArray(prodsData) ? prodsData : []);
      setStats(statsData || null);
      if (Array.isArray(inqsData)) {
        setInquiriesCount(inqsData.length);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setEditorOpen(true);
  };

  const handleCategorySelect = (cat) => {
    setCategoryFilter(cat);
    setSubCategoryFilter('all');
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the catalog?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete garment');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Compute dynamic category counts
  const sherwaniCount = products.filter((p) => p.category === 'Sherwani').length;
  const jodhpuriCount = products.filter((p) => p.category === 'Jodhpuri').length;
  const indoCount = products.filter((p) => p.category === 'Indo-Western').length;
  const blazerCount = products.filter((p) => p.category === 'Blazer').length;

  const getCategoryLabelWithCount = (cat) => {
    switch (cat) {
      case 'Sherwani':
        return `SHERWANI (${sherwaniCount})`;
      case 'Jodhpuri':
        return `JODHPURI (${jodhpuriCount})`;
      case 'Indo-Western':
        return `INDO-WESTERN (${indoCount})`;
      case 'Blazer':
        return `BLAZER (${blazerCount})`;
      default:
        return 'ALL';
    }
  };

  // Filter products by Category, SubCategory, and Search
  const filteredProducts = products.filter((p) => {
    let match = true;
    if (categoryFilter !== 'All') {
      if (p.category !== categoryFilter) match = false;
    }
    if (subCategoryFilter !== 'all') {
      const clean = (s) => (s || '').toLowerCase().replace(/[-_\s]/g, '');
      if (clean(p.subCategory) !== clean(subCategoryFilter)) match = false;
    }
    if (search) {
      const q = search.toLowerCase();
      const title = (p.title || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const sub = (p.subCategory || '').toLowerCase();
      const fabric = (p.fabric || '').toLowerCase();
      if (!title.includes(q) && !cat.includes(q) && !sub.includes(q) && !fabric.includes(q)) {
        match = false;
      }
    }
    return match;
  }).sort((a, b) => {
    const numA = a.refNumber || parseInt(String(a.id || '').split('-').pop(), 10) || 0;
    const numB = b.refNumber || parseInt(String(b.id || '').split('-').pop(), 10) || 0;
    return numA - numB;
  });

  // Current active subcategories list
  const activeSubCategories = categoryFilter !== 'All' ? (SUB_CATEGORIES_CONFIG[categoryFilter] || []) : [];

  // If Full-Page Editor is Open, render full-page editor view!
  if (editorOpen) {
    return (
      <ProductEditorPage
        product={editingProduct}
        onClose={() => setEditorOpen(false)}
        onSaved={() => {
          setEditorOpen(false);
          fetchDashboardData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EB] text-[#2B211D] flex flex-col font-sans">
      {/* Top Admin Navigation Header */}
      <header className="bg-[#5C1A21] text-[#FBF6EC] border-b-2 border-[#A9812F] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#461319] border border-[#A9812F] p-0.5 shadow">
              <img
                src="/logologo.jpeg"
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-wider text-[#FBF6EC]">
                  M.S FASHION
                </span>
                <span className="px-2 py-0.5 bg-[#A9812F]/30 text-[#C5A869] text-[10px] uppercase tracking-widest font-mono rounded border border-[#A9812F]/40 font-semibold">
                  Atelier Master Admin
                </span>
              </div>
              <span className="text-[10px] text-[#D8CEBF] block">
                Logged in as: <strong className="text-[#C5A869]">{adminUser?.name || 'Master Stylist'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-[#461319] hover:bg-[#380e13] text-[#FBF6EC] text-xs font-semibold uppercase tracking-wider rounded border border-[#A9812F]/30 transition-colors"
            >
              <span>View Client Boutique</span>
              <ExternalLink className="w-3 h-3 text-[#C5A869]" />
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-900/60 hover:bg-red-900 text-[#FBF6EC] text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
              title="Logout from admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-[#A9812F]/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#C5A869] text-[#C5A869] bg-[#461319]/50'
                : 'border-transparent text-[#E5D9C5] hover:text-[#FBF6EC]'
            }`}
          >
            📊 Atelier Overview
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#C5A869] text-[#C5A869] bg-[#461319]/50'
                : 'border-transparent text-[#E5D9C5] hover:text-[#FBF6EC]'
            }`}
          >
            🧥 Garments & Customizations ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'border-[#C5A869] text-[#C5A869] bg-[#461319]/50'
                : 'border-transparent text-[#E5D9C5] hover:text-[#FBF6EC]'
            }`}
          >
            <span>📋 Inquiries & Appointments</span>
            {inquiriesCount > 0 && (
              <span className="px-1.5 py-0.5 bg-[#C5A869] text-[#1C080B] text-[10px] font-mono font-bold rounded-full">
                {inquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#C5A869] text-[#C5A869] bg-[#461319]/50'
                : 'border-transparent text-[#E5D9C5] hover:text-[#FBF6EC]'
            }`}
          >
            📢 Announcement Bar & Store Settings
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'banners'
                ? 'border-[#C5A869] text-[#C5A869] bg-[#461319]/50'
                : 'border-transparent text-[#E5D9C5] hover:text-[#FBF6EC]'
            }`}
          >
            🖼️ Hero & Promotional Banners
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FBF6EC] p-5 border border-[#A9812F]/40 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A6E65] block">
                  Total Garments Live
                </span>
                <p className="font-serif font-bold text-3xl text-[#5C1A21] mt-1">
                  {stats?.totalProducts || products.length}
                </p>
                <span className="text-[11px] text-[#8F7F74] mt-1 block">
                  Across Sherwani, Jodhpuri, Indo & Blazer
                </span>
              </div>

              <div className="bg-[#FBF6EC] p-5 border border-[#A9812F]/40 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A6E65] block">
                  Real HD Photos Live
                </span>
                <p className="font-serif font-bold text-3xl text-emerald-800 mt-1">
                  {stats?.realPhotosCount || products.filter(p => p.realImageUrl).length}
                </p>
                <span className="text-[11px] text-[#8F7F74] mt-1 block">
                  {stats?.pendingPlaceholders || 0} items with neutral placeholders
                </span>
              </div>

              <div className="bg-[#FBF6EC] p-5 border border-[#A9812F]/40 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A6E65] block">
                  New Customer Leads
                </span>
                <p className="font-serif font-bold text-3xl text-[#A9812F] mt-1">
                  {stats?.newInquiries || 0}
                </p>
                <span className="text-[11px] text-[#8F7F74] mt-1 block">
                  {stats?.totalInquiries || 0} total lifetime requests
                </span>
              </div>

              <div className="bg-[#FBF6EC] p-5 border border-[#A9812F]/40 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A6E65] block">
                  Total Pipeline Value
                </span>
                <p className="font-serif font-bold text-2xl text-[#5C1A21] mt-1">
                  {formatINR(stats?.pipelineTotal || 0)}
                </p>
                <span className="text-[11px] text-[#8F7F74] mt-1 block">
                  From consultation inquiries
                </span>
              </div>
            </div>

            {/* Quick Actions & Category Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-[#F4ECE1] p-5 border border-[#E5D9C5] space-y-4">
                <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider pb-2 border-b border-[#E5D9C5]">
                  Category Distribution
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FBF6EC] border border-[#D5C8B5]">
                    <span className="text-xs font-semibold text-[#5C1A21] block uppercase">Sherwani</span>
                    <span className="font-serif font-bold text-xl text-[#2B211D]">{sherwaniCount} Styles</span>
                  </div>
                  <div className="p-3 bg-[#FBF6EC] border border-[#D5C8B5]">
                    <span className="text-xs font-semibold text-[#5C1A21] block uppercase">Jodhpuri</span>
                    <span className="font-serif font-bold text-xl text-[#2B211D]">{jodhpuriCount} Styles</span>
                  </div>
                  <div className="p-3 bg-[#FBF6EC] border border-[#D5C8B5]">
                    <span className="text-xs font-semibold text-[#5C1A21] block uppercase">Indo-Western</span>
                    <span className="font-serif font-bold text-xl text-[#2B211D]">{indoCount} Styles</span>
                  </div>
                  <div className="p-3 bg-[#FBF6EC] border border-[#D5C8B5]">
                    <span className="text-xs font-semibold text-[#5C1A21] block uppercase">Blazer</span>
                    <span className="font-serif font-bold text-xl text-[#2B211D]">{blazerCount} Styles</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#F4ECE1] p-5 border border-[#E5D9C5] space-y-3">
                <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider pb-2 border-b border-[#E5D9C5]">
                  Quick Actions
                </h3>

                <div className="space-y-2">
                  <button
                    onClick={handleOpenAdd}
                    className="w-full p-3 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow cursor-pointer transition-colors"
                  >
                    <span>+ Add New Bespoke Garment</span>
                    <Plus className="w-4 h-4 text-[#C5A869]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="w-full p-3 bg-white hover:bg-[#EAE2D5] border border-[#D5C8B5] text-[#5C1A21] text-xs font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>📋 View & Reply to Customer Leads</span>
                    <MessageSquare className="w-4 h-4 text-[#A9812F]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full p-3 bg-white hover:bg-[#EAE2D5] border border-[#D5C8B5] text-[#5C1A21] text-xs font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>📢 Update Top Announcement Bar</span>
                    <Settings className="w-4 h-4 text-[#A9812F]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PRODUCTS & CUSTOMIZATIONS ==================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Toolbar with Category Counts */}
            <div className="bg-[#F4ECE1] p-4 border border-[#E5D9C5] space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative flex-1 w-full min-w-[200px]">
                  <Search className="w-4 h-4 text-[#A9812F] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search garments by name, category, or fabric..."
                    className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-9 pr-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={fetchDashboardData}
                    className="p-2 border border-[#D5C8B5] bg-white hover:bg-[#EAE2D5] text-[#5C1A21] rounded transition-colors cursor-pointer"
                    title="Refresh catalog"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-bold uppercase tracking-wider transition-colors shadow cursor-pointer border border-[#A9812F]/40"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C5A869]" />
                    <span>+ ADD GARMENT</span>
                  </button>
                </div>
              </div>

              {/* Main Category Tabs with Exact Dynamic Counts */}
              <div className="flex gap-1.5 overflow-x-auto pt-1 border-t border-[#E5D9C5]">
                {CATEGORIES.map((cat) => {
                  const isSelected = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#5C1A21] text-[#FBF6EC] border-[#5C1A21] shadow-sm'
                          : 'bg-white text-[#5C1A21] border-[#D5C8B5] hover:bg-[#EAE2D5]'
                      }`}
                    >
                      {getCategoryLabelWithCount(cat)}
                    </button>
                  );
                })}
              </div>

              {/* Sub-Category Filter Buttons (e.g. Jodhpuri with jacket vs suit only) */}
              {activeSubCategories.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#E5D9C5]/60">
                  <span className="text-[11px] font-bold text-[#7A6E65] uppercase tracking-wider mr-1">
                    Silhouettes:
                  </span>
                  {activeSubCategories.map((sub) => {
                    const isSubSelected = subCategoryFilter === sub.id;
                    const clean = (s) => (s || '').toLowerCase().replace(/[-_\s]/g, '');
                    const subCount = sub.id === 'all'
                      ? products.filter(p => p.category === categoryFilter).length
                      : products.filter(p => {
                          if (p.category !== categoryFilter) return false;
                          return clean(p.subCategory) === clean(sub.id);
                        }).length;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => setSubCategoryFilter(sub.id)}
                        className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer border ${
                          isSubSelected
                            ? 'bg-[#A9812F] text-[#FBF6EC] border-[#A9812F]'
                            : 'bg-[#FBF6EC] text-[#5C1A21] border-[#D5C8B5] hover:bg-[#EAE2D5]'
                        }`}
                      >
                        {sub.label} ({subCount})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Products Table */}
            <div className="bg-[#FBF6EC] border border-[#E5D9C5] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#5C1A21] text-[#FBF6EC] uppercase tracking-wider text-[11px] border-b border-[#A9812F]/40">
                      <th className="p-3 pl-4">Photo</th>
                      <th className="p-3">Garment Title & Category</th>
                      <th className="p-3">Base Price</th>
                      <th className="p-3">Customization Accessories</th>
                      <th className="p-3">Lead Time</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5D9C5]">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-[#7A6E65]">Loading catalog...</td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-[#7A6E65]">No garments found in this category.</td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#F4ECE1]/60 transition-colors">
                          {/* Photo Thumbnail */}
                          <td className="p-3 pl-4">
                            {prod.realImageUrl ? (
                              <div className="w-10 h-14 bg-white border border-[#A9812F]/50 shadow-sm overflow-hidden">
                                <img
                                  src={prod.realImageUrl}
                                  alt={prod.title}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-14 bg-[#D8CEBF] border border-[#B5A896] flex items-center justify-center text-[9px] text-[#5C1A21] font-mono text-center leading-tight p-0.5">
                                Placeholder
                              </div>
                            )}
                          </td>

                          {/* Title & SubCategory */}
                          <td className="p-3">
                            <div className="space-y-0.5">
                              <span className="font-serif font-bold text-sm text-[#2B211D] block">
                                {prod.title}
                              </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 bg-[#5C1A21] text-[#FBF6EC] text-[9px] uppercase font-bold tracking-widest rounded">
                                  {prod.category}
                                </span>
                                <span className="px-1.5 py-0.5 bg-[#EAE2D5] border border-[#C5B49E] text-[#5C1A21] font-mono font-bold text-[10px] rounded tracking-wide">
                                  Ref: {prod.id}
                                </span>
                                <span className="text-[11px] text-[#7A6E65]">
                                  {prod.subCategory}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Base Price */}
                          <td className="p-3 font-serif font-bold text-sm text-[#5C1A21]">
                            {formatINR(prod.basePrice)}
                          </td>

                          {/* Accessories list */}
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {prod.accessories && prod.accessories.length > 0 ? (
                                prod.accessories.map((acc, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.5 bg-[#EAE2D5] text-[#5C1A21] text-[10px] font-medium border border-[#D5C8B5]"
                                  >
                                    {acc.name} ({formatINR(acc.price)})
                                  </span>
                                ))
                              ) : (
                                <span className="text-[#8F7F74] italic text-[11px]">No extra accessories</span>
                              )}
                            </div>
                          </td>

                          {/* Lead time */}
                          <td className="p-3 text-[#5A4D45]">
                            {prod.leadTime || '15-20 Days'}
                          </td>

                          {/* Actions */}
                          <td className="p-3 pr-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(prod)}
                                className="px-3.5 py-1.5 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-semibold uppercase tracking-wider rounded shadow transition-colors flex items-center gap-1 cursor-pointer"
                                title="Open Full Screen Editor"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>EDIT</span>
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.title)}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Delete garment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: INQUIRIES CRM ==================== */}
        {activeTab === 'inquiries' && <InquiriesTab />}

        {/* ==================== TAB 4: STORE SETTINGS ==================== */}
        {activeTab === 'settings' && <StoreSettingsTab />}

        {/* ==================== TAB 5: HERO BANNERS ==================== */}
        {activeTab === 'banners' && <BannersTab />}
      </main>
    </div>
  );
}
