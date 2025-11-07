'use client';

import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BaseSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">;

export interface SelectProps extends BaseSelectProps {
  hasError?: boolean;
  size?: "sm" | "md";
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError = false, size = "md", ...props }, ref) => {
    const sizeClasses: Record<NonNullable<SelectProps["size"]>, string> = {
      sm: "px-3 py-1.5 pr-8 text-xs",
      md: "px-3 py-2 pr-10 text-base",
    };

    return (
      <select
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-border bg-base-light text-text-primary shadow-sm transition-colors placeholder:text-text-muted focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/70",
          "appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke-width=%221.5%22 stroke=%22%23ededed%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[position:right_0.75rem_center] bg-no-repeat",
          sizeClasses[size],
          hasError &&
            "border-red-500 focus:border-red-500 focus:ring-red-500/70",
          className,
        )}
        aria-invalid={hasError || undefined}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
