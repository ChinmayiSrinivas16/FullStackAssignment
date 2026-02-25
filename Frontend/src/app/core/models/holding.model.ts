export interface Holding {
  id?: number;
  symbol: string;
  quantity: number;
  averageBuyPrice: number;
  avgPrice: number; // alias for template compatibility
  currentPrice: number;
  investmentAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  pnl: number; // alias for template compatibility
  status: string; // PROFIT, LOSS, NEUTRAL
}
