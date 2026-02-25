import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';

@Injectable({ providedIn: 'root' })
export class ReportsService {

  constructor(private api: ApiHttpClient) {}

  getSummary(): Observable<any> {
    return this.api.get(`${ENDPOINTS.REPORTS}/summary`);
  }

  exportCSV(): Observable<Blob> {
    return this.api.get(`${ENDPOINTS.REPORTS}/export`);
  }
}