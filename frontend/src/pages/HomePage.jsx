import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Scissors,
  MessageSquare,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Package
} from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { api } from '../services/api';

const DEFAULT_HERO_SLIDES = [
  {
    image: '/banners/sherwani-banner.png',
    title: 'The Sovereignty Of',
    highlight: 'Sherwani',
    description:
      'Regal silhouettes, exquisite detailing and master craftsmanship. Each sherwani is individually tailored to create a distinguished look for your most memorable celebrations.',
    primaryText: 'Explore Sherwanis',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring'
  },
  {
    image: '/banners/jodhpuri-banner.png',
    title: 'The Power Of',
    highlight: 'Jodhpuri',
    description:
      'Regal silhouettes, refined detailing and impeccable craftsmanship, tailored for unforgettable celebrations.',
    primaryText: 'Explore Jodhpuri',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring'
  },
  {
    image: '/banners/indo-banner.png',
    title: 'The Legacy Of',
    highlight: 'Indo-Western',
    description:
      'A contemporary interpretation of Indian occasionwear, blending timeless craftsmanship with modern silhouettes.',
    primaryText: 'Explore Indo-Western',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring'
  },
  {
    image: '/banners/blazer-banner.png',
    title: 'The Royality Of',
    highlight: 'Formalwear',
    description:
      'Sharp silhouettes, luxurious fabrics and precision tailoring designed for the modern gentleman.',
    primaryText: 'Explore Blazers',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring'
  }
];

export default function HomePage() {
  const { getWhatsAppLink, setAppointmentModalOpen } = useConfig();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState(DEFAULT_HERO_SLIDES);

  useEffect(() => {
    api.getBanners().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setHeroSlides(data);
      }
    }).catch(() => {});
  }, []);

  const handleWhatsAppHero = () => {
    const msg = `Hello M.S Fashion,\nI am planning for a grand wedding/occasion and would like to explore your bespoke ethnic menswear collection.`;
    window.open(getWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  // ==================== AUTO SLIDER - 4.5 SECONDS ====================
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // ==================== SLIDER CONTROLS ====================
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const slide = heroSlides[currentSlide];

  // ==================== OFFERINGS ====================
  const offerings = [
    {
      id: 'ethnic-wear',
      title: 'Ethnic Wear Collections',
      tagline: 'Imperial Sherwani, Jodhpuri, Indo-Western & Blazers',
      desc: 'Discover our 4 foundational menswear boutiques with curated imperial designs and coordinated bespoke accessories.',
      link: '/ethnic-wear',
      cta: 'Explore Boutiques',
      icon: Sparkles
    },
    {
      id: 'bespoke-tailoring',
      title: 'Bespoke Tailoring',
      tagline: 'Single & Custom Made-to-Measure Fittings',
      desc: 'Master postured patterns, artisan hand zardozi, and canvas construction crafted exclusively for your silhouette.',
      link: '/bespoke-tailoring',
      cta: 'Bespoke Experience',
      icon: Scissors
    },
    {
      id: 'bulk-orders',
      title: 'Bulk & Contract Manufacturing',
      tagline: 'B2B Sizing Ranges for Leading Brands',
      desc: 'Bring your own fabric and design — our master tailors handle the construction and finishing at required scale.',
      link: '/bulk-orders',
      cta: 'Contract Manufacturing',
      icon: Package
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">

      {/* ==================== HERO BANNER SECTION ==================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">

        <div className="relative bg-[#ECE2D2] border border-[#D5C8B5] overflow-hidden shadow-luxury">

          {/* ==================== HERO IMAGE SLIDER ==================== */}
          <div className="relative min-h-[480px] sm:min-h-[580px] flex flex-col justify-end overflow-hidden">

            {/* All images stay mounted.
                Only opacity changes for smooth cross-fade. */}
            <div className="absolute inset-0 z-0 overflow-hidden">

              {heroSlides.map((item, index) => (
                <img
                  key={item.image}
                  src={item.image}
                  alt={item.highlight}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    currentSlide === index
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                />
              ))}

            </div>

            {/* ==================== DARK OVERLAYS ==================== */}

            {/* Left gradient - keeps text readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C080B]/90 via-[#1C080B]/55 to-transparent z-10" />

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C080B]/75 via-transparent to-transparent z-10" />

            {/* ==================== HERO CONTENT ==================== */}
            <div className="relative z-20 max-w-2xl space-y-4 text-[#FBF6EC] p-6 sm:p-12 lg:p-16">

              {/* ==================== HERO HEADING ==================== */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-wide text-[#FBF6EC] drop-shadow-md">

                {slide.title}

                <br />

                <span className="italic font-normal text-[#E8D4A8] whitespace-pre-line">
                  {slide.highlight}
                </span>
              </h1>

              {/* ==================== HERO DESCRIPTION ==================== */}
              <p className="text-sm sm:text-base text-[#E0D0BE] font-light max-w-xl leading-relaxed">
                {slide.description}
              </p>

              {/* ==================== BUTTONS ==================== */}
              <div className="pt-2 flex flex-wrap items-center gap-4">

                <Link
                  to={slide.primaryLink}
                  className="px-7 py-3.5 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs uppercase tracking-widest font-semibold border border-[#A9812F] shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <span>{slide.primaryText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={slide.secondaryLink}
                  className="px-6 py-3.5 bg-[#A9812F] hover:bg-[#8F6B24] text-[#1C080B] text-xs uppercase tracking-widest font-bold shadow-lg transition-all duration-300"
                >
                  {slide.secondaryText}
                </Link>

                <button
                  type="button"
                  onClick={handleWhatsAppHero}
                  className="px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-widest font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>WhatsApp Stylist</span>
                </button>

              </div>

            </div>

            {/* ==================== PREVIOUS BUTTON ==================== */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous banner"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1C080B]/60 hover:bg-[#5C1A21] border border-[#A9812F]/70 text-[#E8D4A8] flex items-center justify-center backdrop-blur-sm transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* ==================== NEXT BUTTON ==================== */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next banner"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1C080B]/60 hover:bg-[#5C1A21] border border-[#A9812F]/70 text-[#E8D4A8] flex items-center justify-center backdrop-blur-sm transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* ==================== SLIDE DOTS ==================== */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">

              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === index
                      ? 'w-8 h-2 bg-[#E8D4A8]'
                      : 'w-2 h-2 bg-[#FBF6EC]/60 hover:bg-[#FBF6EC]'
                  }`}
                />
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* ==================== 3 CORE BRAND PILLARS ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">

          <span className="text-xs uppercase tracking-[0.3em] text-[#8F6B24] font-semibold block">
            M.S Fashion Atelier
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5C1A21] tracking-wide">
            Our Foundational Offerings
          </h2>

          <div className="w-20 h-0.5 bg-[#A9812F] mx-auto mt-2" />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {offerings.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="bg-[#F4ECE1] border border-[#E5D9C5] p-8 shadow-sm hover:border-[#A9812F] hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group"
              >

                <div className="space-y-4">

                  <div className="w-12 h-12 rounded-full bg-[#5C1A21] border border-[#A9812F] flex items-center justify-center text-[#C5A869] shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>

                    <h3 className="font-serif text-2xl font-bold text-[#5C1A21] group-hover:text-[#421116] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#8F6B24] font-serif italic mt-1 font-medium">
                      "{item.tagline}"
                    </p>

                  </div>

                  <p className="text-xs sm:text-sm text-[#61534B] leading-relaxed">
                    {item.desc}
                  </p>

                </div>

                <div className="mt-8 pt-4 border-t border-[#E5D9C5] flex items-center justify-between">

                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5C1A21] group-hover:text-[#A9812F] transition-colors"
                  >
                    <span>{item.cta}</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>

                </div>

              </div>
            );
          })}

        </div>
      </section>

{/* ==================== WHATSAPP CONSULTATION BANNER ==================== */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

  <div className="relative overflow-hidden border-2 border-[#A9812F]/50 shadow-luxury">

    {/* BACKGROUND IMAGE */}
    <img
      src="/banners/consultant-banner.png"
      alt="Wedding Trousseau Consultation"
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* DARK OVERLAY */}
    <div className="absolute inset-0 bg-[#1C080B]/40" />

    {/* CONTENT */}
    <div className="relative z-10 p-8 sm:p-12 text-center">

      <div className="max-w-2xl mx-auto space-y-4">

        <span className="w-12 h-12 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center mx-auto text-[#25D366]">
          <MessageSquare className="w-6 h-6 fill-[#25D366]" />
        </span>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold">
          <span className="text-[#FBF6EC]">
            Need Guidance for Yo
          </span><span className="text-[#FBF6EC]">
            ur Wedding Trousseau?
          </span>
        </h3>

        <p className="text-xs sm:text-sm text-[#E0D0BE] leading-relaxed">
          Connect with our master styling team on WhatsApp for personalized
          color palette recommendations, fabric swatches, and bespoke price
          estimates tailored to your celebration.
        </p>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-4">

          <button
            onClick={handleWhatsAppHero}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-widest font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </button>

          <button
            onClick={() => setAppointmentModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#E8D4A8] text-[#E8D4A8] hover:bg-[#E8D4A8] hover:text-[#1C080B] text-xs uppercase tracking-widest font-semibold transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Private Appointment</span>
          </button>

        </div>

      </div>

    </div>

  </div>

</section>

    </div>
  );
}