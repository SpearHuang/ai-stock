import re
from datetime import datetime, timezone

from openai import AsyncOpenAI

from models.analysis import AnalysisSection, StockAnalysis
from models.stock import MarketContext, StockInfo
from utils.config import settings

REQUIRED_TITLES = ["市场位置", "技术趋势", "热点板块关联", "风险因素", "短期观察"]


class AnalysisService:
    def __init__(self) -> None:
        self.client = (
            AsyncOpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url)
            if settings.openai_api_key
            else None
        )

    async def generate_analysis(
        self,
        code: str,
        stock: StockInfo,
        market_data: MarketContext,
    ) -> StockAnalysis:
        if not self.client:
            return self._fallback_analysis(code, stock, market_data)

        prompt = self._build_prompt(stock, market_data)

        try:
            response = await self.client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "你是 A 股市场解读助手。必须使用简体中文回答。"
                            "不要提供买入、卖出、目标价、收益保证或任何投资承诺。"
                            "不要编造不可用的数据。"
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
            )
            content = response.choices[0].message.content or ""
            sections = self._parse_sections(content)
        except Exception:
            sections = self._fallback_sections(stock, market_data)

        return StockAnalysis(
            code=code,
            stock=stock,
            sections=sections,
            generated_at=datetime.now(timezone.utc),
        )

    def _build_prompt(self, stock: StockInfo, market_data: MarketContext) -> str:
        return f"""
请只做 A 股市场观察解读，使用简体中文输出。

股票信息:
{stock.model_dump()}

市场数据:
{market_data.model_dump()}

必须严格按以下 5 个中文标题输出，标题文字不要增删改:
1. 市场位置
2. 技术趋势
3. 热点板块关联
4. 风险因素
5. 短期观察

结尾必须包含这句话: AI 生成内容仅供参考，不构成投资建议。
不要提供买入、卖出、目标价、收益保证或任何投资承诺。
如果数据不可用，请明确说明数据不可用，不要编造。
"""

    def _parse_sections(self, content: str) -> list[AnalysisSection]:
        sections: list[AnalysisSection] = []
        for index, title in enumerate(REQUIRED_TITLES):
            next_title = REQUIRED_TITLES[index + 1] if index + 1 < len(REQUIRED_TITLES) else None
            start = content.find(title)
            end = content.find(next_title) if next_title else len(content)
            if start >= 0:
                body = _clean_section_content(content[start + len(title) : end])
            else:
                body = "数据不可用，模型返回内容未包含该部分。"
            sections.append(AnalysisSection(title=title, content=body))
        return sections

    def _fallback_analysis(
        self,
        code: str,
        stock: StockInfo,
        market_data: MarketContext,
    ) -> StockAnalysis:
        return StockAnalysis(
            code=code,
            stock=stock,
            sections=self._fallback_sections(stock, market_data),
            generated_at=datetime.now(timezone.utc),
        )

    def _fallback_sections(self, stock: StockInfo, market_data: MarketContext) -> list[AnalysisSection]:
        unavailable = stock.data_status != "available" or market_data.data_status != "available"
        data_note = "部分数据不可用，以下分析仅基于当前可用字段。" if unavailable else "以下分析基于当前可用行情字段。"

        return [
            AnalysisSection(
                title="市场位置",
                content=f"{data_note}{stock.name} 最新价为 {_display(stock.latest_price)}，涨跌幅为 {_display(stock.change_percent, '%')}。",
            ),
            AnalysisSection(
                title="技术趋势",
                content=f"当前可用日 K 记录数为 {len(market_data.daily_kline)}。成交量为 {_display(market_data.volume)}，成交额为 {_display(market_data.turnover)}。",
            ),
            AnalysisSection(
                title="热点板块关联",
                content=market_data.sector_information or "板块信息暂不可用，未编造热点板块关联。",
            ),
            AnalysisSection(
                title="风险因素",
                content="需关注数据缺口、价格波动、流动性变化和消息面不确定性。本内容不构成投资建议。",
            ),
            AnalysisSection(
                title="短期观察",
                content="短期观察应结合更新后的 K 线、成交量、成交额、板块和新闻数据再做判断。",
            ),
        ]


def _display(value: float | None, suffix: str = "") -> str:
    return "不可用" if value is None else f"{value}{suffix}"


def _clean_section_content(content: str) -> str:
    content = content.strip(" :-\n")
    content = re.sub(r"\n\s*#{1,6}\s*\d+[.、)]?\s*$", "", content).strip()
    return content
