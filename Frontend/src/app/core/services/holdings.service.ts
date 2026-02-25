import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';
import { Holding } from '../models/holding.model';

@Injectable({ providedIn: 'root' })
export class HoldingsService {

  constructor(private api: ApiHttpClient) {}

  getAll(): Observable<Holding[]> {
    return this.api.get<Holding[]>(ENDPOINTS.HOLDINGS);
  }

  getBySymbol(symbol: string): Observable<Holding> {
    return this.api.get<Holding>(`${ENDPOINTS.HOLDINGS}/${symbol}`);
  }
}