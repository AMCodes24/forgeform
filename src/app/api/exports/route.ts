import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { formatSupabaseError } from "@/lib/supabase/errors";

const schema = z.object({
  project_id: z.string().uuid(),
  format: z.enum(["stl", "obj", "glb"]),
  file_name: z.string(),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("exports")
    .select("*, projects(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: formatSupabaseError(error.message) },
      { status: 500 }
    );
  }

  return NextResponse.json({ exports: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { project_id, format, file_name } = schema.parse(await request.json());

    const { data: exportRecord, error: exportError } = await supabase
      .from("exports")
      .insert({ project_id, user_id: user.id, format, file_name })
      .select()
      .single();

    if (exportError) {
      return NextResponse.json({ error: exportError.message }, { status: 500 });
    }

    const { data: project } = await supabase
      .from("projects")
      .select("export_count")
      .eq("id", project_id)
      .single();

    if (project) {
      await supabase
        .from("projects")
        .update({ export_count: (project.export_count ?? 0) + 1 })
        .eq("id", project_id);
    }

    return NextResponse.json({ export: exportRecord });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Export record failed" }, { status: 500 });
  }
}
