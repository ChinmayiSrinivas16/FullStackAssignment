import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { Transaction } from '../../core/models';
import { MarketService, StockListItem } from '../../core/services/market.service';
import { TransactionsService } from '../../core/services/transactions.service';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, FormsModule, InrPipe, ChartCardComponent, EmptyStateComponent, IconComponent],
  template: `
    <div class="market-page">
      <div class="market-header">
        <div>
          <h1>Live Market Trading</h1>
          <p class="subtitle">Real-time stock trading with advanced order types</p>
        </div>
        <span class="live-indicator"><span class="live-dot"></span> Live</span>
      </div>

      <div class="market-grid">
        <app-chart-card title="Stocks" meta="Search and select">
          <div class="search-box">
            <app-icon name="search" [size]="15"></app-icon>
            <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Search stocks..." />
          </div>
          <div class="stock-list">
            @for (stock of filteredStocks; track stock.symbol) {
              <button class="stock-item" [class.active]="selectedStock?.symbol === stock.symbol" (click)="selectStock(stock)">
                <span class="identity">
                  <strong>{{ stock.symbol }}</strong>
                  <small>{{ stock.name }}</small>
                </span>
                <span class="price">{{ stock.price | inr }}</span>
              </button>
            }
          </div>
        </app-chart-card>

        @if (selectedStock) {
          <app-chart-card [title]="selectedStock.symbol + ' - ' + selectedStock.name" meta="Live price simulation">
            <div class="selected-price">
              <strong [class.profit]="priceChange >= 0" [class.loss]="priceChange < 0">{{ currentPrice | inr }}</strong>
              <span [class.profit]="priceChange >= 0" [class.loss]="priceChange < 0">{{ priceChange >= 0 ? '+' : '' }}{{ priceChangePercent | number:'1.2-2' }}%</span>
            </div>

            <div class="simulated-chart">
              @for (bar of chartBars; track $index) {
                <div class="chart-bar" [style.height.%]="bar.height" [class.profit-bg]="bar.change >= 0" [class.loss-bg]="bar.change < 0"></div>
              }
            </div>

            <form class="trade-form" (submit)="$event.preventDefault()">
              <div class="form-grid">
                <div class="form-group">
                  <label>Order Type</label>
                  <select [(ngModel)]="orderType" name="orderType">
                    <option value="MARKET">Market Order</option>
                    <option value="LIMIT">Limit Order</option>
                    <option value="STOP_LOSS">Stop Loss</option>
                    <option value="STOP_LIMIT">Stop Limit</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Type</label>
                  <select [(ngModel)]="tradeType" name="tradeType">
                    <option value="BUY">Buy</option>
                    <option value="SELL">Sell</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Quantity</label>
                  <input type="number" [(ngModel)]="tradeQuantity" name="qty" min="1" placeholder="Qty" />
                </div>
                @if (orderType === 'LIMIT' || orderType === 'STOP_LIMIT') {
                  <div class="form-group">
                    <label>Limit Price</label>
                    <input type="number" [(ngModel)]="limitPrice" name="limitPrice" min="0.01" step="0.01" />
                  </div>
                }
                @if (orderType === 'STOP_LOSS' || orderType === 'STOP_LIMIT') {
                  <div class="form-group">
                    <label>Stop Price</label>
                    <input type="number" [(ngModel)]="stopPrice" name="stopPrice" min="0.01" step="0.01" />
                  </div>
                }
              </div>

              <div class="summary-row">
                <span>Estimated Total</span>
                <strong>{{ estimatedTotal | inr }}</strong>
              </div>

              <button class="trade-btn" [class.buy]="tradeType === 'BUY'" [class.sell]="tradeType === 'SELL'" [disabled]="!tradeQuantity" (click)="executeTrade(tradeType)">
                {{ tradeType === 'BUY' ? 'Buy' : 'Sell' }} {{ selectedStock.symbol }}
              </button>
            </form>
          </app-chart-card>
        } @else {
          <app-chart-card title="Trade Panel" meta="Select a stock to start">
            <app-empty-state title="Select a stock" message="Choose a symbol from the left panel to view live pricing and place orders." icon="line-chart"></app-empty-state>
          </app-chart-card>
        }

        <app-chart-card title="Market Stats" meta="Current session data">
          @if (selectedStock) {
            <div class="stats-grid">
              <div class="stat-item">
                <span>Open</span>
                <strong>{{ marketStats.open | inr }}</strong>
              </div>
              <div class="stat-item">
                <span>High</span>
                <strong class="profit">{{ marketStats.high | inr }}</strong>
              </div>
              <div class="stat-item">
                <span>Low</span>
                <strong class="loss">{{ marketStats.low | inr }}</strong>
              </div>
              <div class="stat-item">
                <span>Volume</span>
                <strong>{{ marketStats.volume | number:'1.0-0' }}</strong>
              </div>
            </div>
          } @else {
            <app-empty-state title="No stock selected" message="Market metrics appear after a symbol is selected." icon="activity"></app-empty-state>
          }

          <h4 class="section-title">Recent Trades</h4>
          <div class="recent-trades">
            @for (txn of recentTransactions; track txn.id) {
              <div class="trade-item">
                <span class="badge" [class.buy]="txn.type === 'buy'" [class.sell]="txn.type === 'sell'">{{ txn.type | uppercase }}</span>
                <span class="ticker">{{ txn.symbol }}</span>
                <span class="qty">x{{ txn.quantity }}</span>
                <span class="price">{{ txn.price | inr }}</span>
              </div>
            }
            @if (recentTransactions.length === 0) {
              <app-empty-state title="No recent trades" message="Your latest transactions will be listed here." icon="file-text"></app-empty-state>
            }
          </div>

          @if (tradeMessage) {
            <p class="trade-message" [class.success]="tradeSuccess" [class.error]="!tradeSuccess">{{ tradeMessage }}</p>
          }
        </app-chart-card>
      </div>
    </div>
  `,
  styles: [
    `
      .market-page {
        display: grid;
        gap: var(--space-5);
      }

      .market-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: var(--space-4);
      }

      h1 {
        margin: 0;
        font-size: 28px;
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

      .market-grid {
        display: grid;
        grid-template-columns: 280px 1fr 320px;
        gap: var(--space-4);
        align-items: stretch;
      }

      .search-box {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 10px;
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-sm);
        margin-bottom: var(--space-3);
        color: var(--color-text-secondary);
      }

      .search-box input {
        width: 100%;
        border: none;
        outline: none;
        color: var(--color-text-primary);
        background: transparent;
      }

      .stock-list {
        display: grid;
        gap: var(--space-2);
        max-height: 550px;
        overflow: auto;
      }

      .stock-item {
        width: 100%;
        text-align: left;
        display: flex;
        justify-content: space-between;
        border: 1px solid var(--color-border-soft);
        background: var(--surface-muted-3);
        color: var(--color-text-primary);
        border-radius: var(--radius-sm);
        padding: 10px;
        cursor: pointer;
      }

      .stock-item.active {
        border-color: var(--color-primary);
        background: var(--overlay-primary-18);
      }

      .identity {
        display: grid;
      }

      .identity small {
        color: var(--color-text-secondary);
      }

      .selected-price {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: var(--space-4);
      }

      .selected-price strong {
        font-size: 1.6rem;
      }

      .profit {
        color: var(--color-profit);
      }

      .loss {
        color: var(--color-loss);
      }

      .simulated-chart {
        height: 220px;
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-muted-2);
        border: 1px solid var(--color-border-soft);
        display: flex;
        align-items: end;
        gap: 4px;
      }

      .chart-bar {
        flex: 1;
        border-radius: 4px 4px 0 0;
        background: var(--color-text-muted);
      }

      .chart-bar.profit-bg {
        background: var(--color-profit);
      }

      .chart-bar.loss-bg {
        background: var(--color-loss);
      }

      .trade-form {
        margin-top: var(--space-4);
        display: grid;
        gap: var(--space-3);
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-3);
      }

      .form-group {
        display: grid;
        gap: 6px;
      }

      .form-group label {
        color: var(--color-text-secondary);
        font-size: 0.78rem;
        text-transform: uppercase;
      }

      .form-group input,
      .form-group select {
        width: 100%;
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-sm);
        padding: 9px 10px;
        background: var(--surface-muted);
        color: var(--color-text-primary);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid var(--color-border);
        padding-top: var(--space-3);
      }

      .trade-btn {
        border: none;
        border-radius: var(--radius-sm);
        padding: 12px;
        font-weight: 600;
        color: var(--color-text-primary);
        cursor: pointer;
      }

      .trade-btn.buy {
        background: var(--color-profit);
      }

      .trade-btn.sell {
        background: var(--color-loss);
      }

      .trade-btn:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-3);
      }

      .stat-item {
        padding: var(--space-3);
        border-radius: var(--radius-sm);
        background: var(--surface-muted-3);
        border: 1px solid var(--color-border-soft);
        display: grid;
        gap: var(--space-1);
      }

      .stat-item span {
        color: var(--color-text-secondary);
        font-size: 0.78rem;
        text-transform: uppercase;
      }

      .section-title {
        margin: var(--space-5) 0 var(--space-3);
      }

      .recent-trades {
        display: grid;
        gap: var(--space-2);
      }

      .trade-item {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        align-items: center;
        gap: var(--space-2);
        background: var(--surface-muted-3);
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-sm);
        padding: 8px;
      }

      .badge {
        display: inline-flex;
        font-size: 0.7rem;
        border-radius: 999px;
        padding: 2px 8px;
        font-weight: 600;
      }

      .badge.buy {
        color: var(--color-profit);
        background: rgba(34, 197, 94, 0.18);
      }

      .badge.sell {
        color: var(--color-loss);
        background: var(--overlay-loss-16);
      }

      .ticker {
        font-weight: 600;
      }

      .qty {
        color: var(--color-text-secondary);
      }

      .trade-message {
        margin-top: var(--space-3);
        padding: 10px;
        border-radius: var(--radius-sm);
        text-align: center;
        font-weight: 600;
      }

      .trade-message.success {
        background: var(--overlay-profit-16);
        color: var(--color-profit);
      }

      .trade-message.error {
        background: var(--overlay-loss-16);
        color: var(--color-loss);
      }

      @media (max-width: 1200px) {
        .market-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 700px) {
        .form-grid {
          grid-template-columns: 1fr;
        }

        .market-header {
          flex-direction: column;
        }
      }
    `
  ]
})
export class MarketComponent implements OnInit, OnDestroy {
  allStocks: StockListItem[] = [];
  filteredStocks: StockListItem[] = [];
  selectedStock: StockListItem | null = null;
  searchQuery = '';

  currentPrice = 0;
  priceChange = 0;
  priceChangePercent = 0;

  marketStats = { open: 0, high: 0, low: 0, volume: 0, week52High: 0, week52Low: 0 };

  chartBars: { height: number; price: number; change: number; changePercent: number }[] = [];
  timeLabels = ['-60s', '-45s', '-30s', '-15s', 'Now'];

  tradeType = 'BUY';
  tradeQuantity = 0;
  orderType = 'MARKET';
  limitPrice = 0;
  stopPrice = 0;

  recentTransactions: Transaction[] = [];
  tradeMessage = '';
  tradeSuccess = false;

  private refreshSubscription?: Subscription;
  private refreshTick = 0;
  private readonly MARKET_REFRESH_INTERVAL = 5000;
  private readonly MAX_BARS = 30;

  constructor(
    private marketService: MarketService,
    private txnService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.loadStocks();
    this.loadRecentTransactions();

    this.refreshSubscription = interval(this.MARKET_REFRESH_INTERVAL).subscribe(() => {
      this.loadStocks();
      this.refreshTick += 1;
      if (this.refreshTick % 3 === 0) {
        this.loadRecentTransactions();
      }
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  get estimatedTotal(): number {
    const price =
      this.orderType === 'MARKET'
        ? this.currentPrice
        : this.orderType === 'LIMIT'
          ? this.limitPrice
          : this.stopPrice;
    return this.tradeQuantity * price;
  }

  loadStocks(): void {
    this.marketService.getAllStocks().subscribe({
      next: (res) => {
        this.allStocks = res.data || [];
        if (!this.searchQuery) {
          this.filteredStocks = this.allStocks;
        }
        if (this.selectedStock) {
          const updated = this.allStocks.find((s) => s.symbol === this.selectedStock?.symbol);
          if (updated) {
            const previousPrice = this.currentPrice || updated.price;
            this.priceChange = updated.price - previousPrice;
            this.priceChangePercent = previousPrice > 0 ? (this.priceChange / previousPrice) * 100 : 0;
            this.currentPrice = updated.price;
            this.updateMarketStats(updated.price, previousPrice);
            this.appendChartBar(this.priceChange);
          }
        }
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery) {
      this.filteredStocks = this.allStocks;
      return;
    }
    const q = this.searchQuery.toUpperCase();
    this.filteredStocks = this.allStocks.filter(
      (s) => s.symbol.includes(q) || s.name.toUpperCase().includes(q)
    );
  }

  selectStock(stock: StockListItem): void {
    this.selectedStock = stock;
    this.currentPrice = stock.price;
    this.limitPrice = stock.price;
    this.stopPrice = stock.price;
    this.priceChange = 0;
    this.priceChangePercent = 0;
    this.updateMarketStats(stock.price, stock.price);
    this.generateChartBars(stock.price);
  }

  generateChartBars(basePrice: number): void {
    this.chartBars = [];
    for (let i = 0; i < this.MAX_BARS; i++) {
      const price = basePrice;
      const change = 0;
      const height = 44 + (i % 6) * 4;
      this.chartBars.push({ height, price, change, changePercent: change });
    }
  }

  private appendChartBar(change: number): void {
    const normalized = Math.min(1, Math.abs(change) / Math.max(this.currentPrice, 1));
    const height = 32 + normalized * 55;
    if (this.chartBars.length >= this.MAX_BARS) {
      this.chartBars.shift();
    }
    this.chartBars.push({
      height,
      price: this.currentPrice,
      change,
      changePercent: this.priceChangePercent
    });
  }

  private updateMarketStats(price: number, previousPrice: number): void {
    const spread = Math.max(Math.abs(price - previousPrice), price * 0.002);
    const drift = (price + previousPrice) / 2;
    this.marketStats = {
      open: drift,
      high: Math.max(price, previousPrice) + spread,
      low: Math.max(0, Math.min(price, previousPrice) - spread),
      volume: this.marketStats.volume + 25000,
      week52High: Math.max(this.marketStats.week52High || 0, price),
      week52Low: this.marketStats.week52Low > 0 ? Math.min(this.marketStats.week52Low, price) : price
    };
  }

  loadRecentTransactions(): void {
    this.txnService.getTransactions().subscribe({
      next: (res) => {
        this.recentTransactions = (res.data || []).slice(0, 10);
      }
    });
  }

  executeTrade(type: string): void {
    if (!this.selectedStock || !this.tradeQuantity) {
      return;
    }

    this.tradeMessage = '';

    const req = {
      symbol: this.selectedStock.symbol,
      type: type.toLowerCase(),
      quantity: this.tradeQuantity,
      orderType: this.orderType,
      limitPrice: this.orderType === 'LIMIT' || this.orderType === 'STOP_LIMIT' ? this.limitPrice : undefined,
      stopPrice:
        this.orderType === 'STOP_LOSS' || this.orderType === 'STOP_LIMIT' ? this.stopPrice : undefined
    };

    this.txnService.createTransaction(req as any).subscribe({
      next: () => {
        this.tradeSuccess = true;
        this.tradeMessage = `${type === 'BUY' ? 'Bought' : 'Sold'} ${this.tradeQuantity} shares of ${this.selectedStock?.symbol}!`;
        this.tradeQuantity = 0;
        this.loadRecentTransactions();
        setTimeout(() => (this.tradeMessage = ''), 3000);
      },
      error: (err) => {
        this.tradeSuccess = false;
        this.tradeMessage = this.getUserSafeError(err.error?.message, 'Trade could not be completed. Please try again.');
        setTimeout(() => (this.tradeMessage = ''), 3000);
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
}
