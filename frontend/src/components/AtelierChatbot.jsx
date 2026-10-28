import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, User, Crown, 
  ExternalLink, Calendar, Phone, RefreshCw, ChevronDown 
} from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { useNavigate } from 'react-router-dom';

export default function AtelierChatbot() {
  const { brandConfig, setAppointmentModalOpen, getWhatsAppLink } = useConfig();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial greeting
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! Welcome to M.S Fashion Bespoke Atelier. 👑\nI am your Royal Styling & Tailoring Assistant. How may I assist you with your wedding or bespoke festive ensemble today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: [
        { label: "👑 Sherwani vs Indo-Western", query: "What is the difference between Sherwani and Indo-Western?" },
        { label: "📏 How do fittings work?", query: "How does the custom measurement and trial fitting process work?" },
        { label: "💰 Pricing & Payment terms", query: "What are the price ranges and payment terms?" },
        { label: "📅 Book Atelier Appointment", action: "open_appointment" },
        { label: "💬 Chat with Master", action: "open_whatsapp" }
      ]
    }
  ]);

  // Quick prompt chips
  const quickChips = [
    { label: "👑 Sherwani Styles", query: "Tell me about your Sherwani collections" },
    { label: "🤵 Tuxedos & Blazers", query: "What Blazer and Tuxedo styles do you offer?" },
    { label: "📏 Measurements", query: "How do custom measurements work?" },
    { label: "💎 Royal Accessories", query: "Which accessories are included with Sherwanis?" },
    { label: "⏱️ Delivery Time", query: "How much time does bespoke tailoring take?" },
    { label: "📍 Atelier Location", query: "Where is M.S Fashion studio located?" }
  ];

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Intelligent Human-Friendly Knowledge Engine
  const generateAtelierResponse = (query) => {
    const q = (query || '').toLowerCase().trim();

    // 1. Greetings
    if (q.match(/^(hi|hello|hey|namaste|salaam|salam|good\s*(morning|evening|afternoon)|hola)/)) {
      return {
        text: "Namaste and warm greetings! 🙏\nIt is our honor to welcome you to M.S Fashion. Whether you are planning a grand wedding ensemble, a royal Bandhgala for a reception, or bespoke blazers, I am here to guide you through fabrics, cuts, and custom measurements.\n\nWhat special celebration are you preparing for?",
        options: [
          { label: "👑 Groom Wedding Wear", query: "I am looking for groom wedding wear" },
          { label: "🤵 Reception & Sangeet", query: "What should I wear for reception or sangeet?" },
          { label: "📅 Book a Private Appointment", action: "open_appointment" }
        ]
      };
    }

    // 2. Groom & Wedding Ensembles (Dulha / Shaadi / Reception / Sangeet)
    if (q.includes('groom') || q.includes('dulha') || q.includes('wedding') || q.includes('shaadi') || q.includes('marriage') || q.includes('reception') || q.includes('sangeet')) {
      return {
        text: "Congratulations on the upcoming celebration! 🎊 For Indian weddings, our atelier curates a signature royal wardrobe:\n\n• *Main Wedding (Pheras):* Hand-embroidered Royal Bridal Sherwani in Raw Silk or Velvet with matching Zardozi Safa, Pearl Mala, and Embroidered Mojdi.\n• *Sangeet / Mehendi:* Modern Indo-Western silhouette with asymmetrical flare, cowl draping, or mirror-work accents.\n• *Cocktail / Reception:* Classic Imperial Jodhpuri Bandhgala or a bespoke Double-Breasted Velvet Tuxedo.\n\nEvery piece is hand-tailored from scratch to your exact posture and preference.",
        options: [
          { label: "Explore Sherwanis", action: "nav_sherwani" },
          { label: "Explore Indo-Western", action: "nav_indowestern" },
          { label: "Book Fitting Consultation", action: "open_appointment" }
        ]
      };
    }

    // 3. Sherwani Collections
    if (q.includes('sherwani') || q.includes('achkan')) {
      return {
        text: "Our Royal Sherwani Line is handcrafted for timeless grandeur:\n\n1. *Royal Bridal Sherwani:* Heavy antique gold Zardozi hand-embroidery on pure silk.\n2. *Heritage Velvet Sherwani:* Deep wine and midnight navy imperial velvet with intricate bullion work.\n3. *Brocade Classic:* Rich handwoven Banarasi and Jamawar weaves with subtle metallic sheen.\n4. *Silk Embroidered:* Lightweight elegance for modern daytime weddings.\n\n*Included Accessories Available:* Custom Turban (Safa), Pearl Multi-strand Mala, Royal Brooch, Embroidered Mojdi, and Organza Dupatta.",
        options: [
          { label: "View Sherwani Collection ➔", action: "nav_sherwani" },
          { label: "Inquire via WhatsApp", action: "open_whatsapp" }
        ]
      };
    }

    // 4. Jodhpuri / Bandhgala
    if (q.includes('jodhpuri') || q.includes('bandhgala') || q.includes('bandgala')) {
      return {
        text: "The Jodhpuri Bandhgala is the pinnacle of Indian aristocratic tailoring 👑\n\n• *Silhouette:* Structured high Mandarin collar, padded shoulders, and contoured waistline.\n• *Variations:* Single-jacket classic or 2-piece ensembles with contrasting inner kurtas and regal brooches.\n• *Fabrics:* Italian micro-velvet, fine worsted wool blends, and raw mulberry silk.\n• Perfect for wedding receptions, royal ceremonies, and high-profile evening celebrations.",
        options: [
          { label: "View Jodhpuri Designs ➔", action: "nav_jodhpuri" },
          { label: "Book Studio Fitting", action: "open_appointment" }
        ]
      };
    }

    // 5. Indo-Western
    if (q.includes('indo-western') || q.includes('indo western') || q.includes('fusion') || q.includes('cowl')) {
      return {
        text: "Our Indo-Western ensembles bridge traditional royal craftsmanship with contemporary runway aesthetics ✨\n\n• Features asymmetrical front plackets, overlapping angled hemlines, and fluid drape dhotis or trousers.\n• Ideal for Sangeet nights, ring ceremonies, and celebratory parties where effortless movement is key.",
        options: [
          { label: "View Indo-Western Ensembles ➔", action: "nav_indowestern" },
          { label: "Talk to Master", action: "open_whatsapp" }
        ]
      };
    }

    // 6. Blazers & Tuxedos
    if (q.includes('blazer') || q.includes('coat') || q.includes('suit') || q.includes('tuxedo') || q.includes('tux')) {
      return {
        text: "M.S Fashion crafts bespoke evening wear and party blazers with Savile Row precision:\n\n• *Shawl Lapel Tuxedo:* Satin-faced curved shawl lapels in rich jewel tones.\n• *Double-Breasted (DB):* 6-button classic silhouette with peak lapels.\n• *Single-Breasted (SB):* Contemporary 2-button slim fit with tailored matching trousers.",
        options: [
          { label: "View Blazer Collection ➔", action: "nav_blazer" },
          { label: "Book Studio Fitting", action: "open_appointment" }
        ]
      };
    }

    // 7. Measurements, Fittings & Sizing (Crucial Viva / User point)
    if (q.includes('measurement') || q.includes('size') || q.includes('fit') || q.includes('trial') || q.includes('basting') || q.includes('custom fit')) {
      return {
        text: "Because M.S Fashion is a pure Bespoke Atelier, we never use standard factory sizes (S/M/L) 📏\n\n*Our 3-Step Master Fitting Process:*\n1. *15+ Body Point Mapping:* Chest, shoulder slope, bicep circumference, posture curvature, torso length, and waist.\n2. *Basting Trial:* A rough-cut trial fitting to ensure the canvas aligns naturally to your body shape.\n3. *Final Finishing:* Hand-pressed finish with custom monogramming and guaranteed zero puckering.",
        options: [
          { label: "Book a Fitting Session", action: "open_appointment" },
          { label: "Send Measurements on WhatsApp", action: "open_whatsapp" }
        ]
      };
    }

    // 8. Pricing & Payment Policy (Explaining the Bespoke Model)
    if (q.includes('price') || q.includes('cost') || q.includes('payment') || q.includes('online pay') || q.includes('budget') || q.includes('rate') || q.includes('advance')) {
      return {
        text: "At M.S Fashion, all garments are handcrafted made-to-order:\n\n• *Bespoke Bandhgalas & Blazers:* Typically start from ₹25,000 to ₹50,000.\n• *Royal Groom Sherwanis:* Range between ₹45,000 and ₹1,50,000+ depending on hand-embroidery density (Aari vs Pure Zardozi) and silk grade.\n\n*Why no generic online payment gateway?*\nFollowing luxury couture standards (like Sabyasachi & Savile Row), bespoke orders require in-person fabric approval and trial fittings. We operate on milestone booking (token advance + final delivery payment) rather than a mass-market e-commerce cart.",
        options: [
          { label: "Enter Self Budget in Booking", action: "open_appointment" },
          { label: "Get Instant Estimate on WhatsApp", action: "open_whatsapp" }
        ]
      };
    }

    // 9. Delivery Time / Lead Time
    if (q.includes('time') || q.includes('days') || q.includes('delivery') || q.includes('urgent') || q.includes('fast') || q.includes('when')) {
      return {
        text: "⏳ *Craftsmanship Timeline:*\n\n• *Standard Bespoke Ensembles:* 10 to 18 business days (includes fabric procurement, hand-embroidery, cutting, and trial fitting).\n• *Urgent / Express Wedding Orders:* Can be expedited within 5 to 7 days upon consultation with our Master Tailor.\n\nWe recommend booking your consultation at least 3 to 4 weeks prior to your main wedding date.",
        options: [
          { label: "Check Urgent Slot on WhatsApp", action: "open_whatsapp" },
          { label: "Book Studio Appointment", action: "open_appointment" }
        ]
      };
    }

    // 10. Accessories Included
    if (q.includes('accessory') || q.includes('accessories') || q.includes('safa') || q.includes('pagdi') || q.includes('mala') || q.includes('mojdi') || q.includes('brooch') || q.includes('dupatta')) {
      return {
        text: "👑 Every royal ensemble can be paired with matching bespoke accessories:\n\n• *Safa / Pagdi:* Custom-draped silk or velvet turban with kalgi ornament.\n• *Mala:* Multi-layer freshwater pearl necklace with semi-precious stone pendants.\n• *Royal Brooch:* Handcrafted antique brass/gold chest brooch.\n• *Embroidered Mojdi:* Handmade leather mojdis matched to the sherwani embroidery.\n• *Organza Stole / Dupatta:* Hand-rolled zardozi border stole.\n\nYou can select these dynamically on any product page to see the exact price breakdown!",
        options: [
          { label: "Browse Ethnic Collection", action: "nav_ethnic" },
          { label: "Consult Stylist on WhatsApp", action: "open_whatsapp" }
        ]
      };
    }

    // 11. Location & Atelier Visit
    if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('shop') || q.includes('store') || q.includes('mumbai') || q.includes('visit') || q.includes('hours')) {
      return {
        text: `📍 *M.S Fashion Atelier & Studio:*\n${brandConfig.boutiqueAddress || 'Ground Floor, 10/A, Sanaullah Compound, Near Sauda Bakery, Dharavi Main Road, Mahim (East), Mumbai - 400017'}\n\n🕒 *Visiting Hours:* ${brandConfig.visitingHours || 'Mon - Sat: 1:00 PM - 7:00 PM'}\n📞 *Direct Atelier Line:* ${brandConfig.displayPhone || '+91 89993 86222'}\n\nWalk-ins are welcome, but we recommend booking an appointment for a dedicated Master consultation.`,
        options: [
          { label: "📅 Book Atelier Visit", action: "open_appointment" },
          { label: "Open in Google Maps", action: "open_maps" }
        ]
      };
    }

    // 12. Default Fallback
    return {
      text: "That is a wonderful bespoke preference! 👑\nBecause every M.S Fashion ensemble is customized to your exact fabric, embroidery, and measurement preferences, our Master Craftsman can advise you directly with physical fabric swatches and customized quotations.\n\nWould you like to connect directly on WhatsApp or book a private atelier fitting session?",
      options: [
        { label: "💬 Connect on WhatsApp", action: "open_whatsapp" },
        { label: "📅 Book Private Appointment", action: "open_appointment" },
        { label: "Explore Catalog Collections", action: "nav_ethnic" }
      ]
    };
  };

  // Handle User Message Submission
  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate natural human response delay (500ms - 800ms)
    setTimeout(() => {
      const botResponse = generateAtelierResponse(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: botResponse.options
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 650);
  };

  // Handle Interactive Action Buttons
  const handleActionClick = (opt) => {
    if (opt.query) {
      handleSendMessage(opt.query);
      return;
    }

    if (opt.action === 'open_appointment') {
      setAppointmentModalOpen(true);
      return;
    }

    if (opt.action === 'open_whatsapp') {
      const waUrl = getWhatsAppLink("Hello M.S Fashion Master, I am inquiring about custom wedding/festive tailoring through your website chatbot.");
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (opt.action === 'open_maps') {
      window.open(brandConfig.googleMapsUrl || "https://maps.google.com", '_blank');
      return;
    }

    if (opt.action === 'nav_sherwani') {
      navigate('/category/sherwani');
      setIsOpen(false);
      return;
    }

    if (opt.action === 'nav_jodhpuri') {
      navigate('/category/jodhpuri');
      setIsOpen(false);
      return;
    }

    if (opt.action === 'nav_indowestern') {
      navigate('/category/indo-western');
      setIsOpen(false);
      return;
    }

    if (opt.action === 'nav_blazer') {
      navigate('/category/blazer');
      setIsOpen(false);
      return;
    }

    if (opt.action === 'nav_ethnic') {
      navigate('/ethnic-wear');
      setIsOpen(false);
      return;
    }
  };

  // Reset / Clear Chat
  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "Chat refreshed. How can I assist you with your bespoke royal tailoring today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: [
          { label: "👑 Sherwani vs Indo-Western", query: "What is the difference between Sherwani and Indo-Western?" },
          { label: "📏 How do fittings work?", query: "How does the custom measurement and trial fitting process work?" },
          { label: "💰 Pricing & Payment terms", query: "What are the price ranges and payment terms?" },
          { label: "📅 Book Atelier Appointment", action: "open_appointment" }
        ]
      }
    ]);
  };

  return (
    <>
      {/* ==================== FLOATING CIRCULAR LAUNCHER (MANYAVAR STYLE) ==================== */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Tooltip / Attention Badge (Shown when chat is closed) */}
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#FBF6EC] text-[#5C1A21] px-3.5 py-2 rounded-full border border-[#A9812F]/40 shadow-xl cursor-pointer hover:bg-white transition-all transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-[#A9812F]" />
            <span className="text-xs font-semibold tracking-wide">Ask Royal Stylist</span>
          </div>
        )}

        {/* Circular Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Atelier Stylist Chatbot"
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#5C1A21] via-[#7A232C] to-[#5C1A21] text-[#FBF6EC] border-2 border-[#A9812F] shadow-2xl flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 group focus:outline-none"
        >
          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 text-[#FBF6EC] transition-transform group-hover:rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-[#C5A869]" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#5C1A21] rounded-full" />
            </div>
          )}
        </button>
      </div>

      {/* ==================== EXPANDABLE LUXURY CHAT WINDOW ==================== */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] md:w-[420px] h-[550px] max-h-[80vh] bg-[#FBF6EC] rounded-2xl border border-[#A9812F]/50 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Royal Header */}
          <div className="bg-gradient-to-r from-[#5C1A21] via-[#6E1F27] to-[#5C1A21] text-[#FBF6EC] p-3.5 sm:p-4 border-b border-[#A9812F]/40 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3D1016] border border-[#A9812F] flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-[#C5A869]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base sm:text-lg tracking-wide text-[#FBF6EC] leading-tight">
                    M.S Fashion Stylist
                  </h3>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-[#A9812F]/20 text-[#C5A869] border border-[#A9812F]/40 font-medium">
                    AI Atelier
                  </span>
                </div>
                <p className="text-[11px] text-[#C5A869] flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Bespoke Consultation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart Chat"
                className="p-1.5 text-[#FBF6EC]/70 hover:text-[#FBF6EC] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 text-[#FBF6EC]/70 hover:text-[#FBF6EC] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Filter Chips Carousel (Under Header) */}
          <div className="bg-[#FAF4EB] border-b border-[#D5C8B5] px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                className="text-[11px] font-medium whitespace-nowrap bg-white text-[#5C1A21] px-2.5 py-1 rounded-full border border-[#D5C8B5] hover:border-[#A9812F] hover:bg-[#5C1A21] hover:text-[#FBF6EC] transition-all cursor-pointer shadow-xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll View */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-[#FBF6EC]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#5C1A21] text-[#FBF6EC] rounded-tr-none border border-[#A9812F]/40'
                      : 'bg-white text-[#2B211D] rounded-tl-none border border-[#D5C8B5]/80 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">{msg.text}</p>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-[#8C827A] mt-1 px-1">
                  {msg.time}
                </span>

                {/* Interactive Action Chips inside Bot message */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(opt)}
                        className="text-[11px] font-medium text-left bg-white text-[#5C1A21] hover:bg-[#5C1A21] hover:text-[#FBF6EC] px-2.5 py-1.5 rounded-lg border border-[#A9812F]/40 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {opt.action === 'open_appointment' && <Calendar className="w-3.5 h-3.5 text-[#A9812F]" />}
                        {opt.action === 'open_whatsapp' && <Phone className="w-3.5 h-3.5 text-emerald-600" />}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#5C1A21] font-medium bg-white/80 border border-[#D5C8B5] px-3 py-2 rounded-xl w-max animate-pulse">
                <Crown className="w-3.5 h-3.5 text-[#A9812F]" />
                <span>Royal Stylist is curating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Footer Banner */}
          <div className="bg-[#FAF4EB] border-t border-[#D5C8B5] px-3 py-1.5 flex items-center justify-between text-[11px] text-[#5C1A21]">
            <button
              onClick={() => { setAppointmentModalOpen(true); setIsOpen(false); }}
              className="flex items-center gap-1 font-semibold hover:text-[#A9812F] transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Appointment
            </button>
            <span className="text-[#D5C8B5]">|</span>
            <button
              onClick={() => {
                const waUrl = getWhatsAppLink("Hello M.S Fashion Master, I am connecting from the website chatbot for bespoke tailoring guidance.");
                window.open(waUrl, '_blank', 'noopener,noreferrer');
              }}
              className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Direct WhatsApp Master
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-[#D5C8B5] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about Sherwanis, fittings, pricing..."
              className="flex-1 bg-[#FBF6EC] border border-[#D5C8B5] focus:border-[#A9812F] focus:outline-none rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#2B211D] placeholder-[#8C827A]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 rounded-xl bg-[#5C1A21] text-[#FBF6EC] hover:bg-[#461319] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
