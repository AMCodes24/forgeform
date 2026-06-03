import type { GenerationProvider } from "../types";

export const rodinProvider: GenerationProvider = {
  name: "rodin",
  async generate() {
    throw new Error("Rodin provider not configured. See INTEGRATIONS.md");
  },
};
