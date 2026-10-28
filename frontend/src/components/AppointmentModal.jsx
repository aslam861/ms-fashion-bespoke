import React, { useState, useRef, useEffect } from 'react';
import {
  X, Calendar, Clock, Store, Package, CheckCircle, MessageSquare,
  ChevronDown, Check, AlertCircle, Phone, Sparkles, MapPin, ExternalLink,
  Navigation, Mail, ShieldCheck, ArrowRight, RotateCcw, IndianRupee
} from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { api } from '../services/api';

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 India (+91)', digits: 10 },
  { code: '+971', label: '🇦🇪 UAE (+971)', digits: 9 },
  { code: '+44', label: '🇬🇧 UK (+44)', digits: 10 },
  { code: '+1', label: '🇺🇸 USA (+1)', digits: 10 }
];

const CATEGORY_OPTIONS = [
  { id: 'Sherwani', label: 'Imperial Wedding Sherwani' },
  { id: 'Jodhpuri', label: 'Aristocratic Jodhpuri Bandhgala' },
  { id: 'Indo-Western', label: 'Contemporary Indo-Western' },
  { id: 'Blazer', label: 'Bespoke Blazer / Velvet Tuxedo' }
];

export default function AppointmentModal() {
  const { appointmentModalOpen, setAppointmentModalOpen, getWhatsAppLink, brandConfig } = useConfig();

  // Wizard Steps: 'form' | 'otp' | 'success'
  const [step, setStep] = useState('form');

  // Form Fields
  const [appointmentType, setAppointmentType] = useState('custom-order');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneError, setPhoneError] = useState('');
  const [categoryInterest, setCategoryInterest] = useState('Sherwani');
  const [preferredDate, setPreferredDate] = useState('');
  const [customDateInput, setCustomDateInput] = useState('');
  const [budget, setBudget] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  // OTP Verification States
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [devOtp, setDevOtp] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Custom in-DOM dropdown states
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const categoryRef = useRef(null);
  const dateRef = useRef(null);
  const timerRef = useRef(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  // Auto-detect client city via browser geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const detectedCity = data.city || data.locality || data.principalSubdivision || 'Mumbai';
          setCity(detectedCity);
        } catch (err) {
          setCity('Mumbai');
        }
        setIsDetectingLocation(false);
      },
      () => {
        setIsDetectingLocation(false);
        setCity('Mumbai');
      },
      { timeout: 7000 }
    );
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!appointmentModalOpen) return null;

  // Phone formatting
  const cleanDigits = phoneNumber.replace(/\D/g, '');
  const handlePhoneChange = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
    if (cleaned.length === 10 || cleaned.length === 0) {
      setPhoneError('');
    }
  };

  // 1. Submit Details & Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPhoneError('');

    if (!name.trim()) return;

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid royal email address to receive your verification code.');
      return;
    }

    // Validate Phone only if entered (Phone is Optional)
    if (cleanDigits.length > 0) {
      if (countryCode === '+91' && cleanDigits.length !== 10) {
        setPhoneError('Please enter a valid 10-digit number or leave blank.');
        return;
      }
      if (countryCode !== '+91' && cleanDigits.length < 8) {
        setPhoneError('Please enter a valid phone number or leave blank.');
        return;
      }
    }

    setIsSendingOtp(true);
    setOtpError('');

    try {
      const res = await api.sendOtp({
        email: email.trim(),
        customerName: name.trim()
      });

      setDevOtp(res.devOtp || null);
      setStep('otp');
      setOtp('');
      setCountdown(60);
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Failed to dispatch verification code. Please try again.');
    }

    setIsSendingOtp(false);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isSendingOtp) return;
    setIsSendingOtp(true);
    setOtpError('');

    try {
      const res = await api.sendOtp({
        email: email.trim(),
        customerName: name.trim()
      });
      setDevOtp(res.devOtp || null);
      setCountdown(60);
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to resend verification code.');
    }
    setIsSendingOtp(false);
  };

  // 2. Verify OTP & Finalize Appointment
  const handleVerifyAndConfirm = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setOtpError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    const fullPhone = cleanDigits.length > 0 ? `${countryCode} ${cleanDigits}` : 'Not Provided';
    const selectedCatLabel = CATEGORY_OPTIONS.find(c => c.id === categoryInterest)?.label || categoryInterest;
    const estTotal = parseInt(String(budget).replace(/[^0-9]/g, ''), 10) || 0;

    try {
      // 1. Verify OTP
      await api.verifyOtp({
        email: email.trim(),
        otp: otp.trim()
      });

      // 2. Save verified consultation lead
      await api.submitInquiry({
        customerName: name.trim(),
        customerPhone: fullPhone,
        customerEmail: email.trim(),
        city: city.trim(),
        consultationType: appointmentType,
        productId: 'APPOINTMENT-' + categoryInterest.toUpperCase(),
        productTitle: `Bespoke Appointment (${selectedCatLabel})`,
        selectedAccessories: [],
        estimatedTotal: estTotal,
        budget: budget,
        notes: `Expected Budget: ${budget} | Preferred Date: ${preferredDate || 'Earliest Available'} | Format: ${appointmentType} | Notes: ${notes}`,
        otp: otp.trim()
      });

      setStep('success');
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid or expired verification code.');
    }

    setIsVerifying(false);
  };

  // Direct WhatsApp Booking fallback
  const handleWhatsAppBooking = () => {
    const typeLabel = appointmentType === 'bulk-order' ? 'Bulk Order (Size-Range)' : 'Custom Order (Made-to-Measure)';
    const selectedCatLabel = CATEGORY_OPTIONS.find(c => c.id === categoryInterest)?.label || categoryInterest;
    const fullPhone = cleanDigits.length > 0 ? `${countryCode} ${cleanDigits}` : 'Via WhatsApp';

    const msg = `*👑 APPOINTMENT CONFIRMED — M.S FASHION*\n\nHello M.S Fashion Team,\nI have verified my bespoke appointment request:\n\n*Name:* ${name || 'Prospective Client'}\n*Email (Verified):* ${email}\n*Phone:* ${fullPhone}\n*Consultation Format:* ${typeLabel}\n*Category of Interest:* ${selectedCatLabel}\n*Expected Budget:* ${budget}\n*Preferred Date:* ${preferredDate || 'Earliest Available'}\n*City:* ${city || 'Not Specified'}\n*Notes:* ${notes || 'Looking forward to royal consultation.'}`;
    window.open(getWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    setAppointmentModalOpen(false);
    setStep('form');
    setPhoneNumber('');
    setName('');
    setEmail('');
    setOtp('');
    setDevOtp(null);
    setPhoneError('');
    setEmailError('');
    setOtpError('');
    setCategoryDropdownOpen(false);
    setDatePickerOpen(false);
  };

  // Quick Date presets
  const setQuickDate = (daysAhead, label) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const formatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setPreferredDate(`${label} (${formatted})`);
    setCustomDateInput('');
    setDatePickerOpen(false);
  };

  // Apply calendar date without premature closing glitch
  const applyCalendarDate = (dateVal) => {
    if (!dateVal) return;
    const parts = dateVal.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const dateObj = new Date(y, m, d);
      if (!isNaN(dateObj.getTime())) {
        const formatted = dateObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        setPreferredDate(formatted);
        setDatePickerOpen(false);
        return;
      }
    }
    setPreferredDate(dateVal);
    setDatePickerOpen(false);
  };

  const selectedCatLabel = CATEGORY_OPTIONS.find(c => c.id === categoryInterest)?.label || 'Imperial Wedding Sherwani';

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#2B211D]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FBF6EC] border-2 border-[#A9812F] shadow-2xl rounded-none overflow-hidden my-auto">
        {/* Header Ribbon */}
        <div className="bg-[#5C1A21] text-[#FBF6EC] p-4 sm:p-5 flex items-center justify-between border-b border-[#A9812F]/40">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#C5A869] font-semibold block">
              Bespoke Tailoring Experience
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FBF6EC] tracking-wide">
              {step === 'otp' ? 'Email OTP Verification' : 'Book a Private Consultation'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-[#FBF6EC]/80 hover:text-[#FBF6EC] hover:bg-[#461319] rounded-full transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ==================== STEP 3: SUCCESS VOUCHER ==================== */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#5C1A21] text-[#C5A869] border-2 border-[#A9812F] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-9 h-9 text-[#25D366]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#5C1A21]">
              Consultation Appointment Confirmed
            </h3>
            <p className="text-xs sm:text-sm text-[#574940] max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-[#2B211D]">{name}</strong>. Your royal consultation request has been verified and securely registered with our master atelier.
            </p>

            {/* Verified Credentials Summary Card */}
            <div className="bg-[#ECE2D2] border border-[#D5C8B5] p-3.5 max-w-sm mx-auto text-left space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#7A6E65]">Verified Email:</span>
                <span className="font-mono font-bold text-[#5C1A21] flex items-center gap-1">
                  <span>{email}</span>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A6E65]">Phone Contact:</span>
                <span className="font-mono text-[#2B211D]">
                  {cleanDigits.length > 0 ? `${countryCode} ${cleanDigits}` : 'Not Provided'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A6E65]">Silhouette:</span>
                <span className="font-serif font-semibold text-[#5C1A21]">{selectedCatLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A6E65]">Expected Budget:</span>
                <span className="font-semibold text-[#5C1A21]">{budget}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A6E65]">Preferred Date:</span>
                <span className="font-medium text-[#2B211D]">{preferredDate || 'Earliest Available'}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Open in WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 border border-[#5C1A21] text-[#5C1A21] text-xs uppercase tracking-widest font-semibold hover:bg-[#EAE2D5] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 2: OTP VERIFICATION ==================== */}
        {step === 'otp' && (
          <div className="p-6 sm:p-7 space-y-5 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#5C1A21]/10 border border-[#A9812F]/40 flex items-center justify-center mx-auto text-[#5C1A21]">
                <ShieldCheck className="w-6 h-6 text-[#5C1A21]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#5C1A21]">
                Verify Your Royal Email
              </h3>
              <p className="text-xs text-[#6B5E55] max-w-sm mx-auto">
                A 6-digit verification code has been dispatched to:
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ECE2D2] border border-[#D5C8B5] text-xs font-mono font-bold text-[#5C1A21]">
                <Mail className="w-3.5 h-3.5 text-[#A9812F]" />
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setOtp('');
                    setOtpError('');
                  }}
                  className="text-[10px] text-[#A9812F] underline hover:text-[#5C1A21] ml-1 cursor-pointer font-sans"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Zero-Setup Dev Mode Banner */}
            {devOtp && (
              <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>[Testing Mode Active]</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  SMTP is running in dev mode. Your test OTP is:
                  <strong className="font-mono text-sm tracking-widest text-[#5C1A21] ml-2 px-2 py-0.5 bg-amber-100 border border-amber-400">
                    {devOtp}
                  </strong>
                </p>
              </div>
            )}

            {/* 6-Digit Code Input */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-center text-[#4A3E38] uppercase tracking-wider">
                Enter 6-Digit Verification Code
              </label>
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(val);
                    setOtpError('');
                  }}
                  placeholder="••••••"
                  className="w-full text-center text-2xl font-mono font-bold tracking-[0.4em] py-3 bg-white border-2 border-[#A9812F] focus:border-[#5C1A21] focus:ring-2 focus:ring-[#5C1A21]/20 outline-none text-[#5C1A21]"
                />
              </div>

              {otpError && (
                <p className="text-xs text-red-600 font-semibold text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{otpError}</span>
                </p>
              )}
            </div>

            {/* Resend Timer */}
            <div className="text-center text-xs text-[#7A6E65]">
              {countdown > 0 ? (
                <p className="flex items-center justify-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-[#A9812F]" />
                  <span>Resend code in <strong>{countdown}s</strong></span>
                </p>
              ) : (
                <button
                  type="button"
                  disabled={isSendingOtp}
                  onClick={handleResendOtp}
                  className="text-xs font-bold text-[#5C1A21] hover:text-[#8F6B24] underline transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isSendingOtp ? 'Sending new code...' : 'Didn’t receive code? Resend OTP'}</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E5D9C5] gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setOtp('');
                  setOtpError('');
                }}
                className="px-4 py-2.5 border border-[#D5C8B5] text-[#5C1A21] hover:bg-[#EAE2D5] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
              >
                Back to Details
              </button>

              <button
                type="button"
                disabled={otp.length !== 6 || isVerifying}
                onClick={handleVerifyAndConfirm}
                className={`flex-1 py-3 px-6 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  otp.length === 6 && !isVerifying
                    ? 'bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] border border-[#A9812F]'
                    : 'bg-[#B0A59A] text-white cursor-not-allowed opacity-70'
                }`}
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#FBF6EC] border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#C5A869]" />
                    <span>Verify & Confirm</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 1: CLIENT DETAILS FORM ==================== */}
        {step === 'form' && (
          <form onSubmit={handleRequestOtp} className="p-5 sm:p-6 space-y-4">
            {/* Consultation Format */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C1A21] mb-2">
                Select Consultation Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAppointmentType('custom-order')}
                  className={`p-3 border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    appointmentType === 'custom-order'
                      ? 'border-[#5C1A21] bg-[#F4ECE1] ring-2 ring-[#5C1A21]/30 shadow-sm'
                      : 'border-[#D5C8B5] bg-white opacity-80 hover:opacity-100'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#5C1A21] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-serif font-bold text-sm text-[#2B211D] block">Single Bespoke Fitting</span>
                    <span className="text-[11px] text-[#7A6E65] leading-tight block mt-0.5">
                      Personal made-to-measure tailoring for grooms & individual celebrations
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAppointmentType('bulk-order')}
                  className={`p-3 border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    appointmentType === 'bulk-order'
                      ? 'border-[#5C1A21] bg-[#F4ECE1] ring-2 ring-[#5C1A21]/30 shadow-sm'
                      : 'border-[#D5C8B5] bg-white opacity-80 hover:opacity-100'
                  }`}
                >
                  <Package className="w-4 h-4 text-[#5C1A21] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-serif font-bold text-sm text-[#2B211D] block">Bulk Order</span>
                    <span className="text-[11px] text-[#7A6E65] leading-tight block mt-0.5">
                      For retail brands & wholesale partners ordering in batch quantities
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Client Info Grid (Full Name & Mandatory Email for OTP) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#4A3E38] uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singh"
                  className="w-full bg-white border border-[#D5C8B5] px-3 py-2 text-xs font-medium text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                />
              </div>

              {/* Email Address (Mandatory with OTP verification) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#4A3E38] uppercase">
                    Email Address *
                  </label>
                  <span className="text-[10px] text-[#8F6B24] font-semibold">
                    OTP Verification
                  </span>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="name@example.com"
                  className={`w-full bg-white border px-3 py-2 text-xs font-medium text-[#2B211D] focus:outline-none ${
                    emailError ? 'border-red-500 bg-red-50' : 'border-[#D5C8B5] focus:border-[#5C1A21]'
                  }`}
                />
                {emailError && (
                  <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Phone & Category Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Phone / WhatsApp */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#4A3E38] uppercase">
                    Phone / WhatsApp
                  </label>
                  {cleanDigits.length > 0 && (
                    <span className={`text-[10px] font-mono font-semibold ${
                      cleanDigits.length === 10 ? 'text-emerald-700 font-bold' : 'text-[#8C7E74]'
                    }`}>
                      {cleanDigits.length}/10 Digits {cleanDigits.length === 10 && '✓'}
                    </span>
                  )}
                </div>

                <div className="flex gap-1.5">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-[#EAE2D5] border border-[#D5C8B5] px-2 py-2 text-xs font-mono font-bold text-[#5C1A21] focus:outline-none focus:border-[#5C1A21] cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>

                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className={`w-full bg-white border px-3 py-2 text-xs font-mono font-semibold text-[#2B211D] focus:outline-none ${
                        phoneError
                          ? 'border-red-500 bg-red-50'
                          : cleanDigits.length === 10
                          ? 'border-emerald-600 bg-emerald-50/20'
                          : 'border-[#D5C8B5] focus:border-[#5C1A21]'
                      }`}
                    />
                  </div>
                </div>

                {phoneError && (
                  <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{phoneError}</span>
                  </p>
                )}
              </div>

              {/* 1. Custom Category Dropdown */}
              <div ref={categoryRef} className="relative">
                <label className="block text-xs font-bold text-[#4A3E38] uppercase mb-1">
                  Category of Interest
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryDropdownOpen(!categoryDropdownOpen);
                    setDatePickerOpen(false);
                  }}
                  className="w-full bg-white border border-[#D5C8B5] hover:border-[#5C1A21] px-3 py-2 text-xs font-semibold text-[#2B211D] flex items-center justify-between transition-colors text-left cursor-pointer shadow-sm"
                >
                  <span className="truncate">{selectedCatLabel}</span>
                  <ChevronDown className="w-4 h-4 text-[#5C1A21] shrink-0" />
                </button>

                {/* In-DOM Custom Dropdown Popup */}
                {categoryDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#FBF6EC] border-2 border-[#5C1A21] shadow-2xl z-50 py-1 animate-fadeIn">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const isSelected = categoryInterest === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setCategoryInterest(cat.id);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#5C1A21] text-[#FBF6EC] font-bold'
                              : 'text-[#2B211D] hover:bg-[#EAE2D5]'
                          }`}
                        >
                          <span>{cat.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A869]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Preferred Date & Expected Budget Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Custom Date Picker Selector */}
              <div ref={dateRef} className="relative">
                <label className="block text-xs font-bold text-[#4A3E38] uppercase mb-1">
                  Preferred Date
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setDatePickerOpen(!datePickerOpen);
                    setCategoryDropdownOpen(false);
                  }}
                  className="w-full bg-white border border-[#D5C8B5] hover:border-[#5C1A21] px-3 py-2 text-xs font-semibold text-[#2B211D] flex items-center justify-between transition-colors text-left cursor-pointer shadow-sm"
                >
                  <span className="truncate flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#5C1A21] shrink-0" />
                    <span>{preferredDate || 'Choose Date or Quick Select'}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {preferredDate && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreferredDate('');
                          setCustomDateInput('');
                        }}
                        className="text-[10px] text-red-600 hover:text-red-800 font-bold px-1 hover:underline cursor-pointer"
                        title="Clear preferred date"
                      >
                        ✕
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4 text-[#5C1A21] shrink-0" />
                  </div>
                </button>

                {/* In-DOM Custom Date Popup */}
                {datePickerOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#FBF6EC] border-2 border-[#5C1A21] shadow-2xl z-50 p-3 space-y-3 animate-fadeIn">
                    <div className="px-2 py-1 bg-[#5C1A21] text-[#FBF6EC] text-[10px] font-mono uppercase tracking-widest font-bold text-center">
                      Quick Scheduling Options
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQuickDate(0, 'Today')}
                        className="px-2.5 py-1.5 bg-[#EAE2D5] hover:bg-[#5C1A21] hover:text-[#FBF6EC] text-[#5C1A21] text-[11px] font-semibold transition-colors text-center border border-[#D5C8B5] cursor-pointer"
                      >
                        ⚡ Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickDate(1, 'Tomorrow')}
                        className="px-2.5 py-1.5 bg-[#EAE2D5] hover:bg-[#5C1A21] hover:text-[#FBF6EC] text-[#5C1A21] text-[11px] font-semibold transition-colors text-center border border-[#D5C8B5] cursor-pointer"
                      >
                        📅 Tomorrow
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickDate(3, 'This Weekend')}
                        className="px-2.5 py-1.5 bg-[#EAE2D5] hover:bg-[#5C1A21] hover:text-[#FBF6EC] text-[#5C1A21] text-[11px] font-semibold transition-colors text-center border border-[#D5C8B5] cursor-pointer"
                      >
                        👑 This Weekend
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickDate(7, 'Next Week')}
                        className="px-2.5 py-1.5 bg-[#EAE2D5] hover:bg-[#5C1A21] hover:text-[#FBF6EC] text-[#5C1A21] text-[11px] font-semibold transition-colors text-center border border-[#D5C8B5] cursor-pointer"
                      >
                        ✨ Next Week
                      </button>
                    </div>

                    <div className="pt-2 border-t border-[#E5D9C5] space-y-1.5">
                      <label className="block text-[10px] font-bold text-[#5C1A21] uppercase">
                        Or Pick Specific Calendar Date:
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={customDateInput}
                          onChange={(e) => setCustomDateInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (customDateInput) applyCalendarDate(customDateInput);
                            }
                          }}
                          className="flex-1 bg-white border border-[#A9812F] focus:border-[#5C1A21] px-2 py-1.5 text-xs text-[#2B211D] font-mono outline-none"
                        />
                        <button
                          type="button"
                          disabled={!customDateInput}
                          onClick={() => applyCalendarDate(customDateInput)}
                          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                            customDateInput
                              ? 'bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] cursor-pointer shadow-sm'
                              : 'bg-[#D5C8B5] text-[#8C7E74] cursor-not-allowed'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Expected Budget Input (User's Self Budget - No Hardcoded Options) */}
              <div>
                <label className="block text-xs font-bold text-[#4A3E38] uppercase mb-1">
                  Expected Budget (Self Budget)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="w-3.5 h-3.5 text-[#A9812F]" />
                  </div>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Enter your budget (e.g. 50,000)"
                    className="w-full bg-white border border-[#D5C8B5] hover:border-[#5C1A21] pl-8 pr-3 py-2 text-xs font-semibold text-[#2B211D] placeholder-[#A49488] focus:outline-none focus:border-[#5C1A21] focus:ring-1 focus:ring-[#5C1A21] rounded-none transition-colors shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* City & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#4A3E38] uppercase whitespace-nowrap">
                    City / Location
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="text-[10px] text-[#A9812F] hover:text-[#5C1A21] font-semibold flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                    title="Auto-detect city from GPS"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{isDetectingLocation ? 'Detecting...' : 'Auto-Detect'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Delhi"
                  className="w-full bg-white border border-[#D5C8B5] px-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3E38] uppercase mb-1">
                  Occasion Date & Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Wedding on Dec 2026, need matching safa..."
                  className="w-full bg-white border border-[#D5C8B5] px-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                />
              </div>
            </div>

            {/* Atelier Physical Location Reference Badge */}
            <div className="text-[11px] text-[#6E5D52] bg-[#F4ECE1] p-2.5 border border-[#D5C8B5] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#A9812F] shrink-0" />
                <span className="truncate">Atelier: Sanaullah Compound, Dharavi Main Rd, Mahim (East), Mumbai</span>
              </div>
              <a
                href={brandConfig.googleMapsUrl || 'https://maps.app.goo.gl/bK6BAQTHtguhqWo19'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5C1A21] font-bold underline hover:text-[#461319] shrink-0 flex items-center gap-1 text-[10px] uppercase tracking-wider"
              >
                <span>View on Maps</span>
                <ExternalLink className="w-3 h-3 text-[#A9812F]" />
              </a>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E5D9C5]">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 border border-[#D5C8B5] text-[#5C1A21] hover:bg-[#EAE2D5] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 border border-[#A9812F] cursor-pointer"
              >
                {isSendingOtp ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#FBF6EC] border-t-transparent rounded-full animate-spin" />
                    <span>Sending OTP Code...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Verify Email</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A869]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
