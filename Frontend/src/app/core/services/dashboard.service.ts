import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpClient } from '../api/http-client';
import { ENDPOINTS } from '../api/endpoints';
import { Dashboard } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(private api: ApiHttpClient) {}

  getSummary(): Observable<Dashboard> {
    return this.api.get<Dashboard>(ENDPOINTS.DASHBOARD);
  }
}