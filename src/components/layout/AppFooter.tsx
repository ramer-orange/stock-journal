import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-base-darker/80 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-white/60">
            <p>© 2025 株レンズ. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link
              href="/terms"
              className="text-white/60 transition-colors hover:text-white"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="text-white/60 transition-colors hover:text-white"
            >
              プライバシーポリシー
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

