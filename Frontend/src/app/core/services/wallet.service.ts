import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, WalletSummary } from '../models';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private apiUrl = `${environment.apiUrl}/transactions/wallet`;

  constructor(private http: HttpClient) {}

  getWalletSummary(): Observable<ApiResponse<WalletSummary>> {
    return this.http.get<ApiResponse<WalletSummary>>(this.apiUrl);
  }

  addMoney(amount: number): Observable<ApiResponse<WalletSummary>> {
    return this.http.post<ApiResponse<WalletSummary>>(`${this.apiUrl}/add-money`, { amount });
  }
}
