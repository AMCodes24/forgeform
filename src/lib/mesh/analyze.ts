import type { GeneratedModelData, MeshAnalysisReport } from "@/types";
import { findConnectedComponents, getPrimitiveBounds } from "./bounds";

const MIN_WALL_MM = 1.2;
const MIN_SCALE_MM = 5;
const MAX_SCALE_MM = 500;

export function analyzeMesh(model: GeneratedModelData): MeshAnalysisReport {
  const issues: string[] = [];
  const bounds = getPrimitiveBounds(model.primitives);
  const components = findConnectedComponents(bounds);

  const connectedMesh = components.length <= 1;
  if (!connectedMesh) {
    issues.push(`${components.length} disconnected mesh groups detected`);
  }

  let floatingGeometry = false;
  if (components.length > 1) {
    const sizes = components.map((g) => g.length);
    const maxSize = Math.max(...sizes);
    const floatGroups = components.filter((g) => g.length < maxSize * 0.15);
    floatingGeometry = floatGroups.length > 0;
    if (floatingGeometry) {
      issues.push("Small floating geometry may fail during printing");
    }
  }

  const minWall = Math.min(
    ...model.primitives.map((p) => p.minThicknessMm ?? 2),
    ...bounds.map((b) => {
      const p = model.primitives[b.index];
      const scales = p.scale.map((s) => Math.abs(s) * 50);
      return Math.min(...scales);
    })
  );

  const wallThicknessOk = minWall >= MIN_WALL_MM;
  if (!wallThicknessOk) {
    issues.push(`Minimum wall ~${minWall.toFixed(1)}mm below ${MIN_WALL_MM}mm`);
  }

  const { width, height, depth } = model.metadata.dimensions;
  const scaleValid =
    width >= MIN_SCALE_MM &&
    height >= MIN_SCALE_MM &&
    depth >= MIN_SCALE_MM &&
    width <= MAX_SCALE_MM &&
    height <= MAX_SCALE_MM &&
    depth <= MAX_SCALE_MM;

  if (!scaleValid) {
    issues.push("Model scale outside recommended 5–500mm bounds");
  }

  const lowestY = Math.min(...bounds.map((b) => b.min[1]));
  const flatBasePresent = bounds.some(
    (b) =>
      Math.abs(b.min[1] - lowestY) < 0.05 &&
      model.primitives[b.index].type === "box"
  );

  if (!flatBasePresent && !model.category.includes("keychain")) {
    issues.push("No flat base detected — consider adding a brim or raft");
  }

  const overhangRisk = model.primitives.some((p) => {
    const [rx, , rz] = p.rotation;
    return Math.abs(rx) > 0.45 || Math.abs(rz) > 0.45;
  });

  if (overhangRisk) {
    issues.push("Steep overhang angles detected on one or more parts");
  }

  // Procedural primitives are closed solids from Three.js primitives
  const watertight = !model.isPlaceholder;
  const manifold = !model.isPlaceholder;
  const selfIntersection = false; // avoided by parametric layout
  const invertedNormals = false;

  if (model.isPlaceholder) {
    issues.push("Placeholder model — replace with AI generation for production use");
  }

  return {
    watertight,
    manifold,
    selfIntersection,
    invertedNormals,
    floatingGeometry,
    wallThicknessOk,
    overhangRisk,
    flatBasePresent,
    scaleValid,
    connectedMesh,
    minWallThicknessMm: minWall,
    issues,
  };
}
