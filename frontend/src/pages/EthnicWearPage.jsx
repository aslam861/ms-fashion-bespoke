import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import PlaceholderBox from '../components/PlaceholderBox';
import { api } from '../services/api';
import { useConfig } from '../context/ConfigContext';

export default function EthnicWearPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getWhatsAppLink } = useConfig();

  useEffect(() => {
    Promise.all([api.getCategories(), api.getProducts()])
      .then(([cats, prods]) => {
        const enriched = (cats || []).map((cat) => {
          // If category already has realImageUrl from backend, keep it
          if (cat.realImageUrl && cat.realImageUrl.trim() !== '') {
            return cat;
          }

          // Otherwise dynamically look up the 1st product in this category
          const catProds = (prods || []).filter(
            (p) => p.category && p.category.toLowerCase() === (cat.name || cat.id).toLowerCase()
          );
          const firstWithImg =
            catProds.find((p) => p.realImageUrl && p.realImageUrl.trim() !== '') || catProds[0];

          return {
            ...cat,
            realImageUrl: firstWithImg?.realImageUrl || null
          };
        });
        setCategories(enriched);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-2 border-[#5C1A21] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <span className="font-serif text-lg text-[#5C1A21]">Loading Ethnic Wear Boutiques...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF6EC] min-h-screen py-10 sm:py-14 space-y-12">
      {/* ==================== PAGE HEADER ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8F6B24] font-semibold block">
            Curated Boutiques
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#5C1A21] tracking-wide">
            Signature Menswear Categories
          </h1>
          <div className="w-20 h-0.5 bg-[#A9812F] mx-auto mt-2" />
          <p className="text-sm sm:text-base text-[#61534B] leading-relaxed max-w-2xl mx-auto font-light">
            Explore our four foundational silhouettes — each meticulously crafted with master proportions and customizable accessory elements.
          </p>
        </div>
      </section>

      {/* ==================== 4 BIG CATEGORY CARDS GRID ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group flex flex-col bg-[#F4ECE1] border border-[#E5D9C5] hover:border-[#A9812F] transition-all duration-500 shadow-luxury hover:shadow-luxury-hover overflow-hidden"
            >
              {/* Category Representative Photo */}
              <div className="relative overflow-hidden aspect-[3/4] bg-[#E0D8CB]">
                {/* Clean Collection Badge */}
                <div className="absolute top-3 left-3 z-20 bg-[#5C1A21]/90 backdrop-blur-sm text-[#FBF6EC] text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 font-semibold border border-[#A9812F]/40 shadow-sm">
                  COLLECTION
                </div>

                <PlaceholderBox
                  label={cat.representativePlaceholder || `[${cat.name} Representative Photo]`}
                  folderPath={cat.folderPath}
                  realImageUrl={cat.realImageUrl}
                  aspectRatio="aspect-[3/4]"
                  objectFit="cover"
                  className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Category Info */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3 bg-[#F4ECE1]">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#5C1A21] group-hover:text-[#421116] transition-colors mt-0.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#52443C] font-serif italic mt-1 leading-snug">
                    "{cat.tagline}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#5C1A21] group-hover:text-[#A9812F] transition-colors">
                  <span>View Catalog & Customise</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== BOTTOM STYLING ASSISTANCE BANNER ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#5C1A21] text-[#FBF6EC] p-8 sm:p-10 border border-[#A9812F]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A869] font-medium block">
              Personal Styling Guidance
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FBF6EC]">
              Looking for a tailored silhouette consultation?
            </h3>
            <p className="text-xs sm:text-sm text-[#E0D0BE] max-w-xl">
              Connect directly with our master tailor on WhatsApp to review fabrics, embroidery patterns, and custom measurements.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4">
            <Link
              to="/bespoke-tailoring"
              className="px-6 py-3 border border-[#A9812F] text-[#FBF6EC] hover:bg-[#A9812F] hover:text-[#1C080B] text-xs uppercase tracking-widest font-semibold transition-all"
            >
              Bespoke Fitting Details
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
