export interface Portfolio {
  id: number;
  portfolioName: string;
  description?: string;
  userId: number;
  totalInvested: number;
  currentValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioRequest {
  portfolioName: string;
  description?: string;
}

export interface PortfolioSummary {
  id: number;
  portfolioName: string;
  description?: string;
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  totalStocks: number;
  status: 'PROFIT' | 'LOSS' | 'NEUTRAL';
}
