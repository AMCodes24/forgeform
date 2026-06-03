import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured in .env.local" },
      { status: 503 }
    );
  }

  try {
    const body = schema.parse(await request.json());
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ user: data.user?.id ?? null });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid login data" }, { status: 400 });
    }

    const message =
      error instanceof Error ? error.message : "Login failed on server";

    return NextResponse.json(
      {
        error: message.includes("fetch")
          ? "Server cannot reach Supabase. Check .env.local and your Supabase project status."
          : message,
      },
      { status: 502 }
    );
  }
}
