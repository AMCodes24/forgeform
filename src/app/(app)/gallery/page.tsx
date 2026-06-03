"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ProjectCard } from "@/components/gallery/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import type { Project } from "@/types";

export default function GalleryPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadProjects = () => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (data.projects) setProjects(data.projects);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast("Failed to delete project", "error");
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast("Project deleted", "success");
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Project Gallery</h1>
          <p className="text-sm text-zinc-500 mt-1">
            All your saved models and exports
          </p>
        </div>
        <Link href="/studio">
          <Button>
            <Plus className="h-4 w-4" />
            New Model
          </Button>
        </Link>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          className="pl-10"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-forge-500/30 border-t-forge-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="text-zinc-500 mb-4">
            {search ? "No projects match your search." : "No saved projects yet."}
          </p>
          <Link href="/studio">
            <Button>Create your first model</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
