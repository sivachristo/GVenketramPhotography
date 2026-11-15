import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { artworksData } from "@/data/artworks";
import {
  ARTWORK_COLUMNS,
  getArtworksData,
  mapArtworkDbRow,
} from "@/lib/getArtworksData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const TABLE = "art_gallery";

function revalidateArtworksCache(id) {
  revalidateTag("artworks", { expire: 0 });
  revalidatePath("/art-gallery");
  if (id) {
    revalidatePath(`/art-gallery/${id}`);
  }
  revalidatePath("/admin");
}

export async function GET() {
  const result = await getArtworksData();
  return NextResponse.json(result);
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
    const formattedCategory =
      category || (formattedType === "Digital" ? "Digital Prints" : "Physical Prints");

    const newArtwork = {
      id: newId,
      title: title || "Untitled Artwork",
      shortDescription:
        shortDescription ||
        description?.slice(0, 120) ||
        "Curated fine art photography print.",
      description:
        description ||
        shortDescription ||
        "Curated fine art photography artwork by G. Venketram.",
      image: imageUrl,
      width: Number(width) || 1200,
      height: Number(height) || 1600,
      price: formattedPrice,
      type: formattedType,
      category: formattedCategory,
      availability:
        availability || (formattedType === "Digital" ? "Instant Download" : "In Stock"),
      quantity: Number(quantity) || 25,
      year: year || new Date().getFullYear().toString(),
      dimensions:
        dimensions ||
        (formattedType === "Digital" ? "8K Ultra-HD Resolution" : "24 x 36 inches"),
      display_order: 1,
      options:
        options && options.length > 0
          ? options
          : [
              {
                id: `opt-${newId}-1`,
                label:
                  formattedType === "Digital"
                    ? "Standard Digital License"
                    : "16 x 24 in - Fine Art Matte",
                price: Math.round(formattedPrice * 0.8),
              },
              {
                id: `opt-${newId}-2`,
                label:
                  formattedType === "Digital"
                    ? "Commercial Master License"
                    : "24 x 36 in - Archival Fine Art",
                price: formattedPrice,
              },
              {
                id: `opt-${newId}-3`,
                label:
                  formattedType === "Digital"
                    ? "Exclusive Collector Pack"
                    : "36 x 48 in - Gallery Mount",
                price: Math.round(formattedPrice * 1.6),
              },
            ],
      specs: specs || {
        paper:
          formattedType === "Digital"
            ? "N/A (Digital Download)"
            : "Archival Hahnemühle Photo Rag",
        printing:
          formattedType === "Digital" ? "RAW 16-Bit Master File" : "Pigment Archival Print",
        signature: "Signed Certificate of Authenticity",
        framing:
          formattedType === "Digital" ? "Instant Digital Delivery" : "Unframed / Protective Tube",
      },
    };

    // Insert into Supabase art_gallery table
    if (isSupabaseConfigured && supabase) {
      try {
        // Shift existing display_orders to make room at top
        const { data: existing } = await supabase
          .from(TABLE)
          .select("id, display_order")
          .order("display_order", { ascending: true });
        if (existing && existing.length > 0) {
          await Promise.all(
            existing.map((item) =>
              supabase
                .from(TABLE)
                .update({ display_order: (item.display_order || 1) + 1 })
                .eq("id", item.id)
            )
          );
        }

        const { error: sbErr } = await supabase.from(TABLE).insert([
          {
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
            display_order: 1,
            options: newArtwork.options,
            specs: newArtwork.specs,
          },
        ]);

        if (sbErr) {
          console.error("Supabase insert art_gallery notice:", sbErr.message);
        }
      } catch (sbErr) {
        console.error("Supabase insert art_gallery error:", sbErr.message);
      }
    }

    revalidateArtworksCache();

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

    let existing = {};
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from(TABLE).select(ARTWORK_COLUMNS).eq("id", id).single();
        if (data) existing = mapArtworkDbRow(data);
      } catch (err) {
        console.warn("Supabase fetch single artwork notice:", err.message);
      }
    }
    if (!existing.id) {
      existing = artworksData.find((item) => item.id === id) || {};
    }

    const updatedItem = {
      ...existing,
      id,
      title: updates.title !== undefined ? updates.title : existing.title,
      description:
        updates.description !== undefined ? updates.description : existing.description,
      shortDescription:
        updates.shortDescription !== undefined
          ? updates.shortDescription
          : updates.description?.slice(0, 120) || existing.shortDescription,
      image: updates.image || updates.src || existing.image,
      price:
        updates.price !== undefined ? Number(updates.price) : existing.price,
      type: updates.type || existing.type,
      category: updates.category || existing.category,
      availability: updates.availability || existing.availability,
      quantity:
        updates.quantity !== undefined ? Number(updates.quantity) : existing.quantity,
      dimensions: updates.dimensions || existing.dimensions,
      display_order: updates.display_order || existing.display_order || 1,
      options: updates.options || existing.options,
      specs: updates.specs || existing.specs,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: sbErr } = await supabase
          .from(TABLE)
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
            display_order: updatedItem.display_order,
            options: updatedItem.options,
            specs: updatedItem.specs,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (sbErr) {
          console.error("Supabase update art_gallery notice:", sbErr.message);
        }
      } catch (sbErr) {
        console.error("Supabase update art_gallery error:", sbErr.message);
      }
    }

    revalidateArtworksCache(id);

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
        // Check if image is in Supabase storage and remove it
        const { data: item } = await supabase
          .from(TABLE)
          .select("image")
          .eq("id", id)
          .single();

        if (item?.image && item.image.includes("supabase.co/storage")) {
          for (const bucket of ["portfolio-images", "artworks"]) {
            const part = item.image.split(`/${bucket}/`)[1]?.split("?")[0];
            if (part) {
              await supabase.storage
                .from(bucket)
                .remove([decodeURIComponent(part)]);
              break;
            }
          }
        }

        const { error: sbErr } = await supabase.from(TABLE).delete().eq("id", id);
        if (sbErr) {
          console.error("Supabase delete art_gallery notice:", sbErr.message);
        }
      } catch (sbErr) {
        console.error("Supabase delete art_gallery error:", sbErr.message);
      }
    }

    revalidateArtworksCache(id);

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
