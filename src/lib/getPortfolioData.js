import { cacheLife, cacheTag } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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
  return DEFAULT_CATEGORIES;
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

      if (!error && data) {
        return data.map((img, idx) => ({
          id: img.id,
          src: img.src,
          width: img.width || 1600,
          height: img.height || 1200,
          title: img.title || "Untitled",
          description: img.description || "",
          category: img.category_name,
          display_order: img.display_order ?? idx + 1,
          position_num: img.display_order ?? idx + 1,
        }));
      }
    }
  } catch (err) {
    console.error("Error fetching getPortfolioImages from Supabase:", err);
  }
  return [];
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

      if (!error && dbImages) {
        const grouped = categories.map((catName) => ({
          category: catName,
          images: dbImages
            .filter((img) => img.category_name && img.category_name.toLowerCase() === catName.toLowerCase())
            .map((img, idx) => ({
              id: img.id,
              src: img.src,
              width: img.width || 1600,
              height: img.height || 1200,
              title: img.title || "Untitled",
              description: img.description || "",
              category: catName,
              display_order: img.display_order ?? idx + 1,
              position_num: img.display_order ?? idx + 1,
            })),
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

  return {
    categories: DEFAULT_CATEGORIES,
    portfolioData: DEFAULT_CATEGORIES.map((cat) => ({ category: cat, images: [] })),
  };
}
