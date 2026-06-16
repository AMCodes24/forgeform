"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  Calendar,
  Clock,
  Download,
  Package,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRelativeDate } from "@/lib/utils";
import type { Project, PrintabilityReport } from "@/types";

export function ProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete?: (id: string) => void;
}) {
  const print = project.printability as PrintabilityReport;
  const score =
    project.printability_score ?? print?.score ?? 0;

  const scoreVariant =
    score >= 80 ? "success" : score >= 60 ? "warning" : "danger";

  const category =
    project.model_data?.category?.replace(/-/g, " ") ?? "Model";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden group"
    >
      <div
        className="relative h-36 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${project.thumbnail_color}22, ${project.thumbnail_color}08)`,
        }}
      >
        <div
          className="h-16 w-16 rounded-2xl shadow-lg flex items-center justify-center"
          style={{ backgroundColor: project.thumbnail_color + "33" }}
        >
          <Box
            className="h-8 w-8"
            style={{ color: project.thumbnail_color }}
          />
        </div>
        <Badge variant={scoreVariant} className="absolute top-3 right-3">
          {score}/100
        </Badge>
        {project.model_data?.isPlaceholder && (
          <Badge variant="warning" className="absolute top-3 left-3 text-[10px]">
            Fallback
          </Badge>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-forge-500/90 uppercase tracking-wide mb-1">
          {category}
        </p>
        <h3 className="font-semibold text-zinc-100 truncate">{project.name}</h3>
        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{project.prompt}</p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5" />
            {print?.estimatedMaterialGrams ?? "—"}g
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {print?.estimatedPrintTimeFormatted ?? "—"}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
          <Calendar className="h-3.5 w-3.5" />
          {formatRelativeDate(project.created_at)}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link href={`/studio?project=${project.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              Open
            </Button>
          </Link>
          <span
            className="flex items-center gap-1 text-xs text-zinc-500 px-2"
            title="Exports"
          >
            <Download className="h-3.5 w-3.5" />
            {project.export_count ?? 0}
          </span>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project.id)}
              aria-label="Delete project"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
