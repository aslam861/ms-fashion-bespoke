import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Check, AlertCircle, Store, Phone, Clock, MapPin, Sparkles, Mail, Key, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useConfig } from '../../context/ConfigContext';

export default function StoreSettingsTab() {
  const { brandConfig, refreshBrandConfig } = useConfig();

  const [tickerMessages, setTickerMessages] = useState([
    '👑 ATELIER TIMINGS: MON - SAT (1:00 PM - 7:00 PM) • VISIT FOR BESPOKE MEASUREMENTS',
    '✨ M.S FASHION — MASTER CRAFTSMEN OF ROYAL SHERWANIS, JODHPURIS & BESPOKE BLAZERS',
    '📦 BULK & BRAND CONTRACT MANUFACTURING AVAILABLE — EXPLORE BULK ORDERS'
  ]);
  const [visitingHours, setVisitingHours] = useState('Mon - Sat: 1:00 PM - 7:00 PM');
  const [displayPhone, setDisplayPhone] = useState('+91 89993 86222');
  const [whatsappPhone, setWhatsappPhone] = useState('918999386222');
  const [email, setEmail] = useState('msfashionbespoke@gmail.com');
  const [smtpEmail, setSmtpEmail] = useState('msfashionbespoke@gmail.com');
  const [smtpPassword, setSmtpPassword] = useState('mcas gpvn oupu ztfb');
  const [showPassword, setShowPassword] = useState(false);
  const [boutiqueAddress, setBoutiqueAddress] = useState(
    'Ground Floor, 10/A, Sanaullah Compound, Near Sauda Bakery, Dharavi Main Road, Mahim (East), Mumbai - 400017, Maharashtra'
  );
  const [googleMapsUrl, setGoogleMapsUrl] = useState('https://maps.app.goo.gl/bK6BAQTHtguhqWo19');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Test Email state
  const [testEmailInput, setTestEmailInput] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testSuccess, setTestSuccess] = useState('');
  const [testError, setTestError] = useState('');

  useEffect(() => {
    if (brandConfig) {
      if (brandConfig.tickerMessages && Array.isArray(brandConfig.tickerMessages)) {
        setTickerMessages(brandConfig.tickerMessages);
      }
      if (brandConfig.visitingHours) setVisitingHours(brandConfig.visitingHours);
      if (brandConfig.displayPhone) setDisplayPhone(brandConfig.displayPhone);
      if (brandConfig.whatsappPhone) setWhatsappPhone(brandConfig.whatsappPhone);
      if (brandConfig.email) setEmail(brandConfig.email);
      if (brandConfig.smtpEmail) setSmtpEmail(brandConfig.smtpEmail);
      if (brandConfig.smtpPassword) setSmtpPassword(brandConfig.smtpPassword);
      if (brandConfig.boutiqueAddress) setBoutiqueAddress(brandConfig.boutiqueAddress);
      if (brandConfig.googleMapsUrl) setGoogleMapsUrl(brandConfig.googleMapsUrl);
    }
  }, [brandConfig]);

  const handleAddTicker = () => {
    setTickerMessages([...tickerMessages, '✨ NEW ANNOUNCEMENT • M.S FASHION ATELIER']);
  };

  const handleUpdateTicker = (index, val) => {
    const updated = [...tickerMessages];
    updated[index] = val;
    setTickerMessages(updated);
  };

  const handleRemoveTicker = (index) => {
    if (tickerMessages.length <= 1) {
      alert('At least one announcement ticker message is required.');
      return;
    }
    setTickerMessages(tickerMessages.filter((_, i) => i !== index));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await api.updateBrandConfig({
        brandName: 'M.S Fashion',
        tagline: 'The Art of Bespoke Ethnic Menswear',
        tickerMessages,
        visitingHours,
        displayPhone,
        whatsappPhone,
        email: email.trim(),
        smtpEmail: smtpEmail.trim(),
        smtpPassword: smtpPassword.trim(),
        boutiqueAddress,
        googleMapsUrl
      });

      setSuccessMsg('Store settings, email address and OTP credentials updated successfully!');
      if (refreshBrandConfig) refreshBrandConfig();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to save settings');
    }
    setSaving(false);
  };

  const handleTestEmail = async () => {
    const target = testEmailInput.trim() || email.trim() || smtpEmail.trim();
    if (!target) {
      setTestError('Please provide an email address to send the test verification code.');
      return;
    }
    setTestingEmail(true);
    setTestSuccess('');
    setTestError('');
    try {
      const res = await api.sendTestEmail(target);
      setTestSuccess(res.message || `Test OTP email successfully sent to ${target}!`);
      setTimeout(() => setTestSuccess(''), 7000);
    } catch (err) {
      setTestError(err.response?.data?.message || err.message || 'Failed to dispatch test email.');
    }
    setTestingEmail(false);
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
      {successMsg && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-green-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-700" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Announcement Bar Ticker Editor */}
      <div className="bg-[#F4ECE1] p-5 border border-[#E5D9C5] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5D9C5]">
          <div>
            <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider">
              1. Top Announcement Bar (Maroon Ticker)
            </h3>
            <p className="text-[11px] text-[#7A6E65]">
              These announcements cycle continuously at the very top of the website.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddTicker}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-semibold uppercase tracking-wider transition-colors shadow cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C5A869]" />
            <span>Add Slide</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {tickerMessages.map((msg, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-6 text-center font-mono text-xs font-bold text-[#A9812F]">
                #{index + 1}
              </span>
              <input
                type="text"
                value={msg}
                onChange={(e) => handleUpdateTicker(index, e.target.value)}
                className="flex-1 bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-xs text-[#2B211D] font-medium focus:outline-none focus:border-[#5C1A21]"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveTicker(index)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
                title="Remove announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Boutique Contact & Hours */}
      <div className="bg-[#F4ECE1] p-5 border border-[#E5D9C5] space-y-4">
        <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider pb-3 border-b border-[#E5D9C5]">
          2. Atelier Contact & Visiting Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">
              Visiting Hours & Days
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-[#A9812F] absolute left-3 top-2.5" />
              <input
                type="text"
                value={visitingHours}
                onChange={(e) => setVisitingHours(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-9 pr-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">
              Display Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#A9812F] absolute left-3 top-2.5" />
              <input
                type="text"
                value={displayPhone}
                onChange={(e) => setDisplayPhone(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-9 pr-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">
              WhatsApp Integration Number (No spaces or +)
            </label>
            <input
              type="text"
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              placeholder="918999386222"
              className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-xs font-mono text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#4A3E38] uppercase">
                Boutique Public Email Address
              </label>
              {email && (
                <button
                  type="button"
                  onClick={() => setSmtpEmail(email)}
                  className="text-[10px] text-[#A9812F] hover:underline font-semibold cursor-pointer"
                  title="Copy to OTP Sender Gmail"
                >
                  Sync to OTP Sender ➔
                </button>
              )}
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A9812F] absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="msfashionbespoke@gmail.com"
                className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-9 pr-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
              />
            </div>
            <span className="text-[10px] text-[#7A6E65] block mt-0.5">
              Public contact email displayed in the website footer, booking confirmations, and customer receipts.
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">
            Boutique Atelier Address (Dharavi, Mumbai)
          </label>
          <textarea
            value={boutiqueAddress}
            onChange={(e) => setBoutiqueAddress(e.target.value)}
            rows={2}
            className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">
            Google Maps Business Link / Directions URL
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#A9812F] absolute left-3 top-2.5" />
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-9 pr-3 py-2 text-xs font-mono text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
              required
            />
          </div>
          <span className="text-[11px] text-[#8C7E74] block mt-1">
            Controls the interactive map pin and the "Get Directions on Google Maps" button across the website.
          </span>
        </div>
      </div>

      {/* 3. Customer Appointment OTP & Email Delivery Service (Gmail SMTP) */}
      <div className="bg-[#F4ECE1] p-5 border border-[#E5D9C5] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5D9C5]">
          <div>
            <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider flex items-center gap-2">
              <span>3. Customer Appointment OTP & Mailer Service</span>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                smtpEmail && smtpPassword
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {smtpEmail && smtpPassword ? '🟢 Live Gmail Connected' : '🟡 Dev Testing Mode Active'}
              </span>
            </h3>
            <p className="text-[11px] text-[#7A6E65]">
              Used to send 6-digit OTP verification codes directly to customers' inboxes when booking bespoke appointments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">
              Sender Gmail Address (SMTP User)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A9812F] absolute left-3 top-2.5" />
              <input
                type="email"
                value={smtpEmail}
                onChange={(e) => setSmtpEmail(e.target.value)}
                placeholder="msfashionbespoke@gmail.com"
                className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-9 pr-3 py-2 text-xs font-mono text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
              />
            </div>
            <span className="text-[10px] text-[#7A6E65] block mt-0.5">
              The Gmail address from which verification OTPs are emailed to customers.
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#4A3E38] uppercase">
                Google 16-Digit App Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] text-[#A9812F] hover:underline font-semibold cursor-pointer"
              >
                {showPassword ? 'Hide Password' : 'Show Password'}
              </button>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-[#A9812F] absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
                placeholder="xxxx xxxx xxxx xxxx"
                className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-9 pr-3 py-2 text-xs font-mono text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
              />
            </div>
            <span className="text-[10px] text-[#7A6E65] block mt-0.5">
              Generated in Google Account ➔ Security ➔ 2-Step Verification ➔ App passwords.
            </span>
          </div>
        </div>

        {/* Live Test Email Tool */}
        <div className="pt-3 border-t border-[#E5D9C5] bg-[#EAE0D2] p-3.5 rounded">
          <label className="block text-[11px] font-bold text-[#5C1A21] uppercase tracking-wider mb-1">
            ⚡ Test Email Verification Dispatch (Check Live Inbox)
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="email"
              value={testEmailInput}
              onChange={(e) => setTestEmailInput(e.target.value)}
              placeholder={`Send test verification OTP to (defaults to ${smtpEmail || 'your email'})`}
              className="flex-1 bg-white border border-[#D5C8B5] px-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
            />
            <button
              type="button"
              disabled={testingEmail}
              onClick={handleTestEmail}
              className="px-5 py-2 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#C5A869]" />
              <span>{testingEmail ? 'Sending...' : 'Send Test OTP'}</span>
            </button>
          </div>

          {testSuccess && (
            <div className="mt-2.5 p-2.5 bg-green-100 border border-green-300 text-green-800 text-[11px] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
              <span>{testSuccess}</span>
            </div>
          )}

          {testError && (
            <div className="mt-2.5 p-2.5 bg-red-100 border border-red-300 text-red-800 text-[11px] font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{testError}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg border border-[#A9812F]/40 cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-[#C5A869]" />
          <span>{saving ? 'Saving Settings...' : 'Save Store Settings'}</span>
        </button>
      </div>
    </form>
  );
}
