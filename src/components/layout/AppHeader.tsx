import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { Button } from "@/components/ui/Button";
import { SignOut } from "@/components/Auth/signOut";

export default async function AppHeader() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  if (pathname.startsWith("/signIn") || pathname.startsWith("/login")) {
    return null;
  }

  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-base-darker/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-white">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <Image src="/icon.png" alt="Stock Journal" width={28} height={28} />
          Stock Journal
        </Link>
        <div className="flex items-center gap-0 sm:gap-2">
          {session ? (
            <>
              <Link href="/journals">
                <Button
                  variant="secondary"
                  aria-label="取引記録へ"
                  className="mr-2 w-auto rounded-xl border border-white/20 bg-transparent px-3 text-white hover:bg-transparent sm:mr-0 sm:px-4 sm:hover:bg-white/10"
                >
                  取引記録へ
                </Button>
              </Link>
              <SignOut
                variant="secondary"
                ariaLabel="ログアウト"
                className="w-auto rounded-xl border-0 bg-transparent px-0 text-white hover:bg-transparent sm:border sm:border-white/20 sm:px-4 sm:hover:bg-white/10"
              >
                <SignOutIcon className="h-6 w-6 sm:hidden" />
                <span className="hidden sm:inline">ログアウト</span>
              </SignOut>
            </>
          ) : (
            <Link href="/signIn">
              <Button variant="secondary" className="rounded-xl border border-white/20 bg-transparent px-0 text-white hover:bg-white/10">
                サインイン
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

type IconProps = {
  className?: string;
};

const SignOutIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 4h2.5A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20H15" />
    <path d="M11 16l-4-4 4-4" />
    <path d="M7 12h11" />
  </svg>
);
