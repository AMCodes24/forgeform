import { NextResponse } from "next/server";
import { getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  const configured = isSupabaseConfigured();
  const url = getSupabaseUrl();

  if (!configured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message: "Missing or placeholder Supabase env vars in .env.local",
    });
  }

  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
      cache: "no-store",
    });

    return NextResponse.json({
      ok: res.ok,
      configured: true,
      host: new URL(url).host,
      status: res.status,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      configured: true,
      host: new URL(url).host,
      message:
        error instanceof Error ? error.message : "Cannot reach Supabase",
    });
  }
}
