export function formatSupabaseError(message: string): string {
  const m = message.toLowerCase();

  if (
    m.includes("could not find the table") ||
    m.includes("schema cache") ||
    m.includes("relation") && m.includes("does not exist")
  ) {
    return (
      "Database not set up yet. In the Supabase Dashboard, open SQL Editor, " +
      "paste and run the full contents of supabase/schema.sql in your project, then try saving again."
    );
  }

  if (m.includes("row-level security") || m.includes("rls")) {
    return "Permission denied. Ensure you are signed in and schema.sql policies were applied.";
  }

  return message;
}
