"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function GenerationChart({
  history,
}: {
  history: { date: string; count: number }[];
}) {
  const max = Math.max(...history.map((h) => h.count), 1);

  if (history.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Generation History</CardTitle>
        </CardHeader>
        <p className="text-sm text-zinc-500">No generation activity yet.</p>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Generation History</CardTitle>
      </CardHeader>
      <div className="flex items-end gap-1.5 h-32 pt-4">
        {history.map((item) => (
          <div
            key={item.date}
            className="flex-1 flex flex-col items-center gap-1 group"
          >
            <div
              className="w-full rounded-t-md bg-forge-500/80 group-hover:bg-forge-400 transition-all min-h-[4px]"
              style={{ height: `${(item.count / max) * 100}%` }}
              title={`${item.date}: ${item.count}`}
            />
            <span className="text-[10px] text-zinc-600 truncate w-full text-center">
              {new Date(item.date).toLocaleDateString("en", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
