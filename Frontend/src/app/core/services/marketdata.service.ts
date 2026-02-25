import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';
import { MarketStock } from '../models/stock.model';

@Injectable({ providedIn: 'root' })
export class MarketDataService {

  constructor(private api: ApiHttpClient) {}

  getAllStocks(): Observable<MarketStock[]> {
    return this.api.get<MarketStock[]>(ENDPOINTS.MARKET_STOCKS);
  }

  getStockPrice(symbol: string): Observable<MarketStock> {
    return this.api.get<MarketStock>(ENDPOINTS.MARKET_PRICE(symbol));
  }

  getTopGainers(): Observable<MarketStock[]> {
    return this.api.get<MarketStock[]>(`${ENDPOINTS.MARKET_STOCKS}/gainers`);
  }

  getTopLosers(): Observable<MarketStock[]> {
    return this.api.get<MarketStock[]>(`${ENDPOINTS.MARKET_STOCKS}/losers`);
  }

  searchStocks(query: string): Observable<MarketStock[]> {
    return this.api.get<MarketStock[]>(`${ENDPOINTS.MARKET_STOCKS}/search?q=${query}`);
  }
}
