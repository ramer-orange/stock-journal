'use client';

import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  size?: "sm" | "md";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError = false, rows = 4, size = "md", ...props }, ref) => {
    const sizeClasses: Record<NonNullable<TextareaProps["size"]>, string> = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-3 py-2 text-base",
    };

    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full rounded-lg border border-border bg-base-light text-text-primary shadow-sm transition-colors placeholder:text-text-muted focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/70",
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

Textarea.displayName = "Textarea";
