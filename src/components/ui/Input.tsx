import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-forge-500 focus:outline-none focus:ring-2 focus:ring-forge-500/20 transition-colors",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
