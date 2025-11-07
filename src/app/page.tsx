import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const features = [
  {
    title: "取引の詳細記録",
    description: "売買日、価格、数量に加えて、エントリー理由や学びのメモを記録。口座タイプや資産クラスごとに記録を分けて、体系的な管理が可能です。",
  },
  {
    title: "自動保存で記録漏れゼロ",
    description: "入力と同時に自動保存されるため、保存ボタンを押し忘れる心配がありません。",
  },
  {
    title: "厳格なセキュリティ",
    description: "Google 認証により、許可されたアカウントのみがアクセス可能。金融データを安全に保管し、個人情報の漏洩リスクを最小限に抑えます。",
  },
];

const timeline = [
  { step: "01", title: "Google でサインイン", detail: "新規でメールアドレス・パスワードを入力することはありません。" },
  { step: "02", title: "記録を作成", detail: "口座・資産クラス別にテンプレを用意。" },
  { step: "03", title: "取引を記録", detail: "価格・数量・メモなどを一括入力。" },
];

const testimonials = [
  {
    name: "Aya / Swing Trader",
    quote: "自分の取引を言語化することで取引の癖が見えてきました。",
  },
  {
    name: "Kai / Swing Trader",
    quote: "操作性が良く使いやすいです。取引記録の管理がしやすいです。",
  },
];


export default function Home() {
  return (
    <main className="min-h-screen bg-base-darker text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-base-darker via-[#0d1b1e] to-[#041716] px-6 py-20">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.25),_transparent_55%)] blur-3xl lg:block" aria-hidden />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-base-light/30 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-green-300">
              Stock Journal
            </p>
            <div className="space-y-5">
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
                トレードの記憶を、<br/>意思決定の資産へ。
              </h1>
              <p className="text-base text-white/80 md:text-lg">
                取引を記録し、振り返り。投資家のための記録プラットフォームです。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/signIn">
                <Button size="lg" className="gap-2 rounded-xl bg-white text-base-darker shadow-lg shadow-black/10 hover:bg-slate-100">
                  Google で始める
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[32px] border border-base-light/10 bg-base-light/5 shadow-2xl shadow-black/40">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" aria-hidden />
              <Image
                src="/top.jpeg"
                alt="Stock Journal UI preview"
                width={800}
                height={620}
                className="relative h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-green-300/80">Why Stock Journal</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Stock Journal の 3 つの特徴</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border border-base-light/20 bg-base-dark/60 text-white">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-base-dark/60 px-6 py-16">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="text-center text-3xl font-semibold text-white">すぐに始められる。3 ステップで準備完了。</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {timeline.map((item) => (
              <div key={item.step} className="rounded-2xl border border-base-light/15 bg-base-darker/80 p-5">
                <p className="text-sm text-green-300/80">STEP {item.step}</p>
                <p className="text-xl font-semibold text-white">{item.title}</p>
                <p className="text-sm text-white/70">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-green-300/80">Voices</p>
          <h2 className="mt-3 text-3xl font-semibold">投資家からの声</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border border-base-light/15 bg-base-dark/60 text-white">
              <CardContent className="space-y-3">
                <p className="text-white/80">“{testimonial.quote}”</p>
                <p className="text-sm font-semibold">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center rounded-3xl border border-base-light/20 bg-base-dark/70 p-10 text-center shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-green-300/80">Ready?</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">今すぐ Stock Journal を試す</h2>
          <p className="mt-3 text-base text-white/80">
            Google アカウントでログインし、取引の振り返りを今日から始めましょう。
          </p>
          <Link href="/signIn" className="mt-6">
            <Button size="lg" className="gap-2 rounded-xl bg-white text-base-darker shadow-lg shadow-black/10 hover:bg-slate-100">
              Google で始める
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
