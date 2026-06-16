import type {
  GeneratedModelData,
  GenerationParams,
  MeshAnalysisReport,
  PrintabilityCheck,
  PrintabilityReport,
  RepairReport,
  DifficultyRating,
} from "@/types";
import {
  formatPrintTime,
  estimateCostUsd,
  materialLabel,
} from "./format";

const MATERIAL_DENSITY: Record<string, number> = {
  pla: 1.24,
  petg: 1.27,
  abs: 1.04,
  resin: 1.1,
  tpu: 1.21,
};

export function buildPrintabilityReport(
  model: GeneratedModelData,
  params: GenerationParams,
  mesh: MeshAnalysisReport,
  repairs: RepairReport
): PrintabilityReport {
  const { width = 50, height = 50, depth = 50 } = params;
  const material = params.material ?? "pla";
  const density = MATERIAL_DENSITY[material] ?? 1.24;
  const infill =
    params.detailLevel === "high" ? 0.25 : params.detailLevel === "low" ? 0.15 : 0.2;

  const volumeCm3 = (width * height * depth) / 1000;
  const partCount = model.primitives.length;
  const complexityFactor = 1 + partCount * 0.02;

  const estimatedMaterialGrams =
    Math.round(volumeCm3 * density * infill * complexityFactor * 10) / 10;

  const printSpeedFactor =
    params.detailLevel === "high" ? 1.35 : params.detailLevel === "low" ? 0.85 : 1;
  const supportFactor = mesh.overhangRisk ? 1.15 : 1;
  const estimatedPrintTimeHours =
    Math.round(
      volumeCm3 * 0.07 * printSpeedFactor * supportFactor * complexityFactor * 10
    ) / 10;

  const checks: PrintabilityCheck[] = [
    {
      id: "watertight",
      label: "Watertight",
      passed: mesh.watertight,
      severity: mesh.watertight ? "pass" : "fail",
    },
    {
      id: "manifold",
      label: "Manifold Mesh",
      passed: mesh.manifold,
      severity: mesh.manifold ? "pass" : "fail",
    },
    {
      id: "scale",
      label: "Correct Scale",
      passed: mesh.scaleValid,
      severity: mesh.scaleValid ? "pass" : "fail",
    },
    {
      id: "flat_base",
      label: "Flat Base",
      passed: mesh.flatBasePresent,
      severity: mesh.flatBasePresent ? "pass" : "warn",
    },
    {
      id: "wall_thickness",
      label: "Printable Wall Thickness",
      passed: mesh.wallThicknessOk,
      severity: mesh.wallThicknessOk ? "pass" : "fail",
    },
    {
      id: "connected",
      label: "Connected Mesh",
      passed: mesh.connectedMesh,
      severity: mesh.connectedMesh ? "pass" : "warn",
    },
    {
      id: "floating",
      label: "No Floating Geometry",
      passed: !mesh.floatingGeometry,
      severity: mesh.floatingGeometry ? "warn" : "pass",
    },
    {
      id: "normals",
      label: "Valid Normals",
      passed: !mesh.invertedNormals,
      severity: mesh.invertedNormals ? "fail" : "pass",
    },
    {
      id: "self_intersection",
      label: "No Self-Intersection",
      passed: !mesh.selfIntersection,
      severity: mesh.selfIntersection ? "fail" : "pass",
    },
  ];

  const overhangWarnings: string[] = [];
  const thinWallWarnings: string[] = [];
  const notes: string[] = [];

  if (mesh.overhangRisk) {
    overhangWarnings.push("Steep overhangs — tree supports recommended");
  }
  if (!mesh.wallThicknessOk) {
    thinWallWarnings.push(
      `Walls below ${mesh.minWallThicknessMm.toFixed(1)}mm — increase dimensions or detail`
    );
  }
  if (!mesh.connectedMesh) {
    overhangWarnings.push("Multiple disconnected bodies — verify slicer union");
  }
  if (model.isPlaceholder) {
    notes.push("Unclassified prompt — assign a category keyword for parametric output");
  }

  notes.push(`Category: ${model.category.replace(/-/g, " ")}`);
  notes.push(`Optimized for ${materialLabel(material)}`);

  const supportRequired = mesh.overhangRisk || !mesh.flatBasePresent;
  const supportPercentage = supportRequired
    ? mesh.overhangRisk
      ? 18
      : 8
    : 0;

  let score = 95;
  for (const c of checks) {
    if (!c.passed) {
      if (c.severity === "fail") score -= 12;
      else if (c.severity === "warn") score -= 5;
    }
  }
  if (model.isPlaceholder) score -= 15;
  score = Math.max(30, Math.min(98, score));

  let difficultyRating: DifficultyRating = "easy";
  if (score < 50) difficultyRating = "expert";
  else if (score < 65) difficultyRating = "challenging";
  else if (score < 80) difficultyRating = "moderate";

  const stlExportAllowed =
    mesh.watertight &&
    mesh.manifold &&
    mesh.wallThicknessOk &&
    mesh.scaleValid &&
    score >= 60 &&
    !model.isPlaceholder;

  return {
    estimatedPrintSize: `${width} × ${height} × ${depth} mm`,
    estimatedMaterialGrams,
    estimatedPrintTimeHours,
    estimatedPrintTimeFormatted: formatPrintTime(estimatedPrintTimeHours),
    estimatedCostUsd: estimateCostUsd(estimatedMaterialGrams, material),
    materialLabel: materialLabel(material),
    supportRequired,
    supportPercentage,
    overhangWarnings,
    thinWallWarnings,
    difficultyRating,
    score,
    notes,
    checks,
    stlExportAllowed,
    repairsApplied: repairs.applied,
  };
}
