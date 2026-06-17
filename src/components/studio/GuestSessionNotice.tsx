"use client";

import { Info } from "lucide-react";

export function GuestSessionNotice() {
  return (
    <div className="mb-6 flex gap-3 rounded-xl border border-forge-500/25 bg-forge-500/8 px-4 py-3">
      <Info className="h-5 w-5 text-forge-400 shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium text-forge-200">Guest session</p>
        <p className="mt-0.5 text-zinc-400">
          You&apos;re designing without an account. Your work is saved temporarily
          in this browser. Create an account to keep projects permanently.
        </p>
      </div>
    </div>
  );
}
