export const ENDPOINTS = {
  // Portfolio endpoints
  PORTFOLIOS: '/api/portfolios',
  PORTFOLIO_DASHBOARD: (id: number) => `/api/portfolios/${id}/dashboard`,
  PORTFOLIO_REFRESH: (id: number) => `/api/portfolios/${id}/refresh`,
  
  // Stock endpoints
  STOCKS: (portfolioId: number) => `/api/portfolios/${portfolioId}/stocks`,
  STOCK: (portfolioId: number, id: number) => `/api/portfolios/${portfolioId}/stocks/${id}`,
  
  // Transaction endpoints
  TRANSACTIONS: (portfolioId: number) => `/api/portfolios/${portfolioId}/transactions`,
  TRANSACTION: (portfolioId: number, id: number) => `/api/portfolios/${portfolioId}/transactions/${id}`,
  
  // Market data endpoints
  MARKET_STOCKS: '/api/market/stocks',
  MARKET_PRICE: (symbol: string) => `/api/market/price/${symbol}`,
  
  // Analytics & Reports
  ANALYTICS: (portfolioId: number) => `/api/portfolios/${portfolioId}/analytics`,
  REPORTS: (portfolioId: number) => `/api/portfolios/${portfolioId}/reports`,
  
  // Auth
  AUTH: '/api/auth',
  LOGIN: '/api/auth/signin',
  REGISTER: '/api/auth/signup'
} as const;
