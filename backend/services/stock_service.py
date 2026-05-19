import asyncio
from datetime import date, datetime
from typing import Any

from models.stock import MarketContext, StockInfo


class StockService:
    async def get_stock_info(self, code: str) -> StockInfo:
        try:
            return await asyncio.to_thread(self._get_stock_info_sync, code)
        except Exception as exc:
            return StockInfo(
                code=code,
                name=f"A股 {code}",
                data_status="unavailable",
                message=f"Stock data unavailable: {exc}",
            )

    async def get_market_context(self, code: str) -> MarketContext:
        try:
            return await asyncio.to_thread(self._get_market_context_sync, code)
        except Exception as exc:
            return MarketContext(
                daily_kline=[],
                recent_news=[],
                data_status="unavailable",
                message=f"Market context unavailable: {exc}",
            )

    def _get_stock_info_sync(self, code: str) -> StockInfo:
        import akshare as ak

        try:
            spot_df = ak.stock_zh_a_spot_em()
        except Exception:
            return self._get_stock_info_from_tencent_sync(code)

        row = spot_df[spot_df["代码"].astype(str) == code]

        if row.empty:
            return StockInfo(
                code=code,
                name=f"A股 {code}",
                data_status="unavailable",
                message="Stock code not found in AKShare spot data.",
            )

        record: dict[str, Any] = row.iloc[0].to_dict()

        return StockInfo(
            code=code,
            name=str(record.get("名称") or f"A股 {code}"),
            sector=None,
            latest_price=_to_float(record.get("最新价")),
            change_percent=_to_float(record.get("涨跌幅")),
            volume=_to_float(record.get("成交量")),
            turnover=_to_float(record.get("成交额")),
            data_status="available",
        )

    def _get_stock_info_from_tencent_sync(self, code: str) -> StockInfo:
        from akshare.stock.stock_zh_a_tx import stock_zh_a_spot_tx

        spot_df = stock_zh_a_spot_tx()
        row = spot_df[spot_df["code"].astype(str).str.endswith(code)]

        if row.empty:
            return StockInfo(
                code=code,
                name=f"A股 {code}",
                data_status="unavailable",
                message="Stock code not found in Tencent spot data after Eastmoney failed.",
            )

        record: dict[str, Any] = row.iloc[0].to_dict()

        return StockInfo(
            code=code,
            name=str(record.get("name") or f"A股 {code}"),
            sector=None,
            latest_price=_to_float(record.get("zxj")),
            change_percent=_to_float(record.get("zdf")),
            volume=_to_float(record.get("volume")),
            turnover=_to_float(record.get("turnover")),
            data_status="available",
            message="东方财富行情暂不可用，已切换为腾讯行情备用数据。",
        )

    def _get_market_context_sync(self, code: str) -> MarketContext:
        import akshare as ak

        kline_df = ak.stock_zh_a_hist(symbol=code, period="daily", adjust="")
        recent_kline = _json_records(kline_df.tail(30)) if not kline_df.empty else []

        return MarketContext(
            daily_kline=recent_kline,
            volume=_last_numeric(kline_df, "成交量"),
            turnover=_last_numeric(kline_df, "成交额"),
            sector_information=None,
            recent_news=[],
            data_status="available" if recent_kline else "unavailable",
            message=None if recent_kline else "Daily K-line data unavailable.",
        )


def _to_float(value: Any) -> float | None:
    try:
        if value is None:
            return None
        return float(value)
    except (TypeError, ValueError):
        return None


def _last_numeric(dataframe: Any, column: str) -> float | None:
    if dataframe.empty or column not in dataframe.columns:
        return None
    return _to_float(dataframe.iloc[-1].get(column))


def _json_records(dataframe: Any) -> list[dict[str, Any]]:
    records = []
    for raw_record in dataframe.to_dict(orient="records"):
        record = {}
        for key, value in raw_record.items():
            record[str(key)] = _json_value(value)
        records.append(record)
    return records


def _json_value(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    try:
        if value != value:
            return None
    except Exception:
        pass
    return value
