import { signOut } from "@/auth";
import { Button } from "@/components/ui/Button";

type SignOutProps = {
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
};

export function SignOut({ variant = "primary", className }: SignOutProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit" variant={variant} className={className}>
        サインアウト
      </Button>
    </form>
  );
}
