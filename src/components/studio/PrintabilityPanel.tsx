"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Ruler,
  XCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { PrintabilityReport } from "@/types";

const difficultyColors = {
  easy: "success" as const,
  moderate: "warning" as const,
  challenging: "warning" as const,
  expert: "danger" as const,
};

export function PrintabilityPanel({
  report,
}: {
  report: PrintabilityReport | null;
}) {
  if (!report) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Printability Analysis</CardTitle>
        </CardHeader>
        <p className="text-sm text-zinc-500">
          Generate a model to run watertight, manifold, and print-ready validation.
        </p>
      </Card>
    );
  }

  const scoreColor =
    report.score >= 80 ? "success" : report.score >= 60 ? "warning" : "danger";

  return (
    <Card className="h-full overflow-y-auto max-h-[520px]">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Printability</CardTitle>
        <Badge variant={scoreColor}>{report.score}/100</Badge>
      </CardHeader>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant={difficultyColors[report.difficultyRating]}>
          {report.difficultyRating}
        </Badge>
        {report.supportRequired && (
          <Badge variant="warning">Supports recommended</Badge>
        )}
        {!report.stlExportAllowed && (
          <Badge variant="danger">STL locked</Badge>
        )}
      </div>

      <ul className="space-y-1.5 mb-5">
        {report.checks.map((check) => (
          <li
            key={check.id}
            className="flex items-center gap-2 text-sm text-zinc-300"
          >
            {check.passed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : check.severity === "warn" ? (
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span
              className={
                check.passed ? "" : check.severity === "warn" ? "text-amber-200/90" : "text-red-300/90"
              }
            >
              {check.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
        <Stat icon={Ruler} label="Print size" value={report.estimatedPrintSize} />
        <Stat
          icon={Package}
          label="Filament"
          value={`~${report.estimatedMaterialGrams}g ${report.materialLabel}`}
        />
        <Stat
          icon={Clock}
          label="Print time"
          value={report.estimatedPrintTimeFormatted}
        />
        <Stat
          icon={DollarSign}
          label="Est. cost"
          value={`$${report.estimatedCostUsd.toFixed(2)}`}
        />
      </div>

      {report.repairsApplied.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-zinc-500 uppercase mb-2">
            Repairs applied
          </p>
          <ul className="space-y-1">
            {report.repairsApplied.map((r, i) => (
              <li key={i} className="text-xs text-zinc-400 flex gap-1.5">
                <span className="text-forge-500">→</span> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.overhangWarnings.length > 0 && (
        <WarningList title="Overhangs" items={report.overhangWarnings} />
      )}
      {report.thinWallWarnings.length > 0 && (
        <WarningList title="Thin walls" items={report.thinWallWarnings} />
      )}
    </Card>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface-elevated px-3 py-2">
      <Icon className="h-4 w-4 text-forge-500 shrink-0" />
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="font-medium text-zinc-200">{value}</p>
      </div>
    </div>
  );
}

function WarningList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-3">
      <p className="text-xs font-medium text-amber-500/80 mb-1">{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-xs text-zinc-400 rounded bg-amber-500/5 border border-amber-500/10 px-2 py-1.5"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
