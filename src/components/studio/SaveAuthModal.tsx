"use client";

import Link from "next/link";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SaveAuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function SaveAuthModal({ open, onClose }: SaveAuthModalProps) {
  if (!open) return null;

  const redirect = encodeURIComponent("/studio");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        role="dialog"
        aria-labelledby="save-auth-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-surface-card p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-forge-500/15 text-forge-400">
          <Save className="h-6 w-6" />
        </div>

        <h2 id="save-auth-title" className="text-xl font-bold text-zinc-100">
          Save your design
        </h2>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
          An account is required to save projects, access your gallery, and sync
          designs across devices. Your current work is stored temporarily in this
          browser.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link href={`/signup?redirect=${redirect}`} onClick={onClose}>
            <Button className="w-full">Sign Up</Button>
          </Link>
          <Link href={`/login?redirect=${redirect}`} onClick={onClose}>
            <Button variant="secondary" className="w-full">
              Log In
            </Button>
          </Link>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Continue Without Saving
          </Button>
        </div>
      </div>
    </div>
  );
}
