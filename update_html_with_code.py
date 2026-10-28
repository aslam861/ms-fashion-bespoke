import os

def build_full_html():
    print("Building full HTML report with complete code pages...")
    
    code_files = [
        ('frontend/src/components/AtelierChatbot.jsx', 'AtelierChatbot.jsx (Royal Atelier AI Stylist Module)', 38, None),
        ('frontend/src/components/AppointmentModal.jsx', 'AppointmentModal.jsx (Self Budget & Email OTP Verification)', 38, 380),
        ('frontend/src/components/PricePanelModal.jsx', 'PricePanelModal.jsx (Itemized Costing & Direct WhatsApp Dispatch)', 38, 266),
        ('backend/routes/inquiryRoutes.js', 'inquiryRoutes.js (Lead Submission & Email OTP Verification Endpoints)', 38, None),
        ('backend/services/mailer.js', 'mailer.js (Gmail SMTP Transport & Branded HTML Email Template)', 38, None),
        ('backend/routes/productRoutes.js', 'productRoutes.js (Dynamic Catalog & Category-Wise Ref ID Generator)', 38, None),
        ('backend/server.js', 'server.js (Express Server Architecture & Middleware Pipeline)', 38, None)
    ]

    code_html_sections = []
    
    for filepath, title, lines_per_page, max_lines in code_files:
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = [line.rstrip('\r\n') for line in f.readlines()]
        if max_lines and len(lines) > max_lines:
            lines = lines[:max_lines]
        
        chunks = (len(lines) + lines_per_page - 1) // lines_per_page
        for c_idx in range(chunks):
            chunk = lines[c_idx * lines_per_page : (c_idx + 1) * lines_per_page]
            chunk_code = "\n".join(chunk).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            
            page_div = f"""
<div class="page">
  <h4 class="subsection-title maroon">{title} — Page {c_idx+1} of {chunks}</h4>
  <div class="code-container">{chunk_code}</div>
</div>
"""
            code_html_sections.append(page_div)

    # Read base template
    with open('MS_Fashion_Project_Report.html', 'r', encoding='utf-8') as f:
        base_html = f.read()

    # Insert code pages right before Chapter 6.4 Test Cases
    marker = '<h3 class="section-title">6.4.4 Comprehensive Test Cases Table</h3>'
    if marker in base_html:
        insertion = """
  <h3 class="section-title">6.3 Coding Implementation (Full Production Source Code)</h3>
  <p>Following University of Mumbai guidelines, the primary production source files governing client interaction, visual zoom transforms, royal OTP verification, and backend persistence are provided below across paginated code modules.</p>
</div>
""" + "\n".join(code_html_sections) + """
<div class="page">
""" + marker
        full_html = base_html.replace(marker, insertion)
    else:
        full_html = base_html

    with open('MS_Fashion_Bespoke_Project_Report.html', 'w', encoding='utf-8') as f:
        f.write(full_html)
    print("Full HTML Report generated: MS_Fashion_Bespoke_Project_Report.html")

if __name__ == '__main__':
    build_full_html()
