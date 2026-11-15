import { cacheLife, cacheTag } from "next/cache";
import { artworksData } from "@/data/artworks";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const TABLE = "art_gallery";

export const ARTWORK_COLUMNS =
  "id, title, short_description, description, image, width, height, price, type, category, availability, quantity, year, dimensions, display_order, options, specs";

export function mapArtworkDbRow(item) {
  return {
    id: item.id,
    title: item.title,
    shortDescription: item.short_description || item.description?.slice(0, 100) || "",
    description: item.description || "",
    image: item.image || item.src,
    width: item.width || 1200,
    height: item.height || 1600,
    price: Number(item.price) || 250,
    type: item.type || "Physical",
    category: item.category || "Physical Prints",
    availability: item.availability || "In Stock",
    quantity: item.quantity || 10,
    year: item.year || "2025",
    dimensions: item.dimensions || "24 x 36 inches",
    display_order: item.display_order || 1,
    options: item.options || [
      { id: `opt-${item.id}-1`, label: "Standard Edition", price: Number(item.price) || 250 },
    ],
    specs: item.specs || {
      paper: "Archival Fine Art Paper",
      printing: "Pigment Print",
      signature: "Signed Certificate Included",
      framing: "Unframed",
    },
  };
}

export async function getArtworksData() {
  "use cache";
  cacheLife("hours");
  cacheTag("artworks");

  try {
    if (isSupabaseConfigured && supabase) {
      const { data: dbArtworks, error } = await supabase
        .from(TABLE)
        .select(ARTWORK_COLUMNS)
        .order("display_order", { ascending: true });

      if (!error && dbArtworks && dbArtworks.length > 0) {
        return {
          artworks: dbArtworks.map(mapArtworkDbRow),
          source: "supabase",
        };
      }
    }
  } catch (err) {
    console.error("Supabase GET art_gallery error:", err);
  }

  return {
    artworks: artworksData,
    source: "memory",
  };
}
