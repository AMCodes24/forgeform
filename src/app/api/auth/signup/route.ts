import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase is not configured. Add credentials to .env.local and restart the dev server.",
      },
      { status: 503 }
    );
  }

  try {
    const body = schema.parse(await request.json());
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: { full_name: body.name ?? "" },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      user: data.user?.id ?? null,
      hasSession: Boolean(data.session),
      needsEmailConfirmation: Boolean(data.user && !data.session),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid signup data" }, { status: 400 });
    }

    const message =
      error instanceof Error ? error.message : "Signup failed on server";

    return NextResponse.json(
      {
        error: message.includes("fetch")
          ? "Server cannot reach Supabase. Verify NEXT_PUBLIC_SUPABASE_URL in .env.local and that your Supabase project is active."
          : message,
      },
      { status: 502 }
    );
  }
}
