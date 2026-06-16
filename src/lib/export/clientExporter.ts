import type { ExportFormat, GeneratedModelData } from "@/types";
import { buildGroupFromModel } from "./buildThreeGroup";

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 50);
}

export async function exportModelMesh(
  model: GeneratedModelData,
  format: ExportFormat
): Promise<{ blob: Blob; fileName: string }> {
  const { STLExporter, OBJExporter, GLTFExporter } = await import("three-stdlib");
  const group = buildGroupFromModel(model);
  const baseName = safeFileName(model.name);

  switch (format) {
    case "stl": {
      const exporter = new STLExporter();
      const output = exporter.parse(group);
      return {
        blob: new Blob([output], { type: "model/stl" }),
        fileName: `${baseName}.stl`,
      };
    }
    case "obj": {
      const exporter = new OBJExporter();
      const output = exporter.parse(group);
      return {
        blob: new Blob([output], { type: "text/plain" }),
        fileName: `${baseName}.obj`,
      };
    }
    case "glb": {
      const exporter = new GLTFExporter();
      const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        exporter.parse(
          group,
          (result) => {
            if (result instanceof ArrayBuffer) {
              resolve(result);
            } else {
              reject(new Error("Expected binary GLB output"));
            }
          },
          (error) => reject(error instanceof Error ? error : new Error(String(error))),
          { binary: true }
        );
      });
      return {
        blob: new Blob([buffer], { type: "model/gltf-binary" }),
        fileName: `${baseName}.glb`,
      };
    }
  }
}

export { downloadBlob } from "./download";
