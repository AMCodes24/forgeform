"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  Layers,
  Sparkles,
  Printer,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_NAME, TAGLINE, EXAMPLE_PROMPTS } from "@/lib/constants";
import type { User } from "@supabase/supabase-js";

const features = [
  {
    icon: Sparkles,
    title: "Text-to-3D",
    desc: "Describe any object in plain language and get a printable 3D model in seconds.",
  },
  {
    icon: Box,
    title: "Interactive Preview",
    desc: "Rotate, pan, and zoom your model with professional lighting and shadows.",
  },
  {
    icon: Shield,
    title: "Printability Analysis",
    desc: "Get material estimates, support warnings, and difficulty ratings before you print.",
  },
  {
    icon: Printer,
    title: "Export Ready",
    desc: "Download STL, OBJ, or GLB files ready for your slicer and 3D printer.",
  },
  {
    icon: Layers,
    title: "Project Gallery",
    desc: "Save, organize, and reopen all your creations with full project history.",
  },
  {
    icon: Zap,
    title: "Maker-First",
    desc: "Built for hobbyists, engineers, educators, and product designers.",
  },
];

export function LandingPage({ user }: { user: User | null }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forge-900/30 via-surface to-surface" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-forge-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-forge-500/30 bg-forge-500/10 px-4 py-1.5 text-sm text-forge-400 mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered 3D Creation
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-gradient-forge">{APP_NAME}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400 sm:text-xl">
            {TAGLINE}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
            Describe what you want to build. Customize dimensions and style.
            Preview in 3D, check printability, and export for your printer.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/studio" : "/signup"}>
              <Button size="lg" className="glow-forge min-w-[200px]">
                Start Creating
              </Button>
            </Link>
            <Link href={user ? "/dashboard" : "/login"}>
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                {user ? "Go to Dashboard" : "Sign In"}
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 mx-auto max-w-4xl rounded-2xl border border-border bg-surface-card/50 p-6 glow-forge backdrop-blur"
        >
          <p className="text-left text-sm text-zinc-500 mb-3">Try describing:</p>
          <div className="flex flex-wrap gap-2 justify-start">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <span
                key={prompt}
                className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-sm text-zinc-400"
              >
                &ldquo;{prompt}&rdquo;
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold mb-4">
          Everything makers need
        </h2>
        <p className="text-center text-zinc-500 mb-12 max-w-lg mx-auto">
          From idea to printable file — one platform for the entire workflow.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 hover:border-forge-500/30 transition-colors"
            >
              <f.icon className="h-8 w-8 text-forge-500 mb-4" />
              <h3 className="text-lg font-semibold text-zinc-100">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to forge something new?</h2>
        <p className="text-zinc-500 mb-8">
          Join makers, engineers, and creators turning ideas into printable reality.
        </p>
        <Link href="/signup">
          <Button size="lg">Create Free Account</Button>
        </Link>
      </section>
    </div>
  );
}
