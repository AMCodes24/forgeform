# Export System Integration Guide

## Current Implementation

Client-side exports in `clientExporter.ts` serialize the generated mesh using Three.js `STLExporter`, `OBJExporter`, and `GLTFExporter` via `buildThreeGroup.ts`.

`exporter.ts` remains for server-side or fallback use cases.

## Recommended Libraries

- **STL**: `three/examples/jsm/exporters/STLExporter` or `three-stl-loader` reverse
- **OBJ**: `OBJExporter` from three/examples
- **GLB**: `GLTFExporter` from three/examples

## Integration Steps

1. In the Studio, build a Three.js `Group` from `ModelPrimitive[]` (see `ModelScene.tsx`)
2. Pass the group to exporters in `src/lib/export/exporter.ts`
3. Return `Blob` for client download or upload to Supabase Storage

## Supabase Storage (optional)

Store exports in bucket `exports/{userId}/{projectId}/{filename}` and save signed URLs in `exports` table.
