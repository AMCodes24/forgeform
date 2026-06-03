import { APP_NAME, TAGLINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="font-semibold text-zinc-200">{APP_NAME}</p>
            <p className="text-sm text-zinc-500">{TAGLINE}</p>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {APP_NAME}. Built for makers.
          </p>
        </div>
      </div>
    </footer>
  );
}
