"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/studio", label: "Studio" },
  { href: "/gallery", label: "Gallery" },
];

export function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-forge">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {user &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-forge-500/10 text-forge-400"
                    : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/studio">
                <Button size="sm">New Model</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-800"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-4 py-4 md:hidden">
          {user &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-300"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/studio" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">New Model</Button>
                </Link>
                <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
