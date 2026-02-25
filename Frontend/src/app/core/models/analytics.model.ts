export interface DashboardData {
  portfolioId: number;
  portfolioName: string;
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  totalStocks: number;
  profitableStocks: number;
  lossStocks: number;
  status: 'PROFIT' | 'LOSS' | 'NEUTRAL';
  topGainers: TopMover[];
  topLosers: TopMover[];
  recentTransactions: TransactionSummary[];
  holdings: HoldingSummary[];
}

export interface TopMover {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export interface TransactionSummary {
  id: number;
  symbol: string;
  transactionType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  transactionDate: string;
}

export interface HoldingSummary {
  symbol: string;
  companyName: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  investmentAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  status: 'PROFIT' | 'LOSS' | 'NEUTRAL';
}

export interface ProfitLossData {
  date: string;
  invested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface SectorAllocation {
  sector: string;
  investedAmount: number;
  currentValue: number;
  percentage: number;
  stocks: number;
}

export interface AnalyticsData {
  portfolioId: number;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ALL';
  totalInvested: number;
  currentValue: number;
  realizedGainLoss: number;
  unrealizedGainLoss: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  profitLossData: ProfitLossData[];
  sectorAllocation: SectorAllocation[];
  topPerformingStocks: StockPerformance[];
  lossMakingStocks: StockPerformance[];
}

export interface StockPerformance {
  symbol: string;
  companyName: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  gainLoss: number;
  gainLossPercent: number;
  status: 'PROFIT' | 'LOSS' | 'NEUTRAL';
}

export interface ReportData {
  portfolioId: number;
  portfolioName: string;
  generatedAt: string;
  summary: PortfolioReportSummary;
  holdings: HoldingSummary[];
  transactions: TransactionSummary[];
  sectorAllocation: SectorAllocation[];
}

export interface PortfolioReportSummary {
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  realizedGainLoss: number;
  unrealizedGainLoss: number;
  totalTransactions: number;
  profitableStocks: number;
  lossStocks: number;
  topSector: string;
}
