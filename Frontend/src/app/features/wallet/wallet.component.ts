import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { WalletSummary } from '../../core/models';
import { WalletService } from '../../core/services/wallet.service';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, InrPipe, StatCardComponent, ChartCardComponent, EmptyStateComponent, IconComponent],
  template: `
    <div class="wallet-page">
      <header class="page-header">
        <div>
          <h2>Wallet</h2>
          <p class="subtitle">Funds and trade-ready balance.</p>
        </div>
        <button class="refresh-btn" (click)="refresh()" [disabled]="loading">
          <app-icon name="refresh" [size]="14"></app-icon>
          Refresh
        </button>
      </header>

      @if (loading) {
        <div class="loading-state">
          <div class="loader"></div>
          <p>Loading wallet data...</p>
        </div>
      } @else if (wallet) {
        <app-chart-card title="Add Money">
          <form class="add-funds-form" (submit)="$event.preventDefault(); addMoney()">
            <label for="addMoneyAmount">Amount</label>
            <div class="add-money-row">
              <input id="addMoneyAmount" type="number" min="1" step="1" [(ngModel)]="addMoneyAmount" name="addMoneyAmount" placeholder="Enter amount" />
              <button type="button" class="add-money-btn" (click)="addMoney()" [disabled]="addingMoney || addMoneyAmount <= 0">
                @if (addingMoney) {
                  Adding...
                } @else {
                  Add Money
                }
              </button>
            </div>
          </form>

          @if (addMoneySuccess) {
            <p class="success-msg">{{ addMoneySuccess }}</p>
          }

          @if (addMoneyError) {
            <p class="error-msg">{{ addMoneyError }}</p>
          }
        </app-chart-card>

        <section class="summary-grid">
          <app-stat-card label="Wallet Balance" [value]="wallet.balance | inr" icon="wallet"></app-stat-card>
          <app-stat-card label="Available to Trade" [value]="wallet.availableToTrade | inr" icon="bar-chart-3"></app-stat-card>
          <app-stat-card label="Minimum Balance" [value]="wallet.minimumBalance | inr" icon="line-chart"></app-stat-card>
        </section>

        <section class="grid-two">
          <app-chart-card title="Liquidity Breakdown">
            <div class="summary-rows">
              <div class="summary-row">
                <span>Total Balance</span>
                <strong>{{ wallet.balance | inr }}</strong>
              </div>
              <div class="summary-row">
                <span>Available to Trade</span>
                <strong>{{ wallet.availableToTrade | inr }}</strong>
              </div>
              <div class="summary-row">
                <span>Reserved / Locked</span>
                <strong>{{ reservedAmount | inr }}</strong>
              </div>
              <div class="summary-row">
                <span>Minimum Balance Requirement</span>
                <strong>{{ wallet.minimumBalance | inr }}</strong>
              </div>
            </div>
          </app-chart-card>

          <app-chart-card title="Wallet Status">
            <div class="health-box">
              <p>
                <span class="label">Status</span>
                <strong class="ok">Operational</strong>
              </p>
              <p>
                <span class="label">Trade Readiness</span>
                <strong>{{ readiness }}</strong>
              </p>
              <p>
                <span class="label">Last Updated</span>
                <strong>{{ lastUpdated | date:'dd MMM yyyy, hh:mm:ss a' }}</strong>
              </p>
            </div>
          </app-chart-card>
        </section>
      } @else {
        <app-empty-state
          title="Wallet data unavailable"
          message="Unable to load wallet data right now."
          icon="wallet"></app-empty-state>
      }
    </div>
  `,
  styles: [
    `
      .wallet-page {
        max-width: 1100px;
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
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-4);
      }
      .grid-two {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-4);
      }
      .summary-rows {
        display: grid;
      }
      .summary-row {
        padding: 10px 0;
        border-bottom: 1px solid var(--color-border);
        display: flex;
        justify-content: space-between;
        gap: var(--space-4);
      }
      .summary-row:last-child {
        border-bottom: 0;
      }
      .summary-row span {
        color: var(--color-text-secondary);
      }
      .health-box {
        display: grid;
        gap: var(--space-2);
      }
      .add-funds-form {
        display: grid;
        gap: var(--space-2);
      }
      .add-money-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--space-2);
      }
      .add-funds-form label {
        color: var(--color-text-secondary);
        font-size: 0.78rem;
        text-transform: uppercase;
      }
      .add-funds-form input {
        width: 100%;
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-sm);
        padding: 10px;
        background: var(--surface-muted);
        color: var(--color-text-primary);
      }
      .add-money-btn {
        border: 0;
        border-radius: var(--radius-sm);
        background: var(--color-primary);
        color: var(--color-text-primary);
        padding: 10px 14px;
        cursor: pointer;
      }
      .add-money-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
      .success-msg {
        color: var(--color-profit);
        margin: var(--space-2) 0 0;
      }
      .error-msg {
        color: var(--color-loss);
        margin: var(--space-2) 0 0;
      }
      .health-box p {
        margin: 0;
        border: 1px solid var(--color-border-soft);
        background: var(--surface-muted-3);
        border-radius: var(--radius-sm);
        padding: 10px;
        display: grid;
        gap: 4px;
      }
      .label {
        color: var(--color-text-secondary);
        font-size: 0.78rem;
        text-transform: uppercase;
      }
      .ok {
        color: var(--color-profit);
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
      @media (max-width: 860px) {
        .summary-grid {
          grid-template-columns: 1fr;
        }
        .grid-two {
          grid-template-columns: 1fr;
        }
        .add-money-row {
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
export class WalletComponent implements OnInit, OnDestroy {
  loading = true;
  wallet: WalletSummary | null = null;
  lastUpdated = new Date();
  addMoneyAmount = 0;
  addingMoney = false;
  addMoneySuccess = '';
  addMoneyError = '';
  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL = 15000;

  constructor(private walletService: WalletService) {}

  get reservedAmount(): number {
    if (!this.wallet) {
      return 0;
    }
    return Math.max(0, this.wallet.balance - this.wallet.availableToTrade);
  }

  get readiness(): string {
    if (!this.wallet) {
      return 'Unavailable';
    }
    return this.wallet.availableToTrade >= this.wallet.minimumBalance ? 'Healthy' : 'Low Buffer';
  }

  ngOnInit(): void {
    this.fetchWallet();
    this.refreshSubscription = interval(this.REFRESH_INTERVAL).subscribe(() => this.fetchWallet());
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  refresh(): void {
    this.loading = true;
    this.fetchWallet();
  }

  addMoney(): void {
    if (this.addMoneyAmount <= 0 || this.addingMoney) {
      return;
    }

    this.addingMoney = true;
    this.addMoneySuccess = '';
    this.addMoneyError = '';

    this.walletService.addMoney(this.addMoneyAmount).subscribe({
      next: (response) => {
        this.wallet = response.data;
        this.lastUpdated = new Date();
        this.addMoneySuccess = 'Money added successfully.';
        this.addMoneyAmount = 0;
        this.addingMoney = false;
      },
      error: (error) => {
        this.addMoneyError = this.getUserSafeError(error?.error?.message, 'Unable to add money right now. Please try again.');
        this.addingMoney = false;
      }
    });
  }

  private getUserSafeError(message: string | undefined, fallback: string): string {
    if (!message) {
      return fallback;
    }

    const technicalMarkers = ['port ', 'localhost', 'connection refused', 'microservice', 'restclientexception'];
    const normalized = message.toLowerCase();
    if (technicalMarkers.some((marker) => normalized.includes(marker))) {
      return fallback;
    }

    return message;
  }

  private fetchWallet(): void {
    this.walletService.getWalletSummary().subscribe({
      next: (response) => {
        this.wallet = response.data;
        this.loading = false;
        this.lastUpdated = new Date();
      },
      error: () => {
        this.wallet = null;
        this.loading = false;
      }
    });
  }
}
