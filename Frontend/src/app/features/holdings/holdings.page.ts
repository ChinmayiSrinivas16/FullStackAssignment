import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { PortfolioSummary } from '../../core/models/portfolio.model';
import { Holding } from '../../core/models/holding.model';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.page.html',
  imports: [CommonModule, FormsModule]
})
export class HoldingsPage implements OnInit {

  portfolios: PortfolioSummary[] = [];
  holdings: Holding[] = [];
  selectedPortfolioId: number | null = null;
  loading = false;

  constructor(private portfolioService: PortfolioService) {}

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
          this.loadDashboardData();
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  private loadDashboardData(): void {
    if (!this.selectedPortfolioId) return;
    this.portfolioService.getDashboard(this.selectedPortfolioId).subscribe({
      next: (data) => {
        const holdingsArray: Holding[] = [];
        for (const h of (data.holdings || [])) {
          holdingsArray.push({
            symbol: h.symbol,
            quantity: h.quantity,
            averageBuyPrice: h.averageBuyPrice,
            avgPrice: h.averageBuyPrice,
            currentPrice: h.currentPrice,
            investmentAmount: h.investmentAmount,
            currentValue: h.currentValue,
            gainLoss: h.gainLoss,
            gainLossPercent: h.gainLossPercent,
            pnl: h.gainLoss,
            status: h.status
          });
        }
        this.holdings = holdingsArray;
      },
      error: () => this.holdings = []
    });
  }

  onPortfolioChange(): void {
    this.loadDashboardData();
  }
}
