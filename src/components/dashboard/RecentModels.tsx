"use client";

import Link from "next/link";
import { ArrowRight, Clock, Package } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeDate } from "@/lib/utils";
import type { Project, PrintabilityReport } from "@/types";

export function RecentModels({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Models</CardTitle>
        </CardHeader>
        <p className="text-sm text-zinc-500 mb-4">No models yet.</p>
        <Link
          href="/studio"
          className="text-sm text-forge-400 hover:text-forge-300"
        >
          Create your first model →
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Models</CardTitle>
        <Link
          href="/gallery"
          className="text-sm text-forge-400 hover:text-forge-300 flex items-center gap-1"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <ul className="space-y-3">
        {projects.map((p) => {
          const print = p.printability as PrintabilityReport;
          return (
            <li key={p.id}>
              <Link
                href={`/studio?project=${p.id}`}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-surface-elevated transition-colors"
              >
                <div
                  className="h-10 w-10 rounded-lg shrink-0"
                  style={{ backgroundColor: p.thumbnail_color + "44" }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zinc-200 truncate">{p.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{p.prompt}</p>
                  <div className="flex gap-3 mt-1 text-[10px] text-zinc-600">
                    <span className="flex items-center gap-0.5">
                      <Package className="h-3 w-3" />
                      {print?.estimatedMaterialGrams ?? "—"}g
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="h-3 w-3" />
                      {print?.estimatedPrintTimeFormatted ?? "—"}
                    </span>
                    <span>{formatRelativeDate(p.created_at)}</span>
                  </div>
                </div>
                <Badge variant="forge">{p.printability_score}/100</Badge>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
