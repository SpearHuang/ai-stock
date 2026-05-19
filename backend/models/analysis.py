from datetime import datetime

from pydantic import BaseModel, Field

from models.stock import StockInfo


class AnalysisSection(BaseModel):
    title: str
    content: str


class StockAnalysis(BaseModel):
    code: str = Field(..., min_length=6, max_length=6)
    stock: StockInfo
    sections: list[AnalysisSection]
    disclaimer: str = "AI 生成内容仅供参考，不构成投资建议。"
    generated_at: datetime
