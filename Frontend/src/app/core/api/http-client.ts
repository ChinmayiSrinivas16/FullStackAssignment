import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiHttpClient {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`);
  }

  post<T>(url: string, body: any, options?: any): Observable<T> {
    if (options && options.responseType === 'blob') {
      return this.http.post(`${this.baseUrl}${url}`, body, { 
        ...options, 
        responseType: 'blob' 
      }) as Observable<T>;
    }
    return this.http.post<T>(`${this.baseUrl}${url}`, body);
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${url}`);
  }

  getBlob(url: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${url}`, { responseType: 'blob' });
  }
}
