export const ARTWORK_CATEGORIES = [
  "All",
  "Art",
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
    shortDescription: "Curated fine art portrait highlighting warm bronze tones and dramatic shadows.",
    description: "An evocative study in texture, shadow, and golden illumination. Captured on medium format digital, this limited edition print explores the fluid boundary between classical portrait sculpture and high-fashion visual story.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85",
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
    shortDescription: "High-resolution digital master file with commercial display licensing.",
    description: "An ethereal interplay of light and chiffon. Designed as a high-resolution digital artwork suitable for ultra-HD luxury digital displays, architectural projections, or custom collector printing.",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=85",
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
    shortDescription: "Architectural shadow portrait exploring minimalist form and contrast.",
    description: "Stripping away color reveals pure geometric elegance. Captured in museum-grade black and white, this photograph isolates dramatic light contours across structured architectural elements.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    width: 1200,
    height: 1500,
    price: 520,
    type: "Physical",
    category: "Art",
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
    shortDescription: "Cinematic mood study in deep crimson and velvet shadows.",
    description: "Rich textural depth meets editorial moodiness. Velvet Horizon balances soft tactile fabrics with precise key lighting to create a timeless fine art piece for modern interiors.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
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
    title: "Chiaroscuro Muse",
    shortDescription: "Ultra High-Definition digital masterpiece fine-tuned for digital art collectors.",
    description: "Inspired by Renaissance chiaroscuro master painters, this digital artwork brings dramatic lighting techniques into the contemporary fashion photograph medium.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=85",
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
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85",
    width: 1600,
    height: 1067,
    price: 490,
    type: "Physical",
    category: "Art",
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
    shortDescription: "Moody monochrome print featuring minimalist high-contrast silhouette.",
    description: "Noir Whispers explores the depth of darkness paired with subtle highlights. A striking centerpiece for minimalist modern interiors.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85",
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
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85",
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
    shortDescription: "Warm portrait photograph with rich golden hour tones and organic textures.",
    description: "Capturing a reflective moment wrapped in amber sunlight, this piece blends emotional narrative with museum-grade archival printing.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85",
    width: 1200,
    height: 1600,
    price: 480,
    type: "Physical",
    category: "Art",
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
    shortDescription: "High-resolution digital abstract study exploring refraction and geometric symmetry.",
    description: "An architectural exploration of light refraction on polished marble surfaces. A clean digital master print for modern office and gallery spaces.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85",
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
    shortDescription: "High-fashion fine art print emphasizing fluid movement and rich textiles.",
    description: "Sculptural fabric dynamics in motion. Captured using high-speed flash duration, Symphony of Silk captures frozen waves of crimson silk.",
    image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85",
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
    shortDescription: "Classical fine art portrait inspired by ancient temple motifs.",
    description: "Echoes of Antiquity bridges heritage craftsmanship with contemporary fine art photography. Featuring rich muted undertones and intricate traditional adornments.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    width: 1200,
    height: 1600,
    price: 640,
    type: "Physical",
    category: "Art",
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
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85",
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
    shortDescription: "Warm earthen minimalist fine art print featuring warm clay and shadow balance.",
    description: "Earthen tones of terracotta paired with stark shadow lines create a soothing, grounded aesthetic suited for luxury residential interior spaces.",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=85",
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
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=85",
    width: 1600,
    height: 1067,
    price: 390,
    type: "Physical",
    category: "Art",
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
    title: "Opulent Drape",
    shortDescription: "Ultra High-Definition fashion art piece featuring intricate golden embroidery.",
    description: "Detailed macro view of handcrafted golden embroidery and jewel accents. Captured with precision macro optics to reveal every thread texture.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
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
