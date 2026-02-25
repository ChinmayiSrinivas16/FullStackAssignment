export interface Dashboard {
  // Summary metrics
  totalInvested: number;
  currentPortfolioValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  gainLossStatus: string; // PROFIT, LOSS, NEUTRAL

  // Holdings overview
  totalStocksHeld: number;
  profitableStocks: number;
  lossStocks: number;

  // Top movers
  topGainers: TopMover[];
  topLosers: TopMover[];

  // Recent holdings snapshot
  topHoldings: HoldingSummary[];
}

export interface TopMover {
  symbol: string;
  changePercent: number;
  currentPrice: number;
}

export interface HoldingSummary {
  symbol: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  investmentAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  status: string; // PROFIT, LOSS, NEUTRAL
}
