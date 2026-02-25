import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { DashboardData } from '../../core/models/analytics.model';
import { PortfolioSummary } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  imports: [CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {

  portfolios: PortfolioSummary[] = [];
  selectedPortfolioId: number | null = null;
  dashboard: DashboardData | null = null;
  loading = false;

  constructor(
    private portfolioService: PortfolioService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadPortfolios();
  }

  private loadPortfolios(): void {
    this.loading = true;
    this.portfolioService.getSummaries().subscribe({
      next: (data) => {
        this.portfolios = data;
        if (this.portfolios.length > 0) {
          this.selectedPortfolioId = this.portfolios[0].id;
          this.loadDashboard();
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onPortfolioChange(): void {
    if (this.selectedPortfolioId) {
      this.loadDashboard();
    }
  }

  private loadDashboard(): void {
    if (!this.selectedPortfolioId) return;
    
    this.loading = true;
    this.portfolioService.getDashboard(this.selectedPortfolioId).subscribe({
      next: (data: DashboardData) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  refreshPrices(): void {
    if (!this.selectedPortfolioId) return;
    
    this.loading = true;
    this.portfolioService.refreshPrices(this.selectedPortfolioId).subscribe({
      next: () => {
        this.loadDashboard();
      },
      error: () => this.loading = false
    });
  }
}
