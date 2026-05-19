import Link from "next/link";
import { ArrowLeft, BarChart3, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function LoadingAnalysisPage() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-accent">
          <ArrowLeft size={16} aria-hidden="true" />
          返回搜索
        </Link>

        <header className="grid gap-4 rounded-lg border border-border bg-panel/70 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">股票分析</p>
            <div className="mt-3 h-10 w-64 max-w-full animate-pulse rounded-md bg-panelSoft" />
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400" aria-live="polite">
              <Loader2 className="animate-spin text-accent" size={16} aria-hidden="true" />
              正在获取行情并生成分析...
            </div>
          </div>
          <BarChart3 className="text-accent" size={38} aria-hidden="true" />
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {["最新价", "涨跌幅", "成交量", "换手/成交额"].map((label) => (
            <Card key={label} className="p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
              <div className="mt-3 h-8 w-24 animate-pulse rounded-md bg-panelSoft" />
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-white">股票信息</h2>
            <div className="mt-5 space-y-4">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-6 animate-pulse rounded-md bg-panelSoft" />
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <Card key={item} className="p-5">
                <div className="h-6 w-48 animate-pulse rounded-md bg-panelSoft" />
                <div className="mt-5 space-y-3">
                  <div className="h-4 animate-pulse rounded-md bg-panelSoft" />
                  <div className="h-4 animate-pulse rounded-md bg-panelSoft" />
                  <div className="h-4 w-3/4 animate-pulse rounded-md bg-panelSoft" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
