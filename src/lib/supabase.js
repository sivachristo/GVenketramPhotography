import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("your-supabase-project")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function formatSupabaseError(error, defaultPrefix = "Operation failed") {
  const msg = String(error?.message || error || "");
  if (
    msg.toLowerCase().includes("exceed_cached_egress_quota") ||
    msg.toLowerCase().includes("service for this project is restricted") ||
    msg.toLowerCase().includes("402")
  ) {
    return "superbase limit reached. kindly check";
  }
  return defaultPrefix ? `${defaultPrefix}: ${msg}` : msg;
}

