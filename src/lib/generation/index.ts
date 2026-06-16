/**
 * Generation pipeline — procedural parametric engine.
 * External providers: implement GenerationProvider and register in providers map.
 * @see ../../../docs/ARCHITECTURE.md
 */

import type { GeneratedModelData, GenerationParams, GenerationResult } from "@/types";
import { runGenerationPipeline } from "./pipeline";

export async function generateModel(
  params: GenerationParams
): Promise<GeneratedModelData> {
  const result = await runGenerationPipeline(params);
  return result.model;
}

export async function generateWithPipeline(
  params: GenerationParams
): Promise<GenerationResult> {
  return runGenerationPipeline(params);
}

export { runGenerationPipeline };
