from fastapi import APIRouter, HTTPException

from models.analysis import StockAnalysis
from services.analysis_service import AnalysisService
from services.stock_service import StockService
from utils.validators import validate_stock_code

router = APIRouter(tags=["analysis"])
stock_service = StockService()
analysis_service = AnalysisService()


@router.get("/analysis/{code}", response_model=StockAnalysis)
async def get_analysis(code: str) -> StockAnalysis:
    if not validate_stock_code(code):
        raise HTTPException(status_code=422, detail="Stock code must be 6 digits.")

    stock = await stock_service.get_stock_info(code)
    market_data = await stock_service.get_market_context(code)
    return await analysis_service.generate_analysis(code=code, stock=stock, market_data=market_data)
