import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';
import { MarketData } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class MarketdataService {

  constructor(private api: ApiHttpClient) {}

  getQuote(symbol: string): Observable<MarketData> {
    return this.api.get<MarketData>(`${ENDPOINTS.MARKET}/${symbol}`);
  }
}