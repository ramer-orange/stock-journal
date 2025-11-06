import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "plain";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-green-500 text-base-darker hover:bg-green-600 focus-visible:ring-2 focus-visible:ring-border-focus",
  secondary:
    "bg-base-lighter text-text-primary hover:bg-base-light focus-visible:ring-2 focus-visible:ring-border-focus",
  danger:
    "bg-red-500 text-base-darker hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-border-focus",
  ghost:
    "bg-transparent text-text-secondary hover:bg-base-lighter focus-visible:ring-2 focus-visible:ring-border-focus",
  plain: "",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-md px-3 text-sm",
  md: "h-10 rounded-lg px-4 text-base",
  lg: "h-12 rounded-lg px-6 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
