import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// In-memory / server cache fallback for settings
let cachedSettings = {
  visibility: {
    artGallery: true,
    workshop: true,
  },
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      settings: cachedSettings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }
    
    const vis = body?.settings?.visibility || body?.visibility || body;

    const newVisibility = { ...cachedSettings.visibility };
    if (vis?.artGallery !== undefined) {
      newVisibility.artGallery = Boolean(vis.artGallery);
    }
    if (vis?.workshop !== undefined) {
      newVisibility.workshop = Boolean(vis.workshop);
    }

    cachedSettings = {
      ...cachedSettings,
      visibility: newVisibility,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: cachedSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  return POST(request);
}
