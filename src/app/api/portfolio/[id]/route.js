import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// PATCH /api/portfolio/[id] - Updates a single record by ID with only the changed fields
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing item ID in URL path" }, { status: 400 });
    }

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      );
    }

    const updateFields = {};
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.description !== undefined) updateFields.description = body.description;
    if (body.category !== undefined || body.category_name !== undefined) {
      updateFields.category_name = body.category || body.category_name;
    }
    if (body.src !== undefined) updateFields.src = body.src;
    if (body.width !== undefined) updateFields.width = body.width;
    if (body.height !== undefined) updateFields.height = body.height;
    if (body.display_order !== undefined) updateFields.display_order = body.display_order;
    if (body.position_num !== undefined) updateFields.display_order = body.position_num;

    const { data, error } = await supabase
      .from("portfolio_images")
      .update(updateFields)
      .eq("id", id)
      .select();

    if (error) throw error;

    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      message: `Portfolio record ${id} updated successfully`,
      data: data?.[0],
    });
  } catch (error) {
    console.error("Error in PATCH /api/portfolio/[id]:", error);
    return NextResponse.json(
      { error: "Failed to patch portfolio record: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolio/[id] - Deletes a single record by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing item ID in URL path" }, { status: 400 });
    }

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      );
    }

    // Query item to check if storage file needs cleanup
    const { data: item } = await supabase
      .from("portfolio_images")
      .select("src")
      .eq("id", id)
      .single();

    if (item && item.src && item.src.includes("/portfolio-images/")) {
      const filename = item.src.split("/portfolio-images/")[1]?.split("?")[0];
      if (filename) {
        await supabase.storage
          .from("portfolio-images")
          .remove([decodeURIComponent(filename)]);
      }
    }

    const { error } = await supabase
      .from("portfolio_images")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      message: `Portfolio record ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error in DELETE /api/portfolio/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio record: " + error.message },
      { status: 500 }
    );
  }
}

// GET /api/portfolio/[id] - Fetches a single record by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing item ID in URL path" }, { status: 400 });
    }

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("portfolio_images")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/portfolio/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio record: " + error.message },
      { status: 500 }
    );
  }
}
