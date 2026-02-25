import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';
import { Transaction, TransactionRequest, TransactionUpdateRequest } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionsService {

  constructor(private api: ApiHttpClient) {}

  getByPortfolio(portfolioId: number): Observable<Transaction[]> {
    return this.api.get<Transaction[]>(ENDPOINTS.TRANSACTIONS(portfolioId));
  }

  getById(portfolioId: number, id: number): Observable<Transaction> {
    return this.api.get<Transaction>(ENDPOINTS.TRANSACTION(portfolioId, id));
  }

  create(portfolioId: number, transaction: TransactionRequest): Observable<Transaction> {
    return this.api.post<Transaction>(ENDPOINTS.TRANSACTIONS(portfolioId), transaction);
  }

  update(portfolioId: number, id: number, transaction: TransactionUpdateRequest): Observable<Transaction> {
    return this.api.put<Transaction>(ENDPOINTS.TRANSACTION(portfolioId, id), transaction);
  }

  delete(portfolioId: number, id: number): Observable<void> {
    return this.api.delete<void>(ENDPOINTS.TRANSACTION(portfolioId, id));
  }

  getBySymbol(portfolioId: number, symbol: string): Observable<Transaction[]> {
    return this.api.get<Transaction[]>(`${ENDPOINTS.TRANSACTIONS(portfolioId)}?symbol=${symbol}`);
  }

  getByDateRange(portfolioId: number, startDate: string, endDate: string): Observable<Transaction[]> {
    return this.api.get<Transaction[]>(
      `${ENDPOINTS.TRANSACTIONS(portfolioId)}?startDate=${startDate}&endDate=${endDate}`
    );
  }
}
