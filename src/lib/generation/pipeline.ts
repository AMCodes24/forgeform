import type {
  GenerationParams,
  GenerationResult,
  PipelineStep,
  PipelineStageId,
} from "@/types";
import { detectCategory } from "./detectCategory";
import { generateProcedural } from "./procedural";
import { analyzeMesh } from "@/lib/mesh/analyze";
import { repairMesh } from "@/lib/mesh/repair";
import { buildPrintabilityReport } from "@/lib/printability/analyzer";

const STAGE_ORDER: PipelineStageId[] = [
  "prompt_submitted",
  "model_generation",
  "geometry_cleanup",
  "printability_validation",
  "automatic_repair",
  "export_preparation",
  "ready",
];

const STAGE_LABELS: Record<PipelineStageId, string> = {
  prompt_submitted: "Prompt Submitted",
  model_generation: "Model Generation",
  geometry_cleanup: "Geometry Cleanup",
  printability_validation: "Printability Validation",
  automatic_repair: "Automatic Repair",
  export_preparation: "Export Preparation",
  ready: "Ready For Printing",
};

function createPipeline(): PipelineStep[] {
  return STAGE_ORDER.map((id) => ({
    id,
    label: STAGE_LABELS[id],
    status: "pending" as const,
  }));
}

function setStep(
  pipeline: PipelineStep[],
  id: PipelineStageId,
  status: PipelineStep["status"],
  message?: string
): void {
  const idx = pipeline.findIndex((s) => s.id === id);
  if (idx === -1) return;
  pipeline[idx] = {
    id,
    label: STAGE_LABELS[id],
    status,
    message,
  };
}

export async function runGenerationPipeline(
  params: GenerationParams
): Promise<GenerationResult> {
  const pipeline = createPipeline();
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  setStep(
    pipeline,
    "prompt_submitted",
    "complete",
    `Analyzing: "${params.prompt.slice(0, 60)}"`
  );

  await delay(120);

  const match = detectCategory(params.prompt);
  setStep(
    pipeline,
    "model_generation",
    "active",
    `Category: ${match.category} (${match.matchedKeywords.join(", ") || "parametric"})`
  );

  await delay(200);

  let model = generateProcedural(params, match);
  setStep(
    pipeline,
    "model_generation",
    "complete",
    `${model.primitives.length} parametric parts generated`
  );

  setStep(pipeline, "geometry_cleanup", "active");
  await delay(100);
  setStep(pipeline, "geometry_cleanup", "complete", "Merged primitive tree");

  setStep(pipeline, "printability_validation", "active");
  await delay(150);

  let meshAnalysis = analyzeMesh(model);
  setStep(
    pipeline,
    "printability_validation",
    "complete",
    `${meshAnalysis.issues.length} checks evaluated`
  );

  setStep(pipeline, "automatic_repair", "active");
  await delay(120);

  const { model: repairedModel, report: repairs } = repairMesh(model);
  model = repairedModel;
  meshAnalysis = analyzeMesh(model);
  setStep(
    pipeline,
    "automatic_repair",
    "complete",
    repairs.applied.length
      ? repairs.applied.slice(0, 2).join("; ")
      : "No repairs needed"
  );

  const printability = buildPrintabilityReport(
    model,
    params,
    meshAnalysis,
    repairs
  );

  setStep(pipeline, "export_preparation", "active");
  await delay(80);
  setStep(
    pipeline,
    "export_preparation",
    "complete",
    printability.stlExportAllowed
      ? "STL export enabled"
      : "STL blocked until printability improves"
  );

  setStep(
    pipeline,
    "ready",
    "complete",
    `Printability ${printability.score}/100 — ${printability.estimatedPrintTimeFormatted}`
  );

  return {
    model,
    printability,
    meshAnalysis,
    repairs,
    pipeline,
  };
}
