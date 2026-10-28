import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Phone, MapPin, Calendar, Clock, CheckCircle2, Trash2, Download, Search, RefreshCw, User, Package, Sparkles, Mail
} from 'lucide-react';
import { api } from '../../services/api';
import { useConfig } from '../../context/ConfigContext';

export default function InquiriesTab() {
  const { formatINR, getWhatsAppLink } = useConfig();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminInquiries();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load inquiries', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) =>
          (inq._id === id || inq.id === id) ? { ...inq, status: newStatus } : inq
        )
      );
      if (selectedInquiry && (selectedInquiry._id === id || selectedInquiry.id === id)) {
        setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete/archive this inquiry?')) return;
    try {
      await api.deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i._id !== id && i.id !== id));
      if (selectedInquiry && (selectedInquiry._id === id || selectedInquiry.id === id)) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  const handleWhatsAppReply = (inq) => {
    const cleanPhone = inq.customerPhone ? inq.customerPhone.replace(/[^0-9]/g, '') : '';
    const phoneToUse = cleanPhone.length >= 10 ? (cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`) : '';
    
    let msg = `Hello ${inq.customerName || 'Sir'},\n\n`;
    msg += `Greetings from *M.S Fashion (Bespoke Atelier, Mumbai)*! 👑\n`;
    msg += `We received your inquiry regarding: *${inq.productTitle || inq.productId}*.\n`;
    if (inq.estimatedTotal) {
      msg += `Estimated Budget: ${formatINR(inq.estimatedTotal)}\n`;
    }
    msg += `\nWould you like to schedule your private fitting & fabric consultation session at our atelier or discuss your custom measurement requirements?\n\n`;
    msg += `*M.S Fashion Atelier*\nDharavi Main Road, Mahim (East), Mumbai.`;

    const encoded = encodeURIComponent(msg);
    const waUrl = phoneToUse ? `https://wa.me/${phoneToUse}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      alert('No inquiries to export');
      return;
    }

    const headers = ['Date', 'Customer Name', 'Phone', 'City', 'Product', 'Type', 'Estimated Total', 'Status', 'Notes'];
    const rows = inquiries.map((i) => [
      `"${new Date(i.createdAt || Date.now()).toLocaleDateString()}"`,
      `"${i.customerName || ''}"`,
      `"${i.customerPhone || ''}"`,
      `"${i.city || ''}"`,
      `"${i.productTitle || i.productId || ''}"`,
      `"${i.consultationType || ''}"`,
      `"${i.estimatedTotal || 0}"`,
      `"${i.status || 'new'}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ms_fashion_inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered inquiries
  const filtered = inquiries.filter((inq) => {
    let match = true;
    if (statusFilter !== 'all') {
      const s = (inq.status || 'new').toLowerCase();
      if (statusFilter === 'new' && s !== 'new' && s !== 'pending') match = false;
      if (statusFilter === 'contacted' && s !== 'contacted' && s !== 'scheduled') match = false;
      if (statusFilter === 'in-production' && s !== 'in-production') match = false;
      if (statusFilter === 'completed' && s !== 'completed') match = false;
    }
    if (search) {
      const q = search.toLowerCase();
      const name = (inq.customerName || '').toLowerCase();
      const phone = (inq.customerPhone || '').toLowerCase();
      const city = (inq.city || '').toLowerCase();
      const prod = (inq.productTitle || inq.productId || '').toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !city.includes(q) && !prod.includes(q)) {
        match = false;
      }
    }
    return match;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-800 text-white';
      case 'in-production':
        return 'bg-amber-700 text-white';
      case 'contacted':
      case 'scheduled':
        return 'bg-blue-800 text-white';
      case 'cancelled':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-[#5C1A21] text-[#FBF6EC]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F4ECE1] p-4 border border-[#E5D9C5]">
        <div className="flex flex-wrap items-center gap-2 flex-1 w-full">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#A9812F] absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone, city, or product..."
              className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-9 pr-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
          >
            <option value="all">All Inquiries ({inquiries.length})</option>
            <option value="new">New / Pending</option>
            <option value="contacted">Contacted / Scheduled</option>
            <option value="in-production">In Production</option>
            <option value="completed">Completed / Delivered</option>
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchInquiries}
            className="p-2 border border-[#D5C8B5] bg-white hover:bg-[#EAE2D5] text-[#5C1A21] rounded transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-semibold uppercase tracking-wider transition-colors shadow cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A869]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Inquiries Table / List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inquiries List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="p-12 text-center text-xs font-mono text-[#7A6E65]">Loading consultation inquiries...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center bg-[#F4ECE1] border border-[#E5D9C5] text-[#7A6E65] space-y-2">
              <Package className="w-8 h-8 text-[#A9812F] mx-auto opacity-50" />
              <p className="text-xs font-serif font-bold uppercase tracking-wider">No matching inquiries found</p>
              <p className="text-[11px]">Inquiries from "Get This Item" and "Book Consultation" will appear here.</p>
            </div>
          ) : (
            filtered.map((inq) => {
              const inqId = inq._id || inq.id;
              const isSelected = selectedInquiry && (selectedInquiry._id === inqId || selectedInquiry.id === inqId);

              return (
                <div
                  key={inqId}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 border transition-all cursor-pointer bg-[#FBF6EC] hover:shadow-md ${
                    isSelected ? 'border-[#5C1A21] ring-2 ring-[#5C1A21]/20 shadow-md' : 'border-[#E5D9C5]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded ${getStatusBadge(inq.status)}`}>
                          {inq.status || 'New'}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#2B211D]">
                          {inq.customerName || 'Bespoke Client'}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B5E55]">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-[#A9812F]" />
                          {inq.customerPhone}
                        </span>
                        {inq.customerEmail && (
                          <span className="flex items-center gap-1 font-mono text-[#5C1A21]">
                            <Mail className="w-3 h-3 text-[#A9812F]" />
                            {inq.customerEmail}
                          </span>
                        )}
                        {inq.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#A9812F]" />
                            {inq.city}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-[#8F7F74]">
                          <Calendar className="w-3 h-3" />
                          {new Date(inq.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-[#5C1A21] font-semibold pt-1">
                        👑 {inq.productTitle || inq.productId}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-sm text-[#5C1A21] block">
                        {inq.budget || formatINR(inq.estimatedTotal || 0)}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppReply(inq);
                        }}
                        className="mt-2 flex items-center gap-1 px-2.5 py-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold uppercase tracking-wider rounded shadow transition-colors"
                        title="Open WhatsApp chat with client"
                      >
                        <MessageSquare className="w-3 h-3 fill-white" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 1 Col: Selected Lead Full Details Inspector */}
        <div className="bg-[#F4ECE1] border border-[#E5D9C5] p-5 space-y-4 h-fit sticky top-24">
          {selectedInquiry ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5D9C5]">
                <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider">
                  Lead Details
                </h3>
                <button
                  onClick={() => handleDelete(selectedInquiry._id || selectedInquiry.id)}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  title="Archive / Delete lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#7A6E65] block">Customer Name</span>
                  <p className="font-serif font-bold text-sm text-[#2B211D]">{selectedInquiry.customerName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#7A6E65] block">Phone / WhatsApp</span>
                    <p className="font-mono font-medium text-[#2B211D]">{selectedInquiry.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#7A6E65] block">City</span>
                    <p className="font-medium text-[#2B211D]">{selectedInquiry.city || 'Not specified'}</p>
                  </div>
                </div>

                {selectedInquiry.customerEmail && (
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#7A6E65] block">Verified Email</span>
                    <p className="font-mono font-medium text-[#5C1A21] flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-[#A9812F]" />
                      <span>{selectedInquiry.customerEmail}</span>
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">Verified ✓</span>
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#7A6E65] block">Inquiry Type</span>
                  <p className="font-medium text-[#5C1A21] uppercase tracking-wider">
                    {selectedInquiry.consultationType || 'Direct Fitting Consultation'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#7A6E65] block">Garment Interested In</span>
                  <p className="font-serif font-bold text-sm text-[#5C1A21]">{selectedInquiry.productTitle}</p>
                </div>

                {selectedInquiry.selectedAccessories && selectedInquiry.selectedAccessories.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#7A6E65] block">Selected Accessories</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedInquiry.selectedAccessories.map((acc, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#EAE2D5] text-[#5C1A21] text-[10px] font-medium border border-[#D5C8B5]">
                          + {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#7A6E65] block">Expected Budget</span>
                  <p className="font-serif font-bold text-xl text-[#5C1A21]">
                    {selectedInquiry.budget || formatINR(selectedInquiry.estimatedTotal || 0)}
                  </p>
                </div>

                {selectedInquiry.notes && (
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#7A6E65] block">Customization / Fitting Notes</span>
                    <p className="p-2.5 bg-[#FFFFFF] border border-[#D5C8B5] italic text-[#4A3E38] mt-1 whitespace-pre-wrap">
                      "{selectedInquiry.notes}"
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-[#E5D9C5]">
                  <label className="block text-[10px] font-semibold uppercase text-[#7A6E65] mb-1">
                    Update Pipeline Status:
                  </label>
                  <select
                    value={selectedInquiry.status || 'pending'}
                    onChange={(e) => handleStatusChange(selectedInquiry._id || selectedInquiry.id, e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#5C1A21] focus:outline-none focus:border-[#5C1A21]"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted via WhatsApp</option>
                    <option value="scheduled">Measurement Scheduled</option>
                    <option value="in-production">In Production / Tailoring</option>
                    <option value="completed">Delivered & Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={() => handleWhatsAppReply(selectedInquiry)}
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Reply on WhatsApp</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-[#7A6E65] space-y-2">
              <User className="w-8 h-8 mx-auto text-[#A9812F] opacity-40" />
              <p className="text-xs font-serif font-bold uppercase">Select a lead from the list</p>
              <p className="text-[11px]">Click on any inquiry card to inspect notes, update status, and message via WhatsApp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
