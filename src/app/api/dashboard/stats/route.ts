import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatSupabaseError } from "@/lib/supabase/errors";
import type { DashboardStats, Project } from "@/types";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: formatSupabaseError(error.message) },
      { status: 500 }
    );
  }

  const list = (projects ?? []) as Project[];

  const { count: exportCount } = await supabase
    .from("exports")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const historyMap = new Map<string, number>();
  list.forEach((p) => {
    const date = new Date(p.created_at).toISOString().split("T")[0];
    historyMap.set(date, (historyMap.get(date) ?? 0) + 1);
  });

  const generationHistory = Array.from(historyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  const stats: DashboardStats = {
    totalProjects: list.length,
    recentModels: list.slice(0, 5),
    exportCount: exportCount ?? 0,
    savedModels: list.length,
    generationHistory,
  };

  return NextResponse.json({ stats });
}
