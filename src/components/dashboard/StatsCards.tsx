"use client";

import { motion } from "framer-motion";
import { Box, Download, FolderOpen, History } from "lucide-react";
import type { DashboardStats } from "@/types";

const icons = [Box, Download, FolderOpen, History];

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Total Projects", value: stats.totalProjects, icon: icons[0] },
    { label: "Exports", value: stats.exportCount, icon: icons[1] },
    { label: "Saved Models", value: stats.savedModels, icon: icons[2] },
    {
      label: "This Week",
      value: stats.generationHistory.slice(-7).reduce((a, b) => a + b.count, 0),
      icon: icons[3],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between">
            <card.icon className="h-5 w-5 text-forge-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-zinc-100">{card.value}</p>
          <p className="text-sm text-zinc-500">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
