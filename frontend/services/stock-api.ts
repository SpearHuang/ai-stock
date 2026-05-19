const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000").replace(/\/+$/, "");

export type StockInfo = {
  code: string;
  name: string;
  sector: string | null;
  latest_price: number | null;
  change_percent: number | null;
  volume: number | null;
  turnover: number | null;
  data_status: string;
  message?: string | null;
};

export type AnalysisSection = {
  title: string;
  content: string;
};

export type StockAnalysis = {
  code: string;
  stock: StockInfo;
  sections: AnalysisSection[];
  disclaimer: string;
  generated_at: string;
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getStockInfo(code: string) {
  return request<StockInfo>(`/api/stocks/${code}`);
}

export function getStockAnalysis(code: string) {
  return request<StockAnalysis>(`/api/analysis/${code}`);
}
