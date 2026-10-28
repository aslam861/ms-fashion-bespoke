import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sparkles, SlidersHorizontal, ArrowLeft, ChevronRight, Eye } from 'lucide-react';
import PlaceholderBox from '../components/PlaceholderBox';
import { api } from '../services/api';
import { useConfig } from '../context/ConfigContext';

export default function CategoryGridPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { formatINR } = useConfig();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setActiveSubCategory('all');
    api.getCategoryDetail(categoryId).then((res) => {
      setCategory(res.category);
      setProducts(res.products);
      setLoading(false);
    });
  }, [categoryId]);

  const cleanSub = (s) => (s || '').toLowerCase().replace(/[-_\s]/g, '');

  // Filter products by subcategory strictly by p.subCategory
  const filteredProducts = products.filter((p) => {
    if (activeSubCategory === 'all') return true;
    const target = cleanSub(activeSubCategory);
    const prodSub = cleanSub(p.subCategory);
    return prodSub === target;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-2 border-[#5C1A21] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <span className="font-serif text-lg text-[#5C1A21]">Loading Curated Boutique...</span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#5C1A21]">Category Not Found</h2>
        <Link to="/" className="inline-block text-xs uppercase tracking-widest text-[#A9812F] underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Category Header */}
      <div className="border-b border-[#E5D9C5] pb-6 text-center max-w-3xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#5C1A21] tracking-wide">
          {category.title || category.name}
        </h1>
        <p className="text-sm sm:text-base text-[#574940] font-serif italic max-w-2xl mx-auto leading-relaxed">
          "{category.tagline}"
        </p>
      </div>

      {/* Subcategory Style Filter Tabs (e.g. Single-Breasted vs Double-Breasted vs Shawl) */}
      {category.subCategories && category.subCategories.length > 0 && (
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveSubCategory('all')}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all border ${
              activeSubCategory === 'all'
                ? 'bg-[#5C1A21] text-[#FBF6EC] border-[#5C1A21] shadow-sm'
                : 'bg-[#F4ECE1] text-[#2B211D] border-[#D5C8B5] hover:border-[#A9812F]'
            }`}
          >
            All Silhouettes ({products.length})
          </button>

          {category.subCategories.map((sub) => {
            const count = products.filter((p) => cleanSub(p.subCategory) === cleanSub(sub)).length;
            return (
              <button
                key={sub}
                onClick={() => setActiveSubCategory(sub)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all border ${
                  activeSubCategory === sub
                    ? 'bg-[#5C1A21] text-[#FBF6EC] border-[#5C1A21] shadow-sm'
                    : 'bg-[#F4ECE1] text-[#2B211D] border-[#D5C8B5] hover:border-[#A9812F]'
                }`}
              >
                {sub.replace(/-/g, ' ')} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* ==================== 4 PER ROW DESKTOP GRID ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 pt-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col bg-[#F4ECE1] border border-[#E5D9C5] hover:border-[#A9812F] transition-all duration-300 shadow-luxury hover:shadow-luxury-hover overflow-hidden"
          >
            {/* Clickable Photo Area (Clean without redundant overlay badge) */}
            <Link
              to={`/product/${product.id}`}
              className="relative overflow-hidden aspect-[3/4] bg-[#E0D8CB] block"
            >
              <PlaceholderBox
                label={product.placeholderLabel || `[${product.title}]`}
                realImageUrl={product.realImageUrl}
                folderPath={product.folderPath}
                aspectRatio="aspect-[3/4]"
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Quick Inspect Badge */}
              <div className="absolute inset-0 bg-[#1C080B]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-4 py-2 bg-[#FBF6EC] text-[#5C1A21] text-xs font-semibold uppercase tracking-widest shadow-lg border border-[#A9812F] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Garment & Zoom</span>
                </span>
              </div>
            </Link>

            {/* Product Meta & Pricing with Sub-Type Classification */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8A796F] mb-1">
                  <span className="uppercase tracking-wider font-semibold text-[#8F6B24]">
                    {product.subCategory}
                  </span>
                  <span>Ref: {product.id}</span>
                </div>
                <Link
                  to={`/product/${product.id}`}
                  className="font-serif text-lg font-bold text-[#5C1A21] group-hover:text-[#421116] transition-colors line-clamp-2 mt-0.5 leading-snug"
                >
                  {product.title}
                </Link>
                <p className="text-xs text-[#6B5E55] mt-1 line-clamp-1">
                  {product.fabric}
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A796F] block">
                    Starting From
                  </span>
                  <span className="font-serif font-bold text-base text-[#5C1A21]">
                    {formatINR(product.basePrice)}
                  </span>
                </div>

                <Link
                  to={`/product/${product.id}`}
                  className="px-3 py-1.5 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-[11px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Customise</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-16 text-center text-sm text-[#7A6E65] space-y-3">
          <p>No garments found in this silhouette filter.</p>
          <button
            onClick={() => setActiveSubCategory('all')}
            className="px-4 py-2 bg-[#5C1A21] text-[#FBF6EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#461319] transition-colors cursor-pointer"
          >
            Show All Silhouettes
          </button>
        </div>
      )}
    </div>
  );
}
