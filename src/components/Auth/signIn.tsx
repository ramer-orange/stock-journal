import { signIn } from "@/auth";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type SignInProps = {
  className?: string;
};

export default function SignIn({ className }: SignInProps) {
  return (
    <Card className={cn("relative isolate w-full max-w-md overflow-hidden border  p-0 backdrop-blur-xl shadow-2xl", className)}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-16 top-1/3 h-28 w-28 rounded-full  blur-[80px]" aria-hidden />
      <CardContent className="relative space-y-5 p-6">
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/journals/me" });
          }}
          className="space-y-4"
        >
          <Button
            type="submit"
            size="lg"
            className="w-full gap-3 rounded-xl text-base-darker bg-white"
          >
            <GoogleGlyph />
            Google でサインイン
          </Button>
          <div className="rounded-lg border border-border/70 bg-base-light/80 px-3 py-2 text-xs text-text-secondary">
            続行すると、Stock Journal が Google アカウントの基本プロフィール情報（氏名・メールアドレス）を利用することに同意したものとみなされます。個人情報は Cloudflare D1 上で暗号化保存されます。
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const GoogleGlyph = () => (
  <span className="relative flex h-5 w-5 items-center justify-center">
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12.24 10.2v3.84h5.41c-.22 1.26-.98 2.33-2.08 3.04l3.38 2.62c1.97-1.81 3.11-4.48 3.11-7.66 0-.74-.07-1.45-.2-2.14h-9.62z"
        fill="#4285F4"
      />
      <path
        d="M6.64 14.32l-.88.67-2.69 2.08c1.73 3.43 5.27 5.81 9.37 5.81 2.83 0 5.21-.93 6.95-2.54l-3.38-2.62c-.94.63-2.14 1.01-3.57 1.01-2.75 0-5.08-1.86-5.91-4.41z"
        fill="#34A853"
      />
      <path
        d="M3.07 7.72C2.39 9.15 2 10.75 2 12.4s.39 3.25 1.07 4.68c.83-2.55 3.16-4.41 5.91-4.41.84 0 1.61.14 2.32.38V9.1H6.64c-.99 0-1.86.26-2.57.72z"
        fill="#FBBC05"
      />
      <path
        d="M12.24 4.58c1.54 0 2.92.53 4.01 1.56l2.99-2.99C17.44 1.24 15.06.2 12.24.2 8.14.2 4.6 2.58 2.67 6l3.97 3.1c.83-2.55 3.16-4.52 5.6-4.52z"
        fill="#EA4335"
      />
    </svg>
    <span className="sr-only">Google ロゴ</span>
  </span>
);
