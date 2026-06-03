"use client";

import { isSupabaseConfigured } from "@/lib/supabase/env";

export function SupabaseSetupNotice() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
      <p className="font-medium">Supabase not connected</p>
      <p className="mt-1 text-amber-200/80">
        Copy <code className="text-amber-100">.env.example</code> to{" "}
        <code className="text-amber-100">.env.local</code>, add your project URL
        and anon key, then restart{" "}
        <code className="text-amber-100">npm run dev</code>.
      </p>
    </div>
  );
}
