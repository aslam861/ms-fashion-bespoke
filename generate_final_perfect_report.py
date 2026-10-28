import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
from paginated_code_helper import add_paginated_code_file

def create_final_report():
    print("Initiating Final Perfect Report Creation (100% Pure Black, Straight Tab Dots, Shifa Match)...")
    doc = docx.Document()

    # Section Margins & A4 setup
    section = doc.sections[0]
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.25) # Binding margin
    section.right_margin = Inches(1.0)
    section.page_width = Inches(8.27)  # A4
    section.page_height = Inches(11.69)

    # 1. Solid Black Page Border (Matching Shifa's PDF)
    sectPr = section._sectPr
    pgBorders = parse_xml(
        f'<w:pgBorders {nsdecls("w")} w:offsetFrom="page">'
        f'<w:top w:val="single" w:sz="10" w:space="24" w:color="000000"/>'
        f'<w:left w:val="single" w:sz="10" w:space="24" w:color="000000"/>'
        f'<w:bottom w:val="single" w:sz="10" w:space="24" w:color="000000"/>'
        f'<w:right w:val="single" w:sz="10" w:space="24" w:color="000000"/>'
        f'</w:pgBorders>'
    )
    sectPr.append(pgBorders)

    # 2. Bottom Center Page Numbers (Times New Roman, 10pt, Pure Black)
    footer = section.footer
    p_ft = footer.paragraphs[0]
    p_ft.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_ft = p_ft.add_run()
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    run_ft._r.append(fldChar1)
    run_ft._r.append(instrText)
    run_ft._r.append(fldChar2)
    run_ft._r.append(fldChar3)
    run_ft.font.name = 'Times New Roman'
    run_ft.font.size = Pt(10)
    run_ft.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    # Helper styling functions (All Pure Black)
    BLACK = RGBColor(0x00, 0x00, 0x00)

    def add_title(text, font_size=15, bold=True, space_before=10, space_after=10, align=WD_ALIGN_PARAGRAPH.CENTER):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        run = p.add_run(text)
        run.bold = bold
        run.font.name = 'Times New Roman'
        run.font.size = Pt(font_size)
        run.font.color.rgb = BLACK
        return p

    def add_h1(text):
        doc.add_page_break()
        return add_title(text, font_size=16, bold=True, space_before=16, space_after=16, align=WD_ALIGN_PARAGRAPH.CENTER)

    def add_h2(text):
        return add_title(text, font_size=13, bold=True, space_before=14, space_after=6, align=WD_ALIGN_PARAGRAPH.LEFT)

    def add_h3(text):
        # Normal upright bold (NOT italic, matching Shifa)
        return add_title(text, font_size=12, bold=True, space_before=10, space_after=4, align=WD_ALIGN_PARAGRAPH.LEFT)

    def add_p(text, bold_prefix='', italic=False):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(6)
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.bold = True
            rb.font.name = 'Times New Roman'
            rb.font.size = Pt(12)
            rb.font.color.rgb = BLACK
        r = p.add_run(text)
        r.italic = italic
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        r.font.color.rgb = BLACK
        return p

    def add_bullet(text, bold_prefix=''):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(4)
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.bold = True
            rb.font.name = 'Times New Roman'
            rb.font.size = Pt(12)
            rb.font.color.rgb = BLACK
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        r.font.color.rgb = BLACK
        return p

    def add_image_figure(img_path, caption_text, width=Inches(5.8)):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(8)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.add_run().add_picture(img_path, width=width)

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(12)
            run = p_cap.add_run(caption_text)
            run.bold = True
            run.italic = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(10)
            run.font.color.rgb = BLACK

    # ==================== PAGE 1: TITLE PAGE (EVENLY SPACED) ====================
    add_title("M.S FASHION: BESPOKE ETHNIC MENSWEAR\nPLATFORM", font_size=16, bold=True, space_before=20, space_after=24)
    add_title("A Project Report", font_size=12, bold=True, space_before=4, space_after=6)
    add_title("Submitted in Partial fulfilment of the\nRequirements for the award of the Degree of", font_size=11, bold=False, space_before=4, space_after=8)
    add_title("BACHELOR OF SCIENCE (COMPUTER SCIENCE)", font_size=13, bold=True, space_before=4, space_after=6)
    add_title("SEM V", font_size=12, bold=True, space_before=4, space_after=26)

    add_title("By Aslam Ansari", font_size=13, bold=True, space_before=4, space_after=6)
    add_title("Seat No:                                     Roll No: 05", font_size=11, bold=True, space_before=2, space_after=24)

    add_title("Under the esteemed guidance of", font_size=11, bold=False, space_before=2, space_after=4)
    add_title("Prof. Javed Pathan", font_size=13, bold=True, space_before=2, space_after=2)
    add_title("Assistant Professor", font_size=11, bold=False, space_before=0, space_after=20)

    # Centered Rizvi Logo
    if os.path.exists("report_assets/college_logo_0.png"):
        p_l = doc.add_paragraph()
        p_l.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_l.paragraph_format.space_before = Pt(4)
        p_l.paragraph_format.space_after = Pt(16)
        p_l.add_run().add_picture("report_assets/college_logo_0.png", width=Inches(1.5))

    add_title("DEPARTMENT OF COMPUTER SCIENCE", font_size=11, bold=True, space_before=4, space_after=4)
    add_title("RIZVI COLLEGE OF ARTS, SCIENCE AND COMMERCE", font_size=12, bold=True, space_before=2, space_after=4)
    add_title("(Affiliated to University of Mumbai)", font_size=11, bold=False, space_before=2, space_after=4)
    add_title("MUMBAI-400050", font_size=11, bold=True, space_before=2, space_after=2)
    add_title("MAHARASHTRA", font_size=11, bold=True, space_before=2, space_after=6)
    add_title("2026-2027", font_size=12, bold=True, space_before=4, space_after=10)

    # ==================== PAGE 2: CERTIFICATE (EXACT SHIFA MATCH) ====================
    doc.add_page_break()
    add_title("RIZVI COLLEGE OF ARTS, SCIENCE AND COMMERCE", font_size=13, bold=True, space_before=14, space_after=4)
    add_title("(Affiliated to University of Mumbai)", font_size=11, bold=False, space_before=2, space_after=4)
    add_title("MUMBAI-MAHARASHTRA-400050", font_size=11, bold=True, space_before=2, space_after=8)
    add_title("DEPARTMENT OF COMPUTER SCIENCE", font_size=12, bold=True, space_before=4, space_after=16)

    if os.path.exists("report_assets/college_logo_0.png"):
        p_l2 = doc.add_paragraph()
        p_l2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_l2.paragraph_format.space_before = Pt(4)
        p_l2.paragraph_format.space_after = Pt(16)
        p_l2.add_run().add_picture("report_assets/college_logo_0.png", width=Inches(1.2))

    add_title("CERTIFICATE", font_size=15, bold=True, space_before=10, space_after=20)

    add_p(
        "This is to certify that the project entitled, “M.S Fashion: Bespoke Ethnic Menswear Platform”, is bonafide work of "
        "Aslam Ansari bearing Seat No: Roll No: 05 submitted in Partial fulfilment of the requirements for the award of degree of "
        "BACHELOR OF SCIENCE in COMPUTER SCIENCE SEM V from University of Mumbai."
    )

    # Signatures matching Shifa's clean style (No underscores!)
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(80)

    sig_tbl = doc.add_table(rows=3, cols=2)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_tbl.autofit = False
    sig_tbl.columns[0].width = Inches(3.0)
    sig_tbl.columns[1].width = Inches(3.0)

    # Row 1: Project Guide (Left) & HOD (Right)
    c0 = sig_tbl.cell(0, 0)
    c0.paragraphs[0].text = "Project Guide"
    c0.paragraphs[0].runs[0].font.name = 'Times New Roman'
    c0.paragraphs[0].runs[0].font.size = Pt(11)
    c0.paragraphs[0].runs[0].bold = True

    c1 = sig_tbl.cell(0, 1)
    c1.paragraphs[0].text = "HOD"
    c1.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    c1.paragraphs[0].runs[0].font.name = 'Times New Roman'
    c1.paragraphs[0].runs[0].font.size = Pt(11)
    c1.paragraphs[0].runs[0].bold = True

    # Row 2: External Examiner (Centered)
    sig_tbl.cell(1, 0).merge(sig_tbl.cell(1, 1))
    c_mid = sig_tbl.cell(1, 0)
    p_ex = c_mid.paragraphs[0]
    p_ex.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ex.paragraph_format.space_before = Pt(50)
    p_ex.paragraph_format.space_after = Pt(50)
    r_ex = p_ex.add_run("External Examiner")
    r_ex.font.name = 'Times New Roman'
    r_ex.font.size = Pt(11)
    r_ex.bold = True

    # Row 3: Date & College Seal
    c_dt = sig_tbl.cell(2, 0)
    c_dt.paragraphs[0].text = "Date: __________"
    c_dt.paragraphs[0].runs[0].font.name = 'Times New Roman'
    c_dt.paragraphs[0].runs[0].font.size = Pt(11)

    c_seal = sig_tbl.cell(2, 1)
    c_seal.paragraphs[0].text = "College Seal"
    c_seal.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    c_seal.paragraphs[0].runs[0].font.name = 'Times New Roman'
    c_seal.paragraphs[0].runs[0].font.size = Pt(11)

    # ==================== PAGE 3: ACKNOWLEDGEMENT ====================
    doc.add_page_break()
    add_title("ACKNOWLEDGEMENT", font_size=16, bold=True, space_before=14, space_after=18)
    add_p("I would like to extend my sincere appreciation to the Department of Computer Science at Rizvi College of Arts, Science, and Commerce for providing me with the opportunity to undertake and complete this project dissertation.")
    add_p("I am deeply grateful to our Principal, Dr. Anjum Ara Ahmad, for her exceptional leadership, institutional vision, and encouragement throughout our academic tenure.")
    add_p("I would also like to express my sincere gratitude to the Head of the Department, Professor Arif Patel, for his support in terms of providing essential departmental facilities, computing laboratories, and academic guidance throughout the course, which has been instrumental in the completion of this project.")
    add_p("I would like to convey my profound thanks to my esteemed project guide, Professor Javed Pathan. His continuous mentorship, technical insights, meticulous feedback, and scholarly encouragement have played an indispensable role in the architectural design and successful implementation of the M.S Fashion bespoke platform.")
    add_p("Lastly, I am deeply thankful to my dear parents and family members for their unwavering support, moral encouragement, and blessings that sustained my efforts throughout the development of this dissertation.")

    p_sign = doc.add_paragraph()
    p_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sign.paragraph_format.space_before = Pt(40)
    r_me = p_sign.add_run("Aslam Ansari\nRoll No: 05")
    r_me.bold = True
    r_me.font.name = 'Times New Roman'

    # ==================== PAGE 4: PLAGIARISM REPORT ====================
    doc.add_page_break()
    add_title("PLAGIARISM REPORT", font_size=16, bold=True, space_before=14, space_after=18)
    add_p("The plagiarism scan report for the M.S Fashion: Bespoke Ethnic Menswear Platform project documentation shows 0% plagiarism, indicating that no copied content was detected during the scan. The report records 0% Exact Match and 0% Partial Match, meaning that no significant text was found to directly or partially match the sources checked by the plagiarism detection system.")
    add_p("The report also shows 100% Unique Content, demonstrating that the submitted documentation is identified as original. Overall, the result indicates that the project report maintains a high level of originality and does not contain detectable plagiarized content according to the scan.")

    if os.path.exists("report_assets/plagiarism_proof_0.png"):
        add_image_figure("report_assets/plagiarism_proof_0.png", "Figure: Plagiarism Scan Report Certificate (0% Plagiarism / 100% Unique)", width=Inches(4.5))

    # ==================== PAGE 5: DECLARATION ====================
    doc.add_page_break()
    add_title("DECLARATION", font_size=16, bold=True, space_before=14, space_after=18)
    add_p("I hereby declare that the project entitled, “M.S Fashion: Bespoke Ethnic Menswear Platform”, has not been in any case duplicated to submit to any other university for the award of any degree. To the best of our knowledge other than us, no one has submitted to any other university. The project is done in partial fulfilment of the requirements for the award of degree of BACHELOR OF SCIENCE (COMPUTER SCIENCE) to be submitted as semester V project as part of our curriculum.")

    p_decl = doc.add_paragraph()
    p_decl.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_decl.paragraph_format.space_before = Pt(60)
    r_decl = p_decl.add_run("Aslam Ansari")
    r_decl.bold = True
    r_decl.font.name = 'Times New Roman'

    # ==================== PAGE 6: ABSTRACT ====================
    doc.add_page_break()
    add_title("ABSTRACT", font_size=16, bold=True, space_before=14, space_after=18)
    add_p("M.S Fashion: Bespoke Ethnic Menswear Platform is a technology-driven web application designed to simplify, modernize, and elevate the bespoke tailoring consultation experience for high-end Indian ethnic menswear. Clients seeking wedding and celebration attire—such as royal Sherwanis, aristocratic Jodhpuri Bandhgalas, Indo-Western fusion ensembles, and bespoke Tuxedos—often face challenges with traditional off-the-rack sizing, lack of pre-trial visual inspection, unorganized communication, and fragmented record keeping. The proposed system provides a centralized digital atelier platform where users can explore curated collections, inspect intricate hand-embroidery with interactive zoom calibration, configure royal accessories, calculate itemized price estimations, and book verified private fittings.")
    add_p("The system incorporates an interactive hardware-accelerated CSS Transform-Origin Visual Zoom Calibrator (2.2x zoom) that allows clients to examine fine Zardozi wirework, brocade textures, and accessory details. To solve high-ticket bridal wear communication challenges, the application integrates an intelligent Royal Atelier AI Stylist Chatbot providing contextual styling advice for wedding events, explaining the 15+ body measurement process, and routing inquiries directly to the Master Craftsman on WhatsApp (+91 89993 86222) with automated garment photo links. A two-step royal Email OTP verification protocol powered by Gmail SMTP safeguards the boutique from appointment spam while enabling a client-defined Expected Budget (Self Budget) entry.")
    add_p("By integrating modern web technology (React, Node.js, Express, MongoDB), an AI conversational assistant, and centralized master administrative controls (with sequential Ref IDs and a 4-border phone gallery image crop studio), the proposed system makes bespoke ethnic menswear tailoring more organized, accessible, transparent, and proactive, improving the overall couture experience for clients and master tailors alike.")

    # ==================== TABLE OF CONTENTS (LASER-STRAIGHT DOT LEADERS) ====================
    doc.add_page_break()
    add_title("TABLE OF CONTENTS", font_size=16, bold=True, space_before=14, space_after=18)

    # Helper for laser-straight right tab dot leaders (Matching Shifa's Page 7-9)
    def add_toc_line(title_text, page_num_text, is_chapter=False, indent_in=0.0):
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_before = Pt(6 if is_chapter else 2)
        p.paragraph_format.space_after = Pt(4 if is_chapter else 2)
        if indent_in > 0:
            p.paragraph_format.left_indent = Inches(indent_in)
        p.paragraph_format.tab_stops.add_tab_stop(Inches(5.9), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.DOTS)
        
        r1 = p.add_run(title_text)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11 if is_chapter else 10.5)
        r1.bold = is_chapter
        r1.font.color.rgb = BLACK

        r2 = p.add_run(f"\t{page_num_text}")
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11 if is_chapter else 10.5)
        r2.bold = is_chapter
        r2.font.color.rgb = BLACK

    toc_structure = [
        ("CHAPTER 1. INTRODUCTION", "01", True, 0.0),
        ("1.1 Introduction", "01", False, 0.25),
        ("1.2 Problem Definition", "02", False, 0.25),
        ("1.3 Aim", "04", False, 0.25),
        ("1.4 Objectives", "05", False, 0.25),
        ("1.5 Goal", "05", False, 0.25),
        ("1.6 Need of the System", "06", False, 0.25),

        ("CHAPTER 2. REQUIREMENT SPECIFICATION", "07", True, 0.0),
        ("2.1 Introduction", "07", False, 0.25),
        ("2.2 System Environment", "07", False, 0.25),
        ("2.3 Software Requirements", "08", False, 0.25),
        ("2.4 Hardware Requirements", "10", False, 0.25),
        ("2.5 Methodology", "10", False, 0.25),
        ("2.6 Spiral Model", "11", False, 0.25),

        ("CHAPTER 3. SYSTEM ANALYSIS", "15", True, 0.0),
        ("3.1 System Analysis", "15", False, 0.25),
        ("3.2 Analysis of Existing System", "16", False, 0.25),
        ("3.3 Analysis of the Proposed System", "17", False, 0.25),

        ("CHAPTER 4. SURVEY OF TECHNOLOGY", "20", True, 0.0),
        ("4.1 React.js", "20", False, 0.25),
        ("4.2 Tailwind CSS", "21", False, 0.25),
        ("4.3 Node.js", "22", False, 0.25),
        ("4.4 Express.js", "23", False, 0.25),
        ("4.5 MongoDB", "23", False, 0.25),
        ("4.6 Vite", "24", False, 0.25),
        ("4.7 Nodemailer", "24", False, 0.25),
        ("4.8 Royal Atelier AI Stylist", "25", False, 0.25),
        ("4.9 Postman", "25", False, 0.25),

        ("CHAPTER 5. SYSTEM DESIGN", "26", True, 0.0),
        ("5.1 Introduction", "26", False, 0.25),
        ("5.2 System Architecture Diagram", "26", False, 0.25),
        ("5.3 Data Flow Diagram", "28", False, 0.25),
        ("5.3.1 Level 0 DFD", "28", False, 0.45),
        ("5.3.2 Level 1 DFD", "29", False, 0.45),
        ("5.4 Activity Diagram", "31", False, 0.25),
        ("5.5 E-R Diagram", "32", False, 0.25),
        ("5.6 Use-Case Diagram", "33", False, 0.25),

        ("CHAPTER 6. SYSTEM IMPLEMENTATION", "35", True, 0.0),
        ("6.1 Introduction", "35", False, 0.25),
        ("6.2 Flowchart", "35", False, 0.25),
        ("6.3 Coding", "37", False, 0.25),
        ("6.3.1 Frontend", "38", False, 0.45),
        ("6.3.2 Backend", "68", False, 0.45),
        ("6.4 Testing Approaches", "85", False, 0.25),
        ("6.4.1 Unit Testing", "85", False, 0.45),
        ("6.4.2 Usability Testing", "85", False, 0.45),
        ("6.4.3 Security Testing", "85", False, 0.45),
        ("6.4.4 Test Cases", "86", False, 0.45),

        ("CHAPTER 7. RESULTS", "88", True, 0.0),
        ("7.1 Introduction", "88", False, 0.25),
        ("7.2 Results", "89", False, 0.25),
        ("7.2.1 Home & Navigation", "89", False, 0.45),
        ("7.2.2 Category Catalog", "90", False, 0.45),
        ("7.2.3 Product Detail & Accessories", "91", False, 0.45),
        ("7.2.4 CSS Zoom Viewer", "92", False, 0.45),
        ("7.2.5 Price Breakdown & WhatsApp", "93", False, 0.45),
        ("7.2.6 Appointment Booking", "94", False, 0.45),
        ("7.2.7 Email OTP Verification", "95", False, 0.45),
        ("7.2.8 Royal AI Stylist Chatbot", "96", False, 0.45),
        ("7.2.9 Master Admin Dashboard", "97", False, 0.45),
        ("7.3 Overall Result", "98", False, 0.25),

        ("CHAPTER 8. CONCLUSION AND FUTURE SCOPE", "99", True, 0.0),
        ("8.1 Conclusion", "99", False, 0.25),
        ("8.2 Future Scope and Enhancement", "99", False, 0.25),

        ("CHAPTER 9. REFERENCE", "102", True, 0.0)
    ]

    for title_txt, p_txt, is_ch, ind in toc_structure:
        add_toc_line(title_txt, p_txt, is_ch, ind)

    # ==================== CHAPTER 1: INTRODUCTION ====================
    add_h1("CHAPTER 1. INTRODUCTION")
    add_h2("1.1 Introduction")
    add_p("In the modern era, traditional ethnic menswear occupies an important and celebrated position in Indian culture and global couture. Garments such as the Sherwani, Jodhpuri Bandhgala, Indo-Western achkan, and bespoke evening Tuxedos are widely revered as symbols of heritage, regal prestige, and artisanal craftsmanship. For wedding celebrations, festive gatherings, and formal galas, grooms and family members invest substantial time, emotional care, and financial resources into acquiring customized attire.")
    add_p("Unlike mass-market fast-fashion apparel, bespoke ethnic garments require meticulous individual personalization. A custom wedding sherwani or bandhgala involves more than 15 precise anatomical body measurements (including chest, shoulder slope, bicep circumference, posture curvature, waist contour, and torso length), premium hand-selected fabrics (such as pure mulberry silk, Italian micro-velvet, and Banarasi brocade), and labor-intensive hand-embroidery like antique copper wire Zardozi, Pita work, and fine Resham needlework.")
    add_p("Traditionally, this process has been managed through manual in-person boutique visits, physical cloth swatches, and handwritten paper measurement diaries. However, these conventional methods can become difficult to manage, time-consuming, and prone to errors. Important measurement slips can be misplaced, pricing for add-on accessories often remains ambiguous until the final bill, and clients living far away cannot easily explore silhouettes or inspect embroidery craftsmanship prior to visiting the studio.")
    add_p("M.S Fashion: Bespoke Ethnic Menswear Platform is a technology-driven web application designed to provide a centralized digital platform for exploring, customizing, and scheduling consultations for high-end ethnic menswear. Modeled after editorial luxury fashion benchmarks like Manyavar, the platform enables clients to inspect garments at 2.2x zoom magnification, dynamically configure royal accessories, calculate real-time estimated totals, and book verified private atelier appointments.")
    add_p("The proposed system also integrates a specialized Royal Atelier AI Stylist Chatbot to provide personalized styling guidance, event-appropriate attire suggestions, and instant answers to tailoring questions. Through features such as verified Email OTP booking, direct Master Craftsman WhatsApp routing with design photos, and a Master Admin portal with sequential Ref IDs and image cropping, M.S Fashion provides a seamless, organized, and culturally resonant bespoke menswear solution.")

    add_h2("1.2 Problem Definition")
    add_p("Custom ethnic menswear tailoring involves multiple specialized responsibilities related to fabric selection, silhouette design, hand-embroidery coordination, body measurements, trial fittings, and accessory matching. However, many boutiques still depend on paper registers, informal phone calls, and manual methods.")
    add_bullet("Manual and Scattered Records: Measurement notes, client preferences, and appointment schedules are often maintained on loose paper slips or separate mobile notes, making it difficult to maintain a reliable customer history.", "• ")
    add_bullet("Generic E-Commerce Sizing Incompatibility: Mass e-commerce platforms force garments into rigid factory sizes (S, M, L, XL). Purchasing a ₹60,000 handmade bridal sherwani without customized measurements leads to ill-fitting garments and ruined wedding schedules.", "• ")
    add_bullet("Opaque Accessory Pricing: In traditional boutiques, royal accessories (Safa, Mala, Brooch, Mojdi) are priced separately without upfront totals, creating unexpected costs for clients.", "• ")
    add_bullet("Appointment Spam and Fake Inquiries: Unverified online contact forms often receive false inquiries and invalid phone numbers, wasting valuable artisan cutting time.", "• ")
    add_bullet("Inability to Inspect Embroidery Details: Standard websites display small, flat images without interactive zoom, making it impossible to evaluate zardozi density or silk weaves before visiting.", "• ")
    add_bullet("Payment Gateway Cost Incompatibility: Standard online gateways deduct 2% to 3% transaction fees on full carts. In bespoke couture, orders follow milestone payments (advance token + balance post-fitting), making generic 100% upfront carts unsuitable.", "• ")

    add_h2("1.3 Aim")
    add_p("The primary aim of the M.S Fashion: Bespoke Ethnic Menswear Platform is to develop a centralized, user-friendly, and editorial web application that simplifies the discovery, visual inspection, dynamic pricing, and appointment booking process for bespoke ethnic menswear.")
    add_p("The system aims to provide clients with an organized platform for exploring collections, calibrating visual zoom on embroidery, configuring royal accessories, and validating consultation appointments. It also aims to utilize conversational AI to provide personalized styling recommendations.")

    add_h2("1.4 Objectives")
    add_p("The main objectives of the proposed system are:")
    add_bullet("To develop a centralized platform for showcasing bespoke ethnic menswear across Sherwani, Jodhpuri, Indo-Western, and Blazer categories.")
    add_bullet("To implement an interactive CSS Transform-Origin Visual Zoom Calibrator achieving 2.2x magnification for inspecting collar and embroidery motifs.")
    add_bullet("To provide a dynamic accessory pricing calculation engine aggregating base prices with modular embellishments (Safa, Mala, Brooch, Mojdi).")
    add_bullet("To engineer a secure two-step Email OTP verification system using Nodemailer and Gmail SMTP to prevent fraudulent appointments.")
    add_bullet("To provide a freeform Expected Budget (Self Budget) input field allowing clients to specify their target expenditure directly.")
    add_bullet("To implement direct WhatsApp click-to-chat consultation routing to the Master Tailor (+91 89993 86222) with pre-filled design photo URLs.")
    add_bullet("To develop an AI-powered Royal Atelier Stylist Chatbot providing natural fashion guidance and direct 1-click appointment actions.")
    add_bullet("To construct a Master Admin Dashboard featuring category-wise sequential Reference ID generation and an intuitive 4-border phone gallery image crop studio.")

    add_h2("1.5 Goal")
    add_p("The primary goal of the M.S Fashion system is to create an elegant, organized, and reliable digital environment for managing bespoke menswear consultations. By combining modern web technology, centralized data management, and AI-based styling assistance, the platform aims to make bespoke ethnic fashion more accessible, transparent, and convenient.")

    add_h2("1.6 Need of the System")
    add_p("The major needs of the system are:")
    add_bullet("Centralized Collection Showcase – Explore all ethnic silhouettes in one place.", "1. ")
    add_bullet("Made-to-Measure Assurance – Avoid sizing errors through private fitting appointments.", "2. ")
    add_bullet("Dynamic Price Transparency – Preview itemized accessory costs in real time.", "3. ")
    add_bullet("Spam Reduction – Validate authentic clients via royal 6-digit email OTPs.", "4. ")
    add_bullet("Direct Artisan Bridge – Connect with Master Craftsman via WhatsApp with photo cards.", "5. ")
    add_bullet("AI-Powered Styling Assistance – Obtain instant answers on fabrics and event attire.", "6. ")
    add_bullet("Self-Declared Budgeting – Allow clients to state their budget freely without forced tiers.", "7. ")
    add_bullet("Master Admin CRM – Maintain structured records of client leads and preferences.", "8. ")
    add_bullet("High-Ticket Cost Protection – Adhere to milestone advance booking rather than gateway fees.", "9. ")
    add_bullet("Improved User Experience – Deliver an editorial, Manyavar-inspired luxury aesthetic.", "10. ")

    # ==================== CHAPTER 2: REQUIREMENT SPECIFICATION ====================
    add_h1("CHAPTER 2. REQUIREMENT SPECIFICATION")
    add_h2("2.1 Introduction")
    add_p("In the development of the M.S Fashion platform, it is essential to establish a clear and comprehensive set of requirement specifications. These specifications provide the foundation for designing, developing, testing, and implementing the application effectively. They define the functional requirements, technical requirements, hardware and software requirements, and system constraints.")

    add_h2("2.2 System Environment")
    add_p("The system environment for M.S Fashion consists of three major architectural layers:")
    add_bullet("Frontend Layer: React.js, Tailwind CSS, Vite, and Lucide React icons.", "• ")
    add_bullet("Backend Layer: Node.js and Express.js providing RESTful APIs.", "• ")
    add_bullet("Database & Cloud Layer: MongoDB for persistent storage, Gmail SMTP for email OTP dispatch, and WhatsApp Click-to-Chat protocol.", "• ")

    add_h2("2.3 Software Requirements")
    add_p("The following software tools were utilized during the project:")
    add_bullet("Visual Studio Code – Primary source-code development environment.", "• ")
    add_bullet("React.js (v18.3.1) – Component-based frontend user interface library.", "• ")
    add_bullet("Tailwind CSS (v3.4.17) – Utility-first luxury styling framework.", "• ")
    add_bullet("Vite (v6.1.0) – Frontend development server and Rollup production bundler.", "• ")
    add_bullet("Node.js (v20+) – Asynchronous server-side JavaScript runtime.", "• ")
    add_bullet("Express.js (v4.19+) – RESTful API backend routing and middleware framework.", "• ")
    add_bullet("MongoDB (v7.0+) & Mongoose – Document database for catalog and lead persistence.", "• ")
    add_bullet("Nodemailer – SMTP email transport for royal 6-digit OTP dispatch.", "• ")
    add_bullet("Postman – API endpoint verification and payload testing.", "• ")
    add_bullet("Git & GitHub – Source-code version control and repository management.", "• ")

    add_h2("2.4 Hardware Requirements")
    add_p("The minimum hardware requirements for developing and running the application are:")
    add_bullet("Processor (CPU): Intel Core i5 or equivalent.", "• ")
    add_bullet("Operating System: Microsoft Windows 10/11 (64-bit) or equivalent.", "• ")
    add_bullet("Memory (RAM): 8 GB RAM or above.", "• ")
    add_bullet("Storage: 256 GB SSD or above.", "• ")
    add_bullet("Display Resolution: 1366 × 768 or better.", "• ")
    add_bullet("Internet Connection: Required for API services, cloud database, and mail dispatch.", "• ")

    add_h2("2.5 Methodology")
    add_p("The development of M.S Fashion follows the Spiral Model, an iterative software development methodology emphasizing risk analysis. Unlike purely sequential approaches, the Spiral Model allows the system to evolve through repeated cycles of planning, risk assessment, engineering, and evaluation.")

    add_h2("2.6 Spiral Model")
    add_p("The Spiral Model divides the project lifecycle into multiple iterations (spirals) across four core phases: Planning, Risk Analysis, Engineering, and Evaluation.")
    add_image_figure("report_assets/diagram_spiral_model.png", "Figure 2.1: Spiral Model Iterative Development Methodology for M.S Fashion")

    # ==================== CHAPTER 3: SYSTEM ANALYSIS ====================
    add_h1("CHAPTER 3. SYSTEM ANALYSIS")
    add_h2("3.1 System Analysis")
    add_p("System analysis is a systematic process of studying, understanding, and evaluating an operational workflow to identify limitations and opportunities for software-driven improvement. For M.S Fashion, system analysis focuses on the challenges faced by ethnic menswear boutiques and wedding patrons.")

    add_h2("3.2 Analysis of Existing System")
    add_p("The major problems associated with the existing manual and generic e-commerce systems include:")
    add_bullet("Manual Record-Keeping: Client measurement notes and appointment records are kept in physical diaries that can be easily lost or damaged.", "• ")
    add_bullet("Generic Size Failure: Off-the-shelf S/M/L garments do not fit individual postures, causing high returns and customer distress in bridal wear.", "• ")
    add_bullet("Lack of Real-Time Price Transparency: Add-on accessories are priced ad-hoc during final billing rather than upfront.", "• ")
    add_bullet("Inundation of Unverified Leads: Public phone numbers receive continuous invalid inquiries and appointment spam.", "• ")
    add_bullet("Inability to Zoom into Fabric Details: Static photos fail to show embroidery quality and silk weave density.", "• ")
    add_bullet("Transaction Fee Deductions: Online gateways take 2-3% fees on high-ticket couture orders that actually follow milestone payments.", "• ")

    add_h2("3.3 Analysis of the Proposed System")
    add_p("The proposed M.S Fashion system provides the following structural improvements:")
    add_bullet("Centralized Collection Showcase: Curated catalog of Sherwanis, Jodhpuris, Indo-Western, and Blazers.", "• ")
    add_bullet("Interactive CSS Zoom Viewer: 2.2x hardware-accelerated zoom focusing on collar and accessory motifs.", "• ")
    add_bullet("Dynamic Price Breakdown: Real-time itemized cost calculation based on modular accessory selections.", "• ")
    add_bullet("Two-Step Email OTP Verification: 6-digit code validation preventing false appointment bookings.", "• ")
    add_bullet("Freeform Self Budget Input: Clients declare their intended expenditure freely without forced tiers.", "• ")
    add_bullet("Direct WhatsApp Master Routing: Optimized wa.me links with embedded design photos for rich previews.", "• ")
    add_bullet("Royal Atelier AI Stylist Chatbot: 24/7 conversational fashion guidance and quick action triggers.", "• ")
    add_bullet("Master Admin Dashboard: Category-wise sequential Ref IDs, 4-border gallery cropper, and CRM lead tracker.", "• ")

    # ==================== CHAPTER 4: SURVEY OF TECHNOLOGY ====================
    add_h1("CHAPTER 4. SURVEY OF TECHNOLOGY")
    add_h2("4.1 React.js")
    add_p("React.js is an open-source, component-based frontend JavaScript library developed by Meta. React uses a Virtual DOM to optimize rendering and provides modular, reusable components for managing state, modals, and dynamic catalog views.")
    add_h2("4.2 Tailwind CSS")
    add_p("Tailwind CSS is a utility-first styling framework that provides atomic utility classes directly in component code. In M.S Fashion, Tailwind establishes the royal Manyavar aesthetic: Maroon (#5C1A21), Antique Gold (#A9812F), and Warm Ivory (#FBF6EC).")
    add_h2("4.3 Node.js")
    add_p("Node.js is an asynchronous, event-driven JavaScript runtime built on Chrome's V8 engine that executes server-side code for handling REST API requests, file uploads, and mail dispatch.")
    add_h2("4.4 Express.js")
    add_p("Express.js is a minimalist web framework for Node.js providing routing, middleware, CORS security, and JSON request handling across inquiry, product, and admin services.")
    add_h2("4.5 MongoDB")
    add_p("MongoDB is a document-oriented NoSQL database that stores data in flexible JSON-like BSON documents. In M.S Fashion, MongoDB maintains product catalogs, accessory coordinates, and verified CRM leads.")
    add_h2("4.6 Vite")
    add_p("Vite is a next-generation build tool providing fast development server startup via native ES modules and Rollup-based production compilation in approximately 5 seconds.")
    add_h2("4.7 Nodemailer")
    add_p("Nodemailer is a Node.js module that manages email delivery via Gmail SMTP, generating 6-digit verification codes and sending branded HTML appointment vouchers.")
    add_h2("4.8 Royal Atelier AI Stylist")
    add_p("The AI Stylist Chatbot is a domain-specific conversational engine providing human-friendly recommendations on wedding silhouettes, 15+ body measurements, and direct booking actions.")
    add_h2("4.9 Postman")
    add_p("Postman was utilized to test, debug, and validate REST API endpoints (GET, POST, PUT, DELETE) before frontend integration.")

    # ==================== CHAPTER 5: SYSTEM DESIGN ====================
    add_h1("CHAPTER 5. SYSTEM DESIGN")
    add_h2("5.1 Introduction")
    add_p("System design defines the overall architecture, component relationships, data flow, database structure, and user interaction models of the M.S Fashion platform.")
    add_h2("5.2 System Architecture Diagram")
    add_p("The architecture consists of three primary layers: Presentation Layer (React & Tailwind), Application Logic Layer (Node.js & Express), and Database/Cloud Services (MongoDB, Gmail SMTP, WhatsApp API).")
    add_image_figure("report_assets/diagram_system_architecture.png", "Figure 5.1: High-Level System Architecture Diagram of M.S Fashion")

    add_h2("5.3 Data Flow Diagram")
    add_p("The Data Flow Diagram represents the movement of data between users, system processes, databases, and external services.")
    add_h3("5.3.1 Level 0 DFD")
    add_p("The Level 0 DFD (Context Diagram) represents M.S Fashion as a single central process interacting with the Customer, Master Admin, MongoDB, and External Services.")
    add_image_figure("report_assets/diagram_dfd_level0.png", "Figure 5.2: Level 0 Data Flow Diagram (Context Diagram)")

    add_h3("5.3.2 Level 1 DFD")
    add_p("The Level 1 DFD decomposes the system into eight core processes: Catalog Filtering, CSS Zoom & Pricing, WhatsApp Dispatch, Appointment Booking, Email OTP Verification, AI Stylist Chatbot, Admin Catalog Management, and Store Settings CRM.")
    add_image_figure("report_assets/diagram_dfd_level1.png", "Figure 5.3: Level 1 Data Flow Diagram (Decomposed Modules)")

    add_h2("5.4 Activity Diagram")
    add_p("The Activity Diagram models the client workflow from visiting the website to inspecting garments, calculating prices, and confirming an appointment lead via OTP.")
    add_image_figure("report_assets/diagram_activity.png", "Figure 5.4: UML Activity Diagram for Bespoke Client Consultation Workflow")

    add_h2("5.5 E-R Diagram")
    add_p("The Entity-Relationship Diagram defines the logical database structure and entities: Product, Accessory, Inquiry, EmailOTPVerification, and BrandConfiguration.")
    add_image_figure("report_assets/diagram_er.png", "Figure 5.5: Entity-Relationship (E-R) Diagram of M.S Fashion")

    add_h2("5.6 Use-Case Diagram")
    add_p("The Use-Case Diagram defines functional interactions available to the Customer (Browse, Filter, Zoom, Price, Chat, Book) and Master Atelier (Manage Catalog, Crop Images, Review Leads).")
    add_image_figure("report_assets/diagram_usecase.png", "Figure 5.6: UML Use-Case Diagram for M.S Fashion Platform")

    # ==================== CHAPTER 6: SYSTEM IMPLEMENTATION ====================
    add_h1("CHAPTER 6. SYSTEM IMPLEMENTATION")
    add_h2("6.1 Introduction")
    add_p("System implementation converts designed architectures into working software modules. M.S Fashion was implemented using React, Tailwind CSS, Node.js, Express.js, MongoDB, and Nodemailer.")

    add_h2("6.2 Flowchart")
    add_p("The flowchart illustrates the sequential decision logic executed during user interaction, accessory selection, and lead validation.")
    add_image_figure("report_assets/diagram_flowchart.png", "Figure 6.1: High-Level System Workflow Flowchart")

    add_h2("6.3 Coding")
    add_p("The coding phase involved implementing frontend user interfaces and backend REST services. The complete production source code modules are provided below across paginated code blocks matching University of Mumbai dissertation guidelines.")

    # 6.3.1 FRONTEND CODE (PAGINATED ~30 PAGES)
    add_h3("6.3.1 Frontend")
    
    # 1. AtelierChatbot.jsx
    add_paginated_code_file(doc, 'frontend/src/components/AtelierChatbot.jsx', 'AtelierChatbot.jsx', lines_per_page=38)

    # 2. AppointmentModal.jsx
    add_paginated_code_file(doc, 'frontend/src/components/AppointmentModal.jsx', 'AppointmentModal.jsx', lines_per_page=38, max_total_lines=380)

    # 3. PricePanelModal.jsx
    add_paginated_code_file(doc, 'frontend/src/components/PricePanelModal.jsx', 'PricePanelModal.jsx', lines_per_page=38, max_total_lines=266)

    # 6.3.2 BACKEND CODE (PAGINATED ~22 PAGES)
    doc.add_page_break()
    add_h3("6.3.2 Backend")

    # 4. inquiryRoutes.js
    add_paginated_code_file(doc, 'backend/routes/inquiryRoutes.js', 'inquiryRoutes.js', lines_per_page=38)

    # 5. mailer.js
    add_paginated_code_file(doc, 'backend/services/mailer.js', 'mailer.js', lines_per_page=38)

    # 6. productRoutes.js
    add_paginated_code_file(doc, 'backend/routes/productRoutes.js', 'productRoutes.js', lines_per_page=38)

    # 7. server.js
    add_paginated_code_file(doc, 'backend/server.js', 'server.js', lines_per_page=38)

    # 6.4 TESTING APPROACHES
    doc.add_page_break()
    add_h2("6.4 Testing Approaches")
    add_p("Different testing approaches were used to verify the functionality, usability, reliability, and security of the M.S Fashion application:")
    add_bullet("Unit Testing – Individual functions such as price summation, currency formatting, and sequential Ref ID generation were tested independently.", "6.4.1 ")
    add_bullet("Usability Testing – The application interface was evaluated to ensure smooth navigation, responsive layouts, and intuitive controls.", "6.4.2 ")
    add_bullet("Security Testing – Verified authentication, data validation, rate limiting on OTP requests, and protection against unauthorized access.", "6.4.3 ")

    add_h3("6.4.4 Test Cases")
    add_p("The following test cases were used to verify the major functionalities of the M.S Fashion application:")

    test_cases_data = [
        ("TC-01", "Homepage Navigation", "Open website on browser", "Editorial hero banner and floating Royal Stylist badge load cleanly", "Pass"),
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

    headers = ["Test ID", "Action", "Input / Scenario", "Expected Result", "Status"]
    for col_idx, h_text in enumerate(headers):
        cell = tc_table.cell(0, col_idx)
        cell.paragraphs[0].text = h_text
        cell.paragraphs[0].runs[0].bold = True
        cell.paragraphs[0].runs[0].font.name = 'Times New Roman'
        cell.paragraphs[0].runs[0].font.size = Pt(9.5)
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        # Clean black header
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="000000"/>')
        cell._tc.get_or_add_tcPr().append(shd)

    for row_idx, data in enumerate(test_cases_data, start=1):
        for col_idx, text in enumerate(data):
            cell = tc_table.cell(row_idx, col_idx)
            cell.paragraphs[0].text = text
            cell.paragraphs[0].runs[0].font.name = 'Times New Roman'
            cell.paragraphs[0].runs[0].font.size = Pt(8.5)
            cell.paragraphs[0].runs[0].font.color.rgb = BLACK
            if col_idx == 4:
                cell.paragraphs[0].runs[0].bold = True

    # ==================== CHAPTER 7: RESULTS (EXACT SHIFA MATCH) ====================
    add_h1("CHAPTER 7. RESULTS")
    add_h2("7.1 Introduction")
    add_p("The M.S Fashion: Bespoke Ethnic Menswear Platform was successfully developed and implemented according to the specified system requirements and design. The application provides an integrated digital atelier platform for managing different aspects of ethnic menswear exploration, dynamic pricing, and appointment consultations in a single web application.")
    add_p("The developed system includes modules for collection browsing, silhouette filtering, visual zoom calibration, accessory configuration, dynamic pricing estimation, royal email OTP verification, AI-based fashion styling assistance, and master administration. These modules were integrated to provide a convenient, transparent, and organized experience for bespoke clients and atelier master tailors.")
    add_p("The implemented modules were tested to ensure that the application functions correctly and that users can easily navigate between different features. The results obtained from the implementation and testing demonstrate that the major requirements of the proposed system were successfully achieved.")

    add_h2("7.2 Results")
    add_p("The final implementation of the M.S Fashion application resulted in a functional web application with the major modules identified during the analysis and design phases. The developed system provides features for catalog exploration, interactive zoom, appointment management, WhatsApp consultation, AI styling assistance, and administrative management.")

    # 7.2.1 Home & Navigation
    add_h3("7.2.1 Home & Navigation")
    add_p("The Home & Navigation module introduces the main collection features of M.S Fashion through an editorial hero carousel, primary navigation header, partner brand marquee, and the floating Royal Stylist AI concierge badge.")
    add_image_figure("report_assets/01_homepage.png", "Figure 7.1: Home & Navigation Screen with Hero Carousel and Floating Stylist Badge", width=Inches(5.8))

    # 7.2.2 Category Catalog
    add_h3("7.2.2 Category Catalog")
    add_p("The Category Catalog module enables clients to browse garments by silhouette with real-time subcategory filter tabs (e.g. 'Jodhpuri With Jacket (6)', 'Without Jacket (4)') and clean grid cards.")
    add_image_figure("report_assets/02_category_grid.png", "Figure 7.2: Category Catalog Interface with Live Silhouette Filter Counts", width=Inches(5.8))

    # 7.2.3 Product Detail & Accessories
    add_h3("7.2.3 Product Detail & Accessories")
    add_p("The Product Detail module displays high-resolution garment photography alongside an interactive list of modular royal accessories (Mojdi, Safa, Mala, Dupatta) for customizable pairing.")
    add_image_figure("report_assets/03_product_detail.png", "Figure 7.3: Product Detail View with Modular Royal Accessory Elements", width=Inches(5.8))

    # 7.2.4 CSS Zoom Viewer
    add_h3("7.2.4 CSS Zoom Viewer")
    add_p("The CSS Zoom Viewer module provides 2.2x hardware-accelerated magnification focusing on intricate embroidery motifs and accessory accents with auto-fading crosshair pins.")
    add_image_figure("report_assets/04_zoom_active.png", "Figure 7.4: Hardware-Accelerated 2.2x CSS Zoom Viewer in Active Focus Mode", width=Inches(5.8))

    # 7.2.5 Price Breakdown & WhatsApp
    add_h3("7.2.5 Price Breakdown & WhatsApp")
    add_p("The Price Breakdown module displays an itemized cost calculation for selected garments and accessories, accompanied by direct 'Contact via WhatsApp' routing with embedded photo URLs.")
    add_image_figure("report_assets/05_price_breakdown_top.png", "Figure 7.5(a): Bespoke Price Breakdown Modal with Itemized Accessory Costing", width=Inches(5.5))
    add_image_figure("report_assets/05_price_breakdown_bottom.png", "Figure 7.5(b): Client Customization Notes & Direct WhatsApp Consultation Action", width=Inches(5.5))

    # 7.2.6 Appointment Booking
    add_h3("7.2.6 Appointment Booking")
    add_p("The Appointment Booking module captures client name, verified email, 10-digit phone number, preferred date, and a client-defined Expected Budget (Self Budget) freeform input.")
    add_image_figure("report_assets/06_appointment_form.png", "Figure 7.6: Private Consultation Booking Form with Freeform Self Budget Input", width=Inches(5.8))

    # 7.2.7 Email OTP Verification
    add_h3("7.2.7 Email OTP Verification")
    add_p("The Email OTP Verification module validates client contact credentials through an automated 6-digit verification code dispatched via Gmail SMTP, eliminating appointment spam.")
    add_image_figure("report_assets/07_email_otp.png", "Figure 7.7: Two-Step Royal Email OTP Verification Screen (6-Digit Authenticator)", width=Inches(5.8))

    # 7.2.8 Royal AI Stylist Chatbot
    add_h3("7.2.8 Royal AI Stylist Chatbot")
    add_p("The Royal AI Stylist Chatbot module provides 24/7 conversational assistance on groom wedding etiquette, 15+ body measurement protocols, pricing policies, and direct appointment booking.")
    add_image_figure("report_assets/08_ai_chatbot.png", "Figure 7.8: Royal Atelier AI Stylist Chatbot Offering Conversational Fashion Guidance", width=Inches(5.8))

    # 7.2.9 Master Admin Dashboard
    add_h3("7.2.9 Master Admin Dashboard")
    add_p("The Master Admin Dashboard module equips the atelier owner with real-time CRM lead management, verified email indicators, declared self-budget tracking, and direct WhatsApp client connect.")
    add_image_figure("report_assets/09_admin_dashboard.png", "Figure 7.9: Master Admin Dashboard Displaying Authenticated CRM Consultation Leads", width=Inches(5.8))

    add_h2("7.3 Overall Result")
    add_p("The final results demonstrate that the M.S Fashion application successfully integrates its major modules into a single web platform for convenient and organized bespoke ethnic menswear consultation. The developed application provides users with an intuitive system for exploring collections, configuring royal accessories, calculating transparent prices, and validating appointments. The integration of the Royal AI Stylist Chatbot further enhances the system by providing accessible styling guidance.")

    # ==================== CHAPTER 8: CONCLUSION AND FUTURE SCOPE ====================
    add_h1("CHAPTER 8. CONCLUSION AND FUTURE SCOPE")
    add_h2("8.1 Conclusion")
    add_p("The M.S Fashion: Bespoke Ethnic Menswear Platform was successfully designed, developed, and implemented to provide a centralized digital platform for managing bespoke menswear discovery, visual inspection, and client consultation. The system brings together various important tailoring functionalities within a single application, reducing the need to depend on manual records or unorganized communication methods.")
    add_p("The application allows users to browse collections, inspect embroidery with 2.2x zoom, select matching royal accessories, calculate transparent price estimations, book verified consultations with self-declared budgets, and communicate directly with the Master Tailor. The integration of the Royal Atelier AI Stylist further enhances the system with conversational fashion advice.")
    add_p("The system was developed using modern technologies including React, Tailwind CSS, Vite, Node.js, Express.js, MongoDB, Nodemailer, and WhatsApp protocols. Overall, M.S Fashion provides an efficient and convenient digital solution for bespoke menswear patrons and atelier tailors. The successful implementation and testing demonstrate that the proposed objectives and major functional requirements were achieved.")

    add_h2("8.2 Future Scope and Enhancement")
    add_p("Although the current version of M.S Fashion provides the major functionalities required for bespoke menswear consultations, the system can be further enhanced with advanced features in future versions:")
    add_bullet("WebXR Virtual 3D Mirror – Allow clients to virtually try on 3D digital garment twins using smartphone cameras.", "1. ")
    add_bullet("Fabric Texture AI Analysis – Machine learning models to detect fabric thread density from user-uploaded swatches.", "2. ")
    add_bullet("Multi-Lingual Voice Assistant – Expand AI chatbot to support Hindi, Gujarati, Marathi, and Urdu voice input.", "3. ")
    add_bullet("Photogrammetric Body Measurement – Extract 15+ body measurements from 2D smartphone photos.", "4. ")
    add_bullet("Workshop Inventory ERP – Real-time fabric bolt and embroidery thread inventory tracking for artisans.", "5. ")
    add_bullet("Blockchain Provenance Certificates – Digital certificates guaranteeing pure Banarasi silk and Zardozi metals.", "6. ")
    add_bullet("Multi-Branch Cloud Sync – Centralized database supporting multi-city boutique branches across India and abroad.", "7. ")
    add_bullet("Native Mobile Apps – Build cross-platform Android and iOS apps using React Native and Expo.", "8. ")
    add_bullet("Meta WhatsApp Cloud Webhooks – Automated bidirectional WhatsApp bot conversations with PDF catalogs.", "9. ")
    add_bullet("Predictive Season Analytics – Demand forecasting models based on auspicious wedding calendar dates.", "10. ")

    # ==================== CHAPTER 9: REFERENCES ====================
    add_h1("CHAPTER 9. REFERENCE")
    refs = [
        "https://react.dev/",
        "https://tailwindcss.com/docs",
        "https://nodejs.org/docs/latest/api/",
        "https://expressjs.com/",
        "https://www.mongodb.com/docs/",
        "https://mongoosejs.com/docs/",
        "https://vitejs.dev/guide/",
        "https://nodemailer.com/",
        "https://faq.whatsapp.com/5913398998672934",
        "https://www.postman.com/downloads/",
        "University of Mumbai – Guidelines for Project Dissertation for B.Sc. (Computer Science), 2026."
    ]
    for idx, ref in enumerate(refs, start=1):
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.line_spacing = 1.15
        p_ref.paragraph_format.space_after = Pt(4)
        r_num = p_ref.add_run(f"{idx}. ")
        r_num.bold = True
        r_num.font.name = 'Times New Roman'
        r_num.font.size = Pt(11)
        r_num.font.color.rgb = BLACK
        r_txt = p_ref.add_run(ref)
        r_txt.font.name = 'Times New Roman'
        r_txt.font.size = Pt(11)
        r_txt.font.color.rgb = BLACK

    output_filename = "MS_Fashion_Final_Project_Report.docx"
    doc.save(output_filename)
    print(f"SUCCESS! Final Perfect Report created: {output_filename}")
    return output_filename

if __name__ == '__main__':
    create_final_report()
