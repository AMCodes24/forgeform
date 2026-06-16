# ForgeForm

**Turn Ideas Into Printable Reality**

ForgeForm is a full-stack platform that transforms natural-language descriptions into parametric 3D models, validates them for additive manufacturing, and exports production-ready files.

**Live repository:** [github.com/AMCodes24/forgeform](https://github.com/AMCodes24/forgeform)

---

## Overview

ForgeForm targets makers, engineers, product designers, and educators who need a fast path from concept to printable geometry. Users describe an object, customize dimensions and material settings, preview the model in an interactive 3D viewer, review a printability report, and export STL, OBJ, or GLB files.

The generation engine uses **category-aware parametric modeling** — prompts like *"A dragon keychain with curled tail"* produce recognizable, purpose-built geometry (head, wings, curled tail, keyring loop) rather than generic shapes.

---

## Features

### 3D Model Generation
- Natural-language prompt input with example suggestions
- Keyword-based category detection (keychains, phone stands, cabins, furniture, holders, planters)
- Parametric CAD builders with dimension-driven output (width, height, depth in mm)
- Style, material, detail level, and intended-use settings

### Printable Model Workflow
- Seven-stage generation pipeline with live progress UI
- Geometry cleanup and automatic mesh repair
- Printability score (0–100) with pass/warn/fail checks
- Estimates for print time, filament usage, and material cost
- STL export gated until printability requirements are met

### Model Customization
- Adjustable width, height, and depth (5–500 mm)
- Style presets: modern, minimalist, organic, industrial, playful, and more
- Material selection: PLA, PETG, ABS, resin, TPU
- Detail levels: low, medium, high

### Interactive 3D Viewer
- React Three Fiber + Three.js
- Orbit, pan, and zoom controls
- Professional lighting, shadows, and environment maps

### Design Validation
- Watertight and manifold mesh checks
- Wall thickness, scale, flat-base, and connectivity analysis
- Overhang and floating-geometry warnings
- Automatic repair: thin walls, disconnected fragments, missing base plates

### Export Formats
- **STL** — slicer-ready (requires passing printability checks)
- **OBJ** — mesh interchange
- **GLB** — compact 3D asset

Exports serialize real mesh geometry via Three.js exporters.

### Fabrication & Project Management
- Supabase authentication (email/password)
- Save, update, and reopen projects
- Project gallery with search and delete
- Dashboard with stats, recent models, export history, and generation chart

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| 3D | React Three Fiber, Three.js, three-stdlib |
| Auth & DB | Supabase (Auth + PostgreSQL) |
| Validation | Zod |
| Animation | Framer Motion |

---

## Architecture

```
src/
├── app/                  # Pages and API routes
│   ├── studio/           # Creation workspace
│   ├── gallery/          # Saved projects
│   ├── dashboard/        # User overview
│   └── api/
│       ├── generate/     # Generation pipeline
│       ├── projects/     # Project CRUD
│       ├── exports/      # Export history
│       └── auth/         # Server-side auth
├── components/           # UI, viewer, studio panels
├── lib/
│   ├── generation/       # Category detection + procedural builders
│   ├── mesh/             # Analysis and repair
│   ├── printability/     # Scoring and estimates
│   └── export/           # Mesh serialization
└── types/                # Shared TypeScript types
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for pipeline details and extension points.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- A [Supabase](https://supabase.com) project (free tier works)

### Installation

```bash
git clone https://github.com/AMCodes24/forgeform.git
cd forgeform
npm install
```

### Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database

1. Open Supabase Dashboard → **SQL Editor**
2. Paste and run the full contents of `supabase/schema.sql`
3. Enable **Email** auth under Authentication → Providers
4. Set Site URL to `http://localhost:3000` under Authentication → URL configuration

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `GENERATION_PROVIDER` | No | Future: external provider id |
| `MESHY_API_KEY` | No | Future: Meshy integration |
| `TRIPO_API_KEY` | No | Future: Tripo integration |

Never commit `.env.local` or service role keys.

---

## Security

- `.env.local` and all `*.local` env files are gitignored
- Only the Supabase **anon** key is exposed to the browser (by design)
- Row Level Security isolates user data in PostgreSQL
- Auth requests route through server API handlers

---

## License

MIT — see [LICENSE](LICENSE).

---

## Author

**AMCodes24** — [GitHub](https://github.com/AMCodes24)
