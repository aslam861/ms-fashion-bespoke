import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Sparkles, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your admin password or PIN.');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await login(username, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message || 'Invalid credentials. Default password is: msfashion2026');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#241A17] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#C5A869_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative w-full max-w-md bg-[#FBF6EC] border border-[#A9812F]/60 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Top Header Ribbon */}
        <div className="bg-[#5C1A21] p-6 text-center text-[#FBF6EC] border-b border-[#A9812F]/40 relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#461319] border-2 border-[#A9812F] flex items-center justify-center shadow-lg overflow-hidden p-1">
            <img
              src="/logologo.jpeg"
              alt="M.S Fashion Logo"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C5A869] block font-semibold">
            Bespoke Atelier Management
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#FBF6EC] tracking-wide mt-0.5">
            M.S Fashion Portal
          </h1>
        </div>

        {/* Login Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#5C1A21] uppercase tracking-wider mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#A9812F] absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-10 pr-3 py-2.5 text-sm text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C1A21] uppercase tracking-wider mb-1.5">
              Security Password / PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A9812F] absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-10 pr-3 py-2.5 text-sm text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg border border-[#A9812F]/50 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Verifying Access...' : 'Enter Atelier Dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-[#C5A869]" />
            </button>
          </div>

          <div className="text-center pt-2">
            <a
              href="/"
              className="text-[11px] text-[#7A6E65] hover:text-[#5C1A21] uppercase tracking-wider transition-colors font-medium"
            >
              ← Return to Client Boutique
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
