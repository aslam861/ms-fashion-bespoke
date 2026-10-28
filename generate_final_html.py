import os

def create_final_html():
    print("Generating MS_Fashion_Final_Project_Report.html...")
    
    code_files = [
        ('frontend/src/components/AtelierChatbot.jsx', 'AtelierChatbot.jsx', 38, None),
        ('frontend/src/components/AppointmentModal.jsx', 'AppointmentModal.jsx', 38, 380),
        ('frontend/src/components/PricePanelModal.jsx', 'PricePanelModal.jsx', 38, 266),
        ('backend/routes/inquiryRoutes.js', 'inquiryRoutes.js', 38, None),
        ('backend/services/mailer.js', 'mailer.js', 38, None),
        ('backend/routes/productRoutes.js', 'productRoutes.js', 38, None),
        ('backend/server.js', 'server.js', 38, None)
    ]

    code_html_pages = []
    for filepath, display_name, lines_per_page, max_lines in code_files:
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = [l.rstrip('\r\n') for l in f.readlines()]
        if max_lines and len(lines) > max_lines:
            lines = lines[:max_lines]
        chunks = (len(lines) + lines_per_page - 1) // lines_per_page
        for c in range(chunks):
            chunk = lines[c * lines_per_page : (c + 1) * lines_per_page]
            code_text = "\n".join(chunk).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            page_html = f"""
<div class="page">
  <div class="code-title">{display_name}</div>
  <div class="code-box">{code_text}</div>
</div>
"""
            code_html_pages.append(page_html)

    all_code_blocks = "\n".join(code_html_pages)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>M.S Fashion: Bespoke Ethnic Menswear Platform - Final Project Report</title>
<style>
  @page {{
    size: A4;
    margin: 20mm 15mm 20mm 20mm;
    @bottom-center {{
      content: counter(page);
    }}
  }}
  body {{
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.25;
    color: #000000;
    background-color: #FFFFFF;
    margin: 0;
    padding: 20px 40px;
  }}
  .page {{
    position: relative;
    box-sizing: border-box;
    min-height: 297mm;
    padding: 25px 30px;
    margin-bottom: 30px;
    border: 1.5px solid #000000;
    background: #FFFFFF;
    page-break-after: always;
  }}
  @media print {{
    body {{ padding: 0; background: #FFF; }}
    .page {{
      margin: 0;
      padding: 20px 25px;
      border: 1.5px solid #000000;
      page-break-after: always;
    }}
  }}
  h1.doc-title {{
    color: #000000;
    text-align: center;
    font-size: 17pt;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 25px;
  }}
  h2.chapter-title {{
    color: #000000;
    text-align: center;
    font-size: 16pt;
    font-weight: bold;
    margin-top: 25px;
    margin-bottom: 20px;
    text-transform: uppercase;
  }}
  h3.section-title {{
    color: #000000;
    font-size: 13pt;
    font-weight: bold;
    margin-top: 18px;
    margin-bottom: 8px;
  }}
  h4.subsection-title {{
    color: #000000;
    font-size: 12pt;
    font-weight: bold;
    margin-top: 12px;
    margin-bottom: 6px;
  }}
  p {{
    text-align: justify;
    margin-top: 0;
    margin-bottom: 10px;
  }}
  ul {{
    margin-top: 4px;
    margin-bottom: 12px;
    padding-left: 25px;
  }}
  li {{
    text-align: justify;
    margin-bottom: 6px;
  }}
  .center-text {{ text-align: center; }}
  .bold {{ font-weight: bold; }}
  .figure-box {{
    text-align: center;
    margin: 16px 0;
  }}
  .figure-box img {{
    max-width: 90%;
    max-height: 480px;
    border: 1px solid #777777;
  }}
  .figure-caption {{
    font-size: 10pt;
    font-weight: bold;
    font-style: italic;
    color: #000000;
    margin-top: 6px;
    margin-bottom: 14px;
    text-align: center;
  }}
  .code-title {{
    font-family: "Times New Roman", Times, serif;
    font-size: 11pt;
    font-weight: bold;
    color: #000000;
    margin-bottom: 6px;
  }}
  .code-box {{
    background-color: #FAF8F5;
    border: 1px solid #000000;
    padding: 10px 12px;
    font-family: "Courier New", Courier, monospace;
    font-size: 8.5pt;
    line-height: 1.1;
    color: #000000;
    white-space: pre-wrap;
    word-break: break-word;
    min-height: 240mm;
  }}
  table.test-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0 25px 0;
    font-size: 9pt;
  }}
  table.test-table th {{
    background-color: #000000;
    color: #FFFFFF;
    font-weight: bold;
    padding: 8px 6px;
    border: 1px solid #000000;
    text-align: left;
  }}
  table.test-table td {{
    padding: 6px 6px;
    border: 1px solid #777777;
    vertical-align: top;
    color: #000000;
  }}
  table.test-table tr:nth-child(even) {{
    background-color: #F8F8F8;
  }}
  .toc-line {{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 4px 0;
    font-size: 10.5pt;
  }}
  .toc-title {{
    background: #FFF;
    padding-right: 5px;
    z-index: 1;
  }}
  .toc-dots {{
    flex: 1;
    border-bottom: 1px dotted #000000;
    margin: 0 4px;
    height: 1em;
  }}
  .toc-page {{
    background: #FFF;
    padding-left: 5px;
    font-weight: bold;
    z-index: 1;
  }}
</style>
</head>
<body>

<!-- PAGE 1: TITLE PAGE -->
<div class="page center-text">
  <div style="height: 25px;"></div>
  <h1 class="doc-title" style="font-size: 18pt; margin-bottom: 16px;">M.S FASHION: BESPOKE ETHNIC MENSWEAR<br>PLATFORM</h1>
  <p class="bold" style="font-size: 12pt; margin-bottom: 4px;">A Project Report</p>
  <p style="font-size: 11pt; margin-bottom: 4px;">Submitted in Partial fulfilment of the</p>
  <p style="font-size: 11pt; margin-bottom: 8px;">Requirements for the award of the Degree of</p>
  <p class="bold" style="font-size: 13pt; margin-bottom: 4px;">BACHELOR OF SCIENCE (COMPUTER SCIENCE)</p>
  <p class="bold" style="font-size: 12pt; margin-bottom: 30px;">SEM V</p>

  <p class="bold" style="font-size: 13pt; margin-bottom: 4px;">By Aslam Ansari</p>
  <p class="bold" style="font-size: 11pt; margin-bottom: 30px;">Seat No: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Roll No: 05</p>

  <p style="font-size: 11pt; margin-bottom: 2px;">Under the esteemed guidance of</p>
  <p class="bold" style="font-size: 13pt; margin-bottom: 2px;">Prof. Javed Pathan</p>
  <p style="font-size: 11pt; margin-bottom: 25px;">Assistant Professor</p>

  <div style="margin: 20px 0;">
    <img src="report_assets/college_logo_0.png" alt="Rizvi Logo" style="height: 125px;">
  </div>

  <p class="bold" style="font-size: 11pt; margin-bottom: 2px;">DEPARTMENT OF COMPUTER SCIENCE</p>
  <p class="bold" style="font-size: 12pt; margin-bottom: 2px;">RIZVI COLLEGE OF ARTS, SCIENCE AND COMMERCE</p>
  <p style="font-size: 11pt; margin-bottom: 2px;">(Affiliated to University of Mumbai)</p>
  <p class="bold" style="font-size: 11pt; margin-bottom: 2px;">MUMBAI-400050</p>
  <p class="bold" style="font-size: 11pt; margin-bottom: 4px;">MAHARASHTRA</p>
  <p class="bold" style="font-size: 12pt;">2026-2027</p>
</div>

<!-- PAGE 2: CERTIFICATE -->
<div class="page">
  <div class="center-text">
    <p class="bold" style="font-size: 13pt; margin-bottom: 2px;">RIZVI COLLEGE OF ARTS, SCIENCE AND COMMERCE</p>
    <p style="font-size: 10.5pt; margin-bottom: 2px;">(Affiliated to University of Mumbai)</p>
    <p class="bold" style="font-size: 10.5pt; margin-bottom: 6px;">MUMBAI-MAHARASHTRA-400050</p>
    <p class="bold" style="font-size: 12pt; margin-bottom: 12px;">DEPARTMENT OF COMPUTER SCIENCE</p>
    <img src="report_assets/college_logo_0.png" alt="Rizvi Logo" style="height: 90px; margin-bottom: 15px;">
    <h2 class="doc-title" style="font-size: 15pt; margin: 10px 0 25px 0;">CERTIFICATE</h2>
  </div>

  <p style="font-size: 12pt; line-height: 1.6; margin: 25px 10px;">
    This is to certify that the project entitled, <strong>“M.S Fashion: Bespoke Ethnic Menswear Platform”</strong>, is bonafide work of 
    <strong>Aslam Ansari</strong> bearing <strong>Seat No: &nbsp;&nbsp;&nbsp;&nbsp; Roll No: 05</strong> submitted in Partial fulfilment of the requirements for the award of degree of 
    <strong>BACHELOR OF SCIENCE in COMPUTER SCIENCE SEM V</strong> from University of Mumbai.
  </p>

  <div style="margin-top: 100px; display: flex; justify-content: space-between; padding: 0 40px;">
    <div style="font-weight: bold;">Project Guide</div>
    <div style="font-weight: bold;">HOD</div>
  </div>

  <div style="margin-top: 70px; text-align: center; font-weight: bold;">
    External Examiner
  </div>

  <div style="margin-top: 70px; display: flex; justify-content: space-between; padding: 0 40px; font-size: 11pt;">
    <span>Date: ______________</span>
    <span>College Seal</span>
  </div>
</div>

<!-- PAGE 3: ACKNOWLEDGEMENT -->
<div class="page">
  <h2 class="chapter-title">ACKNOWLEDGEMENT</h2>
  <p>I would like to extend my sincere appreciation to the Department of Computer Science at Rizvi College of Arts, Science, and Commerce for providing me with the opportunity to undertake and complete this project dissertation. I am deeply grateful to our Principal, <strong>Dr. Anjum Ara Ahmad</strong>, for her exceptional leadership and effective management.</p>
  <p>I would also like to express my gratitude to the Head of the Department, <strong>Professor Arif Patel</strong>, for his support in terms of providing essential resources and invaluable guidance throughout our course has been instrumental in the completion of this project.</p>
  <p>I would like to convey my profound thanks to my project guide, <strong>Professor Javed Pathan</strong>. His mentorship and support have played an important role in the success of this project. Lastly, I am deeply thankful to my dear parents for their unwavering support.</p>
  <div style="text-align: right; margin-top: 60px;">
    <p><strong>Aslam Ansari</strong><br>Roll No: 05</p>
  </div>
</div>

<!-- PAGE 4: PLAGIARISM REPORT -->
<div class="page">
  <h2 class="chapter-title">PLAGIARISM REPORT</h2>
  <p>The plagiarism scan report for the M.S Fashion project documentation shows <strong>0% plagiarism</strong>, indicating that no copied content was detected during the scan. The report records <strong>0% Exact Match</strong> and <strong>0% Partial Match</strong>, meaning that no significant text was found to directly or partially match the sources checked by the plagiarism detection system.</p>
  <p>The report also shows <strong>100% Unique Content</strong>, demonstrating that the submitted documentation is identified as original. Overall, the result indicates that the project report maintains a high level of originality and does not contain detectable plagiarized content according to the scan.</p>
  <div class="figure-box" style="margin-top: 40px;">
    <img src="report_assets/plagiarism_proof_0.png" alt="Plagiarism Certificate" style="max-width: 80%;">
    <div class="figure-caption">Figure: Plagiarism Scan Report Certificate (0% Plagiarism / 100% Unique Content)</div>
  </div>
</div>

<!-- PAGE 5: DECLARATION -->
<div class="page">
  <h2 class="chapter-title">DECLARATION</h2>
  <p>I hereby declare that the project entitled, <strong>“M.S Fashion: Bespoke Ethnic Menswear Platform”</strong>, has not been in any case duplicated to submit to any other university for the award of any degree. To the best of our knowledge other than us, no one has submitted to any other university. The project is done in partial fulfilment of the requirements for the award of degree of <strong>BACHELOR OF SCIENCE (COMPUTER SCIENCE)</strong> to be submitted as semester V project as part of our curriculum.</p>
  <div style="text-align: right; margin-top: 80px;">
    <p><strong>Aslam Ansari</strong></p>
  </div>
</div>

<!-- PAGE 6: ABSTRACT -->
<div class="page">
  <h2 class="chapter-title">ABSTRACT</h2>
  <p><strong>M.S Fashion: Bespoke Ethnic Menswear Platform</strong> is a technology-driven platform designed to simplify, modernize, and elevate bespoke tailoring consultations for high-end Indian ethnic menswear. Clients seeking wedding and celebration attire—such as royal Sherwanis, aristocratic Jodhpuri Bandhgalas, Indo-Western fusion silhouettes, and bespoke Tuxedos—often face difficulties with generic factory sizing, unorganized communication, and fragmented record-keeping. The proposed system provides a centralized digital atelier platform where users can explore curated collections, inspect intricate hand-embroidery with interactive zoom calibration, configure royal accessories, calculate itemized price estimations, and book verified private fittings.</p>
  <p>The system incorporates an interactive hardware-accelerated CSS Transform-Origin Visual Zoom Calibrator (2.2x zoom) that allows clients to examine fine Zardozi wirework, brocade textures, and accessory details. To solve high-ticket bridal wear communication challenges, the application integrates an intelligent Royal Atelier AI Stylist Chatbot providing contextual styling advice for wedding events, explaining the 15+ body measurement process, and routing inquiries directly to the Master Craftsman on WhatsApp (+91 89993 86222) with automated garment photo links. A two-step royal Email OTP verification protocol powered by Gmail SMTP safeguards the boutique from appointment spam while enabling a client-defined Expected Budget (Self Budget) entry.</p>
  <p>By integrating modern web technology, an AI conversational assistant, and centralized master administrative controls, the proposed system makes bespoke ethnic menswear tailoring more organized, accessible, transparent, and proactive, improving the overall couture experience for clients and master tailors alike.</p>
</div>

<!-- PAGES 7-9: TABLE OF CONTENTS (LASER-STRAIGHT) -->
<div class="page">
  <h2 class="chapter-title">TABLE OF CONTENTS</h2>
  <div class="toc-line bold"><span>CHAPTER 1. INTRODUCTION</span><span class="toc-dots"></span><span>01</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>1.1 Introduction</span><span class="toc-dots"></span><span>01</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>1.2 Problem Definition</span><span class="toc-dots"></span><span>02</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>1.3 Aim</span><span class="toc-dots"></span><span>04</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>1.4 Objectives</span><span class="toc-dots"></span><span>05</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>1.5 Goal</span><span class="toc-dots"></span><span>05</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>1.6 Need of the System</span><span class="toc-dots"></span><span>06</span></div>

  <div class="toc-line bold" style="margin-top: 10px;"><span>CHAPTER 2. REQUIREMENT SPECIFICATION</span><span class="toc-dots"></span><span>07</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>2.1 Introduction</span><span class="toc-dots"></span><span>07</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>2.2 System Environment</span><span class="toc-dots"></span><span>07</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>2.3 Software Requirements</span><span class="toc-dots"></span><span>08</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>2.4 Hardware Requirements</span><span class="toc-dots"></span><span>10</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>2.5 Methodology</span><span class="toc-dots"></span><span>10</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>2.6 Spiral Model</span><span class="toc-dots"></span><span>11</span></div>

  <div class="toc-line bold" style="margin-top: 10px;"><span>CHAPTER 3. SYSTEM ANALYSIS</span><span class="toc-dots"></span><span>15</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>3.1 System Analysis</span><span class="toc-dots"></span><span>15</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>3.2 Analysis of Existing System</span><span class="toc-dots"></span><span>16</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>3.3 Analysis of the Proposed System</span><span class="toc-dots"></span><span>17</span></div>

  <div class="toc-line bold" style="margin-top: 10px;"><span>CHAPTER 4. SURVEY OF TECHNOLOGY</span><span class="toc-dots"></span><span>20</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>4.1 React.js</span><span class="toc-dots"></span><span>20</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>4.2 Tailwind CSS</span><span class="toc-dots"></span><span>21</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>4.3 Node.js</span><span class="toc-dots"></span><span>22</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>4.4 Express.js</span><span class="toc-dots"></span><span>23</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>4.5 MongoDB</span><span class="toc-dots"></span><span>23</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>4.6 Vite</span><span class="toc-dots"></span><span>24</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>4.7 Nodemailer</span><span class="toc-dots"></span><span>24</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>4.8 Royal Atelier AI Stylist</span><span class="toc-dots"></span><span>25</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>4.9 Postman</span><span class="toc-dots"></span><span>25</span></div>
</div>

<div class="page">
  <div class="toc-line bold"><span>CHAPTER 5. SYSTEM DESIGN</span><span class="toc-dots"></span><span>26</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>5.1 Introduction</span><span class="toc-dots"></span><span>26</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>5.2 System Architecture Diagram</span><span class="toc-dots"></span><span>26</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>5.3 Data Flow Diagram</span><span class="toc-dots"></span><span>28</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>5.3.1 Level 0 DFD</span><span class="toc-dots"></span><span>28</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>5.3.2 Level 1 DFD</span><span class="toc-dots"></span><span>29</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>5.4 Activity Diagram</span><span class="toc-dots"></span><span>31</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>5.5 E-R Diagram</span><span class="toc-dots"></span><span>32</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>5.6 Use-Case Diagram</span><span class="toc-dots"></span><span>33</span></div>

  <div class="toc-line bold" style="margin-top: 10px;"><span>CHAPTER 6. SYSTEM IMPLEMENTATION</span><span class="toc-dots"></span><span>35</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>6.1 Introduction</span><span class="toc-dots"></span><span>35</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>6.2 Flowchart</span><span class="toc-dots"></span><span>35</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>6.3 Coding</span><span class="toc-dots"></span><span>37</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>6.3.1 Frontend</span><span class="toc-dots"></span><span>38</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>6.3.2 Backend</span><span class="toc-dots"></span><span>68</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>6.4 Testing Approaches</span><span class="toc-dots"></span><span>85</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>6.4.1 Unit Testing</span><span class="toc-dots"></span><span>85</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>6.4.2 Usability Testing</span><span class="toc-dots"></span><span>85</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>6.4.3 Security Testing</span><span class="toc-dots"></span><span>85</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>6.4.4 Test Cases</span><span class="toc-dots"></span><span>86</span></div>

  <div class="toc-line bold" style="margin-top: 10px;"><span>CHAPTER 7. RESULTS</span><span class="toc-dots"></span><span>88</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>7.1 Introduction</span><span class="toc-dots"></span><span>88</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>7.2 Results</span><span class="toc-dots"></span><span>89</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>7.2.1 Home & Navigation</span><span class="toc-dots"></span><span>89</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>7.2.2 Category Catalog</span><span class="toc-dots"></span><span>90</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>7.2.3 Product Detail & Accessories</span><span class="toc-dots"></span><span>91</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>7.2.4 CSS Zoom Viewer</span><span class="toc-dots"></span><span>92</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>7.2.5 Price Breakdown & WhatsApp</span><span class="toc-dots"></span><span>93</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>7.2.6 Appointment Booking</span><span class="toc-dots"></span><span>94</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>7.2.7 Email OTP Verification</span><span class="toc-dots"></span><span>95</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>7.2.8 Royal AI Stylist Chatbot</span><span class="toc-dots"></span><span>96</span></div>
  <div class="toc-line" style="padding-left: 40px;"><span>7.2.9 Master Admin Dashboard</span><span class="toc-dots"></span><span>97</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>7.3 Overall Result</span><span class="toc-dots"></span><span>98</span></div>

  <div class="toc-line bold" style="margin-top: 10px;"><span>CHAPTER 8. CONCLUSION AND FUTURE SCOPE</span><span class="toc-dots"></span><span>99</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>8.1 Conclusion</span><span class="toc-dots"></span><span>99</span></div>
  <div class="toc-line" style="padding-left: 20px;"><span>8.2 Future Scope and Enhancement</span><span class="toc-dots"></span><span>99</span></div>

  <div class="toc-line bold" style="margin-top: 10px;"><span>CHAPTER 9. REFERENCE</span><span class="toc-dots"></span><span>102</span></div>
</div>

<!-- CODE MODULES INCLUDED IN CHAPTER 6 -->
{all_code_blocks}

<!-- CHAPTER 7: RESULTS (EXACT SHIFA MATCH) -->
<div class="page">
  <h2 class="chapter-title">CHAPTER 7. RESULTS</h2>
  <h3 class="section-title">7.1 Introduction</h3>
  <p>The M.S Fashion: Bespoke Ethnic Menswear Platform was successfully developed and implemented according to the specified system requirements and design. The application provides an integrated digital atelier platform for managing different aspects of ethnic menswear exploration, dynamic pricing, and appointment consultations in a single web application.</p>
  <p>The developed system includes modules for collection browsing, silhouette filtering, visual zoom calibration, accessory configuration, dynamic pricing estimation, royal email OTP verification, AI-based fashion styling assistance, and master administration. These modules were integrated to provide a convenient, transparent, and organized experience for bespoke clients and atelier master tailors.</p>
  <p>The implemented modules were tested to ensure that the application functions correctly and that users can easily navigate between different features. The results obtained from the implementation and testing demonstrate that the major requirements of the proposed system were successfully achieved.</p>

  <h3 class="section-title">7.2 Results</h3>
  <p>The final implementation of the M.S Fashion application resulted in a functional web application with the major modules identified during the analysis and design phases. The developed system provides features for catalog exploration, interactive zoom, appointment management, WhatsApp consultation, AI styling assistance, and administrative management.</p>

  <h4 class="subsection-title">7.2.1 Home & Navigation</h4>
  <p>The Home & Navigation module introduces the main collection features of M.S Fashion through an editorial hero carousel, primary navigation header, partner brand marquee, and the floating Royal Stylist AI concierge badge.</p>
  <div class="figure-box">
    <img src="report_assets/01_homepage.png" alt="Home Page">
    <div class="figure-caption">Figure 7.1: Home & Navigation Screen with Hero Carousel and Floating Stylist Badge</div>
  </div>
</div>

<div class="page">
  <h4 class="subsection-title">7.2.2 Category Catalog</h4>
  <p>The Category Catalog module enables clients to browse garments by silhouette with real-time subcategory filter tabs (e.g. 'Jodhpuri With Jacket (6)', 'Without Jacket (4)') and clean grid cards.</p>
  <div class="figure-box">
    <img src="report_assets/02_category_grid.png" alt="Category Grid">
    <div class="figure-caption">Figure 7.2: Category Catalog Interface with Live Silhouette Filter Counts</div>
  </div>

  <h4 class="subsection-title">7.2.3 Product Detail & Accessories</h4>
  <p>The Product Detail module displays high-resolution garment photography alongside an interactive list of modular royal accessories (Mojdi, Safa, Mala, Dupatta) for customizable pairing.</p>
  <div class="figure-box">
    <img src="report_assets/03_product_detail.png" alt="Product Detail">
    <div class="figure-caption">Figure 7.3: Product Detail View with Modular Royal Accessory Elements</div>
  </div>
</div>

<div class="page">
  <h4 class="subsection-title">7.2.4 CSS Zoom Viewer</h4>
  <p>The CSS Zoom Viewer module provides 2.2x hardware-accelerated magnification focusing on intricate embroidery motifs and accessory accents with auto-fading crosshair pins.</p>
  <div class="figure-box">
    <img src="report_assets/04_zoom_active.png" alt="Zoom Active">
    <div class="figure-caption">Figure 7.4: Hardware-Accelerated 2.2x CSS Zoom Viewer in Active Focus Mode</div>
  </div>

  <h4 class="subsection-title">7.2.5 Price Breakdown & WhatsApp</h4>
  <p>The Price Breakdown module displays an itemized cost calculation for selected garments and accessories, accompanied by direct 'Contact via WhatsApp' routing with embedded photo URLs.</p>
  <div class="figure-box">
    <img src="report_assets/05_price_breakdown_top.png" alt="Price Modal Top">
    <div class="figure-caption">Figure 7.5(a): Bespoke Price Breakdown Modal with Itemized Accessory Costing</div>
  </div>
  <div class="figure-box">
    <img src="report_assets/05_price_breakdown_bottom.png" alt="Price Modal Bottom">
    <div class="figure-caption">Figure 7.5(b): Client Customization Notes & Direct WhatsApp Consultation Action</div>
  </div>
</div>

<div class="page">
  <h4 class="subsection-title">7.2.6 Appointment Booking</h4>
  <p>The Appointment Booking module captures client name, verified email, 10-digit phone number, preferred date, and a client-defined Expected Budget (Self Budget) freeform input.</p>
  <div class="figure-box">
    <img src="report_assets/06_appointment_form.png" alt="Appointment Form">
    <div class="figure-caption">Figure 7.6: Private Consultation Booking Form with Freeform Self Budget Input</div>
  </div>

  <h4 class="subsection-title">7.2.7 Email OTP Verification</h4>
  <p>The Email OTP Verification module validates client contact credentials through an automated 6-digit verification code dispatched via Gmail SMTP, eliminating appointment spam.</p>
  <div class="figure-box">
    <img src="report_assets/07_email_otp.png" alt="Email OTP">
    <div class="figure-caption">Figure 7.7: Two-Step Royal Email OTP Verification Screen (6-Digit Authenticator)</div>
  </div>
</div>

<div class="page">
  <h4 class="subsection-title">7.2.8 Royal AI Stylist Chatbot</h4>
  <p>The Royal AI Stylist Chatbot module provides 24/7 conversational assistance on groom wedding etiquette, 15+ body measurement protocols, pricing policies, and direct appointment booking.</p>
  <div class="figure-box">
    <img src="report_assets/08_ai_chatbot.png" alt="AI Chatbot">
    <div class="figure-caption">Figure 7.8: Royal Atelier AI Stylist Chatbot Offering Conversational Fashion Guidance</div>
  </div>

  <h4 class="subsection-title">7.2.9 Master Admin Dashboard</h4>
  <p>The Master Admin Dashboard module equips the atelier owner with real-time CRM lead management, verified email indicators, declared self-budget tracking, and direct WhatsApp client connect.</p>
  <div class="figure-box">
    <img src="report_assets/09_admin_dashboard.png" alt="Admin CRM">
    <div class="figure-caption">Figure 7.9: Master Admin Dashboard Displaying Authenticated CRM Consultation Leads</div>
  </div>
</div>

<!-- CHAPTER 8: CONCLUSION AND FUTURE SCOPE -->
<div class="page">
  <h2 class="chapter-title">CHAPTER 8. CONCLUSION AND FUTURE SCOPE</h2>
  <h3 class="section-title">8.1 Conclusion</h3>
  <p>The M.S Fashion: Bespoke Ethnic Menswear Platform was successfully designed, developed, and implemented to provide a centralized digital platform for managing bespoke menswear discovery, visual inspection, and client consultation. The system brings together various important tailoring functionalities within a single application, reducing the need to depend on manual records or unorganized communication methods.</p>
  <p>The application allows users to browse collections, inspect embroidery with 2.2x zoom, select matching royal accessories, calculate transparent price estimations, book verified consultations with self-declared budgets, and communicate directly with the Master Tailor. The integration of the Royal Atelier AI Stylist further enhances the system with conversational fashion advice.</p>
  <p>The system was developed using modern technologies including React, Tailwind CSS, Vite, Node.js, Express.js, MongoDB, Nodemailer, and WhatsApp protocols. Overall, M.S Fashion provides an efficient and convenient digital solution for bespoke menswear patrons and atelier tailors. The successful implementation and testing demonstrate that the proposed objectives and major functional requirements were achieved.</p>

  <h3 class="section-title">8.2 Future Scope and Enhancement</h3>
  <p>Although the current version of M.S Fashion provides the major functionalities required for bespoke menswear consultations, the system can be further enhanced with advanced features in future versions:</p>
  <ul>
    <li>1. WebXR Virtual 3D Mirror – Allow clients to virtually try on 3D digital garment twins using smartphone cameras.</li>
    <li>2. Fabric Texture AI Analysis – Machine learning models to detect fabric thread density from user-uploaded swatches.</li>
    <li>3. Multi-Lingual Voice Assistant – Expand AI chatbot to support Hindi, Gujarati, Marathi, and Urdu voice input.</li>
    <li>4. Photogrammetric Body Measurement – Extract 15+ body measurements from 2D smartphone photos.</li>
    <li>5. Workshop Inventory ERP – Real-time fabric bolt and embroidery thread inventory tracking for artisans.</li>
    <li>6. Blockchain Provenance Certificates – Digital certificates guaranteeing pure Banarasi silk and Zardozi metals.</li>
    <li>7. Multi-Branch Cloud Sync – Centralized database supporting multi-city boutique branches across India and abroad.</li>
    <li>8. Native Mobile Apps – Build cross-platform Android and iOS apps using React Native and Expo.</li>
    <li>9. Meta WhatsApp Cloud Webhooks – Automated bidirectional WhatsApp bot conversations with PDF catalogs.</li>
    <li>10. Predictive Season Analytics – Demand forecasting models based on auspicious wedding calendar dates.</li>
  </ul>
</div>

<!-- CHAPTER 9: REFERENCES -->
<div class="page">
  <h2 class="chapter-title">CHAPTER 9. REFERENCE</h2>
  <p>1. https://react.dev/</p>
  <p>2. https://tailwindcss.com/docs</p>
  <p>3. https://nodejs.org/docs/latest/api/</p>
  <p>4. https://expressjs.com/</p>
  <p>5. https://www.mongodb.com/docs/</p>
  <p>6. https://mongoosejs.com/docs/</p>
  <p>7. https://vitejs.dev/guide/</p>
  <p>8. https://nodemailer.com/</p>
  <p>9. https://faq.whatsapp.com/5913398998672934</p>
  <p>10. https://www.postman.com/downloads/</p>
  <p>11. University of Mumbai – Guidelines for Project Dissertation for B.Sc. (Computer Science), 2026.</p>
</div>

</body>
</html>
"""
    with open('MS_Fashion_Final_Project_Report.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("MS_Fashion_Final_Project_Report.html successfully generated!")

if __name__ == '__main__':
    create_final_html()
