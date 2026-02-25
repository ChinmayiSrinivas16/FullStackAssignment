import { Routes } from '@angular/router';

import { DashboardPage } from './features/dashboard/dashboard.page';
import { TransactionsPage } from './features/transactions/transactions.page';
import { HoldingsPage } from './features/holdings/holdings.page';
import { MarketdataPage } from './features/marketdata/marketdata.page';
import { AnalyticsPage } from './features/analytics/analytics.page';
import { ReportsPage } from './features/reports/reports.page';

export const routes: Routes = [

  // Default Route
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Main Features
  { path: 'dashboard', component: DashboardPage },
  { path: 'transactions', component: TransactionsPage },
  { path: 'holdings', component: HoldingsPage },
  { path: 'marketdata', component: MarketdataPage },
  { path: 'analytics', component: AnalyticsPage },
  { path: 'reports', component: ReportsPage },

  // Wildcard
  { path: '**', redirectTo: 'dashboard' }
];