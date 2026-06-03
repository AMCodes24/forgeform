# 3D Generation Integration Guide

ForgeForm v2 uses **parametric procedural generators** per category (dragon keychain, phone stand, cabin, etc.). AI providers plug in via the same `GenerationProvider` interface.

## Architecture

```
src/lib/generation/
├── index.ts                 # generateWithPipeline()
├── pipeline.ts              # Full pipeline: generate → analyze → repair → report
├── detectCategory.ts        # Keyword → category routing
├── procedural/              # Parametric CAD generators (active)
│   ├── dragon-keychain.ts
│   ├── phone-stand.ts
│   ├── cabin.ts
│   └── ...
├── providers/               # External AI (stubs)
│   ├── meshy.ts
│   ├── tripo.ts
│   ├── rodin.ts
│   └── luma.ts
└── INTEGRATIONS.md
```

## Pipeline Stages

1. Prompt submitted → category detection  
2. Model generation → procedural or AI provider  
3. Geometry cleanup  
4. Printability validation (`src/lib/mesh/analyze.ts`)  
5. Automatic repair (`src/lib/mesh/repair.ts`)  
6. Export preparation  
7. Ready for printing  

## Adding Meshy / Tripo / Rodin / Luma

1. Implement `GenerationProvider` in `providers/your-provider.ts`
2. Return `GeneratedModelData` with `primitives[]` or a `meshUrl` field (extend types)
3. Register in `index.ts` and set `GENERATION_PROVIDER=meshy`
4. Run mesh analysis + repair on downloaded geometry before export

### Meshy example flow

```typescript
// Poll text-to-3d job → download GLB → parse to primitives OR store URL
// Pass through repairMesh() after converting to ModelPrimitive[]
```

## Blender / OpenAI workflows

- **Blender**: Server-side automation script → GLB → storage → viewer loads via `useGLTF`
- **OpenAI**: Assist with category + parametric params, then call procedural generator

## Printability

- Analysis: `src/lib/mesh/analyze.ts`
- Repair: `src/lib/mesh/repair.ts`
- Report: `src/lib/printability/analyzer.ts`
- STL export gated by `printability.stlExportAllowed`
