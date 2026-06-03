/** Placeholder values so `next build` succeeds before `.env.local` is configured. */
const BUILD_PLACEHOLDER_URL = "https://placeholder.supabase.co";
const BUILD_PLACEHOLDER_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUwMjQwMDAsImV4cCI6MTk2MDYwMDAwMH0.placeholder";

function cleanEnv(value: string | undefined, fallback: string) {
  return (value ?? fallback).trim().replace(/^["']|["']$/g, "");
}

export function getSupabaseUrl() {
  return cleanEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    BUILD_PLACEHOLDER_URL
  );
}

export function getSupabaseAnonKey() {
  return cleanEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    BUILD_PLACEHOLDER_KEY
  );
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes("placeholder.supabase.co") &&
      key !== BUILD_PLACEHOLDER_KEY &&
      !url.includes("your-project-ref")
  );
}
