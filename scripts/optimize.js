const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const FILES_DIR = path.join(BASE_DIR, 'files');
const PUBLIC_PORTFOLIO_DIR = path.join(BASE_DIR, 'public', 'portfolio');
const DATA_FILE = path.join(BASE_DIR, 'src', 'data', 'portfolio.js');

const CATEGORIES_MAPPING = [
  {
    folder: 'TransferNow-G Venket Ram - Advertising',
    categoryName: 'Advertising',
    slugDir: 'advertising',
  },
  {
    folder: 'TransferNow-G Venket Ram - Fashion',
    categoryName: 'Fashion',
    slugDir: 'fashion',
  },
  {
    folder: 'TransferNow-G Venket Ram - Jewellery & Sari',
    categoryName: 'Jewellery',
    slugDir: 'jewellery',
  },
];

const STATIC_CATEGORIES_DATA = [
  {
    category: "Art",
    images: [
      {
        src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "Creation Flow",
        description: "Candid capturing of fine art process, pigment blending, and motion."
      },
      {
        src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80",
        width: 1200,
        height: 1600,
        title: "Floral Impasto",
        description: "Textured acrylic canvases showcasing heavy palette knife strokes and warm tones."
      },
      {
        src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "Polychrome Chaos",
        description: "Vibrant abstract studio experimentation with fluid paint and color splatters."
      },
      {
        src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "Fluidity in Stone",
        description: "Abstract digital art exploring liquid marble and swirling high-contrast lines."
      }
    ]
  },
  {
    category: "Food",
    images: [
      {
        src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "Garden Abundance",
        description: "Healthy salad bowl plating focusing on fresh colors, gradients, and microgreens."
      },
      {
        src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80",
        width: 1200,
        height: 1500,
        title: "Neapolitan Hearth",
        description: "Gourmet woodfired pizza capturing stretching cheese and bubbly leopard crust."
      },
      {
        src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "Al Dente Craft",
        description: "Minimalist Italian pasta styling with fresh herbs and a drizzle of premium olive oil."
      },
      {
        src: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "The Artisanal Stack",
        description: "Cross-section food photography highlighting textures of fresh layers and bread crust."
      }
    ]
  },
  {
    category: "Movies",
    images: [
      {
        src: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1000,
        title: "The Silver Screen",
        description: "Dramatic cinematic photo of a silent retro theatre hall before the premiere."
      },
      {
        src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1100,
        title: "Production Eye",
        description: "Industrial cinematography gear set up on location under dramatic spotlighting."
      },
      {
        src: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80",
        width: 1200,
        height: 1600,
        title: "Neon Cinema",
        description: "Moody vintage theatre neon signage casting red reflections in the evening rain."
      },
      {
        src: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "Scene Take",
        description: "Behind-the-scenes movie slate in focus with soft blurred studio rigs."
      }
    ]
  },
  {
    category: "Travel",
    images: [
      {
        src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "Alpine Calm",
        description: "Rustic wooden boat floating on a crystal clear emerald lake in the Alps."
      },
      {
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1000,
        title: "Pacific Shoreline",
        description: "Vibrant and calm tropical beach sunset featuring pristine shorelines and soft tide lines."
      },
      {
        src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "Canyon Wanderer",
        description: "Atmospheric road trip capture framing red rock formations and long highways."
      },
      {
        src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "Cartography & Soul",
        description: "A vintage desk set up with maps, leather journal, and passport detailing plans."
      }
    ]
  },
  {
    category: "Calendar",
    images: [
      {
        src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1200,
        title: "Spring Awakening",
        description: "Spectacular valleys surrounded by high peaks and wildflowers under soft morning light."
      },
      {
        src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1100,
        title: "October Canopy",
        description: "Golden autumn forest path highlighting falling orange leaves and soft sun rays."
      },
      {
        src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
        width: 1600,
        height: 1100,
        title: "Ethereal Mist",
        description: "Summertime foggy morning views across rolling green hills and pine forests."
      },
      {
        src: "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80",
        width: 1200,
        height: 1600,
        title: "Kyoto Snowfall",
        description: "Winter snow falling silently on historic wooden buildings and warm street lanterns."
      }
    ]
  },
  {
    category: "Personalities",
    images: [
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        width: 1200,
        height: 1500,
        title: "The Visionary",
        description: "Expressive studio portrait focusing on depth of character, lighting details, and expression."
      },
      {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
        width: 1200,
        height: 1600,
        title: "Luminous Spirit",
        description: "Warm, natural-light lifestyle portrait showcasing joy, movement, and genuine personality."
      },
      {
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
        width: 1200,
        height: 1500,
        title: "Silent Resolve",
        description: "Moody, high-contrast studio portrait exploring subtle angles and shadow play."
      },
      {
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
        width: 1200,
        height: 1600,
        title: "Introspective",
        description: "Editorial portrait using soft shadows and styling to highlight expressive features."
      }
    ]
  }
];

function cleanTitle(filename) {
  let name = path.parse(filename).name;
  
  // Remove dates like 26.10.2024, 02.03.18, 16.06.24, 2025-02-20
  name = name.replace(/\b\d{1,4}[.\/-]\d{1,2}[.\/-]\d{1,4}\b/g, '');
  
  // Remove common camera/batch junk terms
  name = name.replace(/\b(copy|final|fin|low|bg|f|ff|fff|hdr|print|calendar|insta|twitter|vertical|horizontal|header|post|creative|ad|advt|editorial|dentsu|disha|gvenketram)\b/gi, '');
  
  // Remove numbers that look like codes or indices at start or end
  name = name.replace(/^[\d_\-\s]+/, '');
  name = name.replace(/[\d_\-\s]+$/, '');
  
  // Replace underscores and hyphens with spaces
  name = name.replace(/[_]+/g, ' ').replace(/[-]+/g, ' ');
  
  // Replace multiple spaces with single space
  name = name.replace(/\s+/g, ' ').trim();
  
  if (!name || name.length < 2) {
    name = path.parse(filename).name.replace(/[_.\-]/g, ' ').trim();
  }
  
  // Capitalize title
  return name.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function processImages() {
  const sharp = require('sharp');
  console.log('Starting High Quality 4K Image Optimization (95% quality)...');
  const portfolioData = [];

  for (const item of CATEGORIES_MAPPING) {
    const srcFolderPath = path.join(FILES_DIR, item.folder);
    const destFolderPath = path.join(PUBLIC_PORTFOLIO_DIR, item.slugDir);

    if (!fs.existsSync(destFolderPath)) {
      fs.mkdirSync(destFolderPath, { recursive: true });
    }

    if (!fs.existsSync(srcFolderPath)) {
      console.warn(`Source folder does not exist: ${srcFolderPath}`);
      continue;
    }

    const files = fs.readdirSync(srcFolderPath);
    const categoryImages = [];
    const usedSlugs = new Set();

    console.log(`Processing category: ${item.categoryName} (${files.length} potential files)`);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.tif', '.tiff'].includes(ext)) {
        continue;
      }

      const inputFilePath = path.join(srcFolderPath, file);
      const rawTitle = cleanTitle(file);
      let slug = slugify(path.parse(file).name) || 'image';

      let counter = 1;
      let uniqueSlug = slug;
      while (usedSlugs.has(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      usedSlugs.add(uniqueSlug);

      const outputFileName = `${uniqueSlug}.webp`;
      const outputFilePath = path.join(destFolderPath, outputFileName);
      const webpPublicPath = `/portfolio/${item.slugDir}/${outputFileName}`;

      try {
        console.log(`  Optimizing (Ultra 4K 95% Q): ${file} -> ${outputFileName}`);
        
        // Use Sharp to process image
        const image = sharp(inputFilePath);
        const metadata = await image.metadata();

        // Limit maximum dimensions to 3840px (4K resolution ultra high fidelity)
        let pipeline = image.rotate(); // auto-rotate EXIF
        if ((metadata.width && metadata.width > 3840) || (metadata.height && metadata.height > 3840)) {
          pipeline = pipeline.resize(3840, 3840, {
            fit: 'inside',
            withoutEnlargement: true,
          });
        }

        // Convert to webp with 95% quality for pristine clarity (~75% size reduction target)
        await pipeline
          .webp({ quality: 95, effort: 4 })
          .toFile(outputFilePath);

        // Get processed metadata
        const processedMeta = await sharp(outputFilePath).metadata();

        categoryImages.push({
          src: webpPublicPath,
          width: processedMeta.width || 1200,
          height: processedMeta.height || 1600,
          title: rawTitle,
          description: `Editorial photography for ${item.categoryName} by G Venket Ram.`,
        });
      } catch (err) {
        console.error(`  Failed to process ${file}:`, err.message);
      }
    }

    portfolioData.push({
      category: item.categoryName,
      images: categoryImages,
    });
  }

  // Append static categories (Art, Food, Movies, Travel, Calendar, Personalities)
  for (const staticCat of STATIC_CATEGORIES_DATA) {
    portfolioData.push(staticCat);
  }

  const allCategories = [
    "Advertising",
    "Fashion",
    "Jewellery",
    "Art",
    "Food",
    "Movies",
    "Travel",
    "Calendar",
    "Personalities"
  ];

  // Write updated data to portfolio.js
  const jsContent = `export const PORTFOLIO_CATEGORIES = ${JSON.stringify(allCategories, null, 2)};

export const portfolioData = ${JSON.stringify(portfolioData, null, 2)};
`;

  fs.writeFileSync(DATA_FILE, jsContent, 'utf8');
  console.log(`\nSuccessfully updated ${DATA_FILE}`);
  console.log('High Quality Image optimization complete!');
}

processImages().catch(err => console.error('Error in optimization script:', err));
