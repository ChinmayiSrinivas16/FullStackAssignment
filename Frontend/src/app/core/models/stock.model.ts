export interface Stock {
  id: number;
  portfolioId: number;
  symbol: string;
  companyName: string;
  sector?: string;
  industry?: string;
  totalQuantity: number;
  averageBuyPrice: number;
  totalInvested: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockRequest {
  symbol: string;
  companyName: string;
  sector?: string;
  industry?: string;
}

export interface StockSummary {
  symbol: string;
  companyName: string;
  sector?: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  investmentAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  status: 'PROFIT' | 'LOSS' | 'NEUTRAL';
}

export interface MarketStock {
  symbol: string;
  companyName: string;
  sector?: string;
  industry?: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap?: number;
  lastUpdated: string;
}
