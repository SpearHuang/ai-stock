import { Activity, AlertTriangle, BarChart3 } from "lucide-react";
import { StockSearch } from "@/components/stock-search";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between border-b border-border pb-5">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">AI Stock Analyst</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">A 股市场解读台</h1>
          </div>
          <BarChart3 className="hidden text-accent sm:block" size={34} aria-hidden="true" />
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div className="py-8 sm:py-12">
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                输入股票代码，生成结构化市场观察。
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                面向 A 股 MVP 的 AI 分析页面，聚焦市场位置、技术趋势、板块关联、风险因素和短期观察。
              </p>
            </div>

            <Card className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <Activity className="text-accent" size={22} aria-hidden="true" />
                <h3 className="text-lg font-semibold text-white">股票搜索</h3>
              </div>
              <StockSearch />
            </Card>
          </div>

          <aside className="grid gap-4 self-start">
            {[
              ["Market Position", "结合行情数据解释当前市场位置。"],
              ["Technical Trend", "用日 K、成交量与换手线索描述趋势。"],
              ["Risk Awareness", "明确数据不可用、波动和消息面风险。"]
            ].map(([title, description]) => (
              <Card key={title} className="p-5">
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </Card>
            ))}
            <div className="flex gap-3 rounded-lg border border-warning/35 bg-warning/10 p-4 text-sm leading-6 text-warning">
              <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
              <p>AI-generated analysis for reference only. 本站不提供投资建议。</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
