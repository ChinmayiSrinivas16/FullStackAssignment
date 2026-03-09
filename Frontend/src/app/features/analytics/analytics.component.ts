import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { forkJoin, interval, Subscription } from 'rxjs';
import { AllocationItem, Holding, PnLData, WinRateData } from '../../core/models';
import { AnalyticsService } from '../../core/services/analytics.service';
import { HoldingsService } from '../../core/services/holdings.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { FINTECH_CHART_LABEL_COLOR, FINTECH_CHART_PALETTE } from '../../shared/theme/chart-palette';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    InrPipe,
    IconComponent,
    EmptyStateComponent,
    ChartCardComponent
  ],
  template: `
    <div class="analytics-page">
      <header class="page-header">
        <div>
          <h2>Profit and Loss Analytics</h2>
          <p class="subtitle">Deep insights into your portfolio performance</p>
        </div>
        <div class="header-actions">
          <span class="live-indicator"><span class="live-dot"></span> Live</span>
          <button class="refresh-btn" (click)="refreshData()" [disabled]="loading">
            <app-icon name="refresh" [size]="14"></app-icon>
            Refresh
          </button>
        </div>
      </header>

      @if (loading) {
        <div class="loading-state">
          <div class="loader"></div>
          <p>Analyzing your portfolio...</p>
        </div>
      } @else {
        <app-chart-card title="Profit and Loss Analysis" meta="Choose a time period for P&L trends">
          <div class="period-selector">
            @for (p of periods; track p) {
              <button class="period-btn" [class.active]="selectedPeriod === p" (click)="changePeriod(p)">
                {{ p | titlecase }}
              </button>
            }
          </div>

          @if (pnlData) {
            <div class="pnl-cards">
              <article class="pnl-card">
                <span>Total P&L</span>
                <strong [class.profit]="pnlData.totalPnL >= 0" [class.loss]="pnlData.totalPnL < 0">{{ pnlData.totalPnL | inr }}</strong>
                <small [class.profit]="pnlData.pnlPercentage >= 0" [class.loss]="pnlData.pnlPercentage < 0">
                  {{ pnlData.pnlPercentage >= 0 ? '+' : '' }}{{ pnlData.pnlPercentage | number:'1.2-2' }}%
                </small>
              </article>
              <article class="pnl-card">
                <span>Realized Gains</span>
                <strong [class.profit]="pnlData.realizedPnL >= 0" [class.loss]="pnlData.realizedPnL < 0">{{ pnlData.realizedPnL | inr }}</strong>
                <small>From closed positions</small>
              </article>
              <article class="pnl-card">
                <span>Unrealized Gains</span>
                <strong [class.profit]="pnlData.unrealizedPnL >= 0" [class.loss]="pnlData.unrealizedPnL < 0">{{ pnlData.unrealizedPnL | inr }}</strong>
                <small>From open positions</small>
              </article>
            </div>
          }
        </app-chart-card>

        <section class="grid-two">
          <app-chart-card title="Win Rate" meta="Winning versus losing trades">
            @if (winRate) {
              <div class="win-rate-display">
                <div
                  class="win-rate-ring"
                  [class.zero]="winRate.winRate <= 0"
                  [style.--progress-angle]="(winRate.winRate * 3.6) + 'deg'">
                  <div class="win-rate-core">
                    <strong>{{ winRate.winRate | number:'1.1-1' }}%</strong>
                    <span class="ring-caption">Win Rate</span>
                  </div>
                </div>
                <div class="win-stats">
                  <div class="win-stat"><span class="stat-dot win"></span>Winning: {{ winRate.winningTrades }}</div>
                  <div class="win-stat"><span class="stat-dot lose"></span>Losing: {{ winRate.losingTrades }}</div>
                  <div class="win-stat"><span class="stat-dot neutral"></span>Total: {{ winRate.totalTrades }}</div>
                </div>
              </div>
            }
          </app-chart-card>

          <app-chart-card title="Investment Distribution" meta="Allocation by asset type">
            @if (allocationChartData.labels && allocationChartData.labels.length > 0) {
              <div class="chart-wrapper">
                <canvas baseChart [data]="allocationChartData" [options]="pieOptions" type="pie"></canvas>
              </div>
            } @else {
              <app-empty-state title="No allocation data" message="Add holdings to view your allocation" icon="pie-chart"></app-empty-state>
            }
          </app-chart-card>
        </section>

        <section class="grid-two">
          <app-chart-card title="Top Performers" meta="Best P&L contributors">
            @if (topPerformers.length > 0) {
              <div class="performer-list">
                @for (h of topPerformers; track h.id) {
                  <article class="performer-item">
                    <div>
                      <span class="symbol-pill">{{ h.symbol }}</span>
                      <small>{{ h.quantity }} shares</small>
                    </div>
                    <div class="performer-meta">
                      <span class="profit">+{{ h.pnLPercentage | number:'1.2-2' }}%</span>
                      <span class="profit">{{ h.pnL | inr }}</span>
                    </div>
                  </article>
                }
              </div>
            } @else {
              <app-empty-state title="No profitable holdings" message="Performance leaders appear here once your positions gain." icon="trending-up"></app-empty-state>
            }
          </app-chart-card>

          <app-chart-card title="Loss-Making Stocks" meta="Positions to monitor closely">
            @if (bottomPerformers.length > 0) {
              <div class="performer-list">
                @for (h of bottomPerformers; track h.id) {
                  <article class="performer-item">
                    <div>
                      <span class="symbol-pill loss-pill">{{ h.symbol }}</span>
                      <small>{{ h.quantity }} shares</small>
                    </div>
                    <div class="performer-meta loss-meta">
                      <span class="loss">{{ h.pnLPercentage | number:'1.2-2' }}%</span>
                      <span class="loss">{{ h.pnL | inr }}</span>
                    </div>
                  </article>
                }
              </div>
            } @else {
              <app-empty-state title="No loss-making positions" message="Great momentum. Your negative performers list is empty." icon="trophy"></app-empty-state>
            }
          </app-chart-card>
        </section>
      }
    </div>
  `,
  styles: [
    `
      .analytics-page {
        max-width: 1280px;
        margin: 0 auto;
        display: grid;
        gap: var(--space-5);
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        gap: var(--space-4);
      }
      h2 {
        margin: 0;
        font-size: 22px;
      }
      .subtitle {
        margin: var(--space-1) 0 0;
        color: var(--color-text-secondary);
      }
      .header-actions {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }
      .live-indicator {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--color-profit);
        font-weight: 600;
      }
      .live-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-profit);
        animation: pulse 1.8s infinite ease;
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
        border: 1px solid var(--color-border-soft);
        background: var(--surface-elevated);
        color: var(--color-text-primary);
        border-radius: var(--radius-sm);
        padding: 8px 12px;
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        cursor: pointer;
      }
      .refresh-btn:disabled {
        opacity: 0.6;
      }
      .period-selector {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-4);
      }
      .period-btn {
        border: 1px solid var(--color-border-soft);
        background: var(--surface-muted-3);
        color: var(--color-text-secondary);
        border-radius: 999px;
        padding: 6px 12px;
        cursor: pointer;
      }
      .period-btn.active {
        border-color: var(--color-primary);
        background: var(--overlay-primary-24);
        color: var(--color-text-primary);
      }
      .pnl-cards {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-3);
        align-items: stretch;
      }
      .pnl-card {
        background: var(--surface-muted-3);
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        display: grid;
        gap: var(--space-1);
      }
      .pnl-card span,
      .pnl-card small {
        color: var(--color-text-secondary);
      }
      .pnl-card strong {
        font-size: 1.4rem;
      }
      .profit {
        color: var(--color-profit);
      }
      .loss {
        color: var(--color-loss);
      }
      .grid-two {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-5);
        align-items: stretch;
      }
      .win-rate-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-5);
      }

      .win-rate-ring {
        --progress-angle: 0deg;
        width: 176px;
        height: 176px;
        border-radius: 50%;
        padding: 12px;
        display: grid;
        place-items: center;
        background: conic-gradient(var(--color-primary) var(--progress-angle), var(--border-text-soft) 0);
        box-shadow: inset 0 0 0 1px var(--color-border-muted);
      }

      .win-rate-ring.zero {
        background: conic-gradient(var(--border-text-soft) 360deg);
      }

      .win-rate-core {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 20%, rgba(37, 99, 235, 0.08), transparent 50%), var(--color-card);
        border: 1px solid var(--color-border-soft);
        display: grid;
        place-items: center;
        align-content: center;
        gap: 6px;
      }

      .win-rate-core strong {
        font-size: 2.15rem;
        color: var(--color-text-primary);
        line-height: 1;
      }

      .ring-caption {
        font-size: 0.72rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--color-text-secondary);
      }
      .win-stats {
        display: grid;
        gap: var(--space-2);
      }
      .win-stat {
        color: var(--color-text-secondary);
      }
      .stat-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: var(--space-2);
      }
      .stat-dot.win {
        background: var(--color-profit);
      }
      .stat-dot.lose {
        background: rgba(239, 68, 68, 0.78);
      }
      .stat-dot.neutral {
        background: var(--color-text-secondary);
      }
      .chart-wrapper {
        max-height: 260px;
      }
      .performer-list {
        display: grid;
        gap: var(--space-2);
      }
      .performer-item {
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-sm);
        background: var(--surface-muted-3);
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .symbol-pill {
        display: inline-flex;
        margin-right: var(--space-2);
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--overlay-primary-18);
        color: var(--color-text-primary);
        font-weight: 600;
      }
      .performer-item small {
        color: var(--color-text-secondary);
      }
      .performer-meta {
        display: grid;
        text-align: right;
      }

      .loss-pill {
        background: rgba(239, 68, 68, 0.14);
      }

      .loss-meta .loss {
        color: rgba(239, 68, 68, 0.82);
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
        border-radius: 50%;
        border: 3px solid var(--border-text-soft);
        border-top-color: var(--color-primary);
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (max-width: 1024px) {
        .pnl-cards,
        .grid-two {
          grid-template-columns: 1fr;
        }

        .win-rate-ring {
          width: 160px;
          height: 160px;
        }

        .win-rate-core strong {
          font-size: 1.9rem;
        }
      }
      @media (max-width: 700px) {
        .page-header {
          flex-direction: column;
        }

        .win-rate-display {
          flex-direction: column;
          gap: var(--space-4);
        }

        .win-rate-ring {
          width: 148px;
          height: 148px;
        }

        .win-rate-core strong {
          font-size: 1.7rem;
        }
      }
    `
  ]
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  loading = true;
  pnlData: PnLData | null = null;
  winRate: WinRateData | null = null;
  holdings: Holding[] = [];
  topPerformers: Holding[] = [];
  bottomPerformers: Holding[] = [];
  allocationData: { [key: string]: AllocationItem } = {};
  selectedPeriod = 'monthly';
  periods = ['daily', 'weekly', 'monthly', 'yearly'];

  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL = 20000;

  allocationChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  pieOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: FINTECH_CHART_LABEL_COLOR, padding: 16, usePointStyle: true, font: { size: 12 } }
      }
    }
  };

  constructor(
    private portfolioService: PortfolioService,
    private analyticsService: AnalyticsService,
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
      pnl: this.portfolioService.getPnL(this.selectedPeriod),
      winRate: this.portfolioService.getWinRate(),
      holdings: this.holdingsService.getHoldings(),
      allocation: this.analyticsService.getAssetAllocation()
    }).subscribe({
      next: (res) => {
        this.pnlData = res.pnl.data;
        this.winRate = res.winRate.data;
        this.holdings = res.holdings.data || [];
        this.allocationData = res.allocation.data || {};
        this.computePerformers();
        this.buildAllocationChart();
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

  changePeriod(period: string): void {
    this.selectedPeriod = period;
    this.portfolioService.getPnL(period).subscribe({
      next: (res) => {
        this.pnlData = res.data;
      }
    });
  }

  computePerformers(): void {
    const sorted = [...this.holdings].sort((a, b) => b.pnLPercentage - a.pnLPercentage);
    this.topPerformers = sorted.filter((h) => h.pnL > 0).slice(0, 5);
    this.bottomPerformers = sorted.filter((h) => h.pnL < 0).reverse().slice(0, 5);
  }

  buildAllocationChart(): void {
    const keys = Object.keys(this.allocationData);
    if (!keys.length) {
      return;
    }

    const allocationColorMap: Record<string, string> = {
      stocks: '#2563eb',
      equity: '#1d4ed8',
      bonds: '#94a3b8',
      debt: '#64748b',
      cash: '#22c55e',
      gold: '#334155'
    };

    const fallbackColors = ['#2563eb', '#1d4ed8', '#94a3b8', '#22c55e', '#334155'];

    this.allocationChartData = {
      labels: keys.map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
      datasets: [
        {
          data: keys.map((k) => this.allocationData[k].percentage),
          backgroundColor: keys.map((k, i) => allocationColorMap[k.toLowerCase()] || fallbackColors[i % fallbackColors.length]),
          borderWidth: 2,
          borderColor: '#1e293b'
        }
      ]
    };
  }

  getCircleDash(percentage: number): string {
    const circumference = 2 * Math.PI * 42;
    const filled = (percentage / 100) * circumference;
    return `${filled} ${circumference}`;
  }
}
