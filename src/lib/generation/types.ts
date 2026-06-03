import type { GeneratedModelData, GenerationParams, GenerationProviderId } from "@/types";

export interface GenerationProvider {
  name: GenerationProviderId;
  generate(params: GenerationParams): Promise<GeneratedModelData>;
}
