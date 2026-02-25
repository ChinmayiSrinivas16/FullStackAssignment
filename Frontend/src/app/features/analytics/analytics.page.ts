import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../core/services/analytics.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { PortfolioSummary } from '../../core/models/portfolio.model';
import { AnalyticsData, ReportData } from '../../core/models/analytics.model';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  imports: [CommonModule, FormsModule]
})
export class AnalyticsPage implements OnInit {

  portfolios: PortfolioSummary[] = [];
  selectedPortfolioId: number | null = null;
  selectedPeriod: string = 'ALL';
  analytics: AnalyticsData | null = null;
  pnlData: { totalGain: number; totalLoss: number } = { totalGain: 0, totalLoss: 0 };
  movers: { symbol: string; change: number }[] = [];
  loading = false;

  constructor(
    private analyticsService: AnalyticsService,
    private portfolioService: PortfolioService
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
          this.loadAnalytics();
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onPortfolioChange(): void {
    this.loadAnalytics();
  }

  onPeriodChange(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    if (!this.selectedPortfolioId) return;

    this.loading = true;
    this.analyticsService.getAnalytics(this.selectedPortfolioId, this.selectedPeriod).subscribe({
      next: (data) => {
        this.analytics = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  exportReport(format: 'PDF' | 'EXCEL'): void {
    if (!this.selectedPortfolioId) return;

    this.analyticsService.exportReport(this.selectedPortfolioId, format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-report.${format.toLowerCase()}`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}
