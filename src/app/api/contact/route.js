import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  getContactData,
  getLocalContactData,
  writeLocalContactData,
  DEFAULT_CONTACT_DATA,
} from "@/lib/getContactData";

export async function GET() {
  try {
    const contact = await getContactData();
    return NextResponse.json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error("Error in GET /api/contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact data" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const payload = body?.contact || body;
    const current = getLocalContactData();

    const cleanWhatsapp = (val) => {
      if (!val) return current.whatsappNumber;
      return String(val).replace(/[^0-9]/g, "");
    };

    const updatedContact = {
      titlePrefix: typeof payload.titlePrefix === "string" ? payload.titlePrefix : current.titlePrefix,
      titleHighlight: typeof payload.titleHighlight === "string" ? payload.titleHighlight : current.titleHighlight,
      description: typeof payload.description === "string" ? payload.description : current.description,
      email: typeof payload.email === "string" ? payload.email : current.email,
      phone: typeof payload.phone === "string" ? payload.phone : current.phone,
      whatsappNumber: payload.whatsappNumber ? cleanWhatsapp(payload.whatsappNumber) : current.whatsappNumber,
      address: typeof payload.address === "string" ? payload.address : current.address,
      addressMapUrl: typeof payload.addressMapUrl === "string" ? payload.addressMapUrl : current.addressMapUrl,
      workingHours: typeof payload.workingHours === "string" ? payload.workingHours : current.workingHours,
      formTitle: typeof payload.formTitle === "string" ? payload.formTitle : current.formTitle,
      formHighlight: typeof payload.formHighlight === "string" ? payload.formHighlight : current.formHighlight,
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to local JSON
    writeLocalContactData(updatedContact);

    // 2. Save to Supabase site_settings if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingSettings } = await supabase
          .from("site_settings")
          .select("settings")
          .eq("id", 1)
          .single();

        const currentSettings = existingSettings?.settings || {};
        const mergedSettings = {
          ...currentSettings,
          contact: updatedContact,
        };

        const { error: sbErr } = await supabase.from("site_settings").upsert({
          id: 1,
          settings: mergedSettings,
          updated_at: new Date().toISOString(),
        });

        if (sbErr) {
          console.warn("Supabase upsert site_settings (contact) notice:", sbErr.message);
        }
      } catch (err) {
        console.warn("Supabase upsert site_settings (contact) exception:", err.message);
      }
    }

    // Revalidate paths
    try {
      revalidatePath("/contact");
      revalidatePath("/admin");
    } catch (e) {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: "Contact settings updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Error in POST /api/contact:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update contact settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  return POST(request);
}
