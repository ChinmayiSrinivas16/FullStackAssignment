import { Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';
import { DashboardPage } from './features/dashboard/dashboard.page';
import { TransactionsPage } from './features/transactions/transactions.page';
import { HoldingsPage } from './features/holdings/holdings.page';
import { MarketdataPage } from './features/marketdata/marketdata.page';
import { AnalyticsPage } from './features/analytics/analytics.page';
import { ReportsPage } from './features/reports/reports.page';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // Default Route - Landing Page
  { path: '', component: LandingComponent },

  // Public Routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Main Features (Protected)
  { path: 'dashboard', component: DashboardPage, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsPage, canActivate: [AuthGuard] },
  { path: 'holdings', component: HoldingsPage, canActivate: [AuthGuard] },
  { path: 'marketdata', component: MarketdataPage, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsPage, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsPage, canActivate: [AuthGuard] },

  // Wildcard - Redirect to landing
  { path: '**', component: LandingComponent }
];
