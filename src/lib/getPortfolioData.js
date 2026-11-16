import { cacheLife, cacheTag } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import cloudinaryFallback from "@/data/cloudinaryFallback.json";

export const DEFAULT_CATEGORIES = [
  "All",
  "Advertising",
  "Fashion",
  "Jewellery",
  "Art",
  "Food",
  "Movies",
  "Bare",
  "Calendar",
  "Personalities",
];

export const PORTFOLIO_IMAGE_COLUMNS =
  "id, src, width, height, title, description, category_name, display_order";

function getFallbackCategories() {
  const rows = cloudinaryFallback?.tables?.categories;
  if (Array.isArray(rows) && rows.length > 0) {
    const sorted = [...rows].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const names = sorted.map((c) => c.name).filter(Boolean);
    const withoutAll = names.filter((n) => n.toLowerCase() !== "all");
    return ["All", ...withoutAll];
  }
  return DEFAULT_CATEGORIES;
}

export function getFallbackPortfolioImages() {
  const rows = cloudinaryFallback?.tables?.portfolio_images;
  if (Array.isArray(rows) && rows.length > 0) {
    return [...rows].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }
  return [];
}

function mapPortfolioImage(img, idx, categoryOverride) {
  return {
    id: img.id,
    src: img.src,
    width: img.width || 1600,
    height: img.height || 1200,
    title: img.title || "Untitled",
    description: img.description || "",
    category: categoryOverride || img.category_name,
    display_order: img.display_order ?? idx + 1,
    position_num: img.display_order ?? idx + 1,
  };
}

export async function getPortfolioCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("portfolio-categories");
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("categories")
        .select("name, display_order")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        const names = data.map((c) => c.name).filter(Boolean);
        const withoutAll = names.filter((n) => n.toLowerCase() !== "all");
        return ["All", ...withoutAll];
      }
    }
  } catch (err) {
    console.error("Error fetching getPortfolioCategories from Supabase:", err);
  }
  return getFallbackCategories();
}

export async function getPortfolioImages(category) {
  "use cache";
  const normalizedCategory = (category || "").toLowerCase();
  cacheLife("hours");
  cacheTag("portfolio-images", `portfolio-category-${normalizedCategory}`);
  try {
    if (isSupabaseConfigured && supabase) {
      const categories = await getPortfolioCategories();
      const matchedCategory =
        categories.find((c) => c.toLowerCase() === normalizedCategory) || category;

      const { data, error } = await supabase
        .from("portfolio_images")
        .select(PORTFOLIO_IMAGE_COLUMNS)
        .ilike("category_name", matchedCategory)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((img, idx) => mapPortfolioImage(img, idx));
      }
    }
  } catch (err) {
    console.error("Error fetching getPortfolioImages from Supabase:", err);
  }

  // Fallback to Cloudinary snapshot when Supabase is unavailable/restricted
  const fallbackImages = getFallbackPortfolioImages();
  return fallbackImages
    .filter((img) => img.category_name && img.category_name.toLowerCase() === normalizedCategory)
    .map((img, idx) => mapPortfolioImage(img, idx));
}

export async function getPortfolioData() {
  "use cache";
  cacheLife("hours");
  cacheTag("portfolio-images", "portfolio-categories");
  try {
    if (isSupabaseConfigured && supabase) {
      const categories = await getPortfolioCategories();

      const { data: dbImages, error } = await supabase
        .from("portfolio_images")
        .select(PORTFOLIO_IMAGE_COLUMNS)
        .order("display_order", { ascending: true });

      if (!error && dbImages && dbImages.length > 0) {
        const grouped = categories.map((catName) => ({
          category: catName,
          images: dbImages
            .filter(
              (img) =>
                img.category_name &&
                img.category_name.toLowerCase() === catName.toLowerCase()
            )
            .map((img, idx) => mapPortfolioImage(img, idx, catName)),
        }));

        return {
          categories,
          portfolioData: grouped,
        };
      }
    }
  } catch (err) {
    console.error("Error fetching getPortfolioData from Supabase:", err);
  }

  // Fallback to Cloudinary snapshot when Supabase is unavailable/restricted
  const fallbackCategories = getFallbackCategories();
  const fallbackImages = getFallbackPortfolioImages();
  const groupedFallback = fallbackCategories.map((catName) => ({
    category: catName,
    images: fallbackImages
      .filter(
        (img) =>
          img.category_name &&
          img.category_name.toLowerCase() === catName.toLowerCase()
      )
      .map((img, idx) => mapPortfolioImage(img, idx, catName)),
  }));

  return {
    categories: fallbackCategories,
    portfolioData: groupedFallback,
  };
}
