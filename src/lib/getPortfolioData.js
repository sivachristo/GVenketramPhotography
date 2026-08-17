import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { portfolioData, PORTFOLIO_CATEGORIES } from "@/data/portfolio";

export async function getPortfolioCategories() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((c) => c.name);
      }
    }
  } catch (err) {
    console.warn("Supabase getPortfolioCategories fallback:", err.message);
  }
  return PORTFOLIO_CATEGORIES;
}

export async function getPortfolioImages(category) {
  try {
    if (isSupabaseConfigured && supabase) {
      // Get categories to find exact case-matched category name
      const categories = await getPortfolioCategories();
      const matchedCategory = categories.find(
        (c) => c.toLowerCase() === category.toLowerCase()
      ) || category;

      // Query PostgreSQL database ONLY for rows matching this category_name
      const { data, error } = await supabase
        .from("portfolio_images")
        .select("*")
        .eq("category_name", matchedCategory)
        .order("display_order", { ascending: true });

      if (!error && data) {
        return data.map((img) => ({
          src: img.src,
          width: img.width || 1600,
          height: img.height || 1200,
          title: img.title || "Untitled",
          description: img.description || "",
          category: img.category_name,
        }));
      }
    }
  } catch (err) {
    console.warn("Supabase getPortfolioImages fallback:", err.message);
  }

  // Fallback to local portfolio.js filtering
  const matchingData = portfolioData.find(
    (cat) => cat.category.toLowerCase() === category.toLowerCase()
  );

  if (!matchingData) return [];

  return matchingData.images.map((img) => ({
    ...img,
    category: matchingData.category,
  }));
}

export async function getPortfolioData() {
  try {
    if (isSupabaseConfigured && supabase) {
      const categories = await getPortfolioCategories();

      const { data: dbImages, error } = await supabase
        .from("portfolio_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && dbImages) {
        const grouped = categories.map((catName) => ({
          category: catName,
          images: dbImages
            .filter((img) => img.category_name === catName)
            .map((img) => ({
              src: img.src,
              width: img.width || 1600,
              height: img.height || 1200,
              title: img.title || "Untitled",
              description: img.description || "",
              category: catName,
            })),
        }));

        return {
          categories,
          portfolioData: grouped,
        };
      }
    }
  } catch (err) {
    console.warn("Supabase getPortfolioData fallback:", err.message);
  }

  return {
    categories: PORTFOLIO_CATEGORIES,
    portfolioData: portfolioData,
  };
}
