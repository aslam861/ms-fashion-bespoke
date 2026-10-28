import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dynamicCatalogFile = path.join(__dirname, 'dynamicCatalog.json');

export const categoriesData = [
  {
    id: 'sherwani',
    name: 'Sherwani',
    title: 'Imperial Sherwani Collection',
    tagline: 'Regal Elegance & Royal Heritage for Grand Celebrations',
    description: 'Impeccably tailored wedding sherwanis adorned with hand-stitched zardozi, antique dabka, and royal silhouettes tailored to master perfection.',
    representativePlaceholder: '[Sherwani Representative Photo - Royal Heritage Sherwani]',
    folderPath: 'uploads/references/Sherwani',
    realImageUrl: '/uploads/references/Sherwani/sherwani-01.jpg',
    subCategories: ['Royal Bridal Sherwani', 'Heritage Velvet Sherwani', 'Brocade Classic', 'Silk Embroidered']
  },
  {
    id: 'jodhpuri',
    name: 'Jodhpuri',
    title: 'Aristocratic Jodhpuri Bandhgala',
    tagline: 'Aristocratic Tailoring & Timeless Bandhgala Silhouettes',
    description: 'The epitome of princely Indian tailoring. Structured closed collars, sculpted shoulders, and refined embellishments designed for modern royalty.',
    representativePlaceholder: '[Jodhpuri Representative Photo - Aristocratic Bandhgala Suit]',
    folderPath: 'uploads/references/Jodhpuri-With-Jacket',
    realImageUrl: '/uploads/references/Jodhpuri/jodhpuri-01-1791699346911.png',
    subCategories: ['Jodhpuri-With-Jacket', 'Jodhpuri-Without-Jacket']
  },
  {
    id: 'indo-western',
    name: 'Indo-Western',
    title: 'Contemporary Indo-Western',
    tagline: 'Contemporary Fusion & Avant-Garde Ethnic Silhouettes',
    description: 'A harmonious fusion of traditional Indian craftsmanship with modern asymmetrical cuts, cascading drapes, and structured outerwear.',
    representativePlaceholder: '[Indo-Western Representative Photo - Asymmetrical Draped Ensemble]',
    folderPath: 'uploads/references/Indo-Western-With-Jacket',
    realImageUrl: '/uploads/references/Sherwani/garment-1791701074587.png',
    subCategories: ['Indo-Western-With-Jacket', 'Indo-Western-Without-Jacket']
  },
  {
    id: 'blazer',
    name: 'Blazer',
    title: 'Bespoke Blazers & Tuxedos',
    tagline: 'Timeless Western Elegance & Bespoke Tailored Blazers',
    description: 'Savile Row inspired bespoke tailoring crafted with superfine Italian wools, sharp lapels, and custom double-breasted or shawl styling for black-tie affairs.',
    representativePlaceholder: '[Blazer Representative Photo - Bespoke Tuxedo & Blazers]',
    folderPath: 'uploads/references/Blazer-Single-Breasted',
    realImageUrl: '/uploads/references/Blazer/coat-01-1791700472242.png',
    subCategories: ['Blazer-Single-Breasted', 'Blazer-Double-Breasted', 'Blazer-Shawl']
  }
];

export const productsData = [
  // ==================== SHERWANI (uploads/references/Sherwani/) ====================
  {
    id: 'sherwani-01',
    title: 'The Maharaja Zardozi Velvet Sherwani',
    category: 'Sherwani',
    subCategory: 'Royal Bridal Sherwani',
    folderPath: 'uploads/references/Sherwani',
    placeholderLabel: '[Sherwani photo 1 - Maharaja Zardozi Velvet Sherwani]',
    imageFileName: 'sherwani-01.jpg',
    realImageUrl: '/uploads/references/Sherwani/sherwani-01.jpg',
    basePrice: 11999,
    tagline: 'Deep Maroon Velvet with Antique Gold Zardozi & Resham',
    description: 'An ode to royal Rajasthani heritage. Handcrafted on rich maroon silk velvet with masterfully etched antique gold dabka, French knot florals, and hand-beaded borders.',
    fabric: 'Pure Silk Velvet with Organza Lining',
    embroidery: 'Handcrafted Antique Zardozi, Cutdana & Resham',
    fit: 'Bespoke Regal Tailored Fit',
    leadTime: '20 - 25 Working Days',
    accessories: [
      { name: 'Royal Mojdi', key: 'mojdi', price: 1400, description: 'Matching velvet mojdi with coordinating antique zardozi work', zoomOrigin: { x: 60, y: 94, scale: 2.3 } },
      { name: 'Chanderi Safa', key: 'safa', price: 2000, description: 'Hand-tied royal maroon & gold tissue Chanderi turban', zoomOrigin: { x: 55, y: 8, scale: 2.3 } },
      { name: 'Kundan & Pearl Mala', key: 'mala', price: 700, description: 'Layered pearl necklace with kundan centerpiece', zoomOrigin: { x: 54, y: 28, scale: 2.2 } },
      { name: 'Antique Kalgi Brooch', key: 'brooch', price: 400, description: 'Vintage antique gold plated brooch with emerald droplet', zoomOrigin: { x: 58, y: 31, scale: 2.6 } },
      { name: 'Embroidered Dupatta', key: 'dupatta', price: 2000, description: 'Soft organza stole with scalloped zardozi border work', zoomOrigin: { x: 38, y: 48, scale: 2.1 } }
    ]
  },
  {
    id: 'sherwani-02',
    title: 'The Nawabi Raw Silk Ivory Sherwani',
    category: 'Sherwani',
    subCategory: 'Heritage Velvet Sherwani',
    folderPath: 'uploads/references/Sherwani',
    placeholderLabel: '[Sherwani photo 2 - Nawabi Raw Silk Ivory Sherwani]',
    imageFileName: '',
    basePrice: 58000,
    tagline: 'Warm Ivory Matka Silk with Kashmiri Tilla Threadwork',
    description: 'An understated masterpiece of aristocratic finesse. Built from handwoven textured ivory raw silk with tone-on-tone tilla embroidery and subtle gold sequins.',
    fabric: 'Pure Handloom Raw Silk',
    embroidery: 'Tone-on-Tone Kashmiri Tilla & Subtle Sequins',
    fit: 'Bespoke Structured Silhouette',
    leadTime: '18 - 22 Working Days',
    accessories: [
      { name: 'Royal Mojdi', key: 'mojdi', price: 4200, description: 'Raw silk matching footwear with tone embroidery', zoomOrigin: { x: 50, y: 92, scale: 2.2 } },
      { name: 'Chanderi Safa', key: 'safa', price: 4800, description: 'Peach-gold dual-tone organza pagri with royal drape', zoomOrigin: { x: 50, y: 6, scale: 2.3 } },
      { name: 'Kundan & Pearl Mala', key: 'mala', price: 3800, description: 'Green onyx and cultured pearl layered necklace', zoomOrigin: { x: 50, y: 32, scale: 2.2 } },
      { name: 'Antique Kalgi Brooch', key: 'brooch', price: 2400, description: 'Feather plume jeweled brooch for safa/chest', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Embroidered Dupatta', key: 'dupatta', price: 5800, description: 'Heritage georgette stole with hand-cut gotta patti', zoomOrigin: { x: 26, y: 46, scale: 2.1 } }
    ]
  },
  {
    id: 'sherwani-03',
    title: 'The Banarasi Brocade Royal Sherwani',
    category: 'Sherwani',
    subCategory: 'Brocade Classic',
    folderPath: 'uploads/references/Sherwani',
    placeholderLabel: '[Sherwani photo 3 - Banarasi Brocade Royal Sherwani]',
    imageFileName: '',
    basePrice: 52000,
    tagline: 'Pure Katan Silk Banarasi Weave in Deep Burgundy & Gold',
    description: 'Woven on traditional Varanasi handlooms with pure zari motifs, tailored with a sharp high-neck silhouette and matching churidar.',
    fabric: 'Pure Banarasi Katan Silk with Zari',
    embroidery: 'Hand-loomed Floral Kadwa Weaving',
    fit: 'Classic Tailored Sherwani Fit',
    leadTime: '15 - 20 Working Days',
    accessories: [
      { name: 'Royal Mojdi', key: 'mojdi', price: 3900, description: 'Brocade matching footwear with cushioned sole', zoomOrigin: { x: 50, y: 92, scale: 2.2 } },
      { name: 'Chanderi Safa', key: 'safa', price: 4500, description: 'Hand-woven brocade safa with gold border', zoomOrigin: { x: 50, y: 6, scale: 2.3 } },
      { name: 'Kundan & Pearl Mala', key: 'mala', price: 3500, description: 'Multi-layer pearl haar with ruby accent', zoomOrigin: { x: 50, y: 32, scale: 2.2 } },
      { name: 'Antique Kalgi Brooch', key: 'brooch', price: 2200, description: 'Heritage filigree brooch with ruby centerpiece', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Embroidered Dupatta', key: 'dupatta', price: 5200, description: 'Matching Banarasi zari border tissue dupatta', zoomOrigin: { x: 26, y: 46, scale: 2.1 } }
    ]
  },
  {
    id: 'sherwani-04',
    title: 'The Mughal Jaal Silk Embroidered Sherwani',
    category: 'Sherwani',
    subCategory: 'Silk Embroidered',
    folderPath: 'uploads/references/Sherwani',
    placeholderLabel: '[Sherwani photo 4 - Mughal Jaal Silk Embroidered Sherwani]',
    imageFileName: '',
    basePrice: 62000,
    tagline: 'Subtle Sage & Gold All-Over Floral Jaal Embroidery',
    description: 'An ethereal combination of sage silk base and intricate all-over floral jaal embroidery, perfect for destination weddings and day pheras.',
    fabric: 'Pure Tussar Silk with Satin Finish',
    embroidery: 'Intricate All-Over Silk Resham Jaal',
    fit: 'Structured Slim Bespoke Cut',
    leadTime: '20 - 24 Working Days',
    accessories: [
      { name: 'Royal Mojdi', key: 'mojdi', price: 4400, description: 'Hand-embroidered sage silk mojdi', zoomOrigin: { x: 50, y: 92, scale: 2.2 } },
      { name: 'Chanderi Safa', key: 'safa', price: 5000, description: 'Pastel gold silk organza safa with jeweled kalgi mount', zoomOrigin: { x: 50, y: 6, scale: 2.3 } },
      { name: 'Kundan & Pearl Mala', key: 'mala', price: 4000, description: 'Layered emerald bead and pearl necklace', zoomOrigin: { x: 50, y: 32, scale: 2.2 } },
      { name: 'Antique Kalgi Brooch', key: 'brooch', price: 2600, description: 'Polki and emerald chest brooch', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Embroidered Dupatta', key: 'dupatta', price: 6000, description: 'Silk organza stole with hand-scalloped resham embroidery', zoomOrigin: { x: 26, y: 46, scale: 2.1 } }
    ]
  },

  // ==================== JODHPURI (uploads/references/Jodhpuri-...) ====================
  {
    id: 'jodhpuri-01',
    title: 'The Royal Charcoal Bandhgala with Jacket',
    category: 'Jodhpuri',
    subCategory: 'Jodhpuri-With-Jacket',
    folderPath: 'uploads/references/Jodhpuri-With-Jacket',
    placeholderLabel: '[Jodhpuri With Jacket photo 1 - Royal Charcoal Bandhgala]',
    imageFileName: '',
    basePrice: 42000,
    tagline: 'Sculpted Structured Bandhgala with Outer Layering Jacket',
    description: 'Distinguished formal evening wear featuring a structured closed collar inner suit paired with a majestic open-front bespoke achkan jacket.',
    fabric: 'Super 140s Italian Wool & Silk Blend',
    embroidery: 'Subtle Hand-stitched Pick Lapels & Tone Threading',
    fit: 'Tailored Bandhgala Fit',
    leadTime: '14 - 18 Working Days',
    accessories: [
      { name: 'Silk Pocket-Square', key: 'pocket-square', price: 1200, description: 'Pure printed Italian silk pocket square in maroon & gold', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Antique Chest Brooch', key: 'brooch', price: 2200, description: 'Regal lapel chain brooch with double crest pinning', zoomOrigin: { x: 60, y: 31, scale: 2.6 } }
    ]
  },
  {
    id: 'jodhpuri-02',
    title: 'The Midnight Velvet Embroidered Bandhgala',
    category: 'Jodhpuri',
    subCategory: 'Jodhpuri-With-Jacket',
    folderPath: 'uploads/references/Jodhpuri-With-Jacket',
    placeholderLabel: '[Jodhpuri With Jacket photo 2 - Midnight Velvet Embroidered Bandhgala]',
    imageFileName: '',
    basePrice: 46000,
    tagline: 'Midnight Navy Velvet with Subtle Antique Gold Collar Crest',
    description: 'A sovereign evening piece in rich midnight velvet, lined with cupro silk and detailed with subtle bullion wire crest work.',
    fabric: 'Micro-velvet with Cupro Bemberg Lining',
    embroidery: 'Handmade Bullion Wire Crest & Cuff Trims',
    fit: 'Precision Contoured Fit',
    leadTime: '15 - 20 Working Days',
    accessories: [
      { name: 'Silk Pocket-Square', key: 'pocket-square', price: 1400, description: 'Ivory-gold hand-rolled border silk square', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Antique Chest Brooch', key: 'brooch', price: 2500, description: 'Royal eagle crest brooch with hanging curb chain', zoomOrigin: { x: 60, y: 31, scale: 2.6 } }
    ]
  },
  {
    id: 'jodhpuri-03',
    title: 'The Classic Ivory Raw Silk Bandhgala Suit',
    category: 'Jodhpuri',
    subCategory: 'Jodhpuri-Without-Jacket',
    folderPath: 'uploads/references/Jodhpuri-Without-Jacket',
    placeholderLabel: '[Jodhpuri Without Jacket photo 3 - Classic Ivory Raw Silk Bandhgala]',
    imageFileName: '',
    basePrice: 38000,
    tagline: 'Warm Ivory Handcrafted Bandhgala with Trousers',
    description: 'Clean, elegant, and timeless. Cut from high-twist raw silk with precision shoulder pads and handmade fabric loops.',
    fabric: 'Pure Matka Raw Silk',
    embroidery: 'Fine Saddle Stitching & Minimalist Seams',
    fit: 'Classic Aristocratic Fit',
    leadTime: '12 - 16 Working Days',
    accessories: [
      { name: 'Silk Pocket-Square', key: 'pocket-square', price: 1100, description: 'Burgundy paisley printed twill silk pocket square', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Antique Chest Brooch', key: 'brooch', price: 1900, description: 'Vintage gold monogram lapel pin', zoomOrigin: { x: 60, y: 31, scale: 2.6 } }
    ]
  },
  {
    id: 'jodhpuri-04',
    title: 'The Heritage Maroon Jacquard Bandhgala',
    category: 'Jodhpuri',
    subCategory: 'Jodhpuri-Without-Jacket',
    folderPath: 'uploads/references/Jodhpuri-Without-Jacket',
    placeholderLabel: '[Jodhpuri Without Jacket photo 4 - Heritage Maroon Jacquard Bandhgala]',
    imageFileName: '',
    basePrice: 40000,
    tagline: 'Self-Patterned Maroon Jacquard with Antique Accents',
    description: 'Rich self-woven jacquard motifs on deep maroon fabric, paired with tapered charcoal trousers for an unforgettable royal appearance.',
    fabric: 'Jacquard Silk-Wool Blend',
    embroidery: 'Self Woven Floral Texture',
    fit: 'Slim Fitted Royal Cut',
    leadTime: '14 - 18 Working Days',
    accessories: [
      { name: 'Silk Pocket-Square', key: 'pocket-square', price: 1200, description: 'Gold satin pocket square with dark border', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Antique Chest Brooch', key: 'brooch', price: 2100, description: 'Ruby cluster brooch with double chain clasp', zoomOrigin: { x: 60, y: 31, scale: 2.6 } }
    ]
  },

  // ==================== INDO-WESTERN (uploads/references/Indo-Western-...) ====================
  {
    id: 'indo-01',
    title: 'The Asymmetric Draped Achkan with Open Jacket',
    category: 'Indo-Western',
    subCategory: 'Indo-Western-With-Jacket',
    folderPath: 'uploads/references/Indo-Western-With-Jacket',
    placeholderLabel: '[Indo-Western With Jacket photo 1 - Asymmetric Draped Achkan with Jacket]',
    imageFileName: '',
    basePrice: 48000,
    tagline: 'Modern Asymmetrical Hemline with Layered Tailored Jacket',
    description: 'A high-fashion crossover silhouette combining fluid cowl drapery with a sharply structured overlay jacket, creating captivating movement.',
    fabric: 'Italian Georgette & Crepe with Structured Wool Overlay',
    embroidery: 'Geometric Zardozi and Threadwork on Lapel & Cuffs',
    fit: 'Modern Architectural Drape Fit',
    leadTime: '15 - 20 Working Days',
    accessories: [
      { name: 'Stylist Pocket-Square', key: 'pocket-square', price: 1100, description: 'Asymmetric folded geometric satin square', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Antique Chest Brooch', key: 'brooch', price: 2200, description: 'Modern royal aesthetic lapel brooch with subtle chain', zoomOrigin: { x: 60, y: 31, scale: 2.6 } }
    ]
  },
  {
    id: 'indo-02',
    title: 'The Pleated Overlap Fusion Ensemble with Jacket',
    category: 'Indo-Western',
    subCategory: 'Indo-Western-With-Jacket',
    folderPath: 'uploads/references/Indo-Western-With-Jacket',
    placeholderLabel: '[Indo-Western With Jacket photo 2 - Pleated Overlap Fusion Ensemble with Jacket]',
    imageFileName: '',
    basePrice: 51000,
    tagline: 'Fluted Pleated Front with Hand-Embroidered Open Overlay',
    description: 'Hand-crafted micro-pleating paired with an ornate structured jacket in antique gold and rich maroon tones.',
    fabric: 'Pure Silk Organza & Raw Silk Jacket',
    embroidery: 'Hand-appliquéd Resham Motifs',
    fit: 'Sculpted Fusion Silhouette',
    leadTime: '16 - 20 Working Days',
    accessories: [
      { name: 'Stylist Pocket-Square', key: 'pocket-square', price: 1200, description: 'Monochrome ombre silk square', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Antique Chest Brooch', key: 'brooch', price: 2400, description: 'Antique gold filigree brooch with pearl droplet', zoomOrigin: { x: 60, y: 31, scale: 2.6 } }
    ]
  },
  {
    id: 'indo-03',
    title: 'The Cascading Cowl Kurta & Waistcoat Set',
    category: 'Indo-Western',
    subCategory: 'Indo-Western-Without-Jacket',
    folderPath: 'uploads/references/Indo-Western-Without-Jacket',
    placeholderLabel: '[Indo-Western Without Jacket photo 3 - Cascading Cowl Kurta & Waistcoat Set]',
    imageFileName: '',
    basePrice: 34000,
    tagline: 'Deep Burgundy Cowl Kurta with Tailored Nehru Waistcoat',
    description: 'Effortless ethnic elegance featuring fluid cowl draping along the chest and hip, topped with an embroidered bandhgala waistcoat.',
    fabric: 'Fluid Silk Chanderi & Dupion Silk',
    embroidery: 'Subtle Pinstripe Resham Detailing',
    fit: 'Fluid Tailored Fit',
    leadTime: '10 - 14 Working Days',
    accessories: [
      { name: 'Stylist Pocket-Square', key: 'pocket-square', price: 950, description: 'Textured linen-silk pocket square', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Antique Chest Brooch', key: 'brooch', price: 1900, description: 'Minimalist metallic crest lapel brooch', zoomOrigin: { x: 60, y: 31, scale: 2.6 } }
    ]
  },
  {
    id: 'indo-04',
    title: 'The Monochromatic Charcoal Wrap Ensemble',
    category: 'Indo-Western',
    subCategory: 'Indo-Western-Without-Jacket',
    folderPath: 'uploads/references/Indo-Western-Without-Jacket',
    placeholderLabel: '[Indo-Western Without Jacket photo 4 - Monochromatic Charcoal Wrap Ensemble]',
    imageFileName: '',
    basePrice: 36000,
    tagline: 'Modern Cross-Over Fastening with Straight Tapered Trousers',
    description: 'Understated high fashion with cross-wrap fastening, side vents, and clean tailored lines for sangeet and cocktail soirees.',
    fabric: 'High-Twist Wool Crepe',
    embroidery: 'Minimalist Tone Stitching',
    fit: 'Modern Streamlined Cut',
    leadTime: '12 - 15 Working Days',
    accessories: [
      { name: 'Stylist Pocket-Square', key: 'pocket-square', price: 1000, description: 'Charcoal brushed silk pocket square', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Antique Chest Brooch', key: 'brooch', price: 2100, description: 'Vintage geometric gunmetal brooch', zoomOrigin: { x: 60, y: 31, scale: 2.6 } }
    ]
  },

  // ==================== BLAZER (uploads/references/Blazer-...) ====================
  {
    id: 'coat-01',
    title: 'The Sovereign Single-Breasted Peak Lapel Suit',
    category: 'Blazer',
    subCategory: 'Blazer-Single-Breasted',
    folderPath: 'uploads/references/Blazer-Single-Breasted',
    placeholderLabel: '[Blazer Single-Breasted photo 1 - Sovereign SB Peak Lapel Suit]',
    imageFileName: '',
    basePrice: 44000,
    tagline: 'Savile Row Cut Single-Breasted Suit in Charcoal Glen Check',
    description: 'Masterfully structured single-breasted two-piece suit with high-gorge peak lapels, full horsehair canvas chest, and horn buttons.',
    fabric: 'Super 150s Merino Wool (320 gsm)',
    embroidery: 'Hand-picked AMF Stitching along Lapels & Pockets',
    fit: 'Bespoke English Tailored Fit',
    leadTime: '15 - 20 Working Days',
    accessories: [
      { name: 'Silk Twill Pocket-Square', key: 'pocket-square', price: 1200, description: 'Hand-rolled edge Italian silk twill in burgundy and gold', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Satin Tuxedo Accents', key: 'tuxedo', price: 2800, description: 'Duchess satin trimmed jetted pockets and lapel facing', zoomOrigin: { x: 50, y: 30, scale: 2.2 } },
      { name: 'Antique Lapel Brooch', key: 'brooch', price: 2200, description: 'Signature metal crest lapel pin and chain', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Tailored Trousers / Pant', key: 'pant', price: 4500, description: 'Custom fitted matching formal trousers with waistband adjusters', zoomOrigin: { x: 50, y: 85, scale: 2.1 } }
    ]
  },
  {
    id: 'coat-02',
    title: 'The Imperial Double-Breasted 6x2 Wool Suit',
    category: 'Blazer',
    subCategory: 'Blazer-Double-Breasted',
    folderPath: 'uploads/references/Blazer-Double-Breasted',
    placeholderLabel: '[Blazer Double-Breasted photo 2 - Imperial DB 6x2 Wool Suit]',
    imageFileName: '',
    basePrice: 48000,
    tagline: 'Classic 6x2 Double-Breasted Silhouette in Midnight Navy',
    description: 'Imposing masculine authority. Broad sweeping peak lapels, roped shoulder construction, and a nipped waist tailored for red-carpet distinction.',
    fabric: 'Super 160s Fine Worsted Wool',
    embroidery: 'Hand-stitched Pick Lapels & Milanese Buttonhole',
    fit: 'Power Silhouette Bespoke DB Fit',
    leadTime: '16 - 22 Working Days',
    accessories: [
      { name: 'Silk Twill Pocket-Square', key: 'pocket-square', price: 1300, description: 'Geometric foulard print pocket square', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Satin Tuxedo Accents', key: 'tuxedo', price: 3200, description: 'Grosgrain silk lapel facing and trouser side galon stripe', zoomOrigin: { x: 50, y: 30, scale: 2.2 } },
      { name: 'Antique Lapel Brooch', key: 'brooch', price: 2200, description: 'Aristocratic double chain lapel pin', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Tailored Trousers / Pant', key: 'pant', price: 4500, description: 'Precision cut double-pleated matching trousers', zoomOrigin: { x: 50, y: 85, scale: 2.1 } }
    ]
  },
  {
    id: 'coat-03',
    title: 'The Black-Tie Velvet Shawl Lapel Tuxedo',
    category: 'Blazer',
    subCategory: 'Blazer-Shawl',
    folderPath: 'uploads/references/Blazer-Shawl',
    placeholderLabel: '[Blazer Shawl photo 3 - Black-Tie Velvet Shawl Lapel Tuxedo]',
    imageFileName: '',
    basePrice: 52000,
    tagline: 'Pure Silk Velvet Dinner Jacket with Satin Shawl Collar',
    description: 'The definitive black-tie evening statement. Deep wine velvet dinner jacket featuring a fluid curved satin shawl collar and jetted pockets.',
    fabric: 'Pure Cotton Velvet & Duchess Silk Satin',
    embroidery: 'Hand-molded Shawl Collar & Silk Covered Buttons',
    fit: 'Bespoke Evening Dinner Fit',
    leadTime: '18 - 22 Working Days',
    accessories: [
      { name: 'Antique Lapel Brooch', key: 'brooch', price: 2400, description: 'Vintage black-tie jeweled lapel brooch', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Silk Twill Pocket-Square', key: 'pocket-square', price: 1200, description: 'Pure white Irish linen or silk presidential square', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Tailored Tuxedo Pant', key: 'pant', price: 4800, description: 'Matching tuxedo trousers with satin side stripe', zoomOrigin: { x: 50, y: 85, scale: 2.1 } }
    ]
  },
  {
    id: 'coat-04',
    title: 'The Emerald Green Velvet Shawl Tuxedo',
    category: 'Blazer',
    subCategory: 'Blazer-Shawl',
    folderPath: 'uploads/references/Blazer-Shawl',
    placeholderLabel: '[Blazer Shawl photo 4 - Emerald Green Velvet Shawl Tuxedo]',
    imageFileName: '',
    basePrice: 54000,
    tagline: 'Deep Emerald Velvet with Black Grosgrain Shawl Lapel',
    description: 'An aristocratic evening dinner suit in luminous bottle green velvet paired with midnight trousers featuring a grosgrain side stripe.',
    fabric: 'English Micro-Velvet & Italian Grosgrain Silk',
    embroidery: 'Silk Pic-Stitched Edge Trimming',
    fit: 'Fitted Evening Contour Fit',
    leadTime: '18 - 24 Working Days',
    accessories: [
      { name: 'Antique Lapel Brooch', key: 'brooch', price: 2500, description: 'Emerald and gold baroque silk lapel pin', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Silk Twill Pocket-Square', key: 'pocket-square', price: 1300, description: 'Emerald and gold baroque silk pocket square', zoomOrigin: { x: 60, y: 31, scale: 2.6 } },
      { name: 'Tailored Tuxedo Pant', key: 'pant', price: 4800, description: 'Midnight trousers with grosgrain side stripe', zoomOrigin: { x: 50, y: 85, scale: 2.1 } }
    ]
  }
];

// Load persisted dynamic catalog if present
try {
  if (fs.existsSync(dynamicCatalogFile)) {
    const raw = fs.readFileSync(dynamicCatalogFile, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      productsData.length = 0;
      parsed.forEach(item => productsData.push(item));
    }
  }
} catch (err) {
  console.warn('[Dynamic Catalog Notice]', err.message);
}

export const persistProductsData = () => {
  try {
    fs.writeFileSync(dynamicCatalogFile, JSON.stringify(productsData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Dynamic Catalog Save Error]', err.message);
  }
};

