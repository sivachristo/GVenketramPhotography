const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://gtkbdzhmtacvoqhzlwte.supabase.co";
const supabaseAnonKey = "sb_publishable_gWUa2QJbwLFYdiLIJge_WQ_dwNoBc06";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearDummyDescriptions() {
  console.log("Updating portfolio_images descriptions in Supabase...");
  
  // 1. Update all rows that have non-empty description
  const { data, error } = await supabase
    .from("portfolio_images")
    .update({ description: "" })
    .neq("description", "");

  if (error) {
    console.error("Single query update error:", error);
    // Fallback: batch update in chunks
    console.log("Fetching images for chunked update...");
    const { data: allImages } = await supabase.from("portfolio_images").select("id, description");
    const toUpdate = (allImages || []).filter(img => img.description && img.description.trim() !== "");
    console.log(`Updating ${toUpdate.length} images in chunks...`);
    
    const CHUNK_SIZE = 25;
    for (let i = 0; i < toUpdate.length; i += CHUNK_SIZE) {
      const chunk = toUpdate.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(img => 
          supabase.from("portfolio_images").update({ description: "" }).eq("id", img.id)
        )
      );
      console.log(`Processed ${Math.min(i + CHUNK_SIZE, toUpdate.length)} of ${toUpdate.length}...`);
    }
  }

  console.log("All descriptions have been successfully cleared!");
}

clearDummyDescriptions();
