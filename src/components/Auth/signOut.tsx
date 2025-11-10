"use client";

import type { ComponentProps, ReactNode } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

type SignOutProps = {
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

export function SignOut({ variant = "primary", className, children, ariaLabel }: SignOutProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await signOut({ redirect: false, callbackUrl: "/" });
      } finally {
        router.push("/");
        router.refresh();
      }
    });
  };

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      variant={variant}
      className={className}
      aria-label={ariaLabel ?? "ログアウト"}
    >
      {children ?? "ログアウト"}
    </Button>
  );
}
