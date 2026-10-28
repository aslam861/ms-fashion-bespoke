import React from 'react';
import { Layers, Palette, Package, ShieldCheck, MessageSquare, Calendar, Sparkles, CheckCircle2, ArrowRight, Building2, Truck, Scissors } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export default function BulkOrdersPage() {
  const { getWhatsAppLink, setAppointmentModalOpen } = useConfig();

  const handleWhatsAppBulk = () => {
    const msg = "Hi, I'm interested in bulk/wholesale manufacturing orders.";
    window.open(getWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  const steps = [
    {
      step: '01',
      title: 'You provide the fabric',
      desc: 'Supply your own fabrics — whether pure Banarasi brocades, raw silks, velvets, or suiting wools — sourced from your trusted mills.',
      icon: Layers
    },
    {
      step: '02',
      title: 'You provide the design',
      desc: 'Share your sample pieces, sketches, or tech specs. Our master pattern cutters translate your aesthetic into calibrated production templates.',
      icon: Palette
    },
    {
      step: '03',
      title: 'We manufacture with precision, at your required quantity',
      desc: 'Our experienced artisans handle cutting, hand-embroidery, canvas tailoring, size grading, and rigorous multi-stage quality control at scale.',
      icon: Package
    }
  ];

  const brandLogos = [
    { name: 'Manyavar', src: '/brands/manyavar.png', alt: 'Manyavar' },
    { name: 'Golden Coin', src: '/brands/golden-coin.png', alt: 'Golden Coin' },
    { name: 'Shubh Aarambh', src: '/brands/shubh-aarambh.png', alt: 'Shubh Aarambh' },
    { name: 'Star Ethnics', src: '/brands/star-ethnics.png', alt: 'Star Ethnics' },
    { name: 'Nawab Parker', src: '/brands/nawab-parker.png', alt: 'Nawab Parker' },
    { name: 'Gelato', src: '/brands/gelato.png', alt: 'Gelato' },
    { name: 'Mahashai', src: '/brands/mahashai.png', alt: 'Mahashai' }
  ];

  const highlights = [
    {
      title: 'Size-by-Size Grading (34 - 48+)',
      desc: 'Consistent proportions and master tailoring across all standard commercial sizing sets.'
    },
    {
      title: 'Artisan Zardozi & Handwork at Scale',
      desc: 'Dedicated teams of master hand-embroiderers for intricate bullion, cutdana, and resham artistry.'
    },
    {
      title: 'Bespoke Finishing & Custom Branding',
      desc: 'Structured canvassing, personalized inner linings, custom brand labelling, and luxury packaging.'
    },
    {
      title: 'Reliable Production Timelines',
      desc: 'Disciplined batch delivery schedules to meet peak wedding and festival retail demand.'
    }
  ];

  return (
    <div className="bg-[#FBF6EC] min-h-screen text-[#2B211D]">
      {/* ==================== HERO SECTION (BULK & CONTRACT MANUFACTURING) ==================== */}
      <section className="relative bg-[#5C1A21] text-[#FBF6EC] py-16 sm:py-24 border-b-2 border-[#A9812F]/40 overflow-hidden">
        {/* Background Image (Mass Production Racks) - Controlled via opacity class below */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/backgrounds/bulk-manufacturing-hero.jpg"
            alt="Bulk Manufacturing Production Line"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5C1A21]/0 via-[#461319]/40 to-[#5C1A21]/100" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#C5A869] font-medium px-3 py-1 bg-[#1C080B]/60 border border-[#A9812F]/40 rounded-full shadow-sm">
            B2B & Wholesale Production Partner
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wide leading-tight text-[#FBF6EC] drop-shadow-md">
            Bulk & Contract Manufacturing
          </h1>

          <div className="w-24 h-0.5 bg-[#A9812F] mx-auto" />

          <p className="text-base sm:text-lg text-[#E0D0BE] max-w-3xl mx-auto leading-relaxed font-light drop-shadow-sm">
            We take bulk orders. Bring your own fabric and design — our master tailors handle the stitching, construction, and finishing at scale. Ideal for retail brands and wholesale partners looking for skilled craftsmanship without an in-house production unit.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleWhatsAppBulk}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-widest font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Discuss Bulk Orders on WhatsApp</span>
            </button>

            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 border border-[#A9812F] text-[#FBF6EC] hover:bg-[#A9812F] hover:text-[#1C080B] text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer"
            >
              Schedule Factory / Atelier Visit
            </button>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS (3 SIMPLE STEPS) ==================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8F6B24] font-semibold block">
            Seamless Workflow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5C1A21]">
            How Contract Manufacturing Works
          </h2>
          <div className="w-16 h-0.5 bg-[#A9812F] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#F4ECE1] border border-[#E5D9C5] p-8 shadow-sm hover:border-[#A9812F] transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step Number Watermark */}
                <div className="absolute top-4 right-6 font-serif text-4xl font-bold text-[#DCD2C2] group-hover:text-[#A9812F]/40 transition-colors pointer-events-none">
                  {item.step}
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#5C1A21] border border-[#A9812F] flex items-center justify-center text-[#C5A869] shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#5C1A21] group-hover:text-[#421116] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#61534B] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5D9C5]/80 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8F6B24]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Quality Assured</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== TRUSTED BY SECTION ==================== */}
      <section className="py-16 sm:py-20 bg-[#F4ECE1] border-y border-[#E5D9C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#8F6B24] font-semibold block">
              Industry Partnerships
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5C1A21]">
              Trusted By Leading Ethnic Wear Brands
            </h2>
            <div className="w-16 h-0.5 bg-[#A9812F] mx-auto mt-2" />
            <p className="text-xs sm:text-sm text-[#61534B] font-serif italic pt-1">
              Proud manufacturing partner for India's finest names in menswear
            </p>
          </div>

          {/* Infinite Right-to-Left Continuous Scrolling Marquee (Full Color & 4 Large Cards per Screen) */}
          <div className="relative overflow-hidden w-full py-4">
            {/* Left & Right Soft Fade Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#F4ECE1] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#F4ECE1] to-transparent z-10 pointer-events-none" />

            {/* Seamless Infinite Marquee Track */}
            <div className="animate-marquee flex items-center gap-6">
              {[...brandLogos, ...brandLogos, ...brandLogos].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex items-center justify-center p-6 bg-[#FBF6EC] border-2 border-[#D5C8B5] rounded shadow-sm hover:border-[#A9812F] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-64 sm:w-72 md:w-80 h-32 sm:h-36 shrink-0 group cursor-pointer"
                  title={brand.name}
                >
                  <img
                    src={brand.src}
                    alt={brand.alt}
                    className="max-h-16 sm:max-h-20 max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<span class="font-serif font-bold text-sm uppercase text-[#5C1A21] text-center tracking-wider">${brand.name}</span>`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MANUFACTURING ADVANTAGES ==================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8F6B24] font-semibold block">
            Why Partner With M.S Fashion
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5C1A21]">
            Our Contract Manufacturing Capabilities
          </h2>
          <div className="w-16 h-0.5 bg-[#A9812F] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="bg-[#FBF6EC] border border-[#E5D9C5] p-6 shadow-sm hover:border-[#A9812F] transition-all space-y-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-[#5C1A21]/10 text-[#5C1A21] flex items-center justify-center font-bold text-xs">
                0{i + 1}
              </div>
              <h4 className="font-serif font-bold text-base text-[#5C1A21]">
                {h.title}
              </h4>
              <p className="text-xs text-[#6B5E55] leading-relaxed">
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== CTA SECTION (READY TO DISCUSS YOUR BULK ORDER REQUIREMENTS) ==================== */}
      <section className="relative bg-[#5C1A21] text-[#FBF6EC] py-16 sm:py-20 border-t-2 border-[#A9812F]/40 text-center overflow-hidden">
        {/* Background Image (Handshake) - Controlled via opacity class below */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/backgrounds/bulk-handshake-bg.jpg"
            alt="Business Partnership Handshake"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5C1A21]/0 via-[#461319]/40 to-[#5C1A21]/0" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#C5A869] font-medium px-3 py-1 bg-[#1C080B]/60 border border-[#A9812F]/40 rounded-full shadow-sm">
            Scale Your Brand With Us
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide drop-shadow-md">
            Ready to discuss your bulk order requirements?
          </h2>

          <p className="text-sm sm:text-base text-[#E0D0BE] max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
            Send us your expected quantities, fabric details, or reference designs directly on WhatsApp for an immediate consultation and commercial quotation.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleWhatsAppBulk}
              className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-widest font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Inquire for Bulk Orders on WhatsApp</span>
            </button>

            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 border border-[#A9812F] text-[#FBF6EC] hover:bg-[#A9812F] hover:text-[#1C080B] text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer"
            >
              Book Manufacturing Discussion
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
