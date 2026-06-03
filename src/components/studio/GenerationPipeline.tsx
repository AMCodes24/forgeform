"use client";

import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStep } from "@/types";

export function GenerationPipeline({
  steps,
  active,
}: {
  steps: PipelineStep[];
  active: boolean;
}) {
  if (steps.length === 0 && !active) return null;

  const displaySteps =
    steps.length > 0
      ? steps
      : [
          {
            id: "prompt_submitted" as const,
            label: "Prompt Submitted",
            status: "active" as const,
          },
        ];

  return (
    <div className="glass-card p-4">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
        Generation Pipeline
      </p>
      <ol className="space-y-2">
        {displaySteps.map((step, i) => {
          const isLast = i === displaySteps.length - 1;
          return (
            <li key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StepIcon status={step.status} active={active} />
                {!isLast && (
                  <div
                    className={cn(
                      "w-px flex-1 min-h-[20px] mt-1",
                      step.status === "complete"
                        ? "bg-forge-500/40"
                        : "bg-border"
                    )}
                  />
                )}
              </div>
              <div className="pb-3 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.status === "active"
                      ? "text-forge-400"
                      : step.status === "complete"
                        ? "text-zinc-200"
                        : "text-zinc-500"
                  )}
                >
                  {step.label}
                </p>
                {step.message && (
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">
                    {step.message}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepIcon({
  status,
  active,
}: {
  status: PipelineStep["status"];
  active: boolean;
}) {
  if (status === "complete") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
        <Check className="h-3.5 w-3.5" />
      </div>
    );
  }
  if (status === "active" || (active && status === "pending")) {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-forge-500/20 text-forge-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-zinc-600">
      <Circle className="h-3 w-3" />
    </div>
  );
}
