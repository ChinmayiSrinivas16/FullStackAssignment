import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  constructor(private api: ApiHttpClient) {}

  getPnL(): Observable<any> {
    return this.api.get(`${ENDPOINTS.ANALYTICS}/pnl`);
  }

  getTopMovers(): Observable<any> {
    return this.api.get(`${ENDPOINTS.ANALYTICS}/top-movers`);
  }
}