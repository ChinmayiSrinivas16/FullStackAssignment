// ── Auth Models ──
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
}

// ── API Response Wrapper ──
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
}

// ── Dashboard ──
export interface DashboardData {
  totalValue: number;
  invested: number;
  totalInvestment: number;
  currentValue: number;
  totalPnL: number;
}

// ── Portfolio ──
export interface TotalInvestment {
  totalInvestment: number;
  currency: string;
}

export interface CurrentValue {
  currentValue: number;
  currency: string;
  lastUpdated: string;
}

export interface TotalGain {
  totalGain: number;
  percentageGain: number;
  currency: string;
}

export interface PnLData {
  totalPnL: number;
  unrealizedPnL: number;
  realizedPnL: number;
  pnlPercentage: number;
  currency: string;
  period: string;
}

export interface WinRateData {
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
}

export interface ReturnsData {
  totalReturn: number;
  annualizedReturn: number;
  ytdReturn: number;
  monthlyReturn: number;
  currency: string;
  period: string;
}

export interface PortfolioSummary {
  totalInvestment: number;
  currentValue: number;
  totalGain: number;
  totalGainPercentage: number;
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  currency: string;
  lastUpdated: string;
}

// ── Holdings ──
export interface Holding {
  id: number;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  pnL: number;
  pnLPercentage: number;
}

export interface CreateHoldingRequest {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

// ── Transactions ──
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LIMIT';
export type TransactionStatus = 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'FAILED';

export interface Transaction {
  id: number;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  date: string;
  fees: number;
  orderType?: OrderType;
  limitPrice?: number;
  stopPrice?: number;
  status?: TransactionStatus;
}

export interface CreateTransactionRequest {
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price?: number;
  date?: string;
  fees?: number;
  orderType?: OrderType;
  limitPrice?: number;
  stopPrice?: number;
}

// ── Market Data ──
export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  peRatio: number;
  '52WeekHigh': number;
  '52WeekLow': number;
  dividendYield: number;
}

// ── Market Data History ──
export interface MarketDataPoint {
  id: number;
  symbol: string;
  name: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
  previousClose: number;
  change: number;
  changePercent: number;
  recordedAt: string;
}

// ── Chart Data ──
export interface ChartDataPoint {
  time: string;
  price: number;
  volume?: number;
}

// ── Analytics ──
export interface AllocationItem {
  value: number;
  percentage: number;
}

export interface AssetAllocation {
  [key: string]: AllocationItem;
}

// ── Reports ──
export interface GenerateReportRequest {
  type: string;
  period: string;
  format: string;
}

export interface ReportResponse {
  reportId: string;
  fileName?: string;
  filePath?: string;
  status: string;
  createdAt: string;
}

// ── About ──
export interface AboutInfo {
  companyName: string;
  companyId: string;
  gstNumber: string;
  panNumber: string;
  cinNumber: string;
  supportEmail: string;
  supportPhone: string;
  website: string;
  registeredOffice: string;
}

export interface WalletSummary {
  balance: number;
  minimumBalance: number;
  availableToTrade: number;
}
