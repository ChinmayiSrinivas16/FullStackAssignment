export interface Transaction {
  id: number;
  portfolioId: number;
  stockId: number;
  symbol: string;
  companyName?: string;
  transactionType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  brokerage?: number;
  tax?: number;
  transactionDate: string;
  notes?: string;
  isRealized: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRequest {
  stockId?: number;
  symbol: string;
  transactionType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  brokerage?: number;
  tax?: number;
  transactionDate: string;
  notes?: string;
}

export interface TransactionUpdateRequest {
  quantity?: number;
  price?: number;
  brokerage?: number;
  tax?: number;
  transactionDate?: string;
  notes?: string;
}
