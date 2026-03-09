import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { Holding } from '../../core/models';
import { HoldingsService } from '../../core/services/holdings.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-holdings',
  standalone: true,
  imports: [CommonModule, InrPipe, IconComponent, EmptyStateComponent, ChartCardComponent],
  template: `
    <div class="holdings-page">
      <header class="page-header">
        <div>
          <h2>Portfolio Holdings</h2>
          <p class="subtitle">Current stock positions synced from your transactions</p>
        </div>
        <span class="live-indicator"><span class="live-dot"></span> Live</span>
      </header>

      <div class="auto-notice">
        <app-icon name="activity" [size]="15"></app-icon>
        Holdings and market prices refresh automatically every 10 seconds.
      </div>

      <app-chart-card title="Holdings Table" meta="Live quantities, valuations and P&L">
        @if (loading) {
          <div class="loading-state">
            <div class="loader"></div>
            <p>Loading holdings...</p>
          </div>
        } @else if (holdings.length === 0) {
          <app-empty-state
            title="No holdings yet"
            message="Start by creating buy transactions. Your positions will appear here automatically."
            icon="briefcase"></app-empty-state>
        } @else {
          <section class="summary-strip">
            <article>
              <span>Total Invested</span>
              <strong>{{ totalInvested | inr }}</strong>
            </article>
            <article>
              <span>Current Value</span>
              <strong>{{ totalCurrentValue | inr }}</strong>
            </article>
            <article>
              <span>Total P&L</span>
              <strong [class.profit]="totalPnL >= 0" [class.loss]="totalPnL < 0">{{ totalPnL >= 0 ? '+' : '' }}{{ totalPnL | inr }}</strong>
            </article>
          </section>

          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Qty</th>
                  <th>Avg Cost</th>
                  <th>Current Price</th>
                  <th>Total Cost</th>
                  <th>Current Value</th>
                  <th>P&L</th>
                  <th>P&L %</th>
                </tr>
              </thead>
              <tbody>
                @for (holding of holdings; track holding.id) {
                  <tr>
                    <td><span class="symbol-pill">{{ holding.symbol }}</span></td>
                    <td>{{ holding.quantity }}</td>
                    <td>{{ holding.purchasePrice | inr }}</td>
                    <td class="live-price">{{ holding.currentPrice | inr }}</td>
                    <td>{{ holding.totalCost | inr }}</td>
                    <td>{{ holding.currentValue | inr }}</td>
                    <td [class.profit]="holding.pnL >= 0" [class.loss]="holding.pnL < 0">
                      {{ holding.pnL >= 0 ? '+' : '' }}{{ holding.pnL | inr }}
                    </td>
                    <td>
                      <span class="pnl-badge" [class.positive-bg]="holding.pnLPercentage >= 0" [class.negative-bg]="holding.pnLPercentage < 0">
                        {{ holding.pnLPercentage >= 0 ? '+' : '' }}{{ holding.pnLPercentage | number:'1.2-2' }}%
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </app-chart-card>
    </div>
  `,
  styles: [
    `
      .holdings-page {
        max-width: 1280px;
        margin: 0 auto;
        display: grid;
        gap: var(--space-5);
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
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
      .auto-notice {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        width: fit-content;
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-sm);
        background: var(--surface-muted-2);
        color: var(--color-text-secondary);
        padding: 10px 12px;
      }
      .summary-strip {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-3);
        align-items: stretch;
        margin-bottom: var(--space-4);
      }
      .summary-strip article {
        padding: var(--space-4);
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-md);
        background: var(--surface-muted-3);
        height: 100%;
      }
      .summary-strip span {
        display: block;
        color: var(--color-text-secondary);
        margin-bottom: var(--space-1);
      }
      .summary-strip strong {
        font-size: 1.2rem;
      }
      .table-wrap {
        overflow: auto;
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
      }
      .data-table th,
      .data-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid var(--color-border);
      }
      .data-table th {
        color: var(--color-text-secondary);
        font-size: 0.75rem;
        letter-spacing: 0.04em;
      }
      .data-table td {
        color: var(--color-text-primary);
      }
      .symbol-pill {
        display: inline-flex;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--overlay-primary-18);
        color: var(--color-text-primary);
        font-weight: 600;
      }
      .live-price {
        color: var(--color-primary);
        font-weight: 600;
      }
      .profit {
        color: var(--color-profit);
      }
      .loss {
        color: var(--color-loss);
      }
      .pnl-badge {
        display: inline-flex;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 600;
      }
      .positive-bg {
        background: var(--overlay-profit-16);
        color: var(--color-profit);
      }
      .negative-bg {
        background: var(--overlay-loss-14);
        color: var(--color-loss);
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
      @media (max-width: 900px) {
        .summary-strip {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 700px) {
        .page-header {
          flex-direction: column;
        }
      }
    `
  ]
})
export class HoldingsComponent implements OnInit, OnDestroy {
  holdings: Holding[] = [];
  loading = true;

  totalInvested = 0;
  totalCurrentValue = 0;
  totalPnL = 0;

  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL = 10000;

  constructor(private holdingsService: HoldingsService) {}

  ngOnInit(): void {
    this.loadHoldings();

    this.refreshSubscription = interval(this.REFRESH_INTERVAL).subscribe(() => {
      this.loadHoldings();
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadHoldings(): void {
    this.holdingsService.getHoldings().subscribe({
      next: (res) => {
        this.holdings = res.data || [];
        this.calculateTotals();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalInvested = this.holdings.reduce((sum, h) => sum + (h.totalCost || 0), 0);
    this.totalCurrentValue = this.holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
    this.totalPnL = this.totalCurrentValue - this.totalInvested;
  }
}
