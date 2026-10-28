import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Sparkles, Ruler, ShieldCheck, MessageSquare, Calendar, CheckCircle2, ChevronRight, UserCheck, Eye } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import PlaceholderBox from '../components/PlaceholderBox';

export default function BespokeTailoringPage() {
  const { setAppointmentModalOpen, getWhatsAppLink } = useConfig();

  const handleWhatsAppBespoke = () => {
    const msg = `Hello M.S Fashion,\nI am interested in a private custom made-to-measure bespoke fitting for my upcoming wedding/occasion.`;
    window.open(getWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  const bespokeFeatures = [
    {
      title: 'Individual Measurement & Posture Calibration',
      desc: 'We draft every single piece around your distinct posture, shoulder slope, armhole ergonomics, and chest curvature for an authoritative royal fit.',
      icon: Ruler
    },
    {
      title: 'Artisanal Hand Zardozi & Resham Craftsmanship',
      desc: 'Heirloom hand-embroidery using antique dabka, kundan stones, French knots, and pure gold zari, created one stitch at a time by heritage artisans.',
      icon: Sparkles
    },
    {
      title: 'Structured Canvas Construction',
      desc: 'Premium floating canvas tailoring that molds seamlessly to your chest and shoulders, delivering unmatched drape and longevity without stiff adhesives.',
      icon: Scissors
    },
    {
      title: 'Interactive Accessory Coordination',
      desc: 'Complete styling with coordinated safas, kundan malas, matching velvet mojdis, antique brooches, pocket squares, and dupattas.',
      icon: Eye
    }
  ];

  return (
    <div className="bg-[#FBF6EC] min-h-screen text-[#2B211D]">
      {/* ==================== HERO SECTION (CUSTOM BESPOKE MADE-TO-MEASURE) ==================== */}
      <section className="relative bg-[#5C1A21] text-[#FBF6EC] py-16 sm:py-24 border-b-2 border-[#A9812F]/40 overflow-hidden">
        {/* Background Image (Master Tailor Measuring Client) - Controlled via opacity class below */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/backgrounds/bespoke-master-tailor.jpg"
            alt="Master Tailor Measuring Bespoke Client"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5C1A21]/0 via-[#461319]/30 to-[#5C1A21]/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#C5A869] font-medium px-3 py-1 bg-[#1C080B]/60 border border-[#A9812F]/40 rounded-full shadow-sm">
            The Haute Couture Atelier
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wide leading-tight text-[#FBF6EC] drop-shadow-md">
            Custom Bespoke Made-to-Measure
          </h1>

          <div className="w-24 h-0.5 bg-[#A9812F] mx-auto" />

          <p className="text-base sm:text-lg text-[#E0D0BE] max-w-3xl mx-auto leading-relaxed font-light drop-shadow-sm">
            Every royal sherwani, aristocrat bandhgala, and tailored suit is crafted exclusively for one person — you. Experience master-level fitting, heritage hand-embroidery, and personal styling designed for life's most unforgettable occasions.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#A9812F] hover:bg-[#8F6B24] text-[#1C080B] text-xs uppercase tracking-widest font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Private Fitting Session</span>
            </button>

            <button
              onClick={handleWhatsAppBespoke}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-widest font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Consult Stylist on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== THE BESPOKE EXPERIENCE PILLARS ==================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8F6B24] font-semibold block">
            The Sovereign Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5C1A21]">
            Our Tailoring Hallmarks
          </h2>
          <div className="w-16 h-0.5 bg-[#A9812F] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bespokeFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-[#F4ECE1] border border-[#E5D9C5] p-8 shadow-sm hover:border-[#A9812F] transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#5C1A21] border border-[#A9812F] flex items-center justify-center text-[#C5A869] shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#5C1A21] group-hover:text-[#421116] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#61534B] leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5D9C5]/80 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8F6B24]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>100% Customized Fit</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== CTA SECTION (READY TO CRAFT YOUR CUSTOM ROYAL ENSEMBLE) ==================== */}
      <section className="relative bg-[#5C1A21] text-[#FBF6EC] py-16 sm:py-20 border-t-2 border-[#A9812F]/40 text-center overflow-hidden">
        {/* Background Image (Embroidered Velvet Fabric) - Controlled via opacity class below */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/backgrounds/bespoke-fabric-cta.jpg"
            alt="Royal Embroidered Velvet Fabric"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5C1A21]/0 via-[#461319]/40 to-[#5C1A21]/0" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#C5A869] font-medium px-3 py-1 bg-[#1C080B]/60 border border-[#A9812F]/40 rounded-full shadow-sm">
            Begin Your Atelier Journey
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide drop-shadow-md">
            Ready to craft your custom royal ensemble?
          </h2>

          <p className="text-sm sm:text-base text-[#E0D0BE] max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
            Visit our boutique atelier in Mumbai or coordinate live fabric swatches and measurement guidance with our master stylist on WhatsApp.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/ethnic-wear"
              className="w-full sm:w-auto px-8 py-4 bg-[#A9812F] hover:bg-[#8F6B24] text-[#1C080B] text-xs uppercase tracking-widest font-bold shadow-lg transition-all"
            >
              Browse Ethnic Wear Collections
            </Link>

            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 border border-[#A9812F] text-[#FBF6EC] hover:bg-[#A9812F] hover:text-[#1C080B] text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer"
            >
              Book Private Fitting Appointment
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
