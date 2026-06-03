"use client";

import { useEffect, useState } from "react";
import { Download, FileBox } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeDate } from "@/lib/utils";

interface ExportRow {
  id: string;
  format: string;
  file_name: string;
  created_at: string;
  projects?: { name: string } | null;
}

export function ExportHistory() {
  const [exports, setExports] = useState<ExportRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/exports")
      .then((r) => r.json())
      .then((data) => {
        if (data.exports) setExports(data.exports.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileBox className="h-5 w-5 text-forge-500" />
          Recent Exports
        </CardTitle>
      </CardHeader>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-forge-500/30 border-t-forge-500" />
        </div>
      ) : exports.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No exports yet. Export a saved project from the Studio.
        </p>
      ) : (
        <ul className="space-y-2">
          {exports.map((row) => (
            <li
              key={row.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-elevated/50 px-3 py-2.5"
            >
              <Download className="h-4 w-4 text-zinc-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-200 truncate">
                  {row.file_name}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {row.projects?.name ?? "Project"} ·{" "}
                  {formatRelativeDate(row.created_at)}
                </p>
              </div>
              <Badge variant="forge">{row.format.toUpperCase()}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
