import type { GenerationProvider } from "../types";

export const tripoProvider: GenerationProvider = {
  name: "tripo",
  async generate() {
    throw new Error("Tripo provider not configured. See INTEGRATIONS.md");
  },
};
