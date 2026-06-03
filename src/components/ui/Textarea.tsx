import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-forge-500 focus:outline-none focus:ring-2 focus:ring-forge-500/20 transition-colors",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
