export interface Transaction {
  id: number;
  date: string;
  amount: number;
  description?: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
}
