import re


def validate_stock_code(code: str) -> bool:
    return bool(re.fullmatch(r"\d{6}", code))
