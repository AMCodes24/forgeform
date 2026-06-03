import type { GenerationProvider } from "../types";

export const lumaProvider: GenerationProvider = {
  name: "luma",
  async generate() {
    throw new Error("Luma provider not configured. See INTEGRATIONS.md");
  },
};
