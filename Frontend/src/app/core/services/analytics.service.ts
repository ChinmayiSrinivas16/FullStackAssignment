import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';
import { AnalyticsData, ReportData } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  constructor(private api: ApiHttpClient) {}

  getAnalytics(portfolioId: number, period: string = 'ALL'): Observable<AnalyticsData> {
    return this.api.get<AnalyticsData>(`${ENDPOINTS.ANALYTICS(portfolioId)}?period=${period}`);
  }

  getReport(portfolioId: number): Observable<ReportData> {
    return this.api.get<ReportData>(ENDPOINTS.REPORTS(portfolioId));
  }

  exportReport(portfolioId: number, format: 'PDF' | 'EXCEL'): Observable<Blob> {
    return this.api.getBlob(`${ENDPOINTS.REPORTS(portfolioId)}/export?format=${format}`);
  }
}
