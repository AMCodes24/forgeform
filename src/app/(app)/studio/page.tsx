"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Save, Check } from "lucide-react";
import { GenerationForm } from "@/components/studio/GenerationForm";
import { PrintabilityPanel } from "@/components/studio/PrintabilityPanel";
import { ExportPanel } from "@/components/studio/ExportPanel";
import { GenerationPipeline } from "@/components/studio/GenerationPipeline";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { DatabaseSetupBanner } from "@/components/auth/DatabaseSetupBanner";
import type {
  GeneratedModelData,
  GenerationParams,
  GenerationResult,
  PipelineStep,
  PrintabilityReport,
  Project,
} from "@/types";

const ModelViewer = dynamic(
  () =>
    import("@/components/viewer/ModelViewer").then((m) => m.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-zinc-500">
        Loading 3D viewer…
      </div>
    ),
  }
);

const PIPELINE_PREVIEW: PipelineStep[] = [
  { id: "prompt_submitted", label: "Prompt Submitted", status: "complete" },
  { id: "model_generation", label: "Model Generation", status: "active" },
  { id: "geometry_cleanup", label: "Geometry Cleanup", status: "pending" },
  { id: "printability_validation", label: "Printability Validation", status: "pending" },
  { id: "automatic_repair", label: "Automatic Repair", status: "pending" },
  { id: "export_preparation", label: "Export Preparation", status: "pending" },
  { id: "ready", label: "Ready For Printing", status: "pending" },
];

function StudioContent() {
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get("project");
  const { toast } = useToast();

  const [model, setModel] = useState<GeneratedModelData | null>(null);
  const [printability, setPrintability] = useState<PrintabilityReport | null>(
    null
  );
  const [pipeline, setPipeline] = useState<PipelineStep[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [projectId, setProjectId] = useState<string | undefined>();
  const [formValues, setFormValues] = useState<GenerationParams | null>(null);
  const [loadingProject, setLoadingProject] = useState(!!projectIdParam);

  useEffect(() => {
    if (!projectIdParam) {
      setLoadingProject(false);
      return;
    }

    setLoadingProject(true);
    fetch(`/api/projects/${projectIdParam}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.project) {
          toast("Project not found", "error");
          return;
        }
        const p = data.project as Project;
        setModel(p.model_data);
        setPrintability(p.printability);
        setProjectId(p.id);
        setPipeline([
          {
            id: "ready",
            label: "Ready For Printing",
            status: "complete",
            message: "Loaded from saved project",
          },
        ]);
        setFormValues({
          prompt: p.prompt,
          width: Number(p.width),
          height: Number(p.height),
          depth: Number(p.depth),
          style: p.style,
          material: p.material,
          detailLevel: p.detail_level as GenerationParams["detailLevel"],
          intendedUse: p.intended_use,
        });
      })
      .catch(() => toast("Failed to load project", "error"))
      .finally(() => setLoadingProject(false));
  }, [projectIdParam, toast]);

  const applyResult = (result: GenerationResult) => {
    setModel(result.model);
    setPrintability(result.printability);
    setPipeline(result.pipeline);
  };

  const handleGenerate = useCallback(
    async (params: GenerationParams) => {
      setGenerating(true);
      setSaved(false);
      setFormValues(params);
      setPipeline(PIPELINE_PREVIEW);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Generation failed");

        applyResult({
          model: data.model,
          printability: data.printability,
          meshAnalysis: data.meshAnalysis,
          repairs: data.repairs,
          pipeline: data.pipeline,
        });

        const label = data.model.isPlaceholder
          ? "Fallback model generated — try a category keyword (dragon, cabin, stand)"
          : `${data.model.category.replace(/-/g, " ")} model ready`;
        toast(label, data.model.isPlaceholder ? "info" : "success");
      } catch (err) {
        console.error(err);
        setPipeline([]);
        toast("Generation failed. Please try again.", "error");
      } finally {
        setGenerating(false);
      }
    },
    [toast]
  );

  const handleSave = async () => {
    if (!model || !formValues || !printability) return;
    setSaving(true);

    const payload = {
      name: model.name,
      prompt: formValues.prompt,
      width: formValues.width ?? 50,
      height: formValues.height ?? 50,
      depth: formValues.depth ?? 50,
      style: formValues.style ?? "modern",
      material: formValues.material ?? "pla",
      detail_level: formValues.detailLevel ?? "medium",
      intended_use: formValues.intendedUse ?? "decorative",
      model_data: model,
      printability,
      printability_score: printability.score,
      thumbnail_color: model.primitives[0]?.color ?? "#f97316",
    };

    try {
      const isUpdate = Boolean(projectId);
      const res = await fetch(
        isUpdate ? `/api/projects/${projectId}` : "/api/projects",
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : "Save failed";
        throw new Error(msg);
      }

      setProjectId(data.project.id);
      setSaved(true);
      toast(isUpdate ? "Project updated" : "Project saved", "success");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      toast(
        err instanceof Error ? err.message : "Could not save project.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingProject) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-forge-500/30 border-t-forge-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Studio</h1>
          <p className="text-sm text-zinc-500">
            Parametric CAD generation with print-ready validation
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {model && (
            <>
              <Badge variant="forge">
                {model.category.replace(/-/g, " ")}
              </Badge>
              {model.isPlaceholder && (
                <Badge variant="warning">Fallback</Badge>
              )}
            </>
          )}
          {projectId && <Badge variant="default">Saved</Badge>}
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={!model || saving}
            loading={saving}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {projectId ? "Update Project" : "Save Project"}
              </>
            )}
          </Button>
        </div>
      </div>

      <DatabaseSetupBanner />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4">
              Create Model
            </h2>
            <GenerationForm
              onGenerate={handleGenerate}
              loading={generating}
              initialValues={formValues}
            />
          </div>
          <GenerationPipeline steps={pipeline} active={generating} />
          <ExportPanel
            model={model}
            printability={printability}
            projectId={projectId}
          />
        </div>

        <div className="lg:col-span-5">
          <div className="glass-card h-[420px] sm:h-[520px] overflow-hidden">
            <ModelViewer model={model} />
          </div>
        </div>

        <div className="lg:col-span-3">
          <PrintabilityPanel report={printability} />
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24 text-zinc-500">
          Loading studio…
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
