export const ARTWORK_CATEGORIES = [
  "All",
  "Digital Prints",
  "Physical Prints"
];

export const ARTWORK_TYPES = [
  "All",
  "Physical",
  "Digital"
];

export const initialArtworksData = [
  {
    id: "art-001",
    title: "Serenade in Bronze & Shadow",
    shortDescription: "Curated fine art oil painting study highlighting warm bronze tones and dramatic shadows.",
    description: "An evocative study in texture, shadow, and golden illumination. Captured on medium format digital, this limited edition print explores fluid light boundaries across sculptured oil strokes.",
    image: "/artworks/art-001.jpg",
    width: 1200,
    height: 1600,
    price: 450,
    type: "Physical",
    category: "Physical Prints",
    availability: "Limited Edition (1/25)",
    quantity: 25,
    year: "2025",
    dimensions: "24 x 36 inches",
    options: [
      { id: "opt-sm", label: "16 x 24 in - Fine Art Rag Paper", price: 320 },
      { id: "opt-md", label: "24 x 36 in - Archival Hahnemühle", price: 450 },
      { id: "opt-lg", label: "36 x 48 in - Gallery Acrylic Mount", price: 780 }
    ],
    specs: {
      paper: "Hahnemühle Photo Rag 308gsm",
      printing: "Pigment Archival Print",
      signature: "Hand-signed & numbered certificate by G. Venketram",
      framing: "Unframed (Ships safely rolled in wooden art tube)"
    }
  },
  {
    id: "art-002",
    title: "Celestial Veil",
    shortDescription: "High-resolution digital fluid art master file with commercial display licensing.",
    description: "An ethereal interplay of ambient light and liquid color streams. Designed as a high-resolution digital artwork suitable for ultra-HD luxury digital displays, architectural projections, or custom collector printing.",
    image: "/artworks/art-002.jpg",
    width: 1600,
    height: 1067,
    price: 280,
    type: "Digital",
    category: "Digital Prints",
    availability: "Instant Download",
    quantity: 999,
    year: "2024",
    dimensions: "8192 x 5461 px (8K Native Resolution)",
    options: [
      { id: "opt-dig-pers", label: "Personal Display License (JPG + PNG 8K)", price: 280 },
      { id: "opt-dig-comm", label: "Commercial Editorial License (16-bit TIFF)", price: 650 }
    ],
    specs: {
      format: "RAW / 16-Bit TIFF & Uncompressed 8K JPEG",
      colorSpace: "ProPhoto RGB / DCI-P3",
      license: "Non-Exclusive Digital Rights Certificate included",
      delivery: "Instant Digital File Access Link"
    }
  },
  {
    id: "art-003",
    title: "Monochrome Geometry",
    shortDescription: "Architectural shadow art print exploring minimalist form and high contrast.",
    description: "Stripping away color reveals pure geometric elegance. Isolating dramatic light contours across structured architectural elements and interior gallery spaces.",
    image: "/artworks/art-003.jpg",
    width: 1200,
    height: 1500,
    price: 520,
    type: "Physical",
    category: "Physical Prints",
    availability: "Limited Edition (3/15)",
    quantity: 15,
    year: "2025",
    dimensions: "28 x 40 inches",
    options: [
      { id: "opt-mono-md", label: "20 x 28 in - Exhibition Matte", price: 380 },
      { id: "opt-mono-lg", label: "28 x 40 in - Museum Matte Fine Art", price: 520 },
      { id: "opt-mono-xl", label: "40 x 56 in - Metallic Collector Plate", price: 950 }
    ],
    specs: {
      paper: "Canson Infinity Baryta Prestige 340gsm",
      printing: "Epson UltraChrome Pro HD Monochromatic",
      signature: "Embossed Studio Seal & Signed Certificate",
      framing: "Custom Framed Option Available"
    }
  },
  {
    id: "art-004",
    title: "Velvet Horizon",
    shortDescription: "Cinematic art print in deep crimson hues and canvas texture.",
    description: "Rich textural depth meets editorial moodiness. Velvet Horizon balances abstract color fields with key lighting to create a timeless fine art piece for modern interiors.",
    image: "/artworks/art-004.jpg",
    width: 1200,
    height: 1600,
    price: 390,
    type: "Physical",
    category: "Physical Prints",
    availability: "In Stock",
    quantity: 50,
    year: "2024",
    dimensions: "24 x 32 inches",
    options: [
      { id: "opt-velvet-sm", label: "18 x 24 in - Archival Luster", price: 290 },
      { id: "opt-velvet-md", label: "24 x 32 in - Museum Fine Art Paper", price: 390 },
      { id: "opt-velvet-lg", label: "30 x 40 in - Stretched Fine Canvas", price: 620 }
    ],
    specs: {
      paper: "Epson Premium Luster Photo Paper",
      printing: "Archival Pigment Printing",
      signature: "Hand-signed on margin",
      framing: "Shipped in protective art tube"
    }
  },
  {
    id: "art-005",
    title: "Chiaroscuro Still Life",
    shortDescription: "Ultra High-Definition digital masterpiece fine-tuned for digital art collectors.",
    description: "Inspired by Renaissance chiaroscuro master painters, this digital artwork brings dramatic shadow and highlight techniques to a classical gallery presentation.",
    image: "/artworks/art-005.jpg",
    width: 1600,
    height: 1200,
    price: 240,
    type: "Digital",
    category: "Digital Prints",
    availability: "Instant Download",
    quantity: 999,
    year: "2025",
    dimensions: "9000 x 6750 px (9K Resolution)",
    options: [
      { id: "opt-chia-pers", label: "Collector Digital Package (JPG + Digital Certificate)", price: 240 },
      { id: "opt-chia-pro", label: "High-Res Master Package (16-bit Master TIFF)", price: 490 }
    ],
    specs: {
      format: "16-Bit TIFF & Ultra-HD JPEG",
      colorSpace: "Adobe RGB (1998)",
      license: "Personal & Private Gallery License",
      delivery: "Instant Download"
    }
  },
  {
    id: "art-006",
    title: "Golden Hour Symphony",
    shortDescription: "Warm ambient landscape art print captured in natural golden radiance.",
    description: "Sunlight cascades over organic textures in this warm fine art landscape print. Designed to evoke serenity, warmth, and quiet luxury in living spaces.",
    image: "/artworks/art-006.jpg",
    width: 1600,
    height: 1067,
    price: 490,
    type: "Physical",
    category: "Physical Prints",
    availability: "Limited Edition (2/20)",
    quantity: 20,
    year: "2024",
    dimensions: "24 x 36 inches",
    options: [
      { id: "opt-gold-sm", label: "16 x 24 in - Fine Art Matte", price: 340 },
      { id: "opt-gold-md", label: "24 x 36 in - Archival Rag Fine Art", price: 490 },
      { id: "opt-gold-lg", label: "36 x 54 in - Collector Floating Frame", price: 890 }
    ],
    specs: {
      paper: "Somerset Velvet Fine Art 310gsm",
      printing: "Museum Grade Pigment Inkjet",
      signature: "Hand-signed & numbered certificate",
      framing: "Unframed / Rolled"
    }
  },
  {
    id: "art-007",
    title: "Noir Whispers",
    shortDescription: "Moody monochrome print featuring minimalist high-contrast architectural structure.",
    description: "Noir Whispers explores the depth of darkness paired with subtle highlights across modern art forms. A striking centerpiece for minimalist interiors.",
    image: "/artworks/art-007.jpg",
    width: 1200,
    height: 1800,
    price: 360,
    type: "Physical",
    category: "Physical Prints",
    availability: "In Stock",
    quantity: 30,
    year: "2025",
    dimensions: "20 x 30 inches",
    options: [
      { id: "opt-noir-sm", label: "16 x 24 in - Exhibition Matte", price: 260 },
      { id: "opt-noir-md", label: "20 x 30 in - Baryta Satin Paper", price: 360 },
      { id: "opt-noir-lg", label: "28 x 42 in - Aluminium Dibond Mount", price: 680 }
    ],
    specs: {
      paper: "Hahnemühle Baryta FB 350gsm",
      printing: "B&W Carbon Pigment Ink",
      signature: "Hand-signed certificate included",
      framing: "Unframed"
    }
  },
  {
    id: "art-008",
    title: "Ethereal Mirage",
    shortDescription: "Ultra-wide digital print designed for immersive screen setups and digital frames.",
    description: "Soft atmospheric gradients and delicate detail merge in Ethereal Mirage. Formatted specifically for digital art collectors and smart canvas displays.",
    image: "/artworks/art-008.jpg",
    width: 1600,
    height: 900,
    price: 310,
    type: "Digital",
    category: "Digital Prints",
    availability: "Instant Download",
    quantity: 999,
    year: "2025",
    dimensions: "7680 x 4320 px (16:9 Ultra HD)",
    options: [
      { id: "opt-eth-pers", label: "Standard Digital License (4K + 8K JPG)", price: 310 },
      { id: "opt-eth-pro", label: "Master License (8K TIFF + Display Auth)", price: 580 }
    ],
    specs: {
      format: "8K Ultra-HD JPG / 16-Bit TIFF",
      colorSpace: "Display P3",
      license: "Non-exclusive Digital Display Rights",
      delivery: "Immediate download via secure token"
    }
  },
  {
    id: "art-009",
    title: "Solitude in Amber",
    shortDescription: "Fine art ceramic study with rich golden hour tones and organic textures.",
    description: "Capturing a reflective composition wrapped in amber sunlight, this piece blends tactile craft narrative with museum-grade archival printing.",
    image: "/artworks/art-009.jpg",
    width: 1200,
    height: 1600,
    price: 480,
    type: "Physical",
    category: "Physical Prints",
    availability: "Limited Edition (5/20)",
    quantity: 20,
    year: "2025",
    dimensions: "24 x 36 inches",
    options: [
      { id: "opt-sol-sm", label: "16 x 24 in - Fine Art Matte", price: 350 },
      { id: "opt-sol-md", label: "24 x 36 in - Hahnemühle Bamboo 290gsm", price: 480 },
      { id: "opt-sol-lg", label: "32 x 48 in - Floating Frame Canvas", price: 820 }
    ],
    specs: {
      paper: "Hahnemühle Bamboo Eco-FineArt 290gsm",
      printing: "Pigment Archival Print",
      signature: "Hand-signed & embossed by G. Venketram",
      framing: "Unframed / Collector Tube"
    }
  },
  {
    id: "art-010",
    title: "Prism & Marble",
    shortDescription: "High-resolution digital abstract study exploring refraction and fluid geometric symmetry.",
    description: "An architectural exploration of light refraction on polished marble surfaces. A clean digital master print for modern office and gallery spaces.",
    image: "/artworks/art-010.jpg",
    width: 1600,
    height: 1200,
    price: 260,
    type: "Digital",
    category: "Digital Prints",
    availability: "Instant Download",
    quantity: 999,
    year: "2024",
    dimensions: "8000 x 6000 px (48 MP Digital Master)",
    options: [
      { id: "opt-prism-pers", label: "Personal Display File (High-Res JPG)", price: 260 },
      { id: "opt-prism-comm", label: "Architectural License (16-Bit RAW TIFF)", price: 540 }
    ],
    specs: {
      format: "16-Bit Uncompressed TIFF & 8K JPEG",
      colorSpace: "Adobe RGB (1998)",
      license: "Commercial / Personal Display License",
      delivery: "Instant Digital File Access Link"
    }
  },
  {
    id: "art-011",
    title: "Symphony of Silk",
    shortDescription: "High-fashion textile fine art print emphasizing fluid movement and rich woven layers.",
    description: "Sculptural fabric dynamics in motion. Symphony of Silk captures flowing waves of crimson silk in vibrant detail.",
    image: "/artworks/art-011.jpg",
    width: 1200,
    height: 1500,
    price: 560,
    type: "Physical",
    category: "Physical Prints",
    availability: "Limited Edition (2/10)",
    quantity: 10,
    year: "2025",
    dimensions: "30 x 40 inches",
    options: [
      { id: "opt-silk-sm", label: "20 x 28 in - Archival Cotton Rag", price: 420 },
      { id: "opt-silk-md", label: "30 x 40 in - Gallery Metallic Print", price: 560 },
      { id: "opt-silk-lg", label: "40 x 54 in - Acrylic Glass Mount", price: 1100 }
    ],
    specs: {
      paper: "Canson Infinity Rag Photologique 310gsm",
      printing: "Epson UltraChrome HDX 10-Color Pigment",
      signature: "Hand-signed with numbered studio seal",
      framing: "Unframed"
    }
  },
  {
    id: "art-012",
    title: "Echoes of Antiquity",
    shortDescription: "Classical gallery artwork frame inspired by ancient temple motifs.",
    description: "Echoes of Antiquity bridges heritage craftsmanship with contemporary fine art photography. Featuring rich muted undertones and intricate traditional details.",
    image: "/artworks/art-012.jpg",
    width: 1200,
    height: 1600,
    price: 640,
    type: "Physical",
    category: "Physical Prints",
    availability: "Collector Edition (1/5)",
    quantity: 5,
    year: "2025",
    dimensions: "32 x 48 inches",
    options: [
      { id: "opt-echo-md", label: "24 x 36 in - Fine Art Matte", price: 490 },
      { id: "opt-echo-lg", label: "32 x 48 in - Museum Archival Print", price: 640 },
      { id: "opt-echo-xl", label: "40 x 60 in - Hand-framed Master Piece", price: 1350 }
    ],
    specs: {
      paper: "Hahnemühle Museum Etching 350gsm",
      printing: "Pigment Archival Print",
      signature: "Hand-signed certificate of authenticity",
      framing: "Unframed"
    }
  },
  {
    id: "art-013",
    title: "Nebula Dreams",
    shortDescription: "Digital cosmic atmosphere masterpiece for digital frame installations.",
    description: "Deep indigo and violet light hues intermingle to form a dreamlike cosmic visual piece. Ideal for ambient high-end screen displays.",
    image: "/artworks/art-013.jpg",
    width: 1600,
    height: 900,
    price: 320,
    type: "Digital",
    category: "Digital Prints",
    availability: "Instant Download",
    quantity: 999,
    year: "2025",
    dimensions: "7680 x 4320 px (8K UHD)",
    options: [
      { id: "opt-neb-pers", label: "Collector Digital Pack (8K JPEG)", price: 320 },
      { id: "opt-neb-pro", label: "Master Digital License (RAW + TIFF)", price: 620 }
    ],
    specs: {
      format: "16-Bit TIFF & Uncompressed JPEG",
      colorSpace: "DCI-P3 / Wide Gamut",
      license: "Non-exclusive Digital Display Rights",
      delivery: "Instant File Access"
    }
  },
  {
    id: "art-014",
    title: "Terracotta Silence",
    shortDescription: "Warm earthen ceramic fine art print featuring warm clay and shadow balance.",
    description: "Earthen tones of terracotta paired with stark shadow lines create a soothing, grounded aesthetic suited for luxury residential interior spaces.",
    image: "/artworks/art-014.jpg",
    width: 1200,
    height: 1600,
    price: 410,
    type: "Physical",
    category: "Physical Prints",
    availability: "In Stock",
    quantity: 40,
    year: "2024",
    dimensions: "24 x 36 inches",
    options: [
      { id: "opt-terra-sm", label: "18 x 24 in - Exhibition Satin", price: 310 },
      { id: "opt-terra-md", label: "24 x 36 in - Museum Smooth Fine Art", price: 410 },
      { id: "opt-terra-lg", label: "30 x 45 in - Canvas Wrap", price: 690 }
    ],
    specs: {
      paper: "Hahnemühle Photo Rag Ultra Smooth 305gsm",
      printing: "Epson UltraChrome HD Pigment",
      signature: "Hand-signed by G. Venketram",
      framing: "Unframed"
    }
  },
  {
    id: "art-015",
    title: "Minimalist Horizon",
    shortDescription: "Subtle horizon landscape with expansive atmosphere and soft pastel gradient.",
    description: "A meditation on space and stillness. Minimalist Horizon uses subtle pastel sky gradients to create an expansive sense of peace.",
    image: "/artworks/art-015.jpg",
    width: 1600,
    height: 1067,
    price: 390,
    type: "Physical",
    category: "Physical Prints",
    availability: "In Stock",
    quantity: 35,
    year: "2024",
    dimensions: "24 x 36 inches",
    options: [
      { id: "opt-[#1c1a17]-sm", label: "16 x 24 in - Archival Matte", price: 290 },
      { id: "opt-[#1c1a17]-md", label: "24 x 36 in - Fine Art Rag", price: 390 },
      { id: "opt-[#1c1a17]-lg", label: "36 x 54 in - Aluminium Mounted", price: 790 }
    ],
    specs: {
      paper: "Somerset Velvet 310gsm",
      printing: "Archival Pigment Printing",
      signature: "Hand-signed certificate",
      framing: "Unframed / Rolled"
    }
  },
  {
    id: "art-016",
    title: "Opulent Golden Tapestry",
    shortDescription: "Ultra High-Definition fine art piece featuring framed golden masterwork.",
    description: "Detailed macro view of handcrafted golden accents and fine art frame detail. Captured with precision optics to reveal rich light luminescence.",
    image: "/artworks/art-016.jpg",
    width: 1200,
    height: 1600,
    price: 290,
    type: "Digital",
    category: "Digital Prints",
    availability: "Instant Download",
    quantity: 999,
    year: "2025",
    dimensions: "8000 x 6000 px (8K Resolution)",
    options: [
      { id: "opt-op-pers", label: "Personal Display Digital File", price: 290 },
      { id: "opt-op-pro", label: "Master Commercial File (16-Bit TIFF)", price: 580 }
    ],
    specs: {
      format: "16-Bit TIFF & Uncompressed JPEG",
      colorSpace: "ProPhoto RGB",
      license: "Digital Rights Certificate Included",
      delivery: "Instant Download"
    }
  },
  {
    id: "art-017",
    title: "Prismatic Waves",
    shortDescription: "Vibrant gradient waves forming dynamic abstract visual poetry for digital frames.",
    description: "Fluid spectrum interplay designed for modern ambient display. Formatted in high-bit depth color gamut for premium digital canvases.",
    image: "/artworks/art-017.jpg",
    width: 1600,
    height: 1067,
    price: 340,
    type: "Digital",
    category: "Digital Prints",
    availability: "Instant Download",
    quantity: 999,
    year: "2025",
    dimensions: "8192 x 5461 px (8K UHD)",
    options: [
      { id: "opt-prismw-1", label: "Standard Digital File (8K JPG)", price: 340 },
      { id: "opt-prismw-2", label: "Master Display Pack (16-Bit TIFF)", price: 640 }
    ],
    specs: {
      format: "16-Bit TIFF & Uncompressed 8K JPEG",
      colorSpace: "Display P3 / Adobe RGB",
      license: "Personal & Private Gallery License",
      delivery: "Instant File Access"
    }
  },
  {
    id: "art-018",
    title: "Verdant Echoes",
    shortDescription: "Botanical museum print exploring lush organic forms and textured paper grain.",
    description: "Archival fine art print celebrating natural botanical forms. Printed on heavy cotton rag paper to preserve delicate green tones.",
    image: "/artworks/art-018.jpg",
    width: 1200,
    height: 1600,
    price: 420,
    type: "Physical",
    category: "Physical Prints",
    availability: "In Stock",
    quantity: 30,
    year: "2025",
    dimensions: "24 x 36 inches",
    options: [
      { id: "opt-verd-1", label: "16 x 24 in - Fine Art Matte", price: 310 },
      { id: "opt-verd-2", label: "24 x 36 in - Archival Hahnemühle", price: 420 },
      { id: "opt-verd-3", label: "32 x 48 in - Floating Canvas Frame", price: 790 }
    ],
    specs: {
      paper: "Hahnemühle German Etching 310gsm",
      printing: "Pigment Archival Print",
      signature: "Hand-signed & numbered certificate",
      framing: "Unframed / Rolled Tube"
    }
  },
  {
    id: "art-019",
    title: "Azure Modernism",
    shortDescription: "Bold expressionist oil on canvas print with deep lapis and cobalt tones.",
    description: "Dynamic blue strokes merge with structural geometry. A dramatic focal artwork for residential living rooms and executive suites.",
    image: "/artworks/art-019.jpg",
    width: 1200,
    height: 1600,
    price: 510,
    type: "Physical",
    category: "Physical Prints",
    availability: "Limited Edition (4/15)",
    quantity: 15,
    year: "2025",
    dimensions: "28 x 40 inches",
    options: [
      { id: "opt-azur-1", label: "20 x 28 in - Exhibition Cotton", price: 380 },
      { id: "opt-azur-2", label: "28 x 40 in - Museum Rag Paper", price: 510 },
      { id: "opt-azur-3", label: "36 x 52 in - Stretched Gallery Canvas", price: 920 }
    ],
    specs: {
      paper: "Somerset Velvet Fine Art 310gsm",
      printing: "Epson UltraChrome HDX 10-Color Pigment",
      signature: "Hand-signed with studio seal",
      framing: "Unframed"
    }
  },
  {
    id: "art-020",
    title: "Pastel Reverie",
    shortDescription: "Soft atmospheric color study designed for ambient high-definition digital displays.",
    description: "Gently blending blush, cream, and sky hues to create a calming spatial atmosphere in contemporary spaces.",
    image: "/artworks/art-020.jpg",
    width: 1600,
    height: 1067,
    price: 270,
    type: "Digital",
    category: "Digital Prints",
    availability: "Instant Download",
    quantity: 999,
    year: "2024",
    dimensions: "7680 x 4320 px (8K UHD)",
    options: [
      { id: "opt-pas-1", label: "Personal Display Pack (JPG)", price: 270 },
      { id: "opt-pas-2", label: "Commercial Architectural Rights", price: 560 }
    ],
    specs: {
      format: "16-Bit TIFF & 8K JPEG",
      colorSpace: "sRGB / DCI-P3",
      license: "Non-Exclusive Digital Rights",
      delivery: "Instant Link"
    }
  },
  {
    id: "art-021",
    title: "Luminous Atelier",
    shortDescription: "Archival pigment print capturing classical artist palette textures and pigments.",
    description: "Close-up textural exploration of raw paint pigments and oil mediums. Printed with ultra-fine pigment ink for lifetime color fidelity.",
    image: "/artworks/art-021.jpg",
    width: 1200,
    height: 1600,
    price: 460,
    type: "Physical",
    category: "Physical Prints",
    availability: "In Stock",
    quantity: 25,
    year: "2025",
    dimensions: "24 x 36 inches",
    options: [
      { id: "opt-lum-1", label: "18 x 24 in - Exhibition Matte", price: 340 },
      { id: "opt-lum-2", label: "24 x 36 in - Fine Art Cotton Rag", price: 460 },
      { id: "opt-lum-3", label: "30 x 45 in - Metal Sublimation Plate", price: 830 }
    ],
    specs: {
      paper: "Canson Infinity Rag Photologique 310gsm",
      printing: "Archival Pigment Printing",
      signature: "Hand-signed & numbered certificate",
      framing: "Unframed"
    }
  },
  {
    id: "art-022",
    title: "Minimalist Solitude",
    shortDescription: "Clean monochromatic wall art print with fine art matte finish.",
    description: "Quiet spatial geometry isolating light, shadow, and architectural silence. Designed for minimalist modern interior collectors.",
    image: "/artworks/art-022.jpg",
    width: 1200,
    height: 1600,
    price: 380,
    type: "Physical",
    category: "Physical Prints",
    availability: "In Stock",
    quantity: 40,
    year: "2024",
    dimensions: "20 x 30 inches",
    options: [
      { id: "opt-min-1", label: "16 x 24 in - Archival Smooth", price: 280 },
      { id: "opt-min-2", label: "20 x 30 in - Museum Matte Paper", price: 380 },
      { id: "opt-min-3", label: "28 x 42 in - Aluminum Mounted", price: 690 }
    ],
    specs: {
      paper: "Hahnemühle Photo Rag Ultra Smooth 305gsm",
      printing: "Carbon Monochromatic Pigment",
      signature: "Hand-signed certificate",
      framing: "Unframed"
    }
  },
  {
    id: "art-023",
    title: "Spectral Canvas",
    shortDescription: "Ultra HD 8K digital masterpiece celebrating fluid art motion and light.",
    description: "Complex light caustics and fluid color dynamics frozen in microscopic detail. Formatted for high-end digital galleries and ultra-large displays.",
    image: "/artworks/art-023.jpg",
    width: 1600,
    height: 1067,
    price: 330,
    type: "Digital",
    category: "Digital Prints",
    availability: "Instant Download",
    quantity: 999,
    year: "2025",
    dimensions: "8192 x 5461 px (8K Native)",
    options: [
      { id: "opt-spec-1", label: "Collector Digital Package (JPG)", price: 330 },
      { id: "opt-spec-2", label: "Exclusive Master Package (RAW + TIFF)", price: 670 }
    ],
    specs: {
      format: "16-Bit Master TIFF & 8K JPEG",
      colorSpace: "ProPhoto RGB",
      license: "Digital Display Rights Certificate",
      delivery: "Instant Download"
    }
  },
  {
    id: "art-024",
    title: "Chrono Spectrum",
    shortDescription: "Geometric digital art print rendered for luxury home wall screens and collectors.",
    description: "Precision light geometry and prismatic color field study. Perfect companion artwork for multi-screen art setups.",
    image: "/artworks/art-024.jpg",
    width: 1600,
    height: 1067,
    price: 295,
    type: "Digital",
    category: "Digital Prints",
    availability: "Instant Download",
    quantity: 999,
    year: "2025",
    dimensions: "7680 x 4320 px (8K UHD)",
    options: [
      { id: "opt-chrono-1", label: "Standard Digital File", price: 295 },
      { id: "opt-chrono-2", label: "Commercial Architectural License", price: 590 }
    ],
    specs: {
      format: "16-Bit TIFF & Uncompressed JPEG",
      colorSpace: "Display P3",
      license: "Non-Exclusive License Included",
      delivery: "Instant Download"
    }
  }
];

export let artworksData = [...initialArtworksData];

export function getArtworks(category = "All", type = "All") {
  return artworksData.filter((art) => {
    const matchesCategory = category === "All" || art.category === category || (category === "Art" && art.category.includes("Art"));
    const matchesType = type === "All" || art.type === type;
    return matchesCategory && matchesType;
  });
}

export function getArtworkById(id) {
  return artworksData.find((art) => art.id === id) || null;
}

export function updateArtworksState(newList) {
  artworksData = newList;
}
