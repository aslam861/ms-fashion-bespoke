import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('report_assets', exist_ok=True)

# Helper function to create stylish boxes
def draw_box(ax, x, y, w, h, text, title='', bg='#FBF6EC', border='#5C1A21', title_color='#5C1A21'):
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2",
                                  ec=border, fc=bg, lw=1.5)
    ax.add_patch(rect)
    if title:
        ax.text(x + w/2, y + h - 0.35, title, ha='center', va='center',
                fontsize=10, fontweight='bold', color=title_color)
    ax.text(x + w/2, y + (h/2 if not title else (h-0.3)/2), text, ha='center', va='center',
            fontsize=8.5, color='#2B211D', wrap=True)

# Helper for arrow
def draw_arrow(ax, x1, y1, x2, y2, label='', color='#5C1A21'):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color=color, lw=1.5, mutation_scale=12))
    if label:
        mx, my = (x1 + x2)/2, (y1 + y2)/2
        ax.text(mx, my + 0.15, label, ha='center', va='bottom', fontsize=8, color='#5C1A21', fontweight='semibold')

# ==================== 1. SYSTEM ARCHITECTURE DIAGRAM (Figure 5.1) ====================
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 7)
ax.axis('off')

# Layers
draw_box(ax, 0.5, 4.5, 2.6, 1.8, '• Web & Mobile Browsers\n• Responsive Tailwind UI\n• CSS Transform Zoom\n• Atelier AI Stylist Chatbot', '1. PRESENTATION LAYER\n(React.js & Tailwind CSS)')
draw_box(ax, 3.8, 4.5, 2.6, 1.8, '• Express REST Routing\n• Two-Step Email OTP Auth\n• Dynamic Pricing Engine\n• Static Assets & Uploads', '2. APPLICATION LOGIC\n(Node.js & Express.js)')
draw_box(ax, 7.1, 4.5, 2.4, 1.8, '• Catalog Collections\n• Customization Accessories\n• CRM Leads & Inquiries\n• Brand Store Settings', '3. DATABASE LAYER\n(MongoDB & Dynamic JSON)')

# External Services Layer
draw_box(ax, 1.5, 1.0, 2.2, 1.6, '• Royal 6-Digit OTP\n• Appointment Vouchers\n• SMTP Server Transport', 'GMAIL SMTP SERVICE', bg='#FFF8E7', border='#C5A869')
draw_box(ax, 4.2, 1.0, 2.2, 1.6, '• Click-to-Chat Protocol\n• Garment Photo Unfurl\n• Pre-written Inquiry String', 'WHATSAPP ATELIER API', bg='#E8F8F0', border='#25D366')
draw_box(ax, 6.9, 1.0, 2.2, 1.6, '• Groom Styling Knowledge\n• Measurement Guidance\n• Milestone Payment Policy', 'ATELIER AI STYLIST', bg='#F3E8FF', border='#8B5CF6')

# Arrows
draw_arrow(ax, 3.1, 5.4, 3.8, 5.4, 'REST API')
draw_arrow(ax, 3.8, 5.2, 3.1, 5.2, 'JSON Data')
draw_arrow(ax, 6.4, 5.4, 7.1, 5.4, 'Mongoose ODM')
draw_arrow(ax, 7.1, 5.2, 6.4, 5.2, 'Data Records')

draw_arrow(ax, 4.5, 4.5, 2.6, 2.6, 'Trigger OTP')
draw_arrow(ax, 5.1, 4.5, 5.1, 2.6, 'wa.me Direct')
draw_arrow(ax, 2.5, 4.5, 7.3, 2.6, 'Natural Queries')

ax.text(5.0, 6.7, 'Figure 5.1: High-Level System Architecture Diagram of M.S Fashion', ha='center', va='center', fontsize=12, fontweight='bold', color='#5C1A21')
plt.tight_layout()
plt.savefig('report_assets/diagram_system_architecture.png', bbox_inches='tight')
plt.close()
print('Architecture diagram generated')

# ==================== 2. LEVEL 0 DFD (Context Diagram - Figure 5.2) ====================
fig, ax = plt.subplots(figsize=(9, 6), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off')

# Central Process
circle = plt.Circle((5.0, 3.0), 1.2, ec='#5C1A21', fc='#FBF6EC', lw=2)
ax.add_patch(circle)
ax.text(5.0, 3.0, '0.0\nM.S FASHION\nBESPOKE PLATFORM\n(Core System)', ha='center', va='center', fontsize=9.5, fontweight='bold', color='#5C1A21')

# External Entities
draw_box(ax, 0.5, 2.2, 2.0, 1.6, '• Browse Catalog\n• Select Accessories\n• Enter Self Budget\n• Verify Email OTP', 'CUSTOMER / CLIENT', bg='#FAF4EB')
draw_box(ax, 7.5, 2.2, 2.0, 1.6, '• Catalog Management\n• 4-Border Cropper\n• CRM Lead Review\n• Brand Configuration', 'MASTER ATELIER\n(Admin)', bg='#FAF4EB')
draw_box(ax, 3.8, 0.3, 2.4, 1.0, 'Dynamic Catalog, Accessories,\nCRM Inquiries, Settings', 'MONGODB DATASTORE', bg='#F3F4F6', border='#6B7280')

# Arrows
draw_arrow(ax, 2.5, 3.3, 3.8, 3.3, 'Inquiry / Lead Input')
draw_arrow(ax, 3.8, 2.7, 2.5, 2.7, 'Catalog & Vouchers')
draw_arrow(ax, 6.2, 3.3, 7.5, 3.3, 'Leads & Feedback')
draw_arrow(ax, 7.5, 2.7, 6.2, 2.7, 'Product Updates')
draw_arrow(ax, 4.6, 1.8, 4.6, 1.3, 'Write / Update')
draw_arrow(ax, 5.4, 1.3, 5.4, 1.8, 'Read State')

ax.text(5.0, 5.6, 'Figure 5.2: Level 0 Data Flow Diagram (Context Diagram)', ha='center', va='center', fontsize=12, fontweight='bold', color='#5C1A21')
plt.tight_layout()
plt.savefig('report_assets/diagram_dfd_level0.png', bbox_inches='tight')
plt.close()
print('DFD Level 0 generated')

# ==================== 3. LEVEL 1 DFD (Figure 5.3) ====================
fig, ax = plt.subplots(figsize=(10, 7), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 8)
ax.axis('off')

# Processes
procs = [
    (1.0, 6.0, '1.0 Catalog &\nSilhouette Filters'),
    (4.0, 6.0, '2.0 CSS Zoom &\nAccessory Pricing'),
    (7.0, 6.0, '3.0 WhatsApp Direct\nPhoto Dispatch'),
    (1.0, 3.5, '4.0 Appointment &\nSelf Budget'),
    (4.0, 3.5, '5.0 Email OTP\nVerification'),
    (7.0, 3.5, '6.0 Royal Atelier\nAI Stylist Chatbot'),
    (2.5, 1.0, '7.0 Admin Catalog &\n4-Border Trimmer'),
    (6.0, 1.0, '8.0 Store Settings &\nInquiries CRM')
]

for x, y, txt in procs:
    rect = patches.FancyBboxPatch((x, y), 2.2, 1.2, boxstyle="round,pad=0.15", ec='#5C1A21', fc='#FBF6EC', lw=1.2)
    ax.add_patch(rect)
    ax.text(x+1.1, y+0.6, txt, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#5C1A21')

# Connective lines/arrows
draw_arrow(ax, 3.2, 6.6, 4.0, 6.6, 'Product Selected')
draw_arrow(ax, 6.2, 6.6, 7.0, 6.6, 'Price & Photo')
draw_arrow(ax, 2.1, 4.7, 4.0, 4.1, 'Booking Form')
draw_arrow(ax, 6.2, 4.1, 7.0, 4.1, 'Advice / Consultation')
draw_arrow(ax, 5.1, 3.5, 3.6, 2.2, 'Verified Lead')
draw_arrow(ax, 4.7, 1.6, 6.0, 1.6, 'Product Update')

ax.text(5.0, 7.7, 'Figure 5.3: Level 1 Data Flow Diagram (Decomposed Modules)', ha='center', va='center', fontsize=12, fontweight='bold', color='#5C1A21')
plt.tight_layout()
plt.savefig('report_assets/diagram_dfd_level1.png', bbox_inches='tight')
plt.close()
print('DFD Level 1 generated')

# ==================== 4. ACTIVITY DIAGRAM (Figure 5.4) ====================
fig, ax = plt.subplots(figsize=(8, 7.5), dpi=300)
ax.set_xlim(0, 8)
ax.set_ylim(0, 9)
ax.axis('off')

# Start node
start = plt.Circle((4.0, 8.4), 0.25, color='#5C1A21')
ax.add_patch(start)
ax.text(4.0, 8.4, '', color='white')

# Steps
steps = [
    (2.5, 7.3, 3.0, 0.6, 'User Visits Boutique Website'),
    (2.5, 6.3, 3.0, 0.6, 'Browse Sherwani / Jodhpuri / Blazer'),
    (2.5, 5.3, 3.0, 0.6, 'Select Royal Accessories & View Zoom'),
    (2.5, 4.3, 3.0, 0.6, 'Review Dynamic Estimated Total'),
    (0.8, 3.0, 2.8, 0.8, 'Direct WhatsApp Master\n(Auto-Attach Photo URL)'),
    (4.4, 3.0, 2.8, 0.8, 'Book Private Appointment\n(Enter Self Budget)'),
    (4.4, 1.8, 2.8, 0.7, 'Two-Step Email OTP Verification'),
    (2.5, 0.6, 3.0, 0.6, 'Lead Saved in Master CRM')
]

for x, y, w, h, txt in steps:
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1", ec='#A9812F', fc='#FAF4EB', lw=1.2)
    ax.add_patch(rect)
    ax.text(x+w/2, y+h/2, txt, ha='center', va='center', fontsize=8, fontweight='semibold', color='#5C1A21')

draw_arrow(ax, 4.0, 8.15, 4.0, 7.9)
draw_arrow(ax, 4.0, 7.3, 4.0, 6.9)
draw_arrow(ax, 4.0, 6.3, 4.0, 5.9)
draw_arrow(ax, 4.0, 5.3, 4.0, 4.9)
draw_arrow(ax, 3.3, 4.3, 2.2, 3.8, 'Quick Chat')
draw_arrow(ax, 4.7, 4.3, 5.8, 3.8, 'Book Trial')
draw_arrow(ax, 5.8, 3.0, 5.8, 2.5)
draw_arrow(ax, 5.8, 1.8, 4.7, 1.2)
draw_arrow(ax, 2.2, 3.0, 3.3, 1.2)

# End node
end_outer = plt.Circle((4.0, 0.15), 0.22, ec='#5C1A21', fc='none', lw=1.5)
end_inner = plt.Circle((4.0, 0.15), 0.14, color='#5C1A21')
ax.add_patch(end_outer)
ax.add_patch(end_inner)
draw_arrow(ax, 4.0, 0.6, 4.0, 0.38)

ax.text(4.0, 8.8, 'Figure 5.4: UML Activity Diagram for Bespoke Client Consultation', ha='center', va='center', fontsize=11, fontweight='bold', color='#5C1A21')
plt.tight_layout()
plt.savefig('report_assets/diagram_activity.png', bbox_inches='tight')
plt.close()
print('Activity diagram generated')

# ==================== 5. E-R DIAGRAM (Figure 5.5) ====================
fig, ax = plt.subplots(figsize=(9, 6.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 7)
ax.axis('off')

# Entities
draw_box(ax, 0.5, 4.0, 2.6, 2.4, 'PK: id (e.g. sherwani-01)\n• title (String)\n• category (String)\n• subCategory (String)\n• basePrice (Number)\n• realImageUrl (String)\n• zoomOrigin (x, y, scale)', 'PRODUCT / GARMENT', bg='#FAF4EB')
draw_box(ax, 4.0, 4.0, 2.4, 2.4, 'PK: id (String)\n• name (String)\n• price (Number)\n• category (String)\n• zoomTarget (x, y)\n• description (String)', 'ACCESSORY', bg='#FAF4EB')
draw_box(ax, 7.1, 4.0, 2.4, 2.4, 'PK: id (ObjectId)\n• customerName\n• email (Verified)\n• phone (10-digit)\n• expectedBudget (INR)\n• consultationType\n• status (Pending/Confirmed)', 'INQUIRY / CRM LEAD', bg='#FAF4EB')

draw_box(ax, 1.5, 0.8, 2.8, 2.0, 'PK: id (ObjectId)\n• email (String)\n• otp (6 Digits)\n• expiresAt (Timestamp)\n• verified (Boolean)', 'EMAIL OTP VERIFICATION', bg='#F3F4F6')
draw_box(ax, 5.8, 0.8, 3.2, 2.0, 'PK: id (ObjectId)\n• boutiqueAddress\n• whatsappPhone\n• visitingHours\n• tickerMessages (Array)\n• smtpEmail & Password', 'BRAND CONFIGURATION', bg='#F3F4F6')

# Relationships lines
draw_arrow(ax, 3.1, 5.2, 4.0, 5.2, 'Has (1:N)')
draw_arrow(ax, 6.4, 5.2, 7.1, 5.2, 'Pairs With')
draw_arrow(ax, 7.5, 4.0, 3.5, 2.8, 'Verifies Lead')

ax.text(5.0, 6.7, 'Figure 5.5: Entity-Relationship (E-R) Diagram of M.S Fashion', ha='center', va='center', fontsize=12, fontweight='bold', color='#5C1A21')
plt.tight_layout()
plt.savefig('report_assets/diagram_er.png', bbox_inches='tight')
plt.close()
print('ER diagram generated')

# ==================== 6. USE-CASE DIAGRAM (Figure 5.6) ====================
fig, ax = plt.subplots(figsize=(9, 6.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 7)
ax.axis('off')

# Actors
ax.text(0.8, 3.5, '👤\nCUSTOMER', ha='center', va='center', fontsize=12, fontweight='bold', color='#5C1A21')
ax.text(9.2, 3.5, '👔\nMASTER ATELIER\n(Admin)', ha='center', va='center', fontsize=12, fontweight='bold', color='#5C1A21')

# Use case ovals
use_cases = [
    (3.5, 5.8, 'Browse Ethnic Collections'),
    (3.5, 4.8, 'Filter Silhouettes by Style'),
    (3.5, 3.8, 'Inspect Accessories with CSS Zoom'),
    (3.5, 2.8, 'Book Private Appointment (Self Budget)'),
    (3.5, 1.8, 'Chat with Royal AI Stylist'),
    (6.5, 5.0, 'Manage Garments & Sequential Ref IDs'),
    (6.5, 3.8, 'Calibrate Zoom & 4-Border Crop Studio'),
    (6.5, 2.6, 'Review CRM Leads & WhatsApp Atelier')
]

for x, y, txt in use_cases:
    ellipse = patches.Ellipse((x, y), 2.5, 0.7, ec='#A9812F', fc='#FBF6EC', lw=1.2)
    ax.add_patch(ellipse)
    ax.text(x, y, txt, ha='center', va='center', fontsize=7.5, fontweight='semibold', color='#2B211D')

# Lines from customer
for _, y, _ in use_cases[:5]:
    ax.plot([1.4, 2.25], [3.5, y], color='#5C1A21', lw=1.2, linestyle='-')

# Lines from admin
for _, y, _ in use_cases[5:]:
    ax.plot([8.5, 7.75], [3.5, y], color='#5C1A21', lw=1.2, linestyle='-')

ax.text(5.0, 6.7, 'Figure 5.6: UML Use-Case Diagram for M.S Fashion Platform', ha='center', va='center', fontsize=12, fontweight='bold', color='#5C1A21')
plt.tight_layout()
plt.savefig('report_assets/diagram_usecase.png', bbox_inches='tight')
plt.close()
print('Use case diagram generated')

# ==================== 7. SYSTEM FLOWCHART (Figure 6.1) ====================
fig, ax = plt.subplots(figsize=(8, 7.5), dpi=300)
ax.set_xlim(0, 8)
ax.set_ylim(0, 9)
ax.axis('off')

# Start
rect = patches.FancyBboxPatch((2.8, 8.2), 2.4, 0.5, boxstyle="round,pad=0.2", ec='#5C1A21', fc='#5C1A21')
ax.add_patch(rect)
ax.text(4.0, 8.45, 'START', ha='center', va='center', fontsize=10, fontweight='bold', color='white')

boxes = [
    (2.2, 7.2, 3.6, 0.6, 'User Visits Boutique & Selects Garment'),
    (2.2, 6.2, 3.6, 0.6, 'Selects Royal Accessories & Views 2.2x Zoom'),
    (2.2, 5.2, 3.6, 0.6, 'System Calculates Dynamic Estimated Total')
]

for x, y, w, h, txt in boxes:
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1", ec='#A9812F', fc='#FAF4EB', lw=1.2)
    ax.add_patch(rect)
    ax.text(x+w/2, y+h/2, txt, ha='center', va='center', fontsize=8, fontweight='semibold', color='#5C1A21')

# Decision diamond
diamond = patches.Polygon([[4.0, 4.6], [5.5, 4.0], [4.0, 3.4], [2.5, 4.0]], ec='#5C1A21', fc='#FBF6EC', lw=1.5)
ax.add_patch(diamond)
ax.text(4.0, 4.0, 'Select Action\nType?', ha='center', va='center', fontsize=8, fontweight='bold', color='#5C1A21')

# Branches
draw_box(ax, 0.4, 2.2, 2.6, 0.8, 'Direct WhatsApp Master\n(Auto-Attach Photo URL)', 'WHATSAPP DIRECT')
draw_box(ax, 5.0, 2.2, 2.6, 0.8, 'Fill Appointment Form\n(Enter Self Budget)', 'APPOINTMENT BOOKING')
draw_box(ax, 5.0, 1.0, 2.6, 0.7, 'Two-Step Email OTP\nVerification Screen', 'EMAIL OTP VALIDATION')

# Stop
rect = patches.FancyBboxPatch((2.8, 0.1), 2.4, 0.5, boxstyle="round,pad=0.2", ec='#5C1A21', fc='#5C1A21')
ax.add_patch(rect)
ax.text(4.0, 0.35, 'END (LEAD CONFIRMED)', ha='center', va='center', fontsize=9, fontweight='bold', color='white')

draw_arrow(ax, 4.0, 8.2, 4.0, 7.8)
draw_arrow(ax, 4.0, 7.2, 4.0, 6.8)
draw_arrow(ax, 4.0, 6.2, 4.0, 5.8)
draw_arrow(ax, 4.0, 5.2, 4.0, 4.6)
draw_arrow(ax, 2.5, 4.0, 1.7, 3.0, 'WhatsApp')
draw_arrow(ax, 5.5, 4.0, 6.3, 3.0, 'Book Fitting')
draw_arrow(ax, 6.3, 2.2, 6.3, 1.7)
draw_arrow(ax, 6.3, 1.0, 4.5, 0.6)
draw_arrow(ax, 1.7, 2.2, 3.5, 0.6)

ax.text(4.0, 8.8, 'Figure 6.1: High-Level System Workflow Flowchart', ha='center', va='center', fontsize=11, fontweight='bold', color='#5C1A21')
plt.tight_layout()
plt.savefig('report_assets/diagram_flowchart.png', bbox_inches='tight')
plt.close()
print('Flowchart generated')
