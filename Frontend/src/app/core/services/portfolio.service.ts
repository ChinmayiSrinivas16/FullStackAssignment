import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';
import { Portfolio, PortfolioRequest, PortfolioSummary } from '../models/portfolio.model';
import { DashboardData } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  constructor(private api: ApiHttpClient) {}

  getAll(): Observable<Portfolio[]> {
    return this.api.get<Portfolio[]>(ENDPOINTS.PORTFOLIOS);
  }

  getSummaries(): Observable<PortfolioSummary[]> {
    return this.api.get<PortfolioSummary[]>(ENDPOINTS.PORTFOLIOS);
  }

  getById(id: number): Observable<Portfolio> {
    return this.api.get<Portfolio>(`${ENDPOINTS.PORTFOLIOS}/${id}`);
  }

  create(portfolio: PortfolioRequest): Observable<Portfolio> {
    return this.api.post<Portfolio>(ENDPOINTS.PORTFOLIOS, portfolio);
  }

  update(id: number, portfolio: PortfolioRequest): Observable<Portfolio> {
    return this.api.put<Portfolio>(`${ENDPOINTS.PORTFOLIOS}/${id}`, portfolio);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${ENDPOINTS.PORTFOLIOS}/${id}`);
  }

  getDashboard(id: number): Observable<DashboardData> {
    return this.api.get<DashboardData>(ENDPOINTS.PORTFOLIO_DASHBOARD(id));
  }

  refreshPrices(id: number): Observable<Portfolio> {
    return this.api.post<Portfolio>(ENDPOINTS.PORTFOLIO_REFRESH(id), {});
  }
}
