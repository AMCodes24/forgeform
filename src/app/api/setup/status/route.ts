import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      tablesReady: false,
      message: "Add Supabase keys to .env.local",
    });
  }

  const supabase = await createClient();

  const { error: projectsError } = await supabase
    .from("projects")
    .select("id")
    .limit(1);

  const { error: exportsError } = await supabase
    .from("exports")
    .select("id")
    .limit(1);

  const projectsMissing =
    projectsError?.message?.includes("Could not find") ||
    projectsError?.message?.includes("schema cache") ||
    projectsError?.message?.includes("does not exist");

  const exportsMissing =
    exportsError?.message?.includes("Could not find") ||
    exportsError?.message?.includes("schema cache") ||
    exportsError?.message?.includes("does not exist");

  const tablesReady = !projectsMissing && !exportsMissing;

  return NextResponse.json({
    configured: true,
    tablesReady,
    message: tablesReady
      ? "Database ready"
      : "Run supabase/schema.sql in your Supabase SQL Editor",
  });
}
