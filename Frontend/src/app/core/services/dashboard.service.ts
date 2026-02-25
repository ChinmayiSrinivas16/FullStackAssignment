import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';
import { DashboardData } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(private api: ApiHttpClient) {}

  getSummary(portfolioId: number): Observable<DashboardData> {
    return this.api.get<DashboardData>(ENDPOINTS.PORTFOLIO_DASHBOARD(portfolioId));
  }
}
