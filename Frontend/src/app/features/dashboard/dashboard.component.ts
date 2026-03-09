import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { forkJoin, interval, Subscription } from 'rxjs';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { PortfolioService } from '../../core/services/portfolio.service';
import { HoldingsService } from '../../core/services/holdings.service';
import { DashboardData, Holding, PnLData, ReturnsData, WinRateData } from '../../core/models';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FINTECH_CHART_LABEL_COLOR, FINTECH_CHART_PALETTE } from '../../shared/theme/chart-palette';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgChartsModule,
    InrPipe,
    StatCardComponent,
    ChartCardComponent,
    EmptyStateComponent,
    IconComponent
  ],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <div>
          <h2>Portfolio Dashboard</h2>
          <p class="subtitle">Your investment overview at a glance. Auto-refresh every 15 seconds.</p>
        </div>
        <div class="header-right">
          <span class="live-indicator"><span class="live-dot"></span> Live</span>
          <button class="refresh-btn" (click)="refreshData()" [disabled]="loading">
            <app-icon name="refresh" [size]="14"></app-icon>
            Refresh
          </button>
        </div>
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="loader"></div>
          <p>Loading your portfolio...</p>
        </div>
      } @else {
        <p class="section-kicker">Core Metrics</p>
        <section class="summary-grid">
          <app-stat-card
            label="Total Invested"
            [value]="(dashboard?.totalInvestment || 0) | inr"
            icon="wallet"></app-stat-card>

          <app-stat-card
            label="Current Value"
            [value]="(dashboard?.currentValue || 0) | inr"
            icon="bar-chart-3"></app-stat-card>

          <app-stat-card
            label="Total P&L"
            [value]="(dashboard?.totalPnL || 0) | inr"
            [subtitle]="pnlData ? ((pnlData.pnlPercentage >= 0 ? '+' : '') + (pnlData.pnlPercentage | number:'1.2-2') + '%') : ''"
            [positive]="(dashboard?.totalPnL || 0) >= 0"
            [icon]="(dashboard?.totalPnL || 0) >= 0 ? 'trending-up' : 'trending-down'"></app-stat-card>

          <app-stat-card
            label="Win Rate"
            [value]="(winRate?.winRate ?? 0).toFixed(1) + '%'"
            [subtitle]="(winRate?.winningTrades || 0) + '/' + (winRate?.totalTrades || 0) + ' trades'"
            icon="trophy"></app-stat-card>
        </section>

        <p class="section-kicker">Allocation and P&L</p>
        <section class="grid-two">
          <app-chart-card title="Holdings Distribution" meta="Asset allocation by current value">
            @if (holdingsPieData.labels && holdingsPieData.labels.length > 0) {
              <div class="chart-wrapper">
                <canvas baseChart [data]="holdingsPieData" [options]="pieOptions" type="doughnut"></canvas>
              </div>
            } @else {
              <app-empty-state title="No holdings yet" message="Add holdings to see your distribution" icon="briefcase"></app-empty-state>
            }
          </app-chart-card>

          <app-chart-card title="P&L Breakdown" meta="Realized vs unrealized performance">
            @if (pnlData) {
              <div class="pnl-breakdown">
                <div class="pnl-item">
                  <div class="pnl-label-row">
                    <span>Realized P&L</span>
                    <span class="pnl-val" [class.profit]="pnlData.realizedPnL >= 0" [class.loss]="pnlData.realizedPnL < 0">{{ pnlData.realizedPnL | inr }}</span>
                  </div>
                  <div class="pnl-track"><div class="pnl-fill realized" [style.width.%]="getPnlBarWidth(pnlData.realizedPnL)"></div></div>
                </div>

                <div class="pnl-item">
                  <div class="pnl-label-row">
                    <span>Unrealized P&L</span>
                    <span class="pnl-val" [class.profit]="pnlData.unrealizedPnL >= 0" [class.loss]="pnlData.unrealizedPnL < 0">{{ pnlData.unrealizedPnL | inr }}</span>
                  </div>
                  <div class="pnl-track"><div class="pnl-fill unrealized" [style.width.%]="getPnlBarWidth(pnlData.unrealizedPnL)"></div></div>
                </div>

                <div class="pnl-total">
                  <span>Total P&L</span>
                  <strong [class.profit]="pnlData.totalPnL >= 0" [class.loss]="pnlData.totalPnL < 0">{{ pnlData.totalPnL | inr }}</strong>
                </div>
              </div>
            } @else {
              <app-empty-state title="No P&L data" message="P&L details will appear after market activity" icon="line-chart"></app-empty-state>
            }
          </app-chart-card>
        </section>

        <p class="section-kicker">Returns and Positions</p>
        <section class="grid-two">
          <app-chart-card title="Returns Overview" meta="Absolute and annualized returns">
            @if (returns) {
              <div class="returns-grid">
                <div class="return-item">
                  <span>Total Return</span>
                  <strong [class.profit]="returns.totalReturn >= 0" [class.loss]="returns.totalReturn < 0">{{ returns.totalReturn >= 0 ? '+' : '' }}{{ returns.totalReturn | number:'1.2-2' }}%</strong>
                </div>
                <div class="return-item">
                  <span>Annualized</span>
                  <strong [class.profit]="returns.annualizedReturn >= 0" [class.loss]="returns.annualizedReturn < 0">{{ returns.annualizedReturn >= 0 ? '+' : '' }}{{ returns.annualizedReturn | number:'1.2-2' }}%</strong>
                </div>
                <div class="return-item">
                  <span>YTD Return</span>
                  <strong [class.profit]="returns.ytdReturn >= 0" [class.loss]="returns.ytdReturn < 0">{{ returns.ytdReturn >= 0 ? '+' : '' }}{{ returns.ytdReturn | number:'1.2-2' }}%</strong>
                </div>
                <div class="return-item">
                  <span>Monthly</span>
                  <strong [class.profit]="returns.monthlyReturn >= 0" [class.loss]="returns.monthlyReturn < 0">{{ returns.monthlyReturn >= 0 ? '+' : '' }}{{ returns.monthlyReturn | number:'1.2-2' }}%</strong>
                </div>
              </div>
            }
          </app-chart-card>

          <app-chart-card title="Top Holdings" meta="Most valuable positions">
            <a routerLink="/holdings" class="view-all">View all holdings</a>
            @if (holdings.length > 0) {
              <table class="holdings-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Qty</th>
                    <th>Current</th>
                    <th>P&L</th>
                  </tr>
                </thead>
                <tbody>
                  @for (h of holdings.slice(0, 5); track h.id) {
                    <tr>
                      <td><span class="symbol-pill">{{ h.symbol }}</span></td>
                      <td>{{ h.quantity }}</td>
                      <td>{{ h.currentPrice | inr }}</td>
                      <td>
                        <span [class.profit]="h.pnL >= 0" [class.loss]="h.pnL < 0">{{ h.pnL | inr }}</span>
                        <small>{{ h.pnLPercentage >= 0 ? '+' : '' }}{{ h.pnLPercentage | number:'1.2-2' }}%</small>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <app-empty-state title="No holdings" message="Your positions will appear here" icon="briefcase"></app-empty-state>
            }
          </app-chart-card>
        </section>
      }
    </div>
  `,
  styles: [
    `
      .dashboard {
        max-width: 1280px;
        margin: 0 auto;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      h2 {
        margin: 0;
        font-size: 22px;
        color: var(--color-text-primary);
      }

      .subtitle {
        margin: var(--space-1) 0 0;
        color: var(--color-text-secondary);
      }

      .header-right {
        display: flex;
        gap: var(--space-3);
        align-items: center;
      }

      .live-indicator {
        display: flex;
        gap: var(--space-2);
        align-items: center;
        color: var(--color-profit);
        font-weight: 600;
        font-size: 0.82rem;
      }

      .live-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-profit);
        animation: pulse 1.8s ease infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }

        50% {
          opacity: 0.45;
        }
      }

      .refresh-btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 12px;
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-sm);
        background: var(--surface-elevated);
        color: var(--color-text-primary);
        cursor: pointer;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }

      .refresh-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        border-color: var(--overlay-primary-60);
      }

      .refresh-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--space-4);
        align-items: stretch;
        margin-bottom: var(--space-5);
      }

      .summary-grid app-stat-card:nth-child(1) {
        animation-delay: 40ms;
      }
      .summary-grid app-stat-card:nth-child(2) {
        animation-delay: 80ms;
      }
      .summary-grid app-stat-card:nth-child(3) {
        animation-delay: 120ms;
      }
      .summary-grid app-stat-card:nth-child(4) {
        animation-delay: 160ms;
      }

      .grid-two {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-5);
        align-items: stretch;
        margin-bottom: var(--space-5);
      }

      .section-kicker {
        margin: 0 0 var(--space-3);
        color: var(--color-text-secondary);
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 600;
      }

      .chart-wrapper {
        max-height: 280px;
      }

      .profit {
        color: var(--color-profit);
      }

      .loss {
        color: var(--color-loss);
      }

      .pnl-breakdown {
        display: grid;
        gap: var(--space-4);
      }

      .pnl-item {
        display: grid;
        gap: var(--space-2);
      }

      .pnl-label-row {
        display: flex;
        justify-content: space-between;
        color: var(--color-text-secondary);
      }

      .pnl-val {
        font-weight: 600;
      }

      .pnl-track {
        height: 8px;
        border-radius: 999px;
        background: var(--border-text-soft-2);
        overflow: hidden;
      }

      .pnl-fill {
        height: 100%;
        border-radius: inherit;
      }

      .pnl-fill.realized {
        background: linear-gradient(90deg, var(--color-profit), var(--color-profit));
      }

      .pnl-fill.unrealized {
        background: linear-gradient(90deg, var(--color-primary), var(--color-primary));
      }

      .pnl-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--space-3);
        border-top: 1px solid var(--color-border);
      }

      .returns-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-3);
      }

      .return-item {
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-muted-3);
        border: 1px solid var(--color-border-soft);
      }

      .return-item span {
        display: block;
        color: var(--color-text-secondary);
        margin-bottom: var(--space-1);
      }

      .return-item strong {
        font-size: 1.2rem;
      }

      .view-all {
        display: inline-block;
        margin-bottom: var(--space-3);
        text-decoration: none;
        color: var(--color-primary);
        font-weight: 600;
      }

      .holdings-table {
        width: 100%;
        border-collapse: collapse;
      }

      .holdings-table th,
      .holdings-table td {
        text-align: left;
        padding: 10px;
        border-bottom: 1px solid var(--color-border);
      }

      .holdings-table th {
        color: var(--color-text-secondary);
        font-size: 0.75rem;
        letter-spacing: 0.04em;
      }

      .holdings-table td {
        color: var(--color-text-primary);
      }

      .holdings-table small {
        display: block;
        color: var(--color-text-secondary);
      }

      .symbol-pill {
        display: inline-flex;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--overlay-primary-18);
        color: var(--color-text-primary);
        font-weight: 600;
      }

      .loading-state {
        display: grid;
        justify-items: center;
        gap: var(--space-3);
        padding: var(--space-10) 0;
        color: var(--color-text-secondary);
      }

      .loader {
        width: 36px;
        height: 36px;
        border: 3px solid var(--border-text-soft);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 1100px) {
        .summary-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .grid-two {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 620px) {
        .summary-grid {
          grid-template-columns: 1fr;
        }

        .page-header {
          flex-direction: column;
        }
      }
    `
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = true;
  dashboard: DashboardData | null = null;
  pnlData: PnLData | null = null;
  winRate: WinRateData | null = null;
  returns: ReturnsData | null = null;
  holdings: Holding[] = [];

  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL = 15000;

  holdingsPieData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  pieOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: FINTECH_CHART_LABEL_COLOR, padding: 16, usePointStyle: true, font: { size: 12 } }
      }
    }
  };

  constructor(
    private portfolioService: PortfolioService,
    private holdingsService: HoldingsService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.refreshSubscription = interval(this.REFRESH_INTERVAL).subscribe(() => {
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadData(): void {
    forkJoin({
      dashboard: this.portfolioService.getDashboard(),
      pnl: this.portfolioService.getPnL(),
      winRate: this.portfolioService.getWinRate(),
      returns: this.portfolioService.getReturns(),
      holdings: this.holdingsService.getHoldings()
    }).subscribe({
      next: (res) => {
        this.dashboard = res.dashboard.data;
        this.pnlData = res.pnl.data;
        this.winRate = res.winRate.data;
        this.returns = res.returns.data;
        this.holdings = res.holdings.data || [];
        this.buildPieChart();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loading = true;
    this.loadData();
  }

  buildPieChart(): void {
    if (!this.holdings.length) {
      return;
    }

    const colors = [...FINTECH_CHART_PALETTE, ...FINTECH_CHART_PALETTE];
    this.holdingsPieData = {
      labels: this.holdings.map((h) => h.symbol),
      datasets: [
        {
          data: this.holdings.map((h) => h.currentValue),
          backgroundColor: colors.slice(0, this.holdings.length),
          borderWidth: 0
        }
      ]
    };
  }

  getPnlBarWidth(value: number): number {
    if (!this.pnlData) {
      return 0;
    }

    const max = Math.max(Math.abs(this.pnlData.realizedPnL), Math.abs(this.pnlData.unrealizedPnL), 1);
    return (Math.abs(value) / max) * 100;
  }
}
