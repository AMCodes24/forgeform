# ForgeForm

**Turn Ideas Into Printable Reality**

ForgeForm is a full-stack platform for generating 3D-printable models from natural language. Describe an object, customize dimensions and style, preview in an interactive 3D viewer, analyze printability, and export for your 3D printer.

## Features

- **Text-to-3D** — Natural language model generation (placeholder geometry; AI-ready architecture)
- **Interactive 3D Viewer** — React Three Fiber with orbit controls, lighting, and shadows
- **Printability Analysis** — Size, material, time, supports, overhangs, thin walls, difficulty score
- **Export** — STL, OBJ, GLB (placeholder files; integration docs included)
- **User Accounts** — Supabase authentication
- **Project Gallery** — Save, reopen, search, and manage projects
- **Dashboard** — Stats, recent models, generation history

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Supabase (Auth + PostgreSQL)
- React Three Fiber + Three.js
- Framer Motion

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and add your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the schema in the Supabase SQL editor:

```bash
# File: supabase/schema.sql
```

4. Enable Email auth in Supabase Dashboard → Authentication → Providers

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js pages & API routes
│   ├── api/generate/       # Model generation endpoint
│   ├── api/projects/       # CRUD for saved projects
│   ├── api/exports/        # Export history
│   ├── api/dashboard/      # Dashboard stats
│   ├── studio/             # Main creation workspace
│   ├── gallery/            # Saved projects
│   └── dashboard/          # User overview
├── components/
│   ├── viewer/             # React Three Fiber 3D viewer
│   ├── studio/             # Generation, printability, export UI
│   ├── gallery/            # Project cards
│   └── dashboard/          # Stats & charts
├── lib/
│   ├── generation/         # Generation pipeline (see INTEGRATIONS.md)
│   ├── printability/       # Printability analyzer
│   └── export/             # Export system (see INTEGRATIONS.md)
└── types/                  # Shared TypeScript types
```

## Future Integrations

| Feature | Location |
|---------|----------|
| Meshy / Tripo / Blender AI | `src/lib/generation/INTEGRATIONS.md` |
| Real STL/OBJ/GLB export | `src/lib/export/INTEGRATIONS.md` |
| Image-to-3D | Add provider in `generation/providers/` |
| Marketplace, teams, printer APIs | Extend `types/` and new `app/` routes |

Set `GENERATION_PROVIDER=meshy` (when implemented) to switch providers.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT
