import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const LOCAL_STORAGE_FILE = path.join(process.cwd(), "src", "data", "contact.json");

export const DEFAULT_CONTACT_DATA = {
  titlePrefix: "Get In",
  titleHighlight: "Touch",
  description: "Whether you are planning a global advertising campaign, an editorial magazine photoshoot, or a fine art licensing request, our production team is equipped to facilitate end-to-end creative direction. Let us bring your vision to life.",
  email: "info@gvenketram.com",
  phone: "+91 99400 69697",
  whatsappNumber: "919940069697",
  address: "284 Mercer St, Soho, New York, NY 10003",
  addressMapUrl: "https://maps.google.com",
  workingHours: "Mon – Fri: 09:00 AM – 06:00 PM EST",
  formTitle: "Send a",
  formHighlight: "Message",
  updatedAt: new Date().toISOString()
};

export function getLocalContactData() {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return { ...DEFAULT_CONTACT_DATA, ...parsed };
    }
  } catch (err) {
    console.error("Error reading local contact.json:", err);
  }
  return DEFAULT_CONTACT_DATA;
}

export function writeLocalContactData(data) {
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to local contact.json:", err);
  }
}

export async function getContactData() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data?.settings?.contact) {
        return {
          ...DEFAULT_CONTACT_DATA,
          ...data.settings.contact,
          source: "supabase",
        };
      }
    }
  } catch (err) {
    console.warn("Supabase GET contact data notice:", err.message);
  }

  const local = getLocalContactData();
  return { ...local, source: "local" };
}
