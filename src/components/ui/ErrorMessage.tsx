import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  messages?: string | string[] | null;
}

export function ErrorMessage({ className, messages, ...props }: ErrorMessageProps) {
  if (!messages) {
    return null;
  }

  const list = Array.isArray(messages) ? messages : [messages];

  return (
    <div
      className={cn("rounded-md border border-red-500/50 bg-red-900/30 px-3 py-2 text-sm text-red-400", className)}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <ul className="space-y-1">
        {list.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
