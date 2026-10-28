import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, MapPin, Mail, Sparkles, Clock, Shield, Scissors, Navigation, ExternalLink } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export default function Footer() {
  const { brandConfig, getWhatsAppLink, setAppointmentModalOpen } = useConfig();

  const handleWhatsApp = () => {
    const msg = `Hello M.S Fashion, I would like to schedule a bespoke consultation for my upcoming celebration.`;
    window.open(getWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-[#1C080B] text-[#FBF6EC] border-t-2 border-[#A9812F]/40 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-[#A9812F]/20 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-10 h-10 rounded-full bg-[#5C1A21] border border-[#A9812F] flex items-center justify-center text-[#C5A869] mb-3">
              <Scissors className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#F4ECE1]">Master Bespoke Cut</h4>
            <p className="text-xs text-[#A8988C] mt-1">
              Hand-drafted master patterns crafted uniquely to your personal measurements.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="w-10 h-10 rounded-full bg-[#5C1A21] border border-[#A9812F] flex items-center justify-center text-[#C5A869] mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#F4ECE1]">Handcrafted Zardozi</h4>
            <p className="text-xs text-[#A8988C] mt-1">
              Authentic Indian artisan embroideries with antique dabka, kundan, and pure zari.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="w-10 h-10 rounded-full bg-[#5C1A21] border border-[#A9812F] flex items-center justify-center text-[#C5A869] mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#F4ECE1]">Pure Heritage Fabrics</h4>
            <p className="text-xs text-[#A8988C] mt-1">
              Handloom Banarasi katan, pure raw silk, velvet, and superfine Italian suiting wool.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="w-10 h-10 rounded-full bg-[#5C1A21] border border-[#A9812F] flex items-center justify-center text-[#C5A869] mb-3">
              <MessageSquare className="w-5 h-5 text-[#25D366]" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#F4ECE1]">Personal Stylist</h4>
            <p className="text-xs text-[#A8988C] mt-1">
              One-on-one virtual or in-atelier consultation via dedicated WhatsApp assistance.
            </p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12 border-b border-[#A9812F]/20">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logologo.jpeg"
                alt="M.S Fashion Logo"
                className="w-10 h-10 rounded-full object-cover border border-[#A9812F] shadow-sm bg-white"
              />
              <span className="font-serif font-bold text-2xl tracking-widest text-[#FBF6EC] uppercase">
                M.S Fashion
              </span>
            </div>
            <p className="text-xs text-[#C2B2A3] leading-relaxed pr-4">
              M.S Fashion is a bespoke ethnic menswear luxury label dedicated to crafting sovereign royal attire for grooms, royal weddings, and contract manufacturing for leading retail brands.
            </p>
            <div className="pt-2">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>WhatsApp Atelier Support</span>
              </button>
            </div>
          </div>

          {/* Categories Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-serif font-bold text-sm uppercase tracking-widest text-[#C5A869]">
              Atelier Collections
            </h5>
            <ul className="space-y-2 text-xs text-[#C2B2A3]">
              <li>
                <Link to="/ethnic-wear" className="hover:text-[#FBF6EC] transition-colors">
                  • Ethnic Wear Collections (4 Boutiques)
                </Link>
              </li>
              <li>
                <Link to="/bespoke-tailoring" className="hover:text-[#FBF6EC] transition-colors">
                  • Bespoke Made-to-Measure Tailoring
                </Link>
              </li>
              <li>
                <Link to="/bulk-orders" className="hover:text-[#FBF6EC] transition-colors text-[#C5A869]">
                  • Bulk & Contract Manufacturing (B2B)
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier Contact & Google Maps Location */}
          <div className="md:col-span-5 space-y-3">
            <h5 className="font-serif font-bold text-sm uppercase tracking-widest text-[#C5A869]">
              Boutique Atelier & Inquiries
            </h5>
            <div className="space-y-2 text-xs text-[#C2B2A3]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A9812F] shrink-0 mt-0.5" />
                <span>{brandConfig.boutiqueAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A9812F] shrink-0" />
                <span>{brandConfig.visitingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#A9812F] shrink-0" />
                <span>Direct Line: {brandConfig.displayPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#A9812F] shrink-0" />
                <span>Email: {brandConfig.email}</span>
              </div>
            </div>

            {/* Embedded Live Google Map Container */}
            <div className="pt-1 space-y-2">
              <div className="relative w-full h-36 rounded overflow-hidden border border-[#A9812F]/40 shadow-inner bg-[#241A17]">
                <iframe
                  title="MS Fashion Dharavi Mumbai Location Map"
                  src="https://maps.google.com/maps?q=MS+Fashion,+Sanaullah+Compound+besides,+Dharavi+Main+Rd,+Navrang+Compound,+Mumbai,+Maharashtra+400017&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* 1-Click Get Directions Navigation Button */}
              <a
                href={brandConfig.googleMapsUrl || 'https://maps.app.goo.gl/bK6BAQTHtguhqWo19'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] border border-[#A9812F] text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm group cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#C5A869] group-hover:rotate-45 transition-transform" />
                <span>Open in Google Maps • Get Live Directions</span>
                <ExternalLink className="w-3 h-3 text-[#C5A869]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A796F] gap-4">
          <div>
            © {new Date().getFullYear()} M.S Fashion. All Rights Reserved. Bespoke Ethnic Menswear.
          </div>
          <div>
            <Link
              to="/admin/login"
              className="text-[11px] text-[#A8988C] hover:text-[#C5A869] transition-colors flex items-center gap-1"
            >
              <span>🔒 Atelier Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
