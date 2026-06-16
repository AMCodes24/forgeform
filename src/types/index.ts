export type ExportFormat = "stl" | "obj" | "glb";

export type DetailLevel = "low" | "medium" | "high";
export type DifficultyRating = "easy" | "moderate" | "challenging" | "expert";

export type ModelCategory =
  | "dragon-keychain"
  | "keychain"
  | "phone-stand"
  | "cabin"
  | "furniture"
  | "planter"
  | "holder"
  | "generic"
  | "unclassified";

export type GenerationProviderId =
  | "procedural"
  | "meshy"
  | "tripo"
  | "rodin"
  | "luma"
  | "blender";

export type PipelineStageId =
  | "prompt_submitted"
  | "model_generation"
  | "geometry_cleanup"
  | "printability_validation"
  | "automatic_repair"
  | "export_preparation"
  | "ready";

export interface GenerationParams {
  prompt: string;
  width?: number;
  height?: number;
  depth?: number;
  style?: string;
  material?: string;
  detailLevel?: DetailLevel;
  intendedUse?: string;
}

export type PrimitiveType =
  | "box"
  | "sphere"
  | "cylinder"
  | "cone"
  | "torus"
  | "compound";

export interface ModelPrimitive {
  type: PrimitiveType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  metalness?: number;
  roughness?: number;
  /** Minimum wall thickness in mm for this part */
  minThicknessMm?: number;
}

export interface GeneratedModelData {
  primitives: ModelPrimitive[];
  name: string;
  provider: GenerationProviderId;
  category: ModelCategory;
  isPlaceholder: boolean;
  metadata: {
    prompt: string;
    style: string;
    material: string;
    dimensions: { width: number; height: number; depth: number };
    parametric?: Record<string, number | string>;
    generatorVersion: string;
  };
}

export interface PrintabilityCheck {
  id: string;
  label: string;
  passed: boolean;
  severity: "pass" | "warn" | "fail";
  message?: string;
}

export interface PrintabilityReport {
  estimatedPrintSize: string;
  estimatedMaterialGrams: number;
  estimatedPrintTimeHours: number;
  estimatedPrintTimeFormatted: string;
  estimatedCostUsd: number;
  materialLabel: string;
  supportRequired: boolean;
  supportPercentage: number;
  overhangWarnings: string[];
  thinWallWarnings: string[];
  difficultyRating: DifficultyRating;
  score: number;
  notes: string[];
  checks: PrintabilityCheck[];
  stlExportAllowed: boolean;
  repairsApplied: string[];
}

export interface MeshAnalysisReport {
  watertight: boolean;
  manifold: boolean;
  selfIntersection: boolean;
  invertedNormals: boolean;
  floatingGeometry: boolean;
  wallThicknessOk: boolean;
  overhangRisk: boolean;
  flatBasePresent: boolean;
  scaleValid: boolean;
  connectedMesh: boolean;
  minWallThicknessMm: number;
  issues: string[];
}

export interface RepairReport {
  applied: string[];
  primitivesRemoved: number;
  primitivesAdjusted: number;
}

export interface PipelineStep {
  id: PipelineStageId;
  label: string;
  status: "pending" | "active" | "complete" | "error";
  message?: string;
}

export interface GenerationResult {
  model: GeneratedModelData;
  printability: PrintabilityReport;
  meshAnalysis: MeshAnalysisReport;
  repairs: RepairReport;
  pipeline: PipelineStep[];
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  width: number;
  height: number;
  depth: number;
  style: string;
  material: string;
  detail_level: string;
  intended_use: string;
  model_data: GeneratedModelData;
  printability: PrintabilityReport;
  printability_score: number;
  thumbnail_color: string;
  export_count: number;
  created_at: string;
  updated_at: string;
}

export interface ExportRecord {
  id: string;
  project_id: string;
  user_id: string;
  format: ExportFormat;
  file_name: string;
  created_at: string;
}

export interface DashboardStats {
  totalProjects: number;
  recentModels: Project[];
  exportCount: number;
  savedModels: number;
  generationHistory: { date: string; count: number }[];
}
