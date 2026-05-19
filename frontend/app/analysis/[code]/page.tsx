import Link from "next/link";
import { ArrowLeft, AlertCircle, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getStockAnalysis } from "@/services/stock-api";

type PageProps = {
  params: {
    code: string;
  };
};

export default async function AnalysisPage({ params }: PageProps) {
  let analysis;
  let error = "";

  try {
    analysis = await getStockAnalysis(params.code);
  } catch {
    error = "后端服务暂不可用，请确认 FastAPI 已启动。";
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-accent">
          <ArrowLeft size={16} aria-hidden="true" />
          返回搜索
        </Link>

        {error || !analysis ? (
          <Card className="p-6">
            <div className="flex gap-3 text-danger">
              <AlertCircle size={22} aria-hidden="true" />
              <p>{error}</p>
            </div>
          </Card>
        ) : (
          <>
            <header className="grid gap-4 rounded-lg border border-border bg-panel/70 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-accent">股票分析</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">
                  {analysis.stock.name} <span className="text-slate-400">{analysis.code}</span>
                </h1>
                <p className="mt-3 text-sm text-slate-400">{analysis.disclaimer}</p>
              </div>
              <BarChart3 className="text-accent" size={38} aria-hidden="true" />
            </header>

            <section className="grid gap-4 md:grid-cols-4">
              <Metric label="最新价" value={formatValue(analysis.stock.latest_price)} />
              <Metric label="涨跌幅" value={formatPercent(analysis.stock.change_percent)} tone={analysis.stock.change_percent} />
              <Metric label="成交量" value={formatValue(analysis.stock.volume)} />
              <Metric label="换手/成交额" value={formatValue(analysis.stock.turnover)} />
            </section>

            <section className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-white">股票信息</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <InfoRow label="代码" value={analysis.stock.code} />
                  <InfoRow label="名称" value={analysis.stock.name} />
                  <InfoRow label="所属板块" value={analysis.stock.sector ?? "数据不可用"} />
                  <InfoRow label="数据状态" value={formatStatus(analysis.stock.data_status)} />
                </dl>
                {analysis.stock.message ? (
                  <p className="mt-4 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm leading-6 text-warning">
                    {analysis.stock.message}
                  </p>
                ) : null}
              </Card>

              <div className="space-y-4">
                {analysis.sections.map((section) => (
                  <Card key={section.title} className="p-5">
                    <h2 className="text-lg font-semibold text-white">{translateSectionTitle(section.title)}</h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">{section.content}</p>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: number | null }) {
  const toneClass = tone == null ? "text-white" : tone >= 0 ? "text-accent" : "text-danger";

  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-200">{value}</dd>
    </div>
  );
}

function formatValue(value: number | null) {
  return value == null ? "不可用" : value.toLocaleString("zh-CN");
}

function formatPercent(value: number | null) {
  return value == null ? "不可用" : `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatStatus(value: string) {
  return value === "available" ? "可用" : "不可用";
}

function translateSectionTitle(title: string) {
  const titles: Record<string, string> = {
    "Market Position": "市场位置",
    "Technical Trend": "技术趋势",
    "Hot Sector Relation": "热点板块关联",
    "Risk Factors": "风险因素",
    "Short-term Observation": "短期观察"
  };

  return titles[title] ?? title;
}
