import { cn } from "@/lib/utils";
import { forwardRef, type SelectHTMLAttributes } from "react";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm text-zinc-100 focus:border-forge-500 focus:outline-none focus:ring-2 focus:ring-forge-500/20 transition-colors",
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";
