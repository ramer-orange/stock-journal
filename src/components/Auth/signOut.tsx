import type { ComponentProps, ReactNode } from "react";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";

type SignOutProps = {
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

export function SignOut({ variant = "primary", className, children, ariaLabel }: SignOutProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirect: false });
        redirect("/");
      }}
    >
      <Button
        type="submit"
        variant={variant}
        className={className}
        aria-label={ariaLabel ?? "ログアウト"}
      >
        {children ?? "ログアウト"}
      </Button>
    </form>
  );
}
