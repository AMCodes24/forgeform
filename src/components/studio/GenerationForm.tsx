"use client";

import { useState, useEffect } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import {
  EXAMPLE_PROMPTS,
  STYLES,
  MATERIALS,
  DETAIL_LEVELS,
  INTENDED_USES,
} from "@/lib/constants";
import type { DetailLevel, GenerationParams } from "@/types";

interface GenerationFormProps {
  onGenerate: (params: GenerationParams) => void;
  loading: boolean;
  initialValues?: GenerationParams | null;
}

export function GenerationForm({
  onGenerate,
  loading,
  initialValues,
}: GenerationFormProps) {
  const [prompt, setPrompt] = useState(initialValues?.prompt ?? "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [width, setWidth] = useState(initialValues?.width ?? 50);
  const [height, setHeight] = useState(initialValues?.height ?? 50);
  const [depth, setDepth] = useState(initialValues?.depth ?? 50);
  const [style, setStyle] = useState(initialValues?.style ?? "modern");
  const [material, setMaterial] = useState(initialValues?.material ?? "pla");
  const [detailLevel, setDetailLevel] = useState<DetailLevel>(
    initialValues?.detailLevel ?? "medium"
  );
  const [intendedUse, setIntendedUse] = useState(
    initialValues?.intendedUse ?? "decorative"
  );

  useEffect(() => {
    if (!initialValues) return;
    setPrompt(initialValues.prompt);
    setWidth(initialValues.width ?? 50);
    setHeight(initialValues.height ?? 50);
    setDepth(initialValues.depth ?? 50);
    setStyle(initialValues.style ?? "modern");
    setMaterial(initialValues.material ?? "pla");
    setDetailLevel(initialValues.detailLevel ?? "medium");
    setIntendedUse(initialValues.intendedUse ?? "decorative");
    setShowAdvanced(true);
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({
      prompt: prompt.trim(),
      width,
      height,
      depth,
      style,
      material,
      detailLevel,
      intendedUse,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="prompt">Describe your model</Label>
        <Textarea
          id="prompt"
          rows={4}
          placeholder='e.g. "A dragon keychain with curled tail"'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {EXAMPLE_PROMPTS.slice(0, 3).map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPrompt(ex)}
              className="rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-xs text-zinc-500 hover:border-forge-500/50 hover:text-forge-400 transition-colors"
            >
              {ex.length > 28 ? ex.slice(0, 28) + "…" : ex}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex w-full items-center justify-between rounded-lg px-1 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <span>Dimensions & style options</span>
        {showAdvanced ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {showAdvanced && (
        <div className="space-y-4 rounded-xl border border-border bg-surface-elevated/50 p-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="width">Width (mm)</Label>
              <Input
                id="width"
                type="number"
                min={5}
                max={500}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="height">Height (mm)</Label>
              <Input
                id="height"
                type="number"
                min={5}
                max={500}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="depth">Depth (mm)</Label>
              <Input
                id="depth"
                type="number"
                min={5}
                max={500}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="style">Style</Label>
              <Select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="material">Material</Label>
              <Select
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              >
                {MATERIALS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="detail">Detail Level</Label>
              <Select
                id="detail"
                value={detailLevel}
                onChange={(e) => setDetailLevel(e.target.value as DetailLevel)}
              >
                {DETAIL_LEVELS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="use">Intended Use</Label>
              <Select
                id="use"
                value={intendedUse}
                onChange={(e) => setIntendedUse(e.target.value)}
              >
                {INTENDED_USES.map((u) => (
                  <option key={u} value={u}>
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        <Sparkles className="h-4 w-4" />
        Generate 3D Model
      </Button>
    </form>
  );
}
