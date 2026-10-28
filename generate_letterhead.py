"""
generate_letterhead.py
Generates official Company Letterhead documents for M.S Fashion:
1. MS_Fashion_Company_Certificate_Letterhead.docx (Completed formal certificate for college/professor)
2. MS_Fashion_Blank_Letterhead.docx (Blank official company letterhead template)
3. MS_Fashion_Company_Certificate_Letterhead.html (Web/Print ready companion)
4. MS_Fashion_Blank_Letterhead.html (Blank web/print ready companion)
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

LOGO_PATH = os.path.abspath("frontend/public/logologo.jpeg")

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    """
    kwargs: top, bottom, left, right
    values: dict(sz=12, val='single', color='5C1A21')
    """
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = 'w:{}'.format(edge)
            element = OxmlElement(tag)
            element.set(qn('w:val'), edge_data.get('val', 'single'))
            element.set(qn('w:sz'), str(edge_data.get('sz', 4)))
            element.set(qn('w:space'), '0')
            element.set(qn('w:color'), edge_data.get('color', 'auto'))
            tcBorders.append(element)
    tcPr.append(tcBorders)

def add_header_to_doc(doc):
    # Top Table: 2 columns (Left: Logo + Name, Right: Address + Contacts)
    header_table = doc.add_table(rows=1, cols=2)
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    header_table.autofit = False

    # Widths: Col 0 = 3.6 inches, Col 1 = 3.4 inches (Total = 7.0 inches)
    header_table.columns[0].width = Inches(3.6)
    header_table.columns[1].width = Inches(3.4)

    left_cell = header_table.cell(0, 0)
    right_cell = header_table.cell(0, 1)

    left_cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    right_cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # Left cell content
    p_logo = left_cell.paragraphs[0]
    p_logo.paragraph_format.space_before = Pt(0)
    p_logo.paragraph_format.space_after = Pt(2)
    p_logo.alignment = WD_ALIGN_PARAGRAPH.LEFT

    if os.path.exists(LOGO_PATH):
        run_logo = p_logo.add_run()
        run_logo.add_picture(LOGO_PATH, width=Inches(1.15))

    p_brand = left_cell.add_paragraph()
    p_brand.paragraph_format.space_before = Pt(3)
    p_brand.paragraph_format.space_after = Pt(1)
    run_brand = p_brand.add_run("M.S FASHION")
    run_brand.font.name = "Georgia"
    run_brand.font.size = Pt(17)
    run_brand.font.bold = True
    run_brand.font.color.rgb = RGBColor(92, 26, 33)  # #5C1A21 Royal Maroon

    p_tagline = left_cell.add_paragraph()
    p_tagline.paragraph_format.space_before = Pt(0)
    p_tagline.paragraph_format.space_after = Pt(1)
    run_tag = p_tagline.add_run("THE ART OF BESPOKE ETHNIC MENSWEAR")
    run_tag.font.name = "Calibri"
    run_tag.font.size = Pt(8.5)
    run_tag.font.bold = True
    run_tag.font.color.rgb = RGBColor(169, 129, 47)  # #A9812F Antique Gold

    p_sub = left_cell.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(0)
    run_sub = p_sub.add_run("Royal Sherwanis • Jodhpuri Bandhgalas • Bespoke Suits")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(8)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(80, 80, 80)

    # Right cell content (Company Details)
    p_right = right_cell.paragraphs[0]
    p_right.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_right.paragraph_format.space_before = Pt(0)
    p_right.paragraph_format.space_after = Pt(1)

    r_hdr = p_right.add_run("ATELIER & WORKSHOP OFFICE\n")
    r_hdr.font.name = "Calibri"
    r_hdr.font.size = Pt(9)
    r_hdr.font.bold = True
    r_hdr.font.color.rgb = RGBColor(92, 26, 33)

    r_addr = p_right.add_run(
        "Ground Floor, 10/A, Sanaullah Compound,\n"
        "Near Sauda Bakery, Dharavi Main Road,\n"
        "Mahim (East), Mumbai – 400017, MH, India\n"
    )
    r_addr.font.name = "Calibri"
    r_addr.font.size = Pt(8.5)
    r_addr.font.color.rgb = RGBColor(50, 50, 50)

    r_cnt = p_right.add_run(
        "Phone / WhatsApp: +91 89993 86222\n"
        "Email: msfashionbespoke@gmail.com\n"
        "Web: www.msfashionbespoke.com\n"
        "Reg. Id / Udyam MSME: MH-19-UDYAM-2026"
    )
    r_cnt.font.name = "Calibri"
    r_cnt.font.size = Pt(8.5)
    r_cnt.font.color.rgb = RGBColor(70, 70, 70)

    # Decorative Maroon & Gold Divider Bar
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(4)
    p_div.paragraph_format.space_after = Pt(14)
    
    # Border line using XML
    pPr = p_div._p.get_or_add_pPr()
    pBdr = parse_xml(
        f'<w:pBdr {nsdecls("w")}>\n'
        f'  <w:bottom w:val="single" w:sz="18" w:space="1" w:color="5C1A21"/>\n'
        f'</w:pBdr>'
    )
    pPr.append(pBdr)

def add_footer_to_doc(doc):
    # Bottom divider
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(20)
    p_div.paragraph_format.space_after = Pt(4)
    pPr = p_div._p.get_or_add_pPr()
    pBdr = parse_xml(
        f'<w:pBdr {nsdecls("w")}>\n'
        f'  <w:top w:val="single" w:sz="10" w:space="1" w:color="A9812F"/>\n'
        f'</w:pBdr>'
    )
    pPr.append(pBdr)

    # Footer note
    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_foot.paragraph_format.space_before = Pt(2)
    p_foot.paragraph_format.space_after = Pt(0)
    r_ft1 = p_foot.add_run("M.S FASHION ATELIER • BESPOKE MADE-TO-MEASURE MENSWEAR • CONTRACT BULK MANUFACTURING\n")
    r_ft1.font.name = "Calibri"
    r_ft1.font.size = Pt(7.5)
    r_ft1.font.bold = True
    r_ft1.font.color.rgb = RGBColor(92, 26, 33)

    r_ft2 = p_foot.add_run("Atelier: Dharavi Main Road, Mahim (East), Mumbai – 400017 | Tel: +91 89993 86222 | Email: msfashionbespoke@gmail.com")
    r_ft2.font.name = "Calibri"
    r_ft2.font.size = Pt(7)
    r_ft2.font.color.rgb = RGBColor(120, 120, 120)

def create_certificate_letterhead():
    doc = docx.Document()
    
    # Standard margins (0.6 in top/bottom, 0.75 in left/right)
    for section in doc.sections:
        section.top_margin = Inches(0.55)
        section.bottom_margin = Inches(0.55)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        section.page_width = Inches(8.27)  # A4 width
        section.page_height = Inches(11.69) # A4 height

    # 1. Header
    add_header_to_doc(doc)

    # 2. Ref & Date Line
    ref_table = doc.add_table(rows=1, cols=2)
    ref_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    ref_table.autofit = False
    ref_table.columns[0].width = Inches(3.5)
    ref_table.columns[1].width = Inches(3.5)

    p_ref = ref_table.cell(0, 0).paragraphs[0]
    p_ref.paragraph_format.space_before = Pt(0)
    p_ref.paragraph_format.space_after = Pt(6)
    r_ref = p_ref.add_run("Ref. No: MSF/PROJ/2026-27/05")
    r_ref.font.name = "Calibri"
    r_ref.font.size = Pt(10)
    r_ref.font.bold = True
    r_ref.font.color.rgb = RGBColor(50, 50, 50)

    p_date = ref_table.cell(0, 1).paragraphs[0]
    p_date.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_date.paragraph_format.space_before = Pt(0)
    p_date.paragraph_format.space_after = Pt(6)
    r_date = p_date.add_run("Date: 27th October 2026")
    r_date.font.name = "Calibri"
    r_date.font.size = Pt(10)
    r_date.font.bold = True
    r_date.font.color.rgb = RGBColor(50, 50, 50)

    # 3. Certificate Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(10)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("PROJECT COMPLETION & INDUSTRIAL SPONSORSHIP CERTIFICATE")
    r_title.font.name = "Georgia"
    r_title.font.size = Pt(12.5)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(92, 26, 33)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    r_sub = p_sub.add_run("TO WHOMSOEVER IT MAY CONCERN")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(11)
    r_sub.font.bold = True
    r_sub.font.underline = True
    r_sub.font.color.rgb = RGBColor(30, 30, 30)

    # 4. Paragraph 1: Certification of Student and Degree
    p_body1 = doc.add_paragraph()
    p_body1.paragraph_format.space_before = Pt(0)
    p_body1.paragraph_format.space_after = Pt(8)
    p_body1.paragraph_format.line_spacing = 1.15
    p_body1.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    r = p_body1.add_run("This is to certify that ")
    r.font.name = "Calibri"; r.font.size = Pt(10.5)

    r_bold1 = p_body1.add_run("Mr. Aslam Ansari")
    r_bold1.font.name = "Calibri"; r_bold1.font.size = Pt(10.5); r_bold1.font.bold = True

    r = p_body1.add_run(" (Roll No: ")
    r.font.name = "Calibri"; r.font.size = Pt(10.5)

    r_bold2 = p_body1.add_run("05")
    r_bold2.font.name = "Calibri"; r_bold2.font.size = Pt(10.5); r_bold2.font.bold = True

    r = p_body1.add_run(", Seat No: ")
    r.font.name = "Calibri"; r.font.size = Pt(10.5)

    r_bold3 = p_body1.add_run("_______________")
    r_bold3.font.name = "Calibri"; r_bold3.font.size = Pt(10.5); r_bold3.font.bold = True

    r = p_body1.add_run("), a bonafide student of ")
    r.font.name = "Calibri"; r.font.size = Pt(10.5)

    r_bold4 = p_body1.add_run("Bachelor of Science in Computer Science (B.Sc. CS)")
    r_bold4.font.name = "Calibri"; r_bold4.font.size = Pt(10.5); r_bold4.font.bold = True

    r = p_body1.add_run(" from ")
    r.font.name = "Calibri"; r.font.size = Pt(10.5)

    r_bold5 = p_body1.add_run("Rizvi College of Arts, Science and Commerce")
    r_bold5.font.name = "Calibri"; r_bold5.font.size = Pt(10.5); r_bold5.font.bold = True

    r = p_body1.add_run(" (Affiliated to the University of Mumbai), has successfully completed his live client project titled:\n")
    r.font.name = "Calibri"; r.font.size = Pt(10.5)

    p_proj = doc.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_proj.paragraph_format.space_before = Pt(2)
    p_proj.paragraph_format.space_after = Pt(8)
    r_p = p_proj.add_run("“M.S FASHION: BESPOKE ETHNIC MENSWEAR PLATFORM”")
    r_p.font.name = "Georgia"
    r_p.font.size = Pt(11)
    r_p.font.bold = True
    r_p.font.color.rgb = RGBColor(92, 26, 33)

    p_proj_sub = doc.add_paragraph()
    p_proj_sub.paragraph_format.space_before = Pt(0)
    p_proj_sub.paragraph_format.space_after = Pt(8)
    p_proj_sub.paragraph_format.line_spacing = 1.15
    p_proj_sub.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_ps = p_proj_sub.add_run(
        "at our atelier premises and technical environment during the Academic Year 2026–2027. "
        "The project was executed under the industrial guidance of our Master Tailoring Staff and Management."
    )
    r_ps.font.name = "Calibri"; r_ps.font.size = Pt(10.5)

    # 5. Paragraph 2: Technical Scope & Features Developed
    p_body2 = doc.add_paragraph()
    p_body2.paragraph_format.space_before = Pt(0)
    p_body2.paragraph_format.space_after = Pt(8)
    p_body2.paragraph_format.line_spacing = 1.15
    p_body2.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r2 = p_body2.add_run(
        "During this assignment, Mr. Aslam Ansari designed, engineered, and deployed a robust full-stack bespoke e-commerce platform using "
        "React.js, Node.js/Express, and MongoDB. The system successfully digitizes our physical bespoke tailoring operations by implementing: "
        "(1) High-resolution editorial cataloging for Sherwanis, Jodhpuris, Indo-Western garments, and Tuxedos; "
        "(2) An interactive CSS Visual Zoom Calibrator allowing clients to inspect intricate zardozi and dabka hand-embroidery up close; "
        "(3) A luxury appointment scheduling module fortified with Gmail SMTP OTP email verification to eliminate spam inquiries; "
        "(4) Direct WhatsApp atelier consultation with auto-generated garment image links and bespoke quotation estimates; and "
        "(5) An administrative portal featuring sequential reference tracking and 4-border phone gallery image crop calibration."
    )
    r2.font.name = "Calibri"; r2.font.size = Pt(10)

    # 6. Paragraph 3: Conduct & Verification
    p_body3 = doc.add_paragraph()
    p_body3.paragraph_format.space_before = Pt(0)
    p_body3.paragraph_format.space_after = Pt(16)
    p_body3.paragraph_format.line_spacing = 1.15
    p_body3.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r3 = p_body3.add_run(
        "The software has undergone thorough functional testing and has been validated against our commercial workshop requirements. "
        "Mr. Aslam Ansari exhibited exemplary dedication, intellectual curiosity, technical competence, and high professional ethics throughout this tenure. "
        "We express our sincere satisfaction with his deliverable and wish him grand success in his academic examinations and future career."
    )
    r3.font.name = "Calibri"; r3.font.size = Pt(10)

    # 7. Signature & Stamp Table (2 columns: Left Seal, Right Signatory)
    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False
    sig_table.columns[0].width = Inches(3.5)
    sig_table.columns[1].width = Inches(3.5)

    c_seal = sig_table.cell(0, 0)
    c_sig = sig_table.cell(0, 1)

    # Stamp box on the left
    p_seal = c_seal.paragraphs[0]
    p_seal.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_seal.paragraph_format.space_before = Pt(6)
    p_seal.paragraph_format.space_after = Pt(2)

    # Create a nice dashed border cell or visual stamp placeholder
    seal_box = c_seal.add_table(rows=1, cols=1)
    seal_box.alignment = WD_TABLE_ALIGNMENT.LEFT
    seal_box.autofit = False
    seal_cell = seal_box.cell(0, 0)
    seal_cell.width = Inches(2.2)
    set_cell_border(seal_cell,
                    top=dict(val='dashed', sz=6, color='A9812F'),
                    bottom=dict(val='dashed', sz=6, color='A9812F'),
                    left=dict(val='dashed', sz=6, color='A9812F'),
                    right=dict(val='dashed', sz=6, color='A9812F'))
    
    p_sbox = seal_cell.paragraphs[0]
    p_sbox.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sbox.paragraph_format.space_before = Pt(18)
    p_sbox.paragraph_format.space_after = Pt(18)
    r_sb = p_sbox.add_run("[ OFFICIAL ATELIER SEAL / RUBBER STAMP ]")
    r_sb.font.name = "Calibri"
    r_sb.font.size = Pt(8)
    r_sb.font.bold = True
    r_sb.font.color.rgb = RGBColor(169, 129, 47)

    # Signatory details on the right
    p_sig = c_sig.paragraphs[0]
    p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sig.paragraph_format.space_before = Pt(0)
    p_sig.paragraph_format.space_after = Pt(2)

    r_s1 = p_sig.add_run("For M.S FASHION\n\n\n\n")
    r_s1.font.name = "Georgia"
    r_s1.font.size = Pt(11)
    r_s1.font.bold = True
    r_s1.font.color.rgb = RGBColor(92, 26, 33)

    r_s2 = p_sig.add_run("_____________________________________\n")
    r_s2.font.name = "Calibri"
    r_s2.font.size = Pt(9.5)
    r_s2.font.color.rgb = RGBColor(100, 100, 100)

    r_s3 = p_sig.add_run("AUTHORIZED SIGNATORY / PROPRIETOR\n")
    r_s3.font.name = "Calibri"
    r_s3.font.size = Pt(9.5)
    r_s3.font.bold = True
    r_s3.font.color.rgb = RGBColor(30, 30, 30)

    r_s4 = p_sig.add_run("M.S Fashion Bespoke Atelier\nMahim (East), Mumbai – 400017\nContact: +91 89993 86222")
    r_s4.font.name = "Calibri"
    r_s4.font.size = Pt(8.5)
    r_s4.font.color.rgb = RGBColor(80, 80, 80)

    # 8. Footer
    add_footer_to_doc(doc)

    out_file = "MS_Fashion_Company_Certificate_Letterhead.docx"
    doc.save(out_file)
    print(f"Created: {out_file}")

def create_blank_letterhead():
    doc = docx.Document()
    
    for section in doc.sections:
        section.top_margin = Inches(0.55)
        section.bottom_margin = Inches(0.55)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)

    add_header_to_doc(doc)

    # Ref & Date Line
    ref_table = doc.add_table(rows=1, cols=2)
    ref_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    ref_table.autofit = False
    ref_table.columns[0].width = Inches(3.5)
    ref_table.columns[1].width = Inches(3.5)

    p_ref = ref_table.cell(0, 0).paragraphs[0]
    p_ref.paragraph_format.space_before = Pt(0)
    p_ref.paragraph_format.space_after = Pt(6)
    r_ref = p_ref.add_run("Ref. No: MSF/__________________")
    r_ref.font.name = "Calibri"; r_ref.font.size = Pt(10); r_ref.font.color.rgb = RGBColor(100, 100, 100)

    p_date = ref_table.cell(0, 1).paragraphs[0]
    p_date.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_date.paragraph_format.space_before = Pt(0)
    p_date.paragraph_format.space_after = Pt(6)
    r_date = p_date.add_run("Date: _____ / _____ / 2026")
    r_date.font.name = "Calibri"; r_date.font.size = Pt(10); r_date.font.color.rgb = RGBColor(100, 100, 100)

    # Blank content spacing (leave room for any typed or printed text)
    for _ in range(8):
        p_empty = doc.add_paragraph()
        p_empty.paragraph_format.space_before = Pt(14)
        p_empty.paragraph_format.space_after = Pt(14)

    # Bottom Signatory section
    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False
    sig_table.columns[0].width = Inches(3.5)
    sig_table.columns[1].width = Inches(3.5)

    c_seal = sig_table.cell(0, 0)
    c_sig = sig_table.cell(0, 1)

    seal_box = c_seal.add_table(rows=1, cols=1)
    seal_cell = seal_box.cell(0, 0)
    seal_cell.width = Inches(2.2)
    set_cell_border(seal_cell,
                    top=dict(val='dashed', sz=6, color='A9812F'),
                    bottom=dict(val='dashed', sz=6, color='A9812F'),
                    left=dict(val='dashed', sz=6, color='A9812F'),
                    right=dict(val='dashed', sz=6, color='A9812F'))
    p_sbox = seal_cell.paragraphs[0]
    p_sbox.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sbox.paragraph_format.space_before = Pt(18)
    p_sbox.paragraph_format.space_after = Pt(18)
    r_sb = p_sbox.add_run("[ OFFICIAL ATELIER SEAL / STAMP ]")
    r_sb.font.name = "Calibri"; r_sb.font.size = Pt(8); r_sb.font.bold = True; r_sb.font.color.rgb = RGBColor(169, 129, 47)

    p_sig = c_sig.paragraphs[0]
    p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sig.paragraph_format.space_before = Pt(0)
    p_sig.paragraph_format.space_after = Pt(2)
    r_s1 = p_sig.add_run("For M.S FASHION\n\n\n\n")
    r_s1.font.name = "Georgia"; r_s1.font.size = Pt(11); r_s1.font.bold = True; r_s1.font.color.rgb = RGBColor(92, 26, 33)
    r_s2 = p_sig.add_run("_____________________________________\n")
    r_s2.font.name = "Calibri"; r_s2.font.size = Pt(9.5); r_s2.font.color.rgb = RGBColor(100, 100, 100)
    r_s3 = p_sig.add_run("AUTHORIZED SIGNATORY / PROPRIETOR\n")
    r_s3.font.name = "Calibri"; r_s3.font.size = Pt(9.5); r_s3.font.bold = True; r_s3.font.color.rgb = RGBColor(30, 30, 30)
    r_s4 = p_sig.add_run("M.S Fashion Bespoke Atelier\nMahim (East), Mumbai – 400017\nContact: +91 89993 86222")
    r_s4.font.name = "Calibri"; r_s4.font.size = Pt(8.5); r_s4.font.color.rgb = RGBColor(80, 80, 80)

    add_footer_to_doc(doc)

    out_file = "MS_Fashion_Blank_Letterhead.docx"
    doc.save(out_file)
    print(f"Created: {out_file}")

def create_html_letterheads():
    # Convert logo to base64 for standalone HTML rendering
    import base64
    logo_b64 = ""
    if os.path.exists(LOGO_PATH):
        with open(LOGO_PATH, "rb") as f:
            logo_b64 = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode("utf-8")

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>M.S Fashion - Project Completion Certificate (Company Letterhead)</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@400;500;600;700&display=swap');
  
  @page {{
    size: A4 portrait;
    margin: 15mm 18mm 15mm 18mm;
  }}

  body {{
    font-family: 'Jost', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1a1a1a;
    background: #f0f0f0;
    margin: 0;
    padding: 20px;
    display: flex;
    justify-content: center;
  }}

  .sheet {{
    background: #ffffff;
    width: 210mm;
    min-height: 297mm;
    box-sizing: border-box;
    padding: 16mm 20mm 14mm 20mm;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  /* Top Letterhead Header */
  .letter-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2.5px solid #5C1A21;
    padding-bottom: 12px;
    margin-bottom: 14px;
    position: relative;
  }}

  .letter-header::after {{
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 1px;
    background: #A9812F;
  }}

  .brand-block {{
    display: flex;
    align-items: center;
    gap: 14px;
  }}

  .brand-logo {{
    width: 68px;
    height: 68px;
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid #A9812F;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }}

  .brand-text h1 {{
    margin: 0;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 26px;
    font-weight: 700;
    color: #5C1A21;
    letter-spacing: 0.5px;
  }}

  .brand-text .tagline {{
    margin: 2px 0 0 0;
    font-size: 10px;
    font-weight: 600;
    color: #A9812F;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }}

  .brand-text .subtext {{
    margin: 2px 0 0 0;
    font-size: 9.5px;
    color: #666;
    font-style: italic;
  }}

  .contact-block {{
    text-align: right;
    font-size: 9.5px;
    color: #444;
    line-height: 1.45;
  }}

  .contact-block .office-title {{
    font-weight: 700;
    color: #5C1A21;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }}

  /* Ref & Date */
  .meta-row {{
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 600;
    color: #444;
    margin-bottom: 18px;
  }}

  /* Title */
  .cert-title {{
    text-align: center;
    margin-bottom: 18px;
  }}

  .cert-title h2 {{
    margin: 0 0 4px 0;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 19px;
    color: #5C1A21;
    letter-spacing: 0.5px;
  }}

  .cert-title h3 {{
    margin: 0;
    font-size: 13px;
    color: #222;
    text-decoration: underline;
    letter-spacing: 0.8px;
  }}

  /* Content Body */
  .cert-body {{
    font-size: 11.5px;
    line-height: 1.65;
    text-align: justify;
    color: #222;
  }}

  .cert-body p {{
    margin: 0 0 12px 0;
  }}

  .cert-body .project-highlight {{
    text-align: center;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 15px;
    font-weight: 700;
    color: #5C1A21;
    padding: 6px 12px;
    background: #FAF7F2;
    border-top: 1px solid #E4D5BC;
    border-bottom: 1px solid #E4D5BC;
    margin: 10px 0;
    letter-spacing: 0.5px;
  }}

  /* Signature Block */
  .signatory-row {{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 25px;
    margin-bottom: 15px;
  }}

  .seal-box {{
    border: 1.5px dashed #A9812F;
    border-radius: 6px;
    padding: 16px 18px;
    text-align: center;
    width: 170px;
    background: #FAF9F6;
  }}

  .seal-box .seal-text {{
    font-size: 9px;
    font-weight: 700;
    color: #A9812F;
    letter-spacing: 0.8px;
  }}

  .sign-box {{
    text-align: right;
    font-size: 11px;
    color: #333;
  }}

  .sign-box .for-company {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 15px;
    font-weight: 700;
    color: #5C1A21;
    margin-bottom: 45px;
  }}

  .sign-box .sign-line {{
    border-top: 1px solid #777;
    padding-top: 4px;
    font-weight: 700;
    color: #111;
  }}

  .sign-box .sign-sub {{
    font-size: 10px;
    color: #666;
    line-height: 1.35;
    margin-top: 2px;
  }}

  /* Footer */
  .letter-footer {{
    border-top: 1px solid #A9812F;
    padding-top: 8px;
    text-align: center;
    font-size: 8.5px;
    color: #666;
    line-height: 1.35;
  }}

  .letter-footer strong {{
    color: #5C1A21;
  }}

  .print-btn {{
    position: fixed;
    top: 20px;
    right: 20px;
    background: #5C1A21;
    color: #ffffff;
    border: none;
    padding: 10px 18px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    font-family: inherit;
  }}

  .print-btn:hover {{
    background: #7a232c;
  }}

  @media print {{
    body {{
      background: #ffffff;
      padding: 0;
    }}
    .sheet {{
      box-shadow: none;
      width: 100%;
      min-height: auto;
      padding: 0;
    }}
    .print-btn {{
      display: none;
    }}
  }}
</style>
</head>
<body>

<button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>

<div class="sheet">
  <div>
    <!-- Header -->
    <div class="letter-header">
      <div class="brand-block">
        <img src="{logo_b64}" alt="M.S Fashion Logo" class="brand-logo" />
        <div class="brand-text">
          <h1>M.S FASHION</h1>
          <div class="tagline">The Art of Bespoke Ethnic Menswear</div>
          <div class="subtext">Royal Sherwanis • Jodhpuri Bandhgalas • Bespoke Suits</div>
        </div>
      </div>
      <div class="contact-block">
        <div class="office-title">ATELIER &amp; WORKSHOP OFFICE</div>
        Ground Floor, 10/A, Sanaullah Compound,<br>
        Near Sauda Bakery, Dharavi Main Road,<br>
        Mahim (East), Mumbai – 400017, MH, India<br>
        Phone / WhatsApp: +91 89993 86222<br>
        Email: msfashionbespoke@gmail.com<br>
        Web: www.msfashionbespoke.com
      </div>
    </div>

    <!-- Meta Ref & Date -->
    <div class="meta-row">
      <div>Ref. No: <strong>MSF/PROJ/2026-27/05</strong></div>
      <div>Date: <strong>27th October 2026</strong></div>
    </div>

    <!-- Title -->
    <div class="cert-title">
      <h2>PROJECT COMPLETION &amp; INDUSTRIAL SPONSORSHIP CERTIFICATE</h2>
      <h3>TO WHOMSOEVER IT MAY CONCERN</h3>
    </div>

    <!-- Content -->
    <div class="cert-body">
      <p>
        This is to certify that <strong>Mr. Aslam Ansari</strong> (Roll No: <strong>05</strong>, Seat No: <strong>_______________</strong>), a bonafide student of <strong>Bachelor of Science in Computer Science (B.Sc. CS)</strong> from <strong>Rizvi College of Arts, Science and Commerce</strong> (Affiliated to the University of Mumbai), has successfully completed his live client academic capstone project titled:
      </p>

      <div class="project-highlight">
        “M.S FASHION: BESPOKE ETHNIC MENSWEAR PLATFORM”
      </div>

      <p>
        at our atelier premises and technical environment during the Academic Year 2026–2027. The project was executed under the industrial guidance of our Master Tailoring Staff and Operational Management.
      </p>

      <p>
        During this assignment, Mr. Aslam Ansari designed, engineered, and deployed a robust full-stack bespoke e-commerce platform using React.js, Node.js/Express, and MongoDB. The system successfully digitizes our physical bespoke tailoring operations by implementing: 
        (1) High-resolution editorial cataloging for Sherwanis, Jodhpuris, Indo-Western ensembles, and Tuxedos; 
        (2) An interactive CSS Visual Zoom Calibrator allowing clients to inspect intricate zardozi and dabka hand-embroidery up close; 
        (3) A luxury appointment scheduling module fortified with Gmail SMTP OTP email verification to eliminate spam inquiries; 
        (4) Direct WhatsApp atelier consultation with auto-generated garment image links and bespoke quotation estimates; and 
        (5) An administrative portal featuring sequential reference tracking and 4-border phone gallery image crop calibration.
      </p>

      <p>
        The software has undergone thorough functional testing and has been validated against our commercial workshop requirements. Mr. Aslam Ansari exhibited exemplary dedication, intellectual curiosity, technical competence, and high professional ethics throughout this tenure. We express our sincere satisfaction with his deliverable and wish him grand success in his academic examinations and future career.
      </p>
    </div>
  </div>

  <div>
    <!-- Signature Row -->
    <div class="signatory-row">
      <div class="seal-box">
        <div class="seal-text">
          [ OFFICIAL ATELIER SEAL /<br>RUBBER STAMP ]
        </div>
      </div>
      <div class="sign-box">
        <div class="for-company">For M.S FASHION</div>
        <div class="sign-line">AUTHORIZED SIGNATORY / PROPRIETOR</div>
        <div class="sign-sub">
          M.S Fashion Bespoke Atelier<br>
          Mahim (East), Mumbai – 400017<br>
          Contact: +91 89993 86222
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="letter-footer">
      <strong>M.S FASHION ATELIER</strong> • BESPOKE MADE-TO-MEASURE MENSWEAR • CONTRACT BULK MANUFACTURING<br>
      Atelier: Dharavi Main Road, Mahim (East), Mumbai – 400017 | Tel: +91 89993 86222 | Email: msfashionbespoke@gmail.com
    </div>
  </div>
</div>

</body>
</html>
"""
    with open("MS_Fashion_Company_Certificate_Letterhead.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    print("Created: MS_Fashion_Company_Certificate_Letterhead.html")

    # Blank HTML letterhead
    blank_body_html = """
    <div style="min-height: 480px; display: flex; align-items: center; justify-content: center;">
      <div style="border: 1px dashed #dcd0bc; border-radius: 6px; padding: 50px 70px; text-align: center; color: #a09788; font-style: italic; font-size: 13px;">
        [ OFFICIAL BLANK LETTERHEAD CANVAS — TYPE OR PRINT BODY CONTENT HERE ]
      </div>
    </div>
    """
    import re
    blank_html = re.sub(r'<div class="cert-title">.*?</div>\s*<div class="cert-body">.*?</div>', blank_body_html, html_content, flags=re.DOTALL)
    blank_html = blank_html.replace('MSF/PROJ/2026-27/05', 'MSF/__________________')
    blank_html = blank_html.replace('27th October 2026', '_____ / _____ / 2026')
    blank_html = blank_html.replace('<title>M.S Fashion - Project Completion Certificate (Company Letterhead)</title>', '<title>M.S Fashion - Official Blank Company Letterhead</title>')

    with open("MS_Fashion_Blank_Letterhead.html", "w", encoding="utf-8") as f:
        f.write(blank_html)
    print("Created: MS_Fashion_Blank_Letterhead.html")

if __name__ == "__main__":
    create_certificate_letterhead()
    create_blank_letterhead()
    create_html_letterheads()
