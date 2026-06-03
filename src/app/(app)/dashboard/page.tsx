"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentModels } from "@/components/dashboard/RecentModels";
import { GenerationChart } from "@/components/dashboard/GenerationChart";
import { ExportHistory } from "@/components/dashboard/ExportHistory";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => {
        if (r.status === 401) {
          setUnauthorized(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.stats) setStats(data.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Overview of your projects and activity
          </p>
        </div>
        <Link href="/studio">
          <Button>
            <Plus className="h-4 w-4" />
            New Model
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-forge-500/30 border-t-forge-500" />
        </div>
      ) : unauthorized ? (
        <div className="glass-card p-12 text-center">
          <p className="text-zinc-500 mb-4">Sign in to view your dashboard.</p>
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          <StatsCards stats={stats} />
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentModels projects={stats.recentModels} />
            <GenerationChart history={stats.generationHistory} />
          </div>
          <ExportHistory />
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-zinc-500 mb-4">
            No projects yet. Create your first model in the Studio.
          </p>
          <Link href="/studio">
            <Button>Open Studio</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
