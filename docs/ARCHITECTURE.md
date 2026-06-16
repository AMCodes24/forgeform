# ForgeForm Architecture

ForgeForm is a full-stack web application for prompt-driven, parametric 3D model generation with print-readiness validation and export.

## System Overview

```
Browser (Next.js App Router)
├── Studio UI          → generation form, 3D viewer, pipeline, export
├── Dashboard / Gallery → saved projects (Supabase)
└── API Routes         → /api/generate, /api/projects, /api/auth/*

Generation Pipeline (server)
├── detectCategory     → keyword routing
├── procedural/*       → parametric CAD builders
├── mesh/analyze       → printability geometry checks
├── mesh/repair        → automatic mesh fixes
└── printability/*     → score, estimates, export gates

Export (client)
├── buildThreeGroup    → Three.js scene from primitives
└── clientExporter     → STL / OBJ / GLB via three-stdlib
```

## Generation Pipeline

| Stage | Module | Responsibility |
|-------|--------|----------------|
| Prompt submitted | `pipeline.ts` | Validate input, detect category |
| Model generation | `procedural/` | Build parametric geometry |
| Geometry cleanup | `pipeline.ts` | Normalize primitive tree |
| Printability validation | `mesh/analyze.ts` | Watertight, walls, scale, connectivity |
| Automatic repair | `mesh/repair.ts` | Thin walls, floating parts, base plate |
| Export preparation | `printability/analyzer.ts` | STL gate, cost/time estimates |
| Ready | API response | Model + report + pipeline log |

## Category Generators

| Category | Trigger keywords | Output |
|----------|------------------|--------|
| Dragon keychain | dragon, keychain | Head, wings, curled tail, ring, flat base |
| Phone stand | phone stand, desk stand | Base, angled back, lip, brace |
| Cabin | cabin, cottage, house | Walls, roof, door, windows |
| Furniture | table, chair, desk | Legs, surface, proportions |
| Keychain | keychain, charm | Ring + emblem |
| Holder / Planter | holder, planter | Functional geometry |
| Unclassified | no match | Labeled fallback model |

## Extensibility

External text-to-3D providers integrate via `GenerationProvider` (`src/lib/generation/types.ts`):

1. Implement `generate(params)` returning `GeneratedModelData`
2. Register in `src/lib/generation/index.ts`
3. Set `GENERATION_PROVIDER` in environment
4. Run output through `repairMesh()` and `analyzeMesh()` before export

Supported extension points: Meshy, Tripo, Rodin, Luma, Blender automation, text-to-CAD pipelines.

## Data Model

- **projects** — user models, prompts, dimensions, `model_data` JSON, printability report
- **exports** — export history per project (format, filename, timestamp)

Row Level Security enforces per-user access. Schema: `supabase/schema.sql`.

## Security

- Secrets live in `.env.local` only (gitignored)
- `NEXT_PUBLIC_*` vars are anon keys safe for browser exposure
- Auth flows through server API routes (`/api/auth/*`) with cookie sessions
- Never commit service role keys
