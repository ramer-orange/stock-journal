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
        <div className="flex items-center gap-3">
          {session ? (
            <SignOut variant="secondary" className="rounded-xl border border-white/20 bg-transparent text-white hover:bg-white/10" />
          ) : (
            <Link href="/signIn">
              <Button variant="secondary" className="rounded-xl border border-white/20 bg-transparent text-white hover:bg-white/10">
                サインイン
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
