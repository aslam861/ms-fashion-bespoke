# 👑 M.S FASHION: BESPOKE ETHNIC MENSWEAR PLATFORM

> **Academic Capstone Project — B.Sc. (Computer Science), Semester V / VI**  
> **Institution:** Rizvi College of Arts, Science and Commerce *(Affiliated to the University of Mumbai)*  
> **Academic Year:** 2026 – 2027  
> **Student Developer:** Aslam Ansari (Roll No: 05)  
> **Project Guide:** Prof. Javed Pathan (Assistant Professor)  
> **Head of Department:** Prof. Arif Patel  

---

## 📖 Project Overview

**M.S Fashion** is a bespoke ethnic menswear e-commerce platform and digital atelier management system modeled after the editorial, luxury aesthetic of **Manyavar**. Tailored specifically for high-end groomswear, imperial bandhgalas, and bespoke western suits, the platform bridges physical atelier craftsmanship with a digital boutique experience.

Rather than treating bespoke couture as commodity mass retail, the system implements an **Online-to-Offline (O2O) Bespoke Workflow** featuring:
- High-resolution editorial cataloging with 4 primary categories (**Sherwani**, **Jodhpuri**, **Indo-Western**, **Blazer/Tuxedo**).
- Dynamic subcategory silhouette filters with live garment counters.
- **Interactive CSS Zoom Calibrator** enabling clients to inspect intricate zardozi, dabka, and resham hand-embroidery up close with 2.2x+ scale focus.
- **Royal Atelier AI Stylist Chatbot** offering real-time groom styling guidance, silhouette comparisons, 15+ body measurement consultation, and direct atelier routing.
- **Two-Step Appointment Booking** reinforced with **Gmail SMTP 6-digit OTP verification** to eliminate spam leads.
- Direct WhatsApp atelier consultation with auto-generated garment preview cards and bespoke quotation estimates.
- **Master Admin Customization Studio (2x2 Grid Workspace)** with sequential reference tracking (`sherwani-01`, `02`...), 4-border phone gallery image crop trimmer, and live brand configuration persistence.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI / Client** | React 18, Vite, Tailwind CSS, Lucide React Icons, Context API |
| **Backend API Server** | Node.js, Express.js (RESTful Architecture) |
| **Database & Persistence** | MongoDB / Mongoose with Automatic Resilient In-Memory Fallback & Dynamic JSON Sync |
| **Mail & Security** | Nodemailer (Gmail SMTP Service for 6-Digit OTP Verification) |
| **Styling & Aesthetics** | Cormorant Garamond & Jost Typography, Royal Maroon (`#5C1A21`), Antique Gold (`#A9812F`) |
| **Image Processing** | HTML5 Canvas Crop Studio, CSS Transform-Origin & Scale Calibration |

---

## 🌟 Key Functional Modules

### 1. Client-Facing Luxury Boutique
- **Editorial Homepage:** Hero carousel slides, primary bespoke categories, heritage craftsmanship narrative, partner brand logo marquee, and direct WhatsApp connect.
- **Category Silhouette Grid:** Strict normalized filtering (`With Jacket`, `Without Jacket`, `Single-Breasted`, `Double-Breasted`, `Shawl Lapel`) with zero cross-category bleeding.
- **Bespoke Product Detail Page:**
  - Interactive zoom viewer with calibrated target coordinates (Collar, Brooch, Safa, Mala, Mojdi, Dupatta, Lapel, Pant).
  - Royal accessories selector with dynamic total price calculation and 1-click unselect overview sync.
  - Transparent pricing policy explaining made-to-measure milestone stages (50% advance booking + 50% on final trial).

### 2. Royal Atelier AI Stylist Chatbot
- Floating royal assistant icon at bottom-right with crown insignia and amber glow pulse.
- Intelligent knowledge base answering queries regarding wedding wear, silhouettes, custom measurements, and atelier timings.
- Direct action chips linking to appointment modal, WhatsApp Master connect, and product categories.

### 3. Spam-Resistant Appointment Scheduling
- Client enters Name, mandatory Email, City, Preferred Date, and Budget.
- Automatically dispatches a branded 6-digit verification OTP to the client's email via Gmail SMTP.
- Validates OTP with 60-second cooldown timer before committing booking to backend CRM.

### 4. Master Admin Management Studio
- **2x2 Full-Page Workspace:** Minimal scrolling interface divided into Garment Specs, Photo Uploader, Accessories Manager, and Visual Calibrator.
- **Sequential Ref ID Generation:** Category-wise sequential IDs (`sherwani-01`, `sherwani-02`, `blazer-01`...) with subcategory continuity.
- **Phone Gallery 4-Border Cropper:** 4-sided margin trimmer (Top, Bottom, Left, Right sliders) with 2:3 boutique aspect ratio snapping and subject centering.
- **Live SMTP & Store Settings:** Real-time email update and instant test verification OTP dispatcher.

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js (v18.x or higher)
- Git
- Local MongoDB daemon *(optional; system automatically activates in-memory fallback if MongoDB is not running)*

### 1. Clone the Repository
```bash
git clone https://github.com/aslamans2007/ms-fashion-bespoke.git
cd ms-fashion-bespoke
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
*Backend server runs at:* `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend application runs at:* `http://localhost:5173`

---

## 📂 Project Architecture

```
M.S Fashion V2/
├── backend/
│   ├── data/
│   │   ├── dynamicBrandConfig.json   # Persistent store configuration & SMTP
│   │   └── dynamicCatalog.json       # Dynamic garments, prices, & zoom coords
│   ├── routes/
│   │   ├── adminRoutes.js            # Admin authentication & catalog management
│   │   ├── appointmentRoutes.js      # Booking submissions
│   │   ├── categoryRoutes.js         # Primary bespoke categories
│   │   ├── inquiryRoutes.js          # OTP generation & verification
│   │   └── productRoutes.js          # Garments & subcategory filters
│   ├── services/
│   │   └── mailer.js                 # Gmail SMTP Nodemailer service
│   ├── uploads/                      # Garment photographs & references
│   └── server.js                     # Express server & API routes
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                # Admin tabs & calibration modals
│   │   │   ├── AppointmentModal.jsx  # 2-step OTP booking modal
│   │   │   ├── AtelierChatbot.jsx    # Royal AI Stylist assistant
│   │   │   ├── Navbar.jsx            # Luxury header & navigation
│   │   │   └── Footer.jsx            # Editorial boutique footer
│   │   ├── pages/
│   │   │   ├── admin/                # Master Admin Dashboard & Product Editor
│   │   │   ├── HomePage.jsx          # Hero carousel & category showcases
│   │   │   ├── CategoryGridPage.jsx  # Silhouette filtering boutique grid
│   │   │   └── ProductDetailPage.jsx # CSS Zoom viewer & accessories selector
│   │   └── App.jsx                   # React Router route definitions
│
├── report_assets/                    # UML diagrams & college certification assets
├── MS_Fashion_Final_Project_Report.docx  # 88-page academic project documentation
├── MS_Fashion_Company_Certificate_Letterhead.docx # Formal company letterhead
└── README.md
```

---

## 📜 Academic Project Documentation
Comprehensive academic report conforming to the University of Mumbai guidelines is available in the root directory:
- `MS_Fashion_Final_Project_Report.docx` — Complete 88-page report covering System Analysis, SRS, Architecture, Spiral Model SDLC, ER/DFD/UML Diagrams, Production Code, and Test Cases.
- `MS_Fashion_Company_Certificate_Letterhead.docx` — Official Industrial Project Completion Certificate issued by M.S Fashion Atelier.

---

## 👨‍💻 Author & Acknowledgements
- **Author:** Aslam Ansari (Roll No: 05, Department of Computer Science, Rizvi College of Arts, Science and Commerce)
- **Guidance:** Prof. Javed Pathan (Project Guide)
- **Industry Partner:** M.S Fashion Atelier, Mahim (East), Mumbai
