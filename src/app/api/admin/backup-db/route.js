import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const TABLES = [
  "categories",
  "portfolio_images",
  "main_images",
  "art_gallery",
  "site_settings",
];

export async function GET(request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const backupData = {
      metadata: {
        timestamp: new Date().toISOString(),
        tableCounts: {},
      },
      tables: {},
    };

    for (const table of TABLES) {
      const { data, error } = await supabase.from(table).select("*").limit(5000);
      if (!error && data) {
        backupData.tables[table] = data;
        backupData.metadata.tableCounts[table] = data.length;
      } else {
        backupData.tables[table] = [];
        backupData.metadata.tableCounts[table] = 0;
      }
    }

    const { searchParams } = new URL(request.url);
    const download = searchParams.get("download");

    if (download === "true") {
      const jsonStr = JSON.stringify(backupData, null, 2);
      const filename = `supabase_backup_${new Date().toISOString().slice(0, 10)}.json`;
      return new NextResponse(jsonStr, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      metadata: backupData.metadata,
      tableCounts: backupData.metadata.tableCounts,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

