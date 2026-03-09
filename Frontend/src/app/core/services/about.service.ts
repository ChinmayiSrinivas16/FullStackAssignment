import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AboutInfo, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AboutService {
  private apiUrl = `${environment.aboutApiUrl}/about`;

  constructor(private http: HttpClient) {}

  getAboutInfo(): Observable<ApiResponse<AboutInfo>> {
    return this.http.get<ApiResponse<AboutInfo>>(this.apiUrl);
  }
}
