import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const DEFAULT_CATEGORIES = [
  "Advertising",
  "Fashion",
  "Jewellery",
  "Art",
  "Food",
  "Movies",
  "Travel",
  "Calendar",
  "Personalities",
];

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
    console.error("Error fetching getPortfolioCategories from Supabase:", err);
  }
  return DEFAULT_CATEGORIES;
}

export async function getPortfolioImages(category) {
  try {
    if (isSupabaseConfigured && supabase) {
      const categories = await getPortfolioCategories();
      const matchedCategory = categories.find(
        (c) => c.toLowerCase() === category.toLowerCase()
      ) || category;

      const { data, error } = await supabase
        .from("portfolio_images")
        .select("*")
        .eq("category_name", matchedCategory)
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
