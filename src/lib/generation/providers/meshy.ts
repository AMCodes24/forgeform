import type { GenerationProvider } from "../types";

/**
 * Meshy text-to-3D integration stub.
 * @see ../INTEGRATIONS.md
 */
export const meshyProvider: GenerationProvider = {
  name: "meshy",
  async generate() {
    throw new Error(
      "Meshy provider not configured. Set MESHY_API_KEY and implement providers/meshy.ts"
    );
  },
};
