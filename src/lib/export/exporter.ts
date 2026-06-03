import type { ExportFormat, GeneratedModelData } from "@/types";

/**
 * MVP placeholder export — produces valid-ish file headers.
 * Replace with Three.js STLExporter / OBJExporter / GLTFExporter.
 * @see ./INTEGRATIONS.md
 */

function buildStlPlaceholder(model: GeneratedModelData): string {
  const name = model.name.replace(/[^a-zA-Z0-9]/g, "_");
  return `solid ${name}
  facet normal 0 0 1
    outer loop
      vertex 0 0 0
      vertex 1 0 0
      vertex 0 1 0
    endloop
  endfacet
endsolid ${name}
`;
}

function buildObjPlaceholder(model: GeneratedModelData): string {
  return `# ForgeForm OBJ export — ${model.name}
# Replace with GLTFExporter/OBJExporter mesh data
o ${model.name.replace(/\s/g, "_")}
v 0 0 0
v 1 0 0
v 0 1 0
f 1 2 3
`;
}

function buildGlbPlaceholder(model: GeneratedModelData): ArrayBuffer {
  const json = JSON.stringify({
    asset: { version: "2.0", generator: "ForgeForm MVP" },
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: model.name }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
    accessors: [{ componentType: 5126, count: 3, type: "VEC3" }],
    buffers: [{ byteLength: 36 }],
    bufferViews: [{ buffer: 0, byteLength: 36 }],
    meta: { forgeform: "placeholder-glb" },
  });
  const encoder = new TextEncoder();
  const jsonBytes = encoder.encode(json);
  const header = new ArrayBuffer(12);
  const view = new DataView(header);
  view.setUint32(0, 0x46546c67, true);
  view.setUint32(4, 2, true);
  view.setUint32(8, 12 + jsonBytes.length, true);
  const combined = new Uint8Array(12 + 8 + jsonBytes.length);
  combined.set(new Uint8Array(header), 0);
  const chunkHeader = new DataView(combined.buffer, 12, 8);
  chunkHeader.setUint32(0, jsonBytes.length, true);
  chunkHeader.setUint32(4, 0x4e4f534a, true);
  combined.set(jsonBytes, 20);
  return combined.buffer;
}

export function buildExportBlob(
  model: GeneratedModelData,
  format: ExportFormat
): { blob: Blob; fileName: string; mimeType: string } {
  const safeName = model.name.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 50);

  switch (format) {
    case "stl":
      return {
        blob: new Blob([buildStlPlaceholder(model)], { type: "model/stl" }),
        fileName: `${safeName}.stl`,
        mimeType: "model/stl",
      };
    case "obj":
      return {
        blob: new Blob([buildObjPlaceholder(model)], { type: "text/plain" }),
        fileName: `${safeName}.obj`,
        mimeType: "model/obj",
      };
    case "glb":
      return {
        blob: new Blob([buildGlbPlaceholder(model)], { type: "model/gltf-binary" }),
        fileName: `${safeName}.glb`,
        mimeType: "model/gltf-binary",
      };
  }
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
