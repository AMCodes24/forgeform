import { isSupabaseConfigured } from "./env";

export function getAuthErrorMessage(error: unknown): string {
  if (!isSupabaseConfigured()) {
    return "Supabase is not configured. Copy .env.example to .env.local, add your project URL and anon key, then restart the dev server (npm run dev).";
  }

  if (error instanceof TypeError) {
    const msg = error.message.toLowerCase();
    if (msg.includes("fetch") || msg.includes("network")) {
      return "Cannot reach Supabase. Check your internet connection, confirm the project URL in .env.local, and add http://localhost:3000 under Authentication → URL configuration in the Supabase dashboard.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Authentication failed. Please try again.";
}
