from fastapi import APIRouter, HTTPException

from models.stock import StockInfo
from services.stock_service import StockService
from utils.validators import validate_stock_code

router = APIRouter(tags=["stocks"])
stock_service = StockService()


@router.get("/stocks/{code}", response_model=StockInfo)
async def get_stock(code: str) -> StockInfo:
    if not validate_stock_code(code):
        raise HTTPException(status_code=422, detail="Stock code must be 6 digits.")

    return await stock_service.get_stock_info(code)
