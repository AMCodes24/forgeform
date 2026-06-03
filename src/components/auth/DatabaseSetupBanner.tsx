"use client";

import { useEffect, useState } from "react";
import { Database } from "lucide-react";

export function DatabaseSetupBanner() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/setup/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && !data.tablesReady) {
          setShow(true);
          setMessage(data.message);
        }
      })
      .catch(() => {});
  }, []);

  if (!show) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
      <div className="flex gap-3">
        <Database className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-100">
          <p className="font-medium">Database setup required</p>
          <p className="mt-1 text-amber-200/80">{message}</p>
          <ol className="mt-2 list-decimal list-inside text-amber-200/70 space-y-1">
            <li>Open your Supabase project → SQL Editor</li>
            <li>Copy all of <code className="text-amber-100">supabase/schema.sql</code></li>
            <li>Run the query, then refresh this page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
