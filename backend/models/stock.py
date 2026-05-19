from pydantic import BaseModel, Field


class StockInfo(BaseModel):
    code: str = Field(..., min_length=6, max_length=6)
    name: str
    sector: str | None = None
    latest_price: float | None = None
    change_percent: float | None = None
    volume: float | None = None
    turnover: float | None = None
    data_status: str
    message: str | None = None


class MarketContext(BaseModel):
    daily_kline: list[dict]
    volume: float | None = None
    turnover: float | None = None
    sector_information: str | None = None
    recent_news: list[str]
    data_status: str
    message: str | None = None
