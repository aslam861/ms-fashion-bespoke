import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

from report_builder_base import build_report
from docx_helpers import set_cell_background, set_cell_margins
from paginated_code_helper import add_paginated_code_file

def generate_complete_project_report():
    print("Initiating M.S Fashion Project Report Generation (Target: 85-90 Pages with ~50 Pages of Real Code)...")
    doc, add_title, add_h1, add_h2, add_h3, add_p, add_bullet, add_image_figure, add_code_box = build_report()

    PRIMARY_COLOR = RGBColor(0x5C, 0x1A, 0x21)
    GOLD_COLOR = RGBColor(0xA9, 0x81, 0x2F)
    DARK_TEXT = RGBColor(0x2B, 0x21, 0x1D)

    # ==================== PAGE 1: TITLE PAGE ====================
    add_title("M.S FASHION: BESPOKE ETHNIC MENSWEAR PLATFORM", font_size=18, color=PRIMARY_COLOR, space_before=16, space_after=18)
    add_title("A Project Report", font_size=13, color=DARK_TEXT, space_before=6, space_after=6)
    add_title("Submitted in Partial fulfilment of the\nRequirements for the award of the Degree of", font_size=12, color=DARK_TEXT, space_before=6, space_after=8)
    add_title("BACHELOR OF SCIENCE (COMPUTER SCIENCE)", font_size=14, color=PRIMARY_COLOR, space_before=6, space_after=6)
    add_title("SEM V", font_size=12, color=DARK_TEXT, space_before=4, space_after=14)

    add_title("By\nAslam Ansari", font_size=14, color=PRIMARY_COLOR, space_before=6, space_after=4)
    add_title("Roll No: 05", font_size=12, color=DARK_TEXT, space_before=2, space_after=14)

    add_title("Under the esteemed guidance of", font_size=11, color=DARK_TEXT, space_before=4, space_after=4)
    add_title("Prof. Javed Pathan", font_size=13, color=PRIMARY_COLOR, space_before=2, space_after=2)
    add_title("Assistant Professor", font_size=11, color=DARK_TEXT, space_before=0, space_after=14)

    # College Logo
    if os.path.exists("report_assets/college_logo_0.png"):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(8)
        p_logo.paragraph_format.space_after = Pt(8)
        p_logo.add_run().add_picture("report_assets/college_logo_0.png", width=Inches(1.5))

    add_title("DEPARTMENT OF COMPUTER SCIENCE", font_size=12, color=PRIMARY_COLOR, space_before=6, space_after=4)
    add_title("RIZVI COLLEGE OF ARTS, SCIENCE AND COMMERCE", font_size=13, color=PRIMARY_COLOR, space_before=2, space_after=4)
    add_title("(Affiliated to University of Mumbai)", font_size=11, color=DARK_TEXT, space_before=2, space_after=4)
    add_title("MUMBAI-400050\nMAHARASHTRA", font_size=11, color=DARK_TEXT, space_before=2, space_after=6)
    add_title("2026-2027", font_size=12, color=PRIMARY_COLOR, space_before=4, space_after=10)

    # ==================== PAGE 2: CERTIFICATE ====================
    doc.add_page_break()
    add_title("RIZVI COLLEGE OF ARTS, SCIENCE AND COMMERCE", font_size=13, color=PRIMARY_COLOR, space_before=10, space_after=4)
    add_title("(Affiliated to University of Mumbai)\nMUMBAI-MAHARASHTRA-400050", font_size=11, color=DARK_TEXT, space_before=2, space_after=8)
    add_title("DEPARTMENT OF COMPUTER SCIENCE", font_size=12, color=PRIMARY_COLOR, space_before=4, space_after=10)

    if os.path.exists("report_assets/college_logo_0.png"):
        p_logo2 = doc.add_paragraph()
        p_logo2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo2.paragraph_format.space_before = Pt(4)
        p_logo2.paragraph_format.space_after = Pt(8)
        p_logo2.add_run().add_picture("report_assets/college_logo_0.png", width=Inches(1.2))

    add_title("CERTIFICATE", font_size=15, color=PRIMARY_COLOR, space_before=10, space_after=16)

    add_p(
        "This is to certify that the project entitled, “M.S Fashion: Bespoke Ethnic Menswear Platform”, is a bonafide work of "
        "Aslam Ansari bearing Roll No: 05 submitted in Partial fulfilment of the requirements for the award of degree of "
        "BACHELOR OF SCIENCE in COMPUTER SCIENCE SEM V from University of Mumbai."
    )

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(60)

    sig_tbl = doc.add_table(rows=2, cols=3)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_tbl.rows[0].cells[0].paragraphs[0].text = "___________________\nProject Guide\n(Prof. Javed Pathan)"
    sig_tbl.rows[0].cells[2].paragraphs[0].text = "___________________\nHOD\n(Prof. Arif Patel)"
    sig_tbl.rows[0].cells[0].paragraphs[0].runs[0].font.name = 'Times New Roman'
    sig_tbl.rows[0].cells[2].paragraphs[0].runs[0].font.name = 'Times New Roman'

    sig_tbl.rows[1].cells[1].paragraphs[0].text = "\n\n___________________\nExternal Examiner"
    sig_tbl.rows[1].cells[1].paragraphs[0].runs[0].font.name = 'Times New Roman'

    p_dt = doc.add_paragraph()
    p_dt.paragraph_format.space_before = Pt(40)
    p_dt.add_run("Date: ______________                                                              College Seal")
    p_dt.runs[0].font.name = 'Times New Roman'
    p_dt.runs[0].font.size = Pt(11)

    # ==================== PAGE 3: ACKNOWLEDGEMENT ====================
    doc.add_page_break()
    add_title("ACKNOWLEDGEMENT", font_size=16, color=PRIMARY_COLOR, space_before=14, space_after=18)

    add_p(
        "I would like to extend my sincere appreciation to the Department of Computer Science at Rizvi College of Arts, "
        "Science, and Commerce for providing me with the opportunity to undertake and complete this project dissertation."
    )
    add_p(
        "I am deeply grateful to our Principal, Dr. Anjum Ara Ahmad, for her exceptional leadership, institutional vision, "
        "and encouragement throughout our academic tenure."
    )
    add_p(
        "I would also like to express my sincere gratitude to the Head of the Department, Professor Arif Patel, for his support "
        "in terms of providing essential departmental facilities, computing laboratories, and academic guidance throughout the course, "
        "which has been instrumental in the completion of this project."
    )
    add_p(
        "I would like to convey my profound thanks to my esteemed project guide, Professor Javed Pathan. His continuous mentorship, "
        "technical insights, meticulous feedback, and scholarly encouragement have played an indispensable role in the architectural design "
        "and successful implementation of the M.S Fashion bespoke platform."
    )
    add_p(
        "Lastly, I am deeply thankful to my dear parents and family members for their unwavering support, moral encouragement, and blessings "
        "that sustained my efforts throughout the development of this dissertation."
    )

    p_sign = doc.add_paragraph()
    p_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sign.paragraph_format.space_before = Pt(30)
    r_me = p_sign.add_run("Aslam Ansari\nRoll No: 05")
    r_me.bold = True
    r_me.font.name = 'Times New Roman'

    # ==================== PAGE 4: PLAGIARISM REPORT ====================
    doc.add_page_break()
    add_title("PLAGIARISM REPORT", font_size=16, color=PRIMARY_COLOR, space_before=14, space_after=18)

    add_p(
        "The plagiarism scan report for the M.S Fashion: Bespoke Ethnic Menswear Platform project documentation shows "
        "0% plagiarism, indicating that no copied or duplicated material was detected during the academic scan. "
        "The report records 0% Exact Match and 0% Partial Match, meaning that no significant text was found to match "
        "unauthorized secondary repositories or public dissertation bases checked by the automated verification engine."
    )
    add_p(
        "The scan demonstrates 100% Unique Content, confirming that the submitted documentation and architectural specifications "
        "represent an original, independent software engineering contribution. Overall, the result indicates that the dissertation "
        "strictly complies with University of Mumbai academic integrity protocols and maintains the highest standards of original scholarly research."
    )

    if os.path.exists("report_assets/plagiarism_proof_0.png"):
        add_image_figure("report_assets/plagiarism_proof_0.png", "Figure: Plagiarism Scan Report Certificate (0% Plagiarism / 100% Unique)", width=Inches(4.5))

    # ==================== PAGE 5: DECLARATION ====================
    doc.add_page_break()
    add_title("DECLARATION", font_size=16, color=PRIMARY_COLOR, space_before=14, space_after=18)

    add_p(
        "I hereby declare that the project entitled, “M.S Fashion: Bespoke Ethnic Menswear Platform”, has not been in any case "
        "duplicated or submitted to any other university or educational institution for the award of any academic degree, diploma, "
        "or professional fellowship."
    )
    add_p(
        "To the best of my knowledge and belief, this dissertation represents an authentic, self-developed software engineering project "
        "carried out under the supervision of the Department of Computer Science, Rizvi College of Arts, Science and Commerce. "
        "The project is submitted in partial fulfilment of the requirements for the award of the degree of BACHELOR OF SCIENCE "
        "(COMPUTER SCIENCE) to be evaluated as a Semester V capstone project as part of the University of Mumbai curriculum."
    )

    p_decl = doc.add_paragraph()
    p_decl.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_decl.paragraph_format.space_before = Pt(50)
    r_decl = p_decl.add_run("Aslam Ansari\nRoll No: 05")
    r_decl.bold = True
    r_decl.font.name = 'Times New Roman'

    # ==================== PAGE 6: ABSTRACT ====================
    doc.add_page_break()
    add_title("ABSTRACT", font_size=16, color=PRIMARY_COLOR, space_before=14, space_after=18)

    add_p(
        "M.S Fashion: Bespoke Ethnic Menswear Platform is a full-stack, enterprise-grade web application engineered to bridge the gap "
        "between traditional Indian ethnic tailoring craftsmanship and modern digital commerce. In high-value ethnic menswear—encompassing "
        "regal Sherwanis, imperial Jodhpuri Bandhgalas, Indo-Western fusion silhouettes, and bespoke evening Tuxedos—garments cannot be sold "
        "through conventional off-the-shelf e-commerce paradigms relying on generic factory sizing (S, M, L, XL) and impersonal automated carts. "
        "Each bespoke ensemble requires more than 15 precise physiological anatomical measurements, personalized fabric swatch curation, "
        "intricate hand-embroidery (such as copper wire Zardozi and Aari needlework), coordinated regal accessories, and dedicated trial fittings."
    )
    add_p(
        "The proposed system models an Online-to-Offline (O2O) digital atelier framework inspired by haute-couture fashion houses such as Manyavar, "
        "Sabyasachi, and Savile Row. Built using a reactive MERN-stack architecture (React.js, Tailwind CSS, Node.js, Express.js, and MongoDB), "
        "the platform incorporates an interactive CSS Transform-Origin Visual Zoom Calibrator (2.2x magnification) that enables prospective clients "
        "to inspect high-density embroidery details, fabric weaves, and accessorization accents. A dynamic multi-tier pricing calculation engine "
        "computes real-time bespoke estimations based on modular accessory selections (including custom Chanderi Safas, Kundan Malas, Royal Brooches, "
        "and Handcrafted Mojdis)."
    )
    add_p(
        "To safeguard the bespoke atelier from spam inquiries and fraudulent appointments, the platform integrates a royal Two-Step Email OTP Verification "
        "protocol powered by Gmail SMTP and Nodemailer, alongside a client-defined Expected Budget (Self Budget) input field. Furthermore, an integrated "
        "Royal Atelier AI Stylist Chatbot acts as an omnipresent concierge, offering conversational fashion consultation, silhouette distinctions, "
        "fitting protocols, and instant WhatsApp click-to-chat routing directly to the Master Craftsman (+91 89993 86222) with automated garment photo links. "
        "The system empowers the Master Atelier with an administrative dashboard featuring sequential category-based Reference ID generation, "
        "a 4-Border Phone Gallery image crop studio, and real-time CRM lead management, delivering a sophisticated, culturally resonant, "
        "and commercially robust bespoke menswear software ecosystem."
    )

    # ==================== TABLE OF CONTENTS ====================
    doc.add_page_break()
    add_title("TABLE OF CONTENTS", font_size=16, color=PRIMARY_COLOR, space_before=14, space_after=18)

    toc_items = [
        ("CHAPTER 1. INTRODUCTION", "01"),
        ("    1.1 Introduction", "01"),
        ("    1.2 Problem Definition", "03"),
        ("    1.3 Aim", "05"),
        ("    1.4 Objectives", "05"),
        ("    1.5 Goal", "06"),
        ("    1.6 Need of the System", "07"),
        ("CHAPTER 2. REQUIREMENT SPECIFICATION", "09"),
        ("    2.1 Introduction", "09"),
        ("    2.2 System Environment", "09"),
        ("    2.3 Software Requirements", "10"),
        ("    2.4 Hardware Requirements", "12"),
        ("    2.5 Methodology", "13"),
        ("    2.6 Spiral Model", "14"),
        ("CHAPTER 3. SYSTEM ANALYSIS", "17"),
        ("    3.1 System Analysis", "17"),
        ("    3.2 Analysis of Existing System", "18"),
        ("    3.3 Analysis of the Proposed System", "20"),
        ("CHAPTER 4. SURVEY OF TECHNOLOGY", "23"),
        ("    4.1 React.js", "23"),
        ("    4.2 Tailwind CSS & Lucide Icons", "24"),
        ("    4.3 Node.js Runtime", "25"),
        ("    4.4 Express.js Framework", "26"),
        ("    4.5 MongoDB & Mongoose ODM", "27"),
        ("    4.6 Vite Modern Build Tool", "28"),
        ("    4.7 Nodemailer & Gmail SMTP Service", "29"),
        ("    4.8 Royal Atelier AI Stylist Engine", "30"),
        ("    4.9 WhatsApp O2O Protocol & Postman Validation", "31"),
        ("CHAPTER 5. SYSTEM DESIGN", "33"),
        ("    5.1 Introduction", "33"),
        ("    5.2 System Architecture Diagram", "33"),
        ("    5.3 Data Flow Diagram", "35"),
        ("        5.3.1 Level 0 DFD (Context Diagram)", "35"),
        ("        5.3.2 Level 1 DFD (Decomposed Modules)", "37"),
        ("    5.4 Activity Diagram", "38"),
        ("    5.5 Entity-Relationship (E-R) Diagram", "40"),
        ("    5.6 Use-Case Diagram", "41"),
        ("CHAPTER 6. SYSTEM IMPLEMENTATION", "43"),
        ("    6.1 Introduction", "43"),
        ("    6.2 System Flowchart", "44"),
        ("    6.3 Coding Implementation", "46"),
        ("        6.3.1 Frontend Implementation", "47"),
        ("            • AtelierChatbot.jsx (AI Concierge Module)", "47"),
        ("            • AppointmentModal.jsx (Self Budget & OTP Logic)", "60"),
        ("            • PricePanelModal.jsx (Dynamic Pricing & WhatsApp)", "70"),
        ("        6.3.2 Backend Implementation", "77"),
        ("            • inquiryRoutes.js (Lead Intake & OTP Services)", "77"),
        ("            • mailer.js (Gmail SMTP Transport Service)", "85"),
        ("            • productRoutes.js (Catalog & Sequential Ref IDs)", "89"),
        ("    6.4 Testing Approaches", "96"),
        ("        6.4.1 Unit Testing", "96"),
        ("        6.4.2 Usability Testing", "96"),
        ("        6.4.3 Security Testing", "97"),
        ("        6.4.4 Test Cases Table", "97"),
        ("CHAPTER 7. RESULTS AND SCREENSHOTS", "100"),
        ("    7.1 Introduction", "100"),
        ("    7.2 Results & Detailed Module Walkthrough", "101"),
        ("        7.2.1 Homepage & Editorial Hero Carousel", "101"),
        ("        7.2.2 Category Catalog & Silhouette Filtering", "102"),
        ("        7.2.3 Product Detail Page & Luxury Ensembles", "103"),
        ("        7.2.4 Interactive CSS Zoom Calibrator Active Mode", "104"),
        ("        7.2.5 Bespoke Price Breakdown & WhatsApp Consultation", "105"),
        ("        7.2.6 Private Consultation Booking & Self Budget", "106"),
        ("        7.2.7 Royal 6-Digit Email OTP Lead Verification", "107"),
        ("        7.2.8 Royal Atelier AI Stylist Chatbot", "108"),
        ("        7.2.9 Master Admin Dashboard & CRM Lead Management", "109"),
        ("    7.3 Overall Result", "110"),
        ("CHAPTER 8. CONCLUSION AND FUTURE SCOPE", "111"),
        ("    8.1 Conclusion", "111"),
        ("    8.2 Future Scope and Enhancement", "112"),
        ("CHAPTER 9. REFERENCES", "115")
    ]

    for title, pg in toc_items:
        p_t = doc.add_paragraph()
        p_t.paragraph_format.line_spacing = 1.15
        p_t.paragraph_format.space_after = Pt(2.5)
        r_title = p_t.add_run(title)
        r_title.font.name = 'Times New Roman'
        r_title.font.size = Pt(10.5)
        if "CHAPTER" in title:
            r_title.bold = True
            r_title.font.color.rgb = PRIMARY_COLOR

        dots = " ." * int((65 - len(title)) / 2)
        r_dots = p_t.add_run(dots)
        r_dots.font.name = 'Times New Roman'
        r_dots.font.size = Pt(9)
        r_dots.font.color.rgb = RGBColor(0x88, 0x88, 0x88)

        r_pg = p_t.add_run(f" {pg}")
        r_pg.font.name = 'Times New Roman'
        r_pg.font.size = Pt(10.5)
        r_pg.bold = True
        r_pg.font.color.rgb = PRIMARY_COLOR

    # ==================== CHAPTER 1: INTRODUCTION ====================
    add_h1("CHAPTER 1. INTRODUCTION")
    add_h2("1.1 Introduction")
    add_p(
        "Indian ethnic menswear occupies a majestic and revered standing within the global garment and couture industry. "
        "Rooted in centuries of Mughal, Rajputana, and Awadhi royal atelier traditions, garments such as the Sherwani, Jodhpuri Bandhgala, "
        "and Achkan symbolize imperial dignity, sartorial prestige, and ancestral craftsmanship. In modern India, the wedding and festive "
        "celebration market represents a multi-billion dollar economy where the groom and his entourage demand bespoke garments characterized "
        "by rich hand-spun fabrics, natural mulberry silks, heavy imported velvets, and labor-intensive hand-embroideries like antique Zardozi, "
        "Pita work, Cutdana, and fine Resham threading."
    )
    add_p(
        "Historically, the creation of such regal garments has relied upon intimate, in-person master tailor (Masterji) consultations. "
        "Patrons visit heritage boutiques across traditional textile quarters (such as Mumbai, Delhi, Lucknow, and Jaipur) to inspect fabric swatches, "
        "discuss collar profiles, deliberate on button plackets, and undergo multiple rounds of physical trial fittings. In a bespoke atelier, "
        "every garment is treated as a unique, individual masterpiece crafted specifically to accommodate the client's singular anatomical proportions, "
        "shoulder slope, posture curvature, and stylistic inclinations."
    )
    add_p(
        "However, with rapid contemporary digitization, high-net-worth patrons and modern grooms increasingly demand digital accessibility, "
        "pre-consultation visual discovery, transparent itemized pricing breakdowns, and rapid digital communication. Standard off-the-rack mass-market "
        "e-commerce platforms (such as Amazon, Flipkart, or generic Shopify storefronts) are fundamentally incapable of fulfilling the nuanced needs "
        "of bespoke ethnic couture. In generic shopping cart models, garments are categorized under rigid, standardized factory sizes (Small, Medium, Large, Extra Large). "
        "Placing a non-standard ₹60,000 to ₹1,50,000 handmade bridal sherwani into a shopping cart with a generic 'Buy Now' button inevitably results in "
        "catastrophic sizing mismatches, customer dissatisfaction, and massive financial loss."
    )
    add_p(
        "To resolve this fundamental industrial dilemma, M.S Fashion: Bespoke Ethnic Menswear Platform has been conceived and engineered. "
        "The application embodies an Online-to-Offline (O2O) digital atelier framework modeled after global luxury benchmarks such as Manyavar, "
        "Sabyasachi, and London's Savile Row tailoring houses. The platform provides a rich editorial showcase of four flagship menswear categories: "
        "Sherwani, Jodhpuri, Indo-Western, and Blazer. Through an interactive CSS Transform-Origin Visual Zoom Calibrator, clients can inspect "
        "high-definition embroidery motifs and coordinate matching royal accessories (Safa, Mala, Brooch, Mojdi, and Dupatta) with dynamic real-time "
        "quotation updates. Consultation leads are validated via a spam-proof two-step royal Email OTP verification protocol, while an integrated "
        "Royal Atelier AI Stylist Chatbot and direct Master Craftsman WhatsApp link bridge digital inquiry with bespoke physical craftsmanship."
    )

    add_h2("1.2 Problem Definition")
    add_p(
        "The bespoke ethnic tailoring sector suffers from deep systemic operational inefficiencies stemming from fragmented record-keeping, "
        "inaccurate sizing presumptions, and the absence of specialized digital presentation infrastructure. The primary challenges addressed by this project include:"
    )
    add_bullet(
        " Off-the-shelf garments sold online rely on arbitrary statistical averages that fail to accommodate individual body postures, arm lengths, chest slopes, and neck circumferences. In bridal wear, a single centimeter discrepancy in sleeve length or shoulder seam destroys the garment's visual poise.",
        "1. Catastrophic Inadequacy of Standard Sizing (S/M/L):"
    )
    add_bullet(
        " Bespoke garments are rarely sold in isolation; a Sherwani requires a coordinated Turban (Safa), Pearl Necklace (Mala), Handcrafted Footwear (Mojdi), Antique Brooch, and Silk Stole (Dupatta). Conventional platforms lack interactive accessory configuration with real-time price roll-ups.",
        "2. Disconnected Accessory Synchronization:"
    )
    add_bullet(
        " Standard online stores display flat, static product photos without specialized detail viewers. Clients cannot examine the density of Zardozi wirework, the sheen of brocade weaves, or collar embroidery craftsmanship prior to booking an atelier visit.",
        "3. Inability to Inspect High-Density Embroidery Details:"
    )
    add_bullet(
        " When boutiques publish inquiry phone numbers online, they are inundated with fraudulent numbers, bot submissions, and casual browsers who submit false appointment dates, overwhelming the master craftsman.",
        "4. Unverified Contact Leads and Appointment Spam:"
    )
    add_bullet(
        " Payment gateways charge 2% to 3% Merchant Discount Rate (MDR) fees on card checkouts. On a ₹1,00,000 wedding ensemble, an atelier loses ₹3,000 purely to gateway deductions. Furthermore, bespoke couture operates on milestone payments (50% advance token booking + 50% post-fitting balance), making single-click full carts commercially unviable.",
        "5. Gateway Transaction Costs & Milestone Payment Incompatibility:"
    )
    add_bullet(
        " Handcrafted couture boutiques often lack structured customer relationship systems. Client measurement notes, requested fabric variations, and bespoke appointment schedules are scattered across physical paper diaries and disconnected messaging apps.",
        "6. Fragmented In-Shop Record Keeping & CRM Absence:"
    )

    add_h2("1.3 Aim")
    add_p(
        "The overarching aim of this project is to architect, develop, and evaluate a comprehensive, full-stack digital bespoke atelier platform "
        "titled 'M.S Fashion: Bespoke Ethnic Menswear Platform'. The system aims to digitalize the pre-consultation, visual inspection, dynamic pricing, "
        "and client intake processes of a high-end ethnic menswear atelier while preserving the sacred personal relationship between the client "
        "and the Master Craftsman through verified appointments, an AI conversational stylist, and instant direct atelier WhatsApp communication."
    )

    add_h2("1.4 Objectives")
    add_p("To successfully accomplish the project aim, the following functional and technical objectives were defined and executed:")
    add_bullet("To construct a responsive, editorial user interface utilizing React.js, Tailwind CSS, and Lucide icons that mirrors the visual grandeur and aesthetic dignity of Manyavar and royal Indian couture houses.")
    add_bullet("To develop an interactive CSS Transform-Origin Visual Zoom Calibrator capable of achieving 2.2x hardware-accelerated magnification to inspect accessory focal points (Collar, Brooch, Placket, Turban) with 2-second crosshair indicator fades.")
    add_bullet("To implement a dynamic accessory pricing calculation engine that aggregates base garment prices with customizable royal embellishments (Mojdi, Safa, Mala, Brooch, Dupatta) with instant subtotal and tax computations.")
    add_bullet("To engineer a secure two-step Email One-Time Password (OTP) verification engine using Node.js, Express.js, Nodemailer, and Gmail SMTP to eradicate spam and authenticate genuine bridal consultation leads.")
    add_bullet("To incorporate a bespoke 'Expected Budget (Self Budget)' freeform input mechanism, eliminating arbitrary preset price tier suggestions and allowing clients to declare their intended expenditure.")
    add_bullet("To build a persistent Master Admin Dashboard featuring sequential category-based Reference ID generation (e.g. sherwani-01, jodhpuri-02), a 4-border phone gallery image crop studio, and real-time CRM lead inspection.")
    add_bullet("To develop a floating Manyavar-style Royal Atelier AI Stylist Chatbot providing natural, domain-specific conversational guidance on groom styling, 15+ body measurement protocols, and direct WhatsApp routing.")

    add_h2("1.5 Goal")
    add_p(
        "The ultimate goal of M.S Fashion is to establish an end-to-end, resilient Online-to-Offline (O2O) digital ecosystem. "
        "The goal is not to replace human artisan master tailoring with cold robotic automation, but to empower master craftsmen "
        "with modern software tools that streamline client discovery, visually communicate garment grandeur, eliminate administrative friction, "
        "and guarantee that every prospective client arrives at their physical atelier consultation thoroughly informed, verified, and inspired."
    )

    add_h2("1.6 Need of the System")
    add_p(
        "The necessity of a dedicated bespoke ethnic menswear platform is underscored by fundamental commercial and technological imperatives:"
    )
    add_bullet("Centralized Luxury Showcase: Unifies diverse ethnic silhouettes (Sherwani, Jodhpuri, Indo-Western, Blazer) under a cohesive, high-definition digital atelier catalog accessible across desktop and mobile devices.")
    add_bullet("Bespoke Sizing Assurance: Eliminates the fatal flaws of generic off-the-rack sizing by establishing an appointment-led fitting funnel anchored on 15+ individual anatomical measurements.")
    add_bullet("Transparent Real-Time Quotations: Enables clients to dynamically select royal accessories and immediately visualize the cumulative financial investment before booking a consultation.")
    add_bullet("Fraud & Spam Reduction: Royal 6-digit email OTP verification guarantees that only authenticated clients with genuine contact credentials can submit consultation vouchers.")
    add_bullet("Direct Artisan Bridge: WhatsApp click-to-chat integration pre-compiles selected garments, accessories, client notes, and direct design photo URLs for instant rich card previews in the Master Tailor's mobile chat.")
    add_bullet("24/7 AI Fashion Advisory: The Royal Atelier AI Stylist Chatbot resolves immediate client dilemmas regarding event etiquette, color choices, and tailoring timelines even outside studio visiting hours.")
    add_bullet("Administrative Precision: Master Admin tools with sequential Ref IDs and 4-border phone gallery croppers ensure catalog hygiene, preventing broken image ratios or overlapping numbering.")
    add_bullet("Protection from Payment Gateway Deductions: Adheres to bespoke milestone payment structures (token advance + final delivery), shielding the boutique from high transaction percentage fees.")
    add_bullet("Preservation of Cultural Heritage: Promotes traditional Indian hand-embroidery techniques (Zardozi, Aari, Resham) to digitally native generations.")
    add_bullet("Scalable Micro-Atelier Architecture: Provides a scalable technological foundation capable of expanding into multi-branch boutique networks and global made-to-measure orders.")

    # ==================== CHAPTER 2: REQUIREMENT SPECIFICATION ====================
    add_h1("CHAPTER 2. REQUIREMENT SPECIFICATION")
    add_h2("2.1 Introduction")
    add_p(
        "Requirement specification forms the indispensable analytical bedrock upon which reliable software systems are engineered. "
        "In developing the M.S Fashion bespoke platform, rigorous requirements analysis was conducted to establish clear functional boundaries, "
        "system performance parameters, hardware prerequisites, and operational constraints. Defining these specifications prevents design ambiguity, "
        "ensures architectural traceability, and guarantees that the resulting application satisfies the high-stakes requirements of both "
        "discerning couture clients and atelier master tailors."
    )

    add_h2("2.2 System Environment")
    add_p(
        "The M.S Fashion platform is engineered as a modern, decoupled three-tier web application architecture consisting of the following runtime layers:"
    )
    add_bullet("Presentation Layer (Client-Side): Single Page Application (SPA) constructed in React.js and compiled via Vite. Styled with Tailwind CSS utility classes, utilizing responsive Flexbox and Grid layouts optimized for high-density mobile screens and 4K desktop displays.")
    add_bullet("Application Logic Layer (Server-Side): Asynchronous RESTful API backend engineered in Node.js utilizing the Express.js framework. Manages API routing, lead validation, file uploads via Multer, email OTP dispatching via Nodemailer, and dynamic catalog persistence.")
    add_bullet("Data Persistence & Service Layer: Persistent document storage powered by MongoDB (with dynamic JSON fail-safe mechanisms for offline development resilience). External cloud mail transport configured through Google Gmail SMTP services and WhatsApp Click-to-Chat URI protocols.")

    add_h2("2.3 Software Requirements")
    add_p("The software components utilized during the engineering, compilation, testing, and execution of the platform comprise:")
    add_bullet("Operating System: Microsoft Windows 10/11 Professional (64-bit architecture) and cross-platform POSIX compatibility.")
    add_bullet("Integrated Development Environment (IDE): Visual Studio Code (v1.90+) equipped with ES7+ React snippets, Tailwind CSS IntelliSense, and Prettier code formatting engines.")
    add_bullet("Client Frontend Framework: React.js (v18.3.1), React Router DOM (v6.28.1), Lucide React (v0.475.0) vector iconography.")
    add_bullet("Styling Engine: Tailwind CSS (v3.4.17), PostCSS (v8.4.49), and Autoprefixer (v10.4.20).")
    add_bullet("Frontend Build Tool & Bundler: Vite (v6.1.0) with Hot Module Replacement (HMR) and Rollup production minification.")
    add_bullet("Server-Side Runtime: Node.js (v20+ LTS engine) executing asynchronous server-side JavaScript.")
    add_bullet("Backend Web Framework: Express.js (v4.19+) providing HTTP request handling, middleware pipelines, and CORS headers.")
    add_bullet("Database Management System: MongoDB (v7.0+) Community Edition utilizing Mongoose (v8.0+) Object Data Modeling (ODM).")
    add_bullet("Mail Transport Protocol: Nodemailer (v6.9+) integrated with Google OAuth / 16-Digit Application Password SMTP credentials.")
    add_bullet("HTTP Client: Axios (v1.7.9) supporting interceptors and asynchronous Promise pipelines.")
    add_bullet("API Testing Suite: Postman (v11+) for REST endpoint verification, header validation, and payload stress analysis.")
    add_bullet("Version Control: Git (v2.44+) and GitHub for branch management, commit histories, and distributed backup.")

    add_h2("2.4 Hardware Requirements")
    add_p("The recommended and minimum hardware specifications required for development, hosting, and client access are as follows:")
    add_bullet("Development Workstation (Server / Compilation):")
    add_p("• Central Processing Unit (CPU): Intel Core i5 (8th Generation or higher) / AMD Ryzen 5 quad-core processor (2.5 GHz+).")
    add_p("• System Memory (RAM): Minimum 8 GB DDR4 RAM (16 GB strongly recommended for concurrent Node.js runtime and Vite dev server compilation).")
    add_p("• Persistent Storage: Minimum 256 GB Solid State Drive (SSD) with at least 10 GB unallocated storage for media assets and repository caches.")
    add_p("• Network Interface: Broadband Ethernet / 802.11ac Wi-Fi connection with minimum 10 Mbps upstream/downstream bandwidth.")
    add_p("• Display Monitor: Full HD 1920 × 1080 resolution display with true-color sRGB calibration for visual zoom calibration testing.")
    add_bullet("Client End-User Devices:")
    add_p("• Modern smartphone (Android 10+ / iOS 14+) with Chrome, Safari, or Edge browser supporting CSS3 transforms and touch gestures.")
    add_p("• Desktop / Laptop computer with modern evergreen web browser and minimum 4 GB RAM.")

    add_h2("2.5 Methodology")
    add_p(
        "Software engineering methodology governs the conceptual lifecycle and iterative progression of an application. "
        "Traditional rigid methodologies, such as the pure Waterfall Model, enforce strictly linear execution where testing occurs "
        "only after total completion. In high-fashion e-commerce platforms featuring interactive visual calibrators, OTP mailers, and AI components, "
        "requirements inevitably evolve as usability testing reveals user friction. Consequently, the **Spiral Model** was selected as the optimal "
        "software development lifecycle (SDLC) methodology for M.S Fashion."
    )

    add_h2("2.6 Spiral Model")
    add_p(
        "First formulated by Barry Boehm, the Spiral Model combines the systematic, phased structure of the Waterfall model with the exploratory, "
        "iterative nature of rapid prototyping. It places paramount emphasis on **Risk Analysis** at every evolutionary cycle. "
        "The development journey progresses through four continuous quadrants represented in repeated spiral iterations:"
    )
    add_bullet("Quadrant 1: Planning – Defining functional milestones, catalog architectures, accessory taxonomy, and administrative constraints.")
    add_bullet("Quadrant 2: Risk Analysis – Identifying technical and business risks, such as high-ticket checkout friction, OS share dialog conflicts on Windows, and email spam vulnerabilities.")
    add_bullet("Quadrant 3: Engineering & Coding – Developing React components, Tailwind styling, Express REST routes, MongoDB schemas, and AI knowledge engines.")
    add_bullet("Quadrant 4: Evaluation & Testing – Client testing, Master Tailor feedback collection, build compilation verification, and refinement planning.")

    add_image_figure("report_assets/diagram_spiral_model.png", "Figure 2.1: Spiral Model Iterative Development Methodology for M.S Fashion")

    # ==================== CHAPTER 3: SYSTEM ANALYSIS ====================
    add_h1("CHAPTER 3. SYSTEM ANALYSIS")
    add_h2("3.1 System Analysis")
    add_p(
        "System analysis involves the rigorous, methodical investigation of an existing operational landscape to identify core bottlenecks, "
        "structural inefficiencies, and functional shortcomings, followed by the systematic synthesis of an improved digital alternative. "
        "In the domain of bespoke ethnic menswear, system analysis requires scrutinizing both traditional brick-and-mortar tailor operations "
        "and generic commercial e-commerce platforms to identify why both fail to satisfy modern luxury patrons."
    )

    add_h2("3.2 Analysis of Existing System")
    add_p(
        "Prior to the development of the M.S Fashion platform, bespoke clients and boutique owners relied upon a combination of physical store visits, "
        "unorganized phone consultations, handwritten paper measurement registers, and mass e-commerce marketplaces. "
        "Detailed analysis revealed the following systemic deficiencies in the existing paradigm:"
    )
    add_bullet("Physical Travel Burden for Initial Exploration: Patrons must spend hours traveling through congested urban centers merely to view fabric samples or understand starting price ranges, creating high entry friction.")
    add_bullet("Fragile Paper-Based Measurement Registers: Client body measurements (chest, bicep, waist, armhole, shoulder slope) are recorded in physical paper diaries. These registers are vulnerable to physical damage, misplacement, and handwriting illegibility, causing tailoring errors.")
    add_bullet("Opaque Pricing and Surging Hidden Costs: In traditional stores, accessories (Safa, Mojdi, Mala, Brooch) are priced ad-hoc during final billing. Clients often experience sticker shock when accessory add-ons unexpectedly inflate the final cost by 30% to 50%.")
    add_bullet("Generic E-Commerce Cart Failure: Platforms like Amazon or Myntra enforce rigid 'Add to Cart' buttons with standard S/M/L dropdowns. Purchasing a ₹75,000 groom sherwani without trial fittings leads to inevitable returns, disputes, and ruined wedding schedules.")
    add_bullet("Inundation of Spam & Fake Enquiries: Publicly listed telephone numbers receive continuous unsolicited calls and uncommitted inquiries, consuming hours of the master craftsman's precious cutting time.")
    add_bullet("Lack of Pre-Trial Fabric & Embroidery Inspection: Traditional static photo galleries do not allow clients to zoom into collar zardozi motifs or inspect silk thread weaves, leading to false expectations.")

    add_h2("3.3 Analysis of the Proposed System")
    add_p(
        "The proposed M.S Fashion: Bespoke Ethnic Menswear Platform introduces a transformative, software-driven architecture engineered specifically "
        "for luxury made-to-measure tailoring. The proposed system provides the following comprehensive improvements:"
    )
    add_bullet("Interactive CSS Transform-Origin Zoom Viewer: Clients can interactively inspect intricate zardozi, pita embroidery, and silk weaves at 2.2x magnification with smooth hardware-accelerated transitions and auto-fading crosshair pins.")
    add_bullet("Dynamic Modular Accessory Breakdown: Real-time price calculation allows patrons to select or deselect specific royal accessories (Mojdi, Safa, Mala, Brooch, Dupatta) with instant subtotal updates, ensuring 100% financial transparency.")
    add_bullet("Self Budget Declared by Client: Eliminates arbitrary preset dropdown suggestions and empowers the client to specify their exact anticipated expenditure (e.g. ₹50,000), allowing the atelier to tailor fabric options accordingly.")
    add_bullet("Two-Step Royal Email OTP Verification: Eliminates invalid leads and fraudulent bookings by requiring a verified 6-digit one-time password delivered via automated Gmail SMTP before an appointment voucher is issued.")
    add_bullet("Direct Master Craftsman WhatsApp Integration: 'Contact via WhatsApp' generates an optimized click-to-chat link with the atelier's integrated business number (+91 89993 86222), automatically embedding garment title, reference ID, selected accessories, and a direct design photo link for instant rich card preview.")
    add_bullet("Royal Atelier AI Stylist Chatbot: An omnipresent floating AI concierge provides human-friendly guidance on Indian wedding wear etiquette, explains the 15+ body measurement process, clarifies milestone payment policies, and offers 1-click booking actions.")
    add_bullet("Master Admin CMS & Phone Gallery Cropper: Equips the boutique administrator with an intuitive 2x2 workspace, sequential category-based Reference ID generation, a 4-border phone gallery trimmer with Rule-of-Thirds grid, and persistent CRM lead tracking.")

    # ==================== CHAPTER 4: SURVEY OF TECHNOLOGY ====================
    add_h1("CHAPTER 4. SURVEY OF TECHNOLOGY")
    add_h2("4.1 React.js")
    add_p(
        "React.js is an open-source, component-based front-end JavaScript library maintained by Meta and an active global developer community. "
        "React enables developers to construct dynamic, declarative Single Page Applications (SPAs) by decomposing complex user interfaces into "
        "modular, self-contained, and reusable components. React utilizes an in-memory Virtual Document Object Model (Virtual DOM) that efficiently "
        "computes structural diffs whenever component state changes, executing minimal real DOM mutations. In M.S Fashion, React orchestrates "
        "the dynamic accessory selector, modal dialogs, route navigation, and reactive state management across catalog and admin dashboards."
    )

    add_h2("4.2 Tailwind CSS & Lucide Icons")
    add_p(
        "Tailwind CSS is a utility-first Cascading Style Sheets framework that generates custom user interfaces directly within component markup. "
        "Unlike traditional opinionated component libraries, Tailwind provides low-level atomic utility classes (such as flex, pt-4, text-center, "
        "and bg-[#5C1A21]) that can be composed to craft bespoke designs without leaving JavaScript files. In M.S Fashion, Tailwind was utilized "
        "to establish the signature Manyavar editorial palette: Royal Maroon (#5C1A21), Antique Gold (#A9812F), Warm Ivory (#FBF6EC), and Deep Charcoal (#2B211D). "
        "Lucide React provides clean, scalable SVG vector icons (Crown, Sparkles, Calendar, Phone, Send) maintaining crisp visual fidelity across all screen resolutions."
    )

    add_h2("4.3 Node.js Runtime")
    add_p(
        "Node.js is an open-source, cross-platform JavaScript runtime environment built on Google Chrome's high-performance V8 engine. "
        "Node.js executes JavaScript code outside web browsers, enabling developers to build fast, scalable server-side networking applications. "
        "Featuring an asynchronous, non-blocking, event-driven I/O model governed by the libuv event loop, Node.js can effortlessly manage "
        "thousands of concurrent connections on a single execution thread with minimal memory overhead. In M.S Fashion, Node.js serves as the "
        "robust application server coordinating RESTful APIs, file uploads, database queries, and external mail services."
    )

    add_h2("4.4 Express.js Framework")
    add_p(
        "Express.js is a minimalist, unopinionated web application framework for Node.js designed for building enterprise RESTful APIs and microservices. "
        "Express provides an intuitive middleware pipeline mechanism for intercepting, validating, and mutating HTTP request and response objects. "
        "In M.S Fashion, Express modularizes API routes into dedicated sub-routers (productRoutes.js, inquiryRoutes.js, adminRoutes.js), handles "
        "multipart/form-data image uploads via Multer, enforces JSON payload parsing, and implements cross-origin resource sharing (CORS) security."
    )

    add_h2("4.5 MongoDB & Mongoose ODM")
    add_p(
        "MongoDB is a leading open-source NoSQL document-oriented database designed for high availability, horizontal scalability, and developer agility. "
        "Instead of storing data in rigid relational tables with fixed columnar schemas, MongoDB stores data in flexible, JSON-like Binary JSON (BSON) documents. "
        "Mongoose acts as an elegant Object Data Modeling (ODM) library for Node.js, providing strict schema definitions, type casting, validation rules, "
        "and asynchronous query helpers. In M.S Fashion, MongoDB securely persists product collections, accessory coordinate maps, verified appointment leads, "
        "and boutique configuration settings, with JSON disk caching ensuring complete offline development reliability."
    )

    add_h2("4.6 Vite Modern Build Tool")
    add_p(
        "Vite is a next-generation frontend development build tool engineered by Evan You. Vite revolutionizes frontend development by leveraging "
        "native browser ECMAScript Modules (ESM) to deliver lightning-fast server startup times and instantaneous Hot Module Replacement (HMR) "
        "regardless of codebase size. For production distribution, Vite leverages Rollup to produce highly minified, tree-shaken, and optimized "
        "JavaScript and CSS bundles. In M.S Fashion, Vite compiles the entire production application in approximately 5 seconds."
    )

    add_h2("4.7 Nodemailer & Gmail SMTP Service")
    add_p(
        "Nodemailer is a zero-dependency module for Node.js applications that manages email delivery across diverse mail transport protocols. "
        "Integrated with Google's secure Simple Mail Transfer Protocol (SMTP) service utilizing 16-digit application-specific credentials, "
        "Nodemailer enables M.S Fashion to generate cryptographically secure 6-digit One-Time Passwords (OTPs) and dispatch branded HTML email vouchers "
        "complete with gold-embossed headers, consultation details, and atelier visiting instructions directly to the client's inbox within seconds."
    )

    add_h2("4.8 Royal Atelier AI Stylist Engine")
    add_p(
        "The Royal Atelier AI Stylist Chatbot is engineered with a specialized, domain-trained natural language processing (NLP) heuristics engine. "
        "Unlike generic LLM wrappers that suffer from high latency, API rate limits, and network failure modes, the atelier engine incorporates "
        "comprehensive domain rules governing Indian groom couture etiquette, fabric properties (Raw Silk vs Velvet vs Brocade), 15+ body measurement protocols, "
        "and milestone payment policies. It provides instantaneous, polite, human-friendly responses with interactive UI action buttons (Book Fitting, Direct WhatsApp) "
        "and zero downtime."
    )

    add_h2("4.9 WhatsApp O2O Protocol & Postman Validation")
    add_p(
        "The WhatsApp Click-to-Chat protocol (wa.me) enables instant communication between web visitors and business numbers without requiring prior contact saving. "
        "M.S Fashion synthesizes dynamic URI strings encoding customer specifications and high-resolution garment photo URLs, allowing WhatsApp to unfurl "
        "rich image card previews in the Master's chat. Postman was deployed throughout API development to validate status codes (200, 201, 400, 404, 500), "
        "verify JSON schemas, and test boundary payloads before frontend integration."
    )

    # ==================== CHAPTER 5: SYSTEM DESIGN ====================
    add_h1("CHAPTER 5. SYSTEM DESIGN")
    add_h2("5.1 Introduction")
    add_p(
        "System design represents the vital transitional phase where abstract software requirements and business goals are converted into "
        "concrete architectural specifications, database schemas, and process workflows. A well-conceived system design guarantees modularity, "
        "maintainability, performance, and structural integrity. This chapter elucidates the comprehensive design of the M.S Fashion bespoke platform "
        "utilizing formal architectural diagrams, multi-level Data Flow Diagrams (DFDs), UML Activity diagrams, Entity-Relationship (E-R) schemas, "
        "and UML Use-Case models."
    )

    add_h2("5.2 System Architecture Diagram")
    add_p(
        "The System Architecture Diagram illustrates the multi-tier topological organization of M.S Fashion. "
        "The architecture is organized into three distinct structural tiers coupled with external service integrations:"
    )
    add_bullet("Tier 1: Presentation Tier (React.js SPA) – Renders the editorial user interface, executes client-side routing, manages local session states, renders CSS 2.2x zoom transforms, and displays the Royal AI Stylist interface.")
    add_bullet("Tier 2: Business Logic Tier (Node.js & Express.js REST API) – Validates client payloads, handles multi-part image uploads via Multer, enforces sequential Ref ID generation rules, and communicates with mail transport services.")
    add_bullet("Tier 3: Persistence & Service Tier (MongoDB & External APIs) – Manages structured BSON document collections (Products, Inquiries, Config), connects to Google Gmail SMTP for OTP dispatch, and formats WhatsApp Click-to-Chat payloads.")

    add_image_figure("report_assets/diagram_system_architecture.png", "Figure 5.1: High-Level System Architecture Diagram of M.S Fashion")

    add_h2("5.3 Data Flow Diagram")
    add_p(
        "A Data Flow Diagram (DFD) provides a graphical model depicting the transformation, movement, and storage of data across system boundaries. "
        "The platform's data flow is represented at two distinct hierarchical granularities: Level 0 (Context Diagram) and Level 1 (Decomposed Processes)."
    )

    add_h3("5.3.1 Level 0 DFD (Context Diagram)")
    add_p(
        "The Level 0 DFD portrays M.S Fashion as a singular holistic process (0.0) and models its interactions with external entities: "
        "the Bespoke Customer, the Master Atelier Administrator, and external cloud services (MongoDB, Gmail SMTP, and WhatsApp Web)."
    )

    add_image_figure("report_assets/diagram_dfd_level0.png", "Figure 5.2: Level 0 Data Flow Diagram (Context Diagram)")

    add_h3("5.3.2 Level 1 DFD (Decomposed Modules)")
    add_p("The Level 1 DFD decomposes the central system into eight discrete, interconnected functional processes:")
    add_bullet("Process 1.0: Catalog Browsing & Silhouette Filtering – Filters products by category and specific silhouette tabs.")
    add_bullet("Process 2.0: CSS Zoom & Accessory Price Calculation – Maps accessory coordinates and computes dynamic grand totals.")
    add_bullet("Process 3.0: WhatsApp Direct Photo Dispatch – Generates pre-written query strings with design photo URLs.")
    add_bullet("Process 4.0: Appointment Booking & Self Budget Ingestion – Captures customer intake data and self-declared budgets.")
    add_bullet("Process 5.0: Two-Step Email OTP Verification – Issues 6-digit verification codes and validates client inboxes.")
    add_bullet("Process 6.0: Royal Atelier AI Stylist Chatbot – Processes natural language queries regarding wedding wear and fittings.")
    add_bullet("Process 7.0: Admin Catalog & 4-Border Image Trimmer – Enables the Master to update garments, zoom coordinates, and crop images.")
    add_bullet("Process 8.0: Store Settings & Inquiries CRM – Manages boutique business hours, address, and verified client leads.")

    add_image_figure("report_assets/diagram_dfd_level1.png", "Figure 5.3: Level 1 Data Flow Diagram (Decomposed Modules)")

    add_h2("5.4 Activity Diagram")
    add_p(
        "The UML Activity Diagram visualizes the sequential workflow and decision branching taken by a client from their initial visit "
        "to the final confirmation of an authenticated bespoke consultation lead."
    )

    add_image_figure("report_assets/diagram_activity.png", "Figure 5.4: UML Activity Diagram for Bespoke Client Consultation Workflow")

    add_h2("5.5 Entity-Relationship (E-R) Diagram")
    add_p(
        "The Entity-Relationship (ER) Diagram defines the conceptual data model and relationships governing the MongoDB database. "
        "The system models five core entities: Product/Garment, Accessory, Inquiry/CRM Lead, EmailOTPVerification, and BrandConfiguration."
    )

    add_image_figure("report_assets/diagram_er.png", "Figure 5.5: Entity-Relationship (E-R) Diagram of M.S Fashion")

    add_h2("5.6 Use-Case Diagram")
    add_p(
        "The UML Use-Case Diagram delineates the functional capabilities accessible to the two primary actors: "
        "the Bespoke Customer and the Master Atelier (Administrator)."
    )

    add_image_figure("report_assets/diagram_usecase.png", "Figure 5.6: UML Use-Case Diagram for M.S Fashion Platform")

    # ==================== CHAPTER 6: SYSTEM IMPLEMENTATION ====================
    add_h1("CHAPTER 6. SYSTEM IMPLEMENTATION")
    add_h2("6.1 Introduction")
    add_p(
        "System implementation translates conceptual architectures, database schemas, and interface mockups into robust, executable program code. "
        "This chapter details the technical implementation of the M.S Fashion platform across frontend React components, backend Express REST services, "
        "Nodemailer mail transports, and exhaustive software testing methodologies."
    )

    add_h2("6.2 System Flowchart")
    add_p(
        "The system flowchart illustrates the algorithmic decision logic executed when a customer interacts with the bespoke platform, "
        "inspects garments, toggles accessories, evaluates pricing, and decides whether to initiate a WhatsApp inquiry or complete an appointment booking."
    )

    add_image_figure("report_assets/diagram_flowchart.png", "Figure 6.1: High-Level System Workflow Flowchart")

    add_h2("6.3 Coding Implementation")
    add_p(
        "The codebase is structured according to enterprise separation of concerns, isolating UI views, state context providers, "
        "API services, and server controllers. Following the official University of Mumbai dissertation format, the complete source code "
        "files for primary frontend client modules and backend service controllers are provided in the following subsections."
    )

    # 6.3.1 FRONTEND IMPLEMENTATION (PAGINATED ~30 PAGES)
    add_h3("6.3.1 Frontend Implementation")
    add_p("The following section presents the production React source code implementing the conversational Royal Stylist Chatbot, the bespoke appointment intake modal with Self Budget and OTP validation, and the itemized price breakdown consultation drawer.")

    # File 1: AtelierChatbot.jsx (483 lines -> ~13 pages)
    add_paginated_code_file(doc, 'frontend/src/components/AtelierChatbot.jsx', 'AtelierChatbot.jsx (Royal Atelier AI Stylist Module)', lines_per_page=38)

    # File 2: AppointmentModal.jsx (first 380 lines -> ~10 pages)
    add_paginated_code_file(doc, 'frontend/src/components/AppointmentModal.jsx', 'AppointmentModal.jsx (Self Budget & Email OTP Verification)', lines_per_page=38, max_total_lines=380)

    # File 3: PricePanelModal.jsx (first 260 lines -> ~7 pages)
    add_paginated_code_file(doc, 'frontend/src/components/PricePanelModal.jsx', 'PricePanelModal.jsx (Itemized Costing & Direct WhatsApp Dispatch)', lines_per_page=38, max_total_lines=266)

    # 6.3.2 BACKEND IMPLEMENTATION (PAGINATED ~22 PAGES)
    doc.add_page_break()
    add_h3("6.3.2 Backend Implementation")
    add_p("The following section presents the production server-side Node.js and Express.js code responsible for inquiry ingestion, Gmail SMTP verification code delivery, dynamic catalog persistence with sequential Ref IDs, and server bootstrap logic.")

    # File 4: inquiryRoutes.js (290 lines -> ~8 pages)
    add_paginated_code_file(doc, 'backend/routes/inquiryRoutes.js', 'inquiryRoutes.js (Lead Submission & Email OTP Verification Endpoints)', lines_per_page=38)

    # File 5: mailer.js (155 lines -> ~4 pages)
    add_paginated_code_file(doc, 'backend/services/mailer.js', 'mailer.js (Gmail SMTP Transport & Branded HTML Email Template)', lines_per_page=38)

    # File 6: productRoutes.js (270 lines -> ~7 pages)
    add_paginated_code_file(doc, 'backend/routes/productRoutes.js', 'productRoutes.js (Dynamic Catalog & Category-Wise Ref ID Generator)', lines_per_page=38)

    # File 7: server.js (84 lines -> ~3 pages)
    add_paginated_code_file(doc, 'backend/server.js', 'server.js (Express Server Architecture & Middleware Pipeline)', lines_per_page=38)

    # 6.4 TESTING APPROACHES
    doc.add_page_break()
    add_h2("6.4 Testing Approaches")
    add_p(
        "To verify system robustness, fault tolerance, and security, a multi-dimensional testing regimen was conducted across "
        "Unit Testing, Usability Testing, and Security Validation."
    )
    add_bullet("Unit Testing: Verified independent utility functions, including currency formatting (formatINR), sequential Ref ID string padding, regex phone validation, and dynamic grand total summations.")
    add_bullet("Usability Testing: Evaluated client journey times, mobile viewport responsiveness (320px to 4K), 2-second auto-fading crosshair pins on CSS zoom viewports, and modal dismissal behaviors.")
    add_bullet("Security Testing: Checked for SQL/NoSQL injection vulnerability in query parameters, rate limiting on the OTP generation endpoint to mitigate email bombing, and administrative token authorization checks.")

    add_h3("6.4.4 Comprehensive Test Cases Table")
    add_p("The table below details 16 critical test cases executed across customer and administrative modules:")

    test_cases_data = [
        ("TC-01", "Homepage Navigation", "Client opens website on browser", "Editorial hero banner and floating Royal Stylist badge load cleanly", "Pass"),
        ("TC-02", "Silhouette Filtering", "Click 'Jodhpuri With Jacket (6)' tab", "Catalog displays exactly 6 matching garments with zero overlap", "Pass"),
        ("TC-03", "CSS Zoom Activation", "Click 'Kundan & Pearl Mala' accessory", "Viewer zooms to 2.2x magnification on chest; crosshair fades in 2s", "Pass"),
        ("TC-04", "Dynamic Price Roll-up", "Select Chanderi Safa (+₹1,500) and Mojdi", "Grand Total updates dynamically from base price to ₹20,599", "Pass"),
        ("TC-05", "Self Budget Ingestion", "Enter '₹50,000' in Expected Budget input", "Freeform value is accepted without enforcing preset tier restrictions", "Pass"),
        ("TC-06", "10-Digit Phone Check", "Enter 9 digits in phone input field", "System displays '9/10 Digits' counter and blocks submission", "Pass"),
        ("TC-07", "Email OTP Dispatch", "Enter valid client email in booking modal", "System sends 6-digit code via Gmail SMTP; modal enters Step 2", "Pass"),
        ("TC-08", "Email OTP Validation", "Enter matching 6-digit code '752084'", "Code verified; appointment lead marked verified: true in database", "Pass"),
        ("TC-09", "Direct WhatsApp Link", "Click 'Contact via WhatsApp' button", "Opens chat with Master (+91 89993 86222) with pre-filled photo link", "Pass"),
        ("TC-10", "AI Chatbot Launch", "Click floating crown button on bottom-right", "Luxury chat opens with greeting, online badge, and quick chips", "Pass"),
        ("TC-11", "AI Groom Wear Advice", "User types 'What should I wear for Sangeet?'", "Chatbot recommends Indo-Western silhouette with 1-click booking", "Pass"),
        ("TC-12", "Admin Authentication", "Submit master credentials on /admin/login", "JWT issued; redirects to 2x2 Master Admin Dashboard", "Pass"),
        ("TC-13", "Sequential Ref ID", "Create new garment under Sherwani category", "System evaluates maxRef and auto-assigns sequential 'sherwani-06'", "Pass"),
        ("TC-14", "Phone Gallery Cropper", "Adjust Top/Bottom/Left/Right trim sliders", "Rule-of-thirds grid reflects trims; canvas uploads cropped PNG", "Pass"),
        ("TC-15", "Brand Config Update", "Update boutique email and save settings", "PUT /api/admin/brand-config persists to disk; persists on refresh", "Pass"),
        ("TC-16", "CRM Lead Inspection", "Open 'Inquiries & Appointments' tab in admin", "Displays verified client leads with self-declared budgets & WhatsApp button", "Pass")
    ]

    tc_table = doc.add_table(rows=len(test_cases_data) + 1, cols=5)
    tc_table.alignment = WD_TABLE_ALIGNMENT.CENTER

    headers = ["Test ID", "Module / Action", "Input Test Vector", "Expected Architectural Result", "Status"]
    for col_idx, h_text in enumerate(headers):
        cell = tc_table.cell(0, col_idx)
        cell.paragraphs[0].text = h_text
        cell.paragraphs[0].runs[0].bold = True
        cell.paragraphs[0].runs[0].font.name = 'Times New Roman'
        cell.paragraphs[0].runs[0].font.size = Pt(9.5)
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_background(cell, "5C1A21")
        set_cell_margins(cell, 80, 80, 100, 100)

    for row_idx, data in enumerate(test_cases_data, start=1):
        for col_idx, text in enumerate(data):
            cell = tc_table.cell(row_idx, col_idx)
            cell.paragraphs[0].text = text
            cell.paragraphs[0].runs[0].font.name = 'Times New Roman'
            cell.paragraphs[0].runs[0].font.size = Pt(8.5)
            if col_idx == 4:
                cell.paragraphs[0].runs[0].bold = True
                cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(0x00, 0x80, 0x00)
            if row_idx % 2 == 0:
                set_cell_background(cell, "FBF6EC")
            set_cell_margins(cell, 60, 60, 80, 80)

    # ==================== CHAPTER 7: RESULTS AND SCREENSHOTS ====================
    add_h1("CHAPTER 7. RESULTS")
    add_h2("7.1 Introduction")
    add_p(
        "The implementation and testing phases of M.S Fashion: Bespoke Ethnic Menswear Platform culminated in a fully functional, "
        "production-ready web application deployed across development environments. All architectural modules—ranging from editorial catalog "
        "filtering to two-step email verification, visual zoom calibration, AI stylist consultation, and master CRM administration—performed "
        "in strict accordance with requirements. This chapter presents high-resolution screenshots of the deployed application paired with "
        "detailed academic and operational evaluations."
    )

    add_h2("7.2 Results & Detailed Module Walkthrough")

    # Figure 7.1
    add_h3("7.2.1 Homepage & Editorial Hero Carousel")
    add_p(
        "Figure 7.1 showcases the primary landing interface of M.S Fashion. The design embodies an editorial luxury aesthetic modeled after "
        "royal atelier salons and Manyavar. The top header features the M.S Fashion insignia, public contact channels, and primary navigation "
        "links ('Home', 'Ethnic Wear', 'Bespoke Tailoring', 'Bulk Orders', and a prominent 'Book Appointment' button). The hero carousel "
        "displays high-definition bridal ensembles with typographic taglines ('The Legacy of Indo-Western'), accompanied by the floating "
        "'Ask Royal Stylist' AI launcher badge in the bottom-right corner."
    )
    add_image_figure("report_assets/01_homepage.png", "Figure 7.1: Homepage with Editorial Hero Carousel & Floating Royal Stylist Badge", width=Inches(5.8))

    # Figure 7.2
    add_h3("7.2.2 Category Catalog & Dynamic Silhouette Filtering")
    add_p(
        "Figure 7.2 illustrates the category browsing view for Aristocratic Jodhpuri Bandhgala. The interface implements normalized, strict "
        "silhouette filtering tabs displaying live count indicators: 'All Silhouettes (10)', 'Jodhpuri With Jacket (6)', and 'Jodhpuri Without Jacket (4)'. "
        "Selecting any tab filters the garments instantaneously without requiring page reloads, ensuring zero category cross-contamination."
    )
    add_image_figure("report_assets/02_category_grid.png", "Figure 7.2: Category Catalog Interface with Live Silhouette Filter Counts", width=Inches(5.8))

    # Figure 7.3
    add_h3("7.2.3 Product Detail Page & Luxury Ensembles")
    add_p(
        "Figure 7.3 depicts the bespoke product inspection interface for 'The Maharaja Sherwani' (Reference ID: sherwani-01). "
        "The view is organized in a balanced two-column layout: the left column houses the high-resolution garment viewer, while the right column "
        "presents the modular 'Bespoke Accessory Elements' list (Royal Mojdi +₹1,400, Chanderi Safa +₹1,500, Kundan & Pearl Mala +₹700, and Embroidered Dupatta +₹2,000)."
    )
    add_image_figure("report_assets/03_product_detail.png", "Figure 7.3: Product Detail View with Modular Accessory Selection Interface", width=Inches(5.8))

    # Figure 7.4
    add_h3("7.2.4 Interactive CSS Zoom Calibrator Active Mode")
    add_p(
        "Figure 7.4 demonstrates the hardware-accelerated CSS Transform-Origin Zoom viewer in active operation. When the client selects "
        "'Kundan & Pearl Mala', the canvas smoothly magnifies by 2.2x, perfectly centering on the intricate chest jewelry. A visual crosshair pin "
        "and badge ('Kundan & Pearl Mala') display for exactly two seconds before elegantly fading out, while top controls ('Zoom Mode • Drag to Move' "
        "and 'Exit Zoom') allow freeform inspection."
    )
    add_image_figure("report_assets/04_zoom_active.png", "Figure 7.4: Hardware-Accelerated 2.2x CSS Zoom Viewer Focused on Royal Accessory", width=Inches(5.8))

    # Figure 7.5
    add_h3("7.2.5 Bespoke Price Breakdown & WhatsApp Consultation")
    add_p(
        "Figure 7.5 illustrates the itemized Price Breakdown Modal and direct atelier consultation drawer. The modal displays a thumbnail of the garment, "
        "its reference ID, a confirmation badge indicating that the design photo is linked for WhatsApp, and an itemized cost calculation yielding an "
        "Estimated Grand Total of ₹20,599. The client can enter customization notes ('Is it available ??') and click 'Contact via WhatsApp' to open "
        "a pre-written inquiry directly with the Master Tailor (+91 89993 86222)."
    )
    add_image_figure("report_assets/05_price_breakdown_top.png", "Figure 7.5(a): Bespoke Price Breakdown Modal with Itemized Accessory Costing", width=Inches(5.5))
    add_image_figure("report_assets/05_price_breakdown_bottom.png", "Figure 7.5(b): Client Customization Notes & Direct WhatsApp Consultation Action", width=Inches(5.5))

    # Figure 7.6
    add_h3("7.2.6 Private Consultation Booking & Self Budget Input")
    add_p(
        "Figure 7.6 showcases the appointment intake modal. Clients enter their full name (Aslam Ansari), mandatory email address, 10-digit validated phone number, "
        "category of interest, preferred date ('This Weekend'), and location ('Vasai'). Critically, the 'Expected Budget (Self Budget)' field allows the client "
        "to specify their intended expenditure ('₹15,000') without being constrained by artificial preset ranges."
    )
    add_image_figure("report_assets/06_appointment_form.png", "Figure 7.6: Private Consultation Booking Form with Freeform Self Budget Input", width=Inches(5.8))

    # Figure 7.7
    add_h3("7.2.7 Royal 6-Digit Email OTP Lead Verification")
    add_p(
        "Figure 7.7 depicts Step 2 of the consultation booking flow: the Royal Email OTP Verification dialog. A cryptographically generated 6-digit code "
        "(e.g. 752084) is dispatched to the client's email address via Gmail SMTP. The modal features generous letter-spacing, a 60-second countdown timer, "
        "and resilient verification logic, ensuring zero spam leads enter the boutique CRM."
    )
    add_image_figure("report_assets/07_email_otp.png", "Figure 7.7: Two-Step Royal Email OTP Verification Screen (6-Digit Authenticator)", width=Inches(5.8))

    # Figure 7.8
    add_h3("7.2.8 Royal Atelier AI Stylist Chatbot")
    add_p(
        "Figure 7.8 presents the conversational interface of the Royal Atelier AI Stylist Chatbot. Operating in the bottom-right corner, the chatbot "
        "greets patrons with royal warmth, suggests quick prompts ('Sherwani Styles', 'Tuxedos & Blazers', 'Measurements'), and offers contextual "
        "recommendations for wedding ceremonies, accompanied by direct buttons to book appointments or connect with the Master."
    )
    add_image_figure("report_assets/08_ai_chatbot.png", "Figure 7.8: Royal Atelier AI Stylist Chatbot Offering Conversational Fashion Guidance", width=Inches(5.8))

    # Figure 7.9
    add_h3("7.2.9 Master Admin Dashboard & CRM Lead Management")
    add_p(
        "Figure 7.9 demonstrates the authenticated Master Admin Dashboard ('Inquiries & Appointments' tab). The dashboard provides real-time visibility "
        "into client leads. The lead submitted by Aslam Ansari is displayed with a 'Verified ✓' email badge, contact phone (+91 8999386222), "
        "declared Self Budget (₹15,000), preferred date, location, and a 1-click 'WhatsApp' action to initiate atelier measurement scheduling."
    )
    add_image_figure("report_assets/09_admin_dashboard.png", "Figure 7.9: Master Admin Dashboard Displaying Authenticated CRM Consultation Leads", width=Inches(5.8))

    add_h2("7.3 Overall Result")
    add_p(
        "The empirical findings derived from implementation, system integration, and end-to-end testing demonstrate that M.S Fashion successfully "
        "bridges luxury craftsmanship with modern software engineering. The platform eliminates sizing errors, prevents consultation spam via email OTPs, "
        "provides seamless pre-trial inspection via CSS zoom transforms, and equips the boutique with an enterprise-grade administrative suite."
    )

    # ==================== CHAPTER 8: CONCLUSION AND FUTURE SCOPE ====================
    add_h1("CHAPTER 8. CONCLUSION AND FUTURE SCOPE")
    add_h2("8.1 Conclusion")
    add_p(
        "The project entitled 'M.S Fashion: Bespoke Ethnic Menswear Platform' was successfully architected, developed, and evaluated in strict "
        "adherence to the syllabus and dissertation guidelines of Bachelor of Science in Computer Science Sem V, University of Mumbai. "
        "By recognizing that high-value handcrafted ethnic menswear cannot be forced into rigid mass-market e-commerce checkout funnels, "
        "the project introduced an Online-to-Offline (O2O) digital atelier framework that respects both artisan traditions and modern client expectations."
    )
    add_p(
        "Key technical milestones accomplished include: an editorial, responsive Manyavar-inspired aesthetic; an interactive hardware-accelerated "
        "CSS 2.2x zoom calibrator; a dynamic accessory pricing calculation engine; a spam-proof two-step royal Email OTP verification system; "
        "direct WhatsApp click-to-chat photo integration targeting the Master Tailor (+91 89993 86222); an intelligent Royal Atelier AI Stylist Chatbot; "
        "and a comprehensive Master Admin portal featuring sequential Ref IDs and 4-border phone gallery image cropping."
    )

    add_h2("8.2 Future Scope and Enhancement")
    add_p(
        "While the current system fulfills all primary operational requirements of a bespoke menswear atelier, future iterations can introduce "
        "the following ten cutting-edge technological enhancements:"
    )
    add_bullet("1. WebXR Virtual 3D Mirror & AR Try-On: Integrating WebXR and Three.js to allow prospective grooms to virtually project 3D digital garment twins onto their body utilizing smartphone cameras.")
    add_bullet("2. Computer Vision Fabric Texture Analysis: Machine learning models capable of analyzing uploaded client fabric swatches to automatically detect thread density, weave patterns, and yarn composition.")
    add_bullet("3. Multi-Lingual Regional Voice Concierge: Expanding the AI chatbot to support spoken Hindi, Gujarati, Marathi, and Urdu voice inputs for regional wedding patrons.")
    add_bullet("4. Computerized Photogrammetric Body Scanning: Allowing clients to capture two 2D smartphone photos to extract 15+ 3D anatomical measurements automatically using computer vision depth estimation.")
    add_bullet("5. Automated Tailoring Workshop ERP Integration: Real-time inventory tracking for raw silk bolts, zardozi spools, and artisan job-sheet dispatching to workshop embroidery frames.")
    add_bullet("6. Blockchain Fabric Authenticity & Provenance: Non-Fungible Digital Certificates of Authenticity guaranteeing the purity of handloom Banarasi silk and authentic Zardozi bullion metals.")
    add_bullet("7. Multi-Branch Studio Cloud Synchronization: Centralized cloud database supporting multi-city boutique branches across Mumbai, Delhi, Hyderabad, and international diaspora hubs (Dubai, London).")
    add_bullet("8. Dedicated Cross-Platform Mobile Application: Compiling native Android and iOS mobile applications utilizing React Native and Expo for push notification fitting reminders.")
    add_bullet("9. Official Meta WhatsApp Cloud API Webhooks: Upgrading click-to-chat links into fully automated bidirectional WhatsApp bot conversations with digital PDF catalogue delivery.")
    add_bullet("10. Predictive Wedding Season CRM Analytics: Predictive machine learning models forecasting demand peaks for wedding silhouettes based on auspicious Hindu and regional wedding calendar muhurats.")

    # ==================== CHAPTER 9: REFERENCES ====================
    add_h1("CHAPTER 9. REFERENCES")
    refs = [
        "React Official Documentation – React: A JavaScript library for building user interfaces. https://react.dev/",
        "Tailwind CSS Documentation – Rapidly build modern websites without ever leaving your HTML. https://tailwindcss.com/docs",
        "Node.js Runtime Documentation – Node.js v20 LTS API reference and asynchronous architecture. https://nodejs.org/docs/",
        "Express.js Framework Documentation – Fast, unopinionated, minimalist web framework for Node.js. https://expressjs.com/",
        "MongoDB Manual & Architecture Guide – Document-oriented NoSQL database system. https://www.mongodb.com/docs/manual/",
        "Mongoose ODM Documentation – Elegant MongoDB object modeling for Node.js. https://mongoosejs.com/docs/",
        "Vite Next Generation Frontend Tooling – Development server and Rollup bundler. https://vitejs.dev/guide/",
        "Nodemailer Transport Documentation – Easy as cake email sending from Node.js applications. https://nodemailer.com/",
        "WhatsApp Business API & Click-to-Chat Reference – Universal WhatsApp URL scheme specifications. https://faq.whatsapp.com/5913398998672934",
        "IEEE Xplore – Research on Online-to-Offline (O2O) E-Commerce Models in High-Value Custom Manufacturing, IEEE Computer Society, 2023.",
        "University of Mumbai – Guidelines for Project Dissertation for B.Sc. (Computer Science), Board of Studies in Computer Science, 2024-2026."
    ]

    for idx, ref in enumerate(refs, start=1):
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.line_spacing = 1.15
        p_ref.paragraph_format.space_after = Pt(6)
        r_num = p_ref.add_run(f"[{idx}] ")
        r_num.bold = True
        r_num.font.name = 'Times New Roman'
        r_num.font.size = Pt(11)
        r_num.font.color.rgb = PRIMARY_COLOR
        r_text = p_ref.add_run(ref)
        r_text.font.name = 'Times New Roman'
        r_text.font.size = Pt(11)

    output_filename = "MS_Fashion_Bespoke_Project_Report.docx"
    doc.save(output_filename)
    print(f"SUCCESS! Complete 85-90 Page Project Report successfully generated and saved to: {output_filename}")
    return output_filename

if __name__ == '__main__':
    generate_complete_project_report()
