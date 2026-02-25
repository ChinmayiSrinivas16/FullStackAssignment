import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionsService {

  constructor(private api: ApiHttpClient) {}

  getAll(): Observable<Transaction[]> {
    return this.api.get<Transaction[]>(ENDPOINTS.TRANSACTIONS);
  }

  create(transaction: Transaction): Observable<Transaction> {
    return this.api.post<Transaction>(ENDPOINTS.TRANSACTIONS, transaction);
  }

  update(id: number, transaction: Transaction): Observable<Transaction> {
    return this.api.put<Transaction>(
      `${ENDPOINTS.TRANSACTIONS}/${id}`, 
      transaction
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${ENDPOINTS.TRANSACTIONS}/${id}`);
  }
}