import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    getWhatsAppLink,
    setAppointmentModalOpen
  } = useConfig();

  // =====================================================
  // ANNOUNCEMENT / TICKER PHRASES
  // =====================================================
  const tickerPhrases = [
    {
      text: 'Personal Consultation: Mon - Sat: 1:00 PM to 7:00 PM (By Appointment Only)',
      link: null
    },
    {
      text: 'Handcrafted Bespoke Ethnic Menswear • Tailored to Perfection',
      link: null
    },
    {
      text: 'We Also Take Bulk & Wholesale Orders',
      link: '/bulk-orders'
    }
  ];

  const [tickerIndex, setTickerIndex] = useState(0);

  // =====================================================
  // TICKER ROTATION
  // =====================================================
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(
        (prev) => (prev + 1) % tickerPhrases.length
      );
    }, 3200);

    return () => clearInterval(interval);
  }, [tickerPhrases.length]);

  // =====================================================
  // WHATSAPP
  // =====================================================
  const handleWhatsAppGeneral = () => {
    const msg = `Hello M.S Fashion,
I would like to inquire about your bespoke ethnic menswear collection and tailoring services.`;

    window.open(
      getWhatsAppLink(msg),
      '_blank',
      'noopener,noreferrer'
    );
  };

  const currentPhrase = tickerPhrases[tickerIndex];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF6EC]/95 backdrop-blur-md border-b border-[#E5D9C5] transition-all">

      {/* =====================================================
          TOP ANNOUNCEMENT BAR
      ====================================================== */}
      <div className="bg-[#5C1A21] text-[#FBF6EC] py-1.5 px-4 text-xs font-light tracking-widest border-b border-[#A9812F]/40 flex items-center justify-between min-h-[34px]">

        {/* LEFT ANNOUNCEMENT */}
        <div className="hidden lg:flex items-center text-[11px] text-[#E0D0BE] shrink-0">
          <span>
            Bespoke Menswear Atelier & Master Tailoring
          </span>
        </div>

        {/* CENTER TICKER */}
        <div className="flex-1 flex items-center justify-center overflow-hidden h-5 px-2 sm:px-4">

          <div
            key={tickerIndex}
            className="animate-sequential-ticker text-center whitespace-nowrap"
          >

            {currentPhrase.link ? (

              <Link
                to={currentPhrase.link}
                className="font-medium text-[11px] text-[#FBF6EC] hover:text-[#C5A869] transition-colors underline underline-offset-4 tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >

                <span>
                  {currentPhrase.text}
                </span>

                <span className="text-[9px] bg-[#A9812F] text-[#1C080B] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  B2B
                </span>

              </Link>

            ) : (

              <span className="font-medium text-[11px] text-[#F4ECE1] tracking-wider">
                {currentPhrase.text}
              </span>

            )}

          </div>

        </div>

        {/* RIGHT ANNOUNCEMENT - WHATSAPP */}
        <div className="hidden lg:flex items-center text-[11px] shrink-0">

          <button
            onClick={handleWhatsAppGeneral}
            className="flex items-center gap-1.5 text-[#C5A869] hover:text-white transition-colors font-sans"
          >

            <MessageSquare className="w-3 h-3 text-[#25D366]" />

            <span>
              WhatsApp Consultation: +91 8999386222
            </span>

          </button>

        </div>

      </div>


      {/* =====================================================
          MAIN NAVIGATION
      ====================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center h-20">

          {/* ==================== MOBILE MENU ==================== */}
          <div className="flex items-center lg:hidden">

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#5C1A21] hover:text-[#2B211D] focus:outline-none"
              aria-label="Toggle Navigation"
            >

              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}

            </button>

          </div>


          {/* ==================== BRAND LOGO ==================== */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">

            <Link
              to="/"
              className="inline-block group"
            >

              <div className="flex items-center justify-center lg:justify-start gap-3">

                {/* LOGO */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#A9812F]/60 shadow-sm bg-white flex-shrink-0">

                  <img
                    src="/logologo.jpeg"
                    alt="M.S Fashion Logo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                </div>

                {/* BRAND NAME */}
                <div className="flex flex-col text-left">

                  <span className="font-serif font-bold text-2xl sm:text-3xl tracking-widest text-[#5C1A21] leading-none uppercase group-hover:text-[#421116] transition-colors">
                    M.S Fashion
                  </span>

                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#A9812F] font-medium mt-1">
                    Bespoke Ethnic Menswear
                  </span>

                </div>

              </div>

            </Link>

          </div>


          {/* =====================================================
              DESKTOP NAVIGATION
              IMPROVED SPACING
          ====================================================== */}
          <nav className="hidden lg:flex flex-1 justify-center ml-8 xl:ml-12 mr-8 xl:mr-12">

            <div className="flex items-center justify-center gap-7 xl:gap-9">

              {/* HOME */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-xs uppercase font-medium tracking-widest py-2 transition-all duration-300 hover:scale-110 border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'border-[#5C1A21] text-[#5C1A21] font-semibold'
                      : 'border-transparent text-[#2B211D] hover:text-[#5C1A21] hover:border-[#A9812F]'
                  }`
                }
              >
                Home
              </NavLink>


              {/* ETHNIC WEAR */}
              <NavLink
                to="/ethnic-wear"
                className={({ isActive }) =>
                  `text-xs uppercase font-medium tracking-widest py-2 transition-all duration-300 hover:scale-110 border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'border-[#5C1A21] text-[#5C1A21] font-semibold'
                      : 'border-transparent text-[#2B211D] hover:text-[#5C1A21] hover:border-[#A9812F]'
                  }`
                }
              >
                Ethnic Wear
              </NavLink>


              {/* BESPOKE TAILORING */}
              <NavLink
                to="/bespoke-tailoring"
                className={({ isActive }) =>
                  `text-xs uppercase font-medium tracking-widest py-2 transition-all duration-300 hover:scale-110 border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'border-[#5C1A21] text-[#5C1A21] font-semibold'
                      : 'border-transparent text-[#2B211D] hover:text-[#5C1A21] hover:border-[#A9812F]'
                  }`
                }
              >
                Bespoke Tailoring
              </NavLink>


              {/* BULK ORDERS */}
              <NavLink
                to="/bulk-orders"
                className={({ isActive }) =>
                  `text-xs uppercase font-medium tracking-widest py-2 transition-all duration-300 hover:scale-110 border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'border-[#5C1A21] text-[#5C1A21] font-semibold'
                      : 'border-transparent text-[#2B211D] hover:text-[#5C1A21] hover:border-[#A9812F]'
                  }`
                }
              >
                Bulk Orders
              </NavLink>
            </div>

          </nav>


          {/* =====================================================
              ACTION BUTTONS
              WHATSAPP REMOVED FROM DESKTOP
          ====================================================== */}
          <div className="flex items-center gap-3 flex-none">

            {/* BOOK APPOINTMENT */}
            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#5C1A21] text-[#FBF6EC] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 whitespace-nowrap"
            >

              <Calendar className="w-3.5 h-3.5" />

              <span>
                Book Appointment
              </span>

            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      {mobileMenuOpen && (

        <div className="lg:hidden bg-[#FBF6EC] border-b border-[#E5D9C5] px-4 pt-2 pb-6 space-y-3 animate-fadeIn">

          <div className="flex flex-col space-y-2 pt-2 border-t border-[#E5D9C5]">

            {/* HOME */}
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-medium text-[#2B211D] hover:text-[#5C1A21] border-b border-[#E5D9C5]/50"
            >
              Home
            </Link>


            {/* ETHNIC WEAR */}
            <Link
              to="/ethnic-wear"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold text-[#5C1A21] hover:text-[#8F6B24] border-b border-[#E5D9C5]/50 flex items-center justify-between"
            >
              <span>
                Ethnic Wear (Sherwani, Jodhpuri, Indo-Western, Blazer)
              </span>
            </Link>


            {/* BESPOKE TAILORING */}
            <Link
              to="/bespoke-tailoring"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-medium text-[#2B211D] hover:text-[#5C1A21] border-b border-[#E5D9C5]/50"
            >
              Bespoke Made-to-Measure Tailoring
            </Link>


            {/* BULK ORDERS */}
            <Link
              to="/bulk-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold text-[#5C1A21] hover:text-[#8F6B24] border-b border-[#E5D9C5]/50 flex items-center justify-between"
            >

              <span>
                Bulk & Contract Manufacturing
              </span>

              <span className="text-[10px] bg-[#A9812F] text-[#1C080B] font-bold px-1.5 py-0.5 rounded uppercase">
                B2B
              </span>

            </Link>

          </div>


          {/* =====================================================
              MOBILE BUTTONS
          ====================================================== */}
          <div className="pt-4 flex flex-col gap-2">

            {/* BOOK APPOINTMENT */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAppointmentModalOpen(true);
              }}
              className="w-full py-2.5 border border-[#A9812F] text-[#5C1A21] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
            >

              <Calendar className="w-4 h-4" />

              <span>
                Book Appointment
              </span>

            </button>


            {/* MOBILE WHATSAPP */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsAppGeneral();
              }}
              className="w-full py-2.5 bg-[#25D366] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
            >

              <MessageSquare className="w-4 h-4 fill-white" />

              <span>
                Consult on WhatsApp
              </span>

            </button>

          </div>

        </div>

      )}

    </header>
  );
}