import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { formatSupabaseError } from "@/lib/supabase/errors";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  prompt: z.string().min(1),
  width: z.number(),
  height: z.number(),
  depth: z.number(),
  style: z.string(),
  material: z.string(),
  detail_level: z.string(),
  intended_use: z.string(),
  model_data: z.record(z.unknown()),
  printability: z.record(z.unknown()),
  printability_score: z.number(),
  thumbnail_color: z.string().optional(),
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
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: formatSupabaseError(error.message), code: "DB_ERROR" },
      { status: 500 }
    );
  }

  return NextResponse.json({ projects: data });
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
    const body = createSchema.parse(await request.json());

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        ...body,
        thumbnail_color:
          body.thumbnail_color ??
          (body.model_data as { primitives?: { color: string }[] })
            ?.primitives?.[0]?.color ??
          "#f97316",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: formatSupabaseError(error.message), code: "DB_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json({ project: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}
