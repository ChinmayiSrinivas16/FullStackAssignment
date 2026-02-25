import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';

@Injectable({ providedIn: 'root' })
export class ReportsService {

  constructor(private api: ApiHttpClient) {}

  generateReport(format: string): Observable<Blob> {
    return this.api.post(`${ENDPOINTS.REPORTS}/generate`, { format }, { responseType: 'blob' });
  }

  getSummary(portfolioId: number): Observable<any> {
    return this.api.get<any>(`${ENDPOINTS.REPORTS(portfolioId)}/summary`);
  }

  exportCSV(portfolioId: number): Observable<Blob> {
    return this.api.getBlob(`${ENDPOINTS.REPORTS(portfolioId)}/export`);
  }

  exportPDF(portfolioId: number): Observable<Blob> {
    return this.api.getBlob(`${ENDPOINTS.REPORTS(portfolioId)}/pdf`);
  }
}
