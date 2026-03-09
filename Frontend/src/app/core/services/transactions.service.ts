import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Transaction, CreateTransactionRequest, WalletSummary } from '../models';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions(type?: string, limit: number = 50, offset: number = 0): Observable<ApiResponse<Transaction[]>> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<ApiResponse<Transaction[]>>(this.apiUrl, { params });
  }

  getTransactionById(id: number): Observable<ApiResponse<Transaction>> {
    return this.http.get<ApiResponse<Transaction>>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transaction: CreateTransactionRequest): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(this.apiUrl, transaction);
  }

  getWalletSummary(): Observable<ApiResponse<WalletSummary>> {
    return this.http.get<ApiResponse<WalletSummary>>(`${this.apiUrl}/wallet`);
  }
}
