"use client";

import { useState } from "react";
import { Download, FileBox, Loader2, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { exportModelMesh, downloadBlob } from "@/lib/export/clientExporter";
import type { ExportFormat, GeneratedModelData, PrintabilityReport } from "@/types";

const formats: { format: ExportFormat; label: string; desc: string }[] = [
  { format: "stl", label: "STL", desc: "Slicer-ready (printability required)" },
  { format: "obj", label: "OBJ", desc: "Mesh interchange" },
  { format: "glb", label: "GLB", desc: "Compact 3D asset" },
];

interface ExportPanelProps {
  model: GeneratedModelData | null;
  printability: PrintabilityReport | null;
  projectId?: string;
  onExportRecorded?: () => void;
}

export function ExportPanel({
  model,
  printability,
  projectId,
  onExportRecorded,
}: ExportPanelProps) {
  const { toast } = useToast();
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const stlAllowed = printability?.stlExportAllowed ?? false;

  const handleExport = async (format: ExportFormat) => {
    if (!model) return;
    if (format === "stl" && !stlAllowed) {
      toast("STL export requires passing printability checks", "error");
      return;
    }

    setExporting(format);
    try {
      const { blob, fileName } = await exportModelMesh(model, format);
      downloadBlob(blob, fileName);
      toast(`Downloaded ${fileName}`, "success");

      if (projectId) {
        const res = await fetch("/api/exports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_id: projectId,
            format,
            file_name: fileName,
          }),
        });
        if (!res.ok) throw new Error("Failed to record export");
        onExportRecorded?.();
      }
    } catch (err) {
      console.error(err);
      toast("Export failed. Please try again.", "error");
    } finally {
      setExporting(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileBox className="h-5 w-5 text-forge-500" />
          Export
        </CardTitle>
      </CardHeader>
      {!model ? (
        <p className="text-sm text-zinc-500">
          Export STL, OBJ, or GLB after generating a model.
        </p>
      ) : (
        <div className="space-y-2">
          {formats.map(({ format, label, desc }) => {
            const locked = format === "stl" && !stlAllowed;
            return (
              <Button
                key={format}
                variant="secondary"
                className="w-full justify-between"
                disabled={exporting !== null || locked}
                onClick={() => handleExport(format)}
              >
                <span>
                  <span className="font-semibold">{label}</span>
                  <span className="ml-2 text-zinc-500 text-xs">{desc}</span>
                </span>
                {exporting === format ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : locked ? (
                  <Lock className="h-4 w-4 text-zinc-500" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            );
          })}
          {!stlAllowed && (
            <p className="text-xs text-amber-500/90 pt-1">
              STL unlocks when watertight, manifold, wall thickness, and scale checks pass.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
