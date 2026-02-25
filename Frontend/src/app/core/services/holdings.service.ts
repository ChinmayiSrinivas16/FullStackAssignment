import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';
import { Stock, StockRequest, StockSummary } from '../models/stock.model';

@Injectable({ providedIn: 'root' })
export class HoldingsService {

  constructor(private api: ApiHttpClient) {}

  getByPortfolio(portfolioId: number): Observable<Stock[]> {
    return this.api.get<Stock[]>(ENDPOINTS.STOCKS(portfolioId));
  }

  getById(portfolioId: number, id: number): Observable<Stock> {
    return this.api.get<Stock>(ENDPOINTS.STOCK(portfolioId, id));
  }

  create(portfolioId: number, stock: StockRequest): Observable<Stock> {
    return this.api.post<Stock>(ENDPOINTS.STOCKS(portfolioId), stock);
  }

  update(portfolioId: number, id: number, stock: StockRequest): Observable<Stock> {
    return this.api.put<Stock>(ENDPOINTS.STOCK(portfolioId, id), stock);
  }

  delete(portfolioId: number, id: number): Observable<void> {
    return this.api.delete<void>(ENDPOINTS.STOCK(portfolioId, id));
  }

  getSummaries(portfolioId: number): Observable<StockSummary[]> {
    return this.api.get<StockSummary[]>(`${ENDPOINTS.STOCKS(portfolioId)}/summaries`);
  }
}
