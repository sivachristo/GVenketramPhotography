import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { artworksData, updateArtworksState, initialArtworksData } from "@/data/artworks";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Global in-memory storage array for current server process
let currentArtworks = [...artworksData];

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data: dbArtworks, error } = await supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && dbArtworks && dbArtworks.length > 0) {
        return NextResponse.json({
          artworks: dbArtworks.map((item) => ({
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
            options: item.options || [
              { id: `opt-${item.id}-1`, label: "Standard Edition", price: Number(item.price) || 250 }
            ],
            specs: item.specs || {
              paper: "Archival Fine Art Paper",
              printing: "Pigment Print",
              signature: "Signed Certificate Included",
              framing: "Unframed"
            }
          })),
          source: "supabase",
        });
      }
    }
  } catch (err) {
    console.error("Supabase GET artworks error:", err);
  }

  return NextResponse.json({
    artworks: currentArtworks,
    source: "memory",
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      image,
      src,
      price,
      type,
      category,
      availability,
      quantity,
      dimensions,
      options,
      specs,
      year,
      width,
      height,
    } = body;

    const imageUrl = image || src;
    if (!imageUrl) {
      return NextResponse.json({ error: "Artwork image URL is required" }, { status: 400 });
    }

    const newId = `art-${Date.now()}`;
    const formattedPrice = Number(price) || 350;
    const formattedType = type === "Digital" ? "Digital" : "Physical";
    const formattedCategory = category || (formattedType === "Digital" ? "Digital Prints" : "Physical Prints");

    const newArtwork = {
      id: newId,
      title: title || "Untitled Artwork",
      shortDescription: shortDescription || description?.slice(0, 120) || "Curated fine art photography print.",
      description: description || shortDescription || "Curated fine art photography artwork by G. Venketram.",
      image: imageUrl,
      width: Number(width) || 1200,
      height: Number(height) || 1600,
      price: formattedPrice,
      type: formattedType,
      category: formattedCategory,
      availability: availability || (formattedType === "Digital" ? "Instant Download" : "In Stock"),
      quantity: Number(quantity) || 25,
      year: year || new Date().getFullYear().toString(),
      dimensions: dimensions || (formattedType === "Digital" ? "8K Ultra-HD Resolution" : "24 x 36 inches"),
      options: options && options.length > 0 ? options : [
        { id: `opt-${newId}-1`, label: formattedType === "Digital" ? "Standard Digital License" : "16 x 24 in - Fine Art Matte", price: Math.round(formattedPrice * 0.8) },
        { id: `opt-${newId}-2`, label: formattedType === "Digital" ? "Commercial Master License" : "24 x 36 in - Archival Fine Art", price: formattedPrice },
        { id: `opt-${newId}-3`, label: formattedType === "Digital" ? "Exclusive Collector Pack" : "36 x 48 in - Gallery Mount", price: Math.round(formattedPrice * 1.6) }
      ],
      specs: specs || {
        paper: formattedType === "Digital" ? "N/A (Digital Download)" : "Archival Hahnemühle Photo Rag",
        printing: formattedType === "Digital" ? "RAW 16-Bit Master File" : "Pigment Archival Print",
        signature: "Signed Certificate of Authenticity",
        framing: formattedType === "Digital" ? "Instant Digital Delivery" : "Unframed / Protective Tube"
      }
    };

    // If Supabase is configured, also insert into database
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("artworks").insert([{
          id: newId,
          title: newArtwork.title,
          description: newArtwork.description,
          short_description: newArtwork.shortDescription,
          image: newArtwork.image,
          width: newArtwork.width,
          height: newArtwork.height,
          price: newArtwork.price,
          type: newArtwork.type,
          category: newArtwork.category,
          availability: newArtwork.availability,
          quantity: newArtwork.quantity,
          year: newArtwork.year,
          dimensions: newArtwork.dimensions,
          options: newArtwork.options,
          specs: newArtwork.specs,
        }]);
      } catch (sbErr) {
        console.error("Supabase insert artwork notice:", sbErr.message);
      }
    }

    currentArtworks = [newArtwork, ...currentArtworks];
    updateArtworksState(currentArtworks);

    revalidatePath("/art-gallery");
    revalidatePath("/art-gallery/[id]");

    return NextResponse.json({
      success: true,
      message: "Artwork created successfully",
      artwork: newArtwork,
    });
  } catch (error) {
    console.error("Error creating artwork:", error);
    return NextResponse.json(
      { error: "Failed to create artwork: " + error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing artwork ID for update" }, { status: 400 });
    }

    const index = currentArtworks.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    const existing = currentArtworks[index];
    const updatedPrice = updates.price !== undefined ? Number(updates.price) : existing.price;

    const updatedItem = {
      ...existing,
      title: updates.title !== undefined ? updates.title : existing.title,
      description: updates.description !== undefined ? updates.description : existing.description,
      shortDescription: updates.shortDescription !== undefined ? updates.shortDescription : (updates.description?.slice(0, 120) || existing.shortDescription),
      image: updates.image || updates.src || existing.image,
      price: updatedPrice,
      type: updates.type || existing.type,
      category: updates.category || existing.category,
      availability: updates.availability || existing.availability,
      quantity: updates.quantity !== undefined ? Number(updates.quantity) : existing.quantity,
      dimensions: updates.dimensions || existing.dimensions,
      options: updates.options || existing.options,
      specs: updates.specs || existing.specs,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("artworks")
          .update({
            title: updatedItem.title,
            description: updatedItem.description,
            short_description: updatedItem.shortDescription,
            image: updatedItem.image,
            price: updatedItem.price,
            type: updatedItem.type,
            category: updatedItem.category,
            availability: updatedItem.availability,
            quantity: updatedItem.quantity,
            dimensions: updatedItem.dimensions,
            options: updatedItem.options,
            specs: updatedItem.specs,
          })
          .eq("id", id);
      } catch (sbErr) {
        console.error("Supabase update artwork notice:", sbErr.message);
      }
    }

    currentArtworks[index] = updatedItem;
    updateArtworksState(currentArtworks);

    revalidatePath("/art-gallery");
    revalidatePath(`/art-gallery/${id}`);

    return NextResponse.json({
      success: true,
      message: "Artwork updated successfully",
      artwork: updatedItem,
    });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json(
      { error: "Failed to update artwork: " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const id = searchParams.get("id") || body.id;

    if (!id) {
      return NextResponse.json({ error: "Missing artwork ID to delete" }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("artworks").delete().eq("id", id);
      } catch (sbErr) {
        console.error("Supabase delete artwork notice:", sbErr.message);
      }
    }

    currentArtworks = currentArtworks.filter((item) => item.id !== id);
    updateArtworksState(currentArtworks);

    revalidatePath("/art-gallery");

    return NextResponse.json({
      success: true,
      message: "Artwork deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return NextResponse.json(
      { error: "Failed to delete artwork: " + error.message },
      { status: 500 }
    );
  }
}
