import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { TransactionsService } from '../../core/services/transactions.service';
import { MarketService, StockListItem } from '../../core/services/market.service';
import { Transaction, CreateTransactionRequest, WalletSummary } from '../../core/models';
import { interval, Subscription } from 'rxjs';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { WalletService } from '../../core/services/wallet.service';

interface StockSearchResult {
  symbol: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, InrPipe, IconComponent, EmptyStateComponent],
  template: `
    <div class="transactions-page">
      <div class="page-header">
        <div>
          <h2>Transaction History</h2>
          <p class="subtitle">Buy and sell stocks with live market data</p>
        </div>
        <div class="live-indicator">
          <span class="live-dot"></span> Live
        </div>
        <button class="btn-add" (click)="showAddForm = !showAddForm">
          <app-icon [name]="showAddForm ? 'x' : 'plus'" [size]="16"></app-icon>
          {{ showAddForm ? 'Cancel' : 'New Transaction' }}
        </button>
      </div>

      @if (showAddForm) {
        <div class="add-form-card">
          <h3>Record New Transaction</h3>
          @if (walletSummary) {
            <div class="wallet-hint">
              <span>Available to buy: {{ walletSummary.availableToTrade | inr }}</span>
              <span>Minimum balance: {{ walletSummary.minimumBalance | inr }}</span>
            </div>
          }
          <form (ngSubmit)="addTransaction()" class="add-form">
            <div class="form-row">
              <div class="form-group stock-search-group">
                <label>Stock Symbol</label>
                <div class="stock-search-wrapper">
                  <input type="text" 
                         [(ngModel)]="stockSearchQuery" 
                         (input)="onStockSearch()"
                         (focus)="showStockDropdown = true"
                         (blur)="hideStockDropdown()"
                         name="stockSearch" 
                         placeholder="Search stocks..." 
                         required 
                         autocomplete="off" />
                  @if (selectedStock) {
                    <div class="selected-stock">
                      <span class="stock-symbol">{{ selectedStock.symbol }}</span>
                      <span class="stock-name">{{ selectedStock.name }}</span>
                      <span class="stock-price">₹{{ selectedStock.price | number:'1.2-2' }}</span>
                      <button type="button" class="clear-btn" (click)="clearSelectedStock()">
                        <app-icon name="x" [size]="14"></app-icon>
                      </button>
                    </div>
                  }
                  @if (showStockDropdown && stockResults.length > 0) {
                    <div class="stock-dropdown">
                      @for (stock of stockResults; track stock.symbol) {
                        <div class="stock-option" (mousedown)="selectStock(stock)">
                          <span class="stock-symbol">{{ stock.symbol }}</span>
                          <span class="stock-name">{{ stock.name }}</span>
                          <span class="stock-price">₹{{ stock.price | number:'1.2-2' }}</span>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
              <div class="form-group">
                <label>Type</label>
                <select [(ngModel)]="newTxn.type" name="type" required>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div class="form-group">
                <label>Quantity</label>
                <input type="number" [(ngModel)]="newTxn.quantity" name="quantity" min="1" placeholder="Shares" required />
              </div>
              <div class="form-group">
                <label>Price (₹)</label>
                <input type="number" [(ngModel)]="newTxn.price" name="price" min="0.01" step="0.01" 
                       [placeholder]="selectedStock ? 'Live: ₹' + selectedStock.price : 'Auto-fetched'" 
                       [readonly]="!!selectedStock" />
                @if (selectedStock) {
                  <small class="auto-fetch-note">Price auto-fetched from live market</small>
                }
              </div>
            </div>
            @if (formError) {
              <div class="error-msg">{{ formError }}</div>
            }
            @if (formSuccess) {
              <div class="success-msg">{{ formSuccess }}</div>
            }
            <button type="submit" class="btn-submit" [disabled]="saving">
              {{ saving ? 'Processing...' : (newTxn.type === 'buy' ? 'Buy Stock' : 'Sell Stock') }}
            </button>
          </form>
        </div>
      }

      @if (livePrices.length > 0) {
        <div class="ticker-strip">
          @for (price of livePrices; track price.symbol) {
            <span class="ticker-item">
              <strong>{{ price.symbol }}</strong> ₹{{ price.price | number:'1.2-2' }}
              <span [class]="price.change >= 0 ? 'positive' : 'negative'">
                <app-icon [name]="price.change >= 0 ? 'chevron-up' : 'chevron-down'" [size]="12"></app-icon>
                {{ price.changePercent | number:'1.2-2' }}%
              </span>
            </span>
          }
        </div>
      }

      <div class="filters">
        <button [class.active]="!filterType" (click)="filterBy('')">All</button>
        <button [class.active]="filterType === 'BUY'" (click)="filterBy('BUY')">Buy</button>
        <button [class.active]="filterType === 'SELL'" (click)="filterBy('SELL')">Sell</button>
      </div>

      <div class="table-card">
        @if (loading) {
          <div class="loading">Loading transactions...</div>
        } @else if (transactions.length === 0) {
          <app-empty-state
            title="No transactions yet"
            message="Start by adding your first transaction"
            icon="receipt"
            actionLabel="Add transaction"
            (action)="showAddForm = true"></app-empty-state>
        } @else {
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Symbol</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              @for (txn of transactions; track txn.id) {
                <tr>
                  <td>{{ txn.date | date:'dd-MMM-yyyy' }}</td>
                  <td><span class="symbol-tag">{{ txn.symbol }}</span></td>
                  <td>
                    <span class="type-badge" [class.buy-badge]="txn.type === 'buy'" [class.sell-badge]="txn.type === 'sell'">
                      {{ txn.type | uppercase }}
                    </span>
                  </td>
                  <td>{{ txn.quantity }}</td>
                  <td>₹{{ txn.price | inr }}</td>
                  <td class="total-val">₹{{ txn.total | inr }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  styles: [`
    .transactions-page { max-width: 1280px; margin: 0 auto; }
    .page-header { display: grid; grid-template-columns: minmax(260px, 1fr) auto auto; align-items: center; margin-bottom: 20px; gap: var(--space-3); }
    .page-header h2 { margin: 0; color: var(--color-text-primary); }
    .subtitle { margin: 4px 0 0; color: var(--color-text-secondary); font-size: 14px; }
    .live-indicator { display: flex; align-items: center; gap: 6px; color: var(--color-profit); font-weight: 600; font-size: 12px; }
    .live-dot { width: 8px; height: 8px; background: var(--color-profit); border-radius: 50%; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .btn-add { display: inline-flex; align-items: center; gap: var(--space-2); background: var(--color-primary); color: var(--color-text-primary); border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: .2s; }
    .btn-add:hover { background: var(--color-primary-hover); transform: translateY(-1px); }
    
    .add-form-card { background: var(--color-card); border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: var(--shadow-card); border: 1px solid var(--color-border-soft); }
    .add-form-card h3 { margin: 0 0 16px; color: var(--color-text-primary); }
    .wallet-hint {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 12px;
      border: 1px solid var(--color-border-soft);
      border-radius: 8px;
      background: var(--surface-muted-3);
      margin-bottom: 12px;
      color: var(--color-text-secondary);
      font-size: 12px;
    }
    .form-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: var(--color-text-secondary); font-size: 13px; }
    .form-group input, .form-group select { width: 100%; padding: 10px 12px; border: 1px solid var(--color-border-soft); border-radius: 8px; font-size: 14px; transition: border-color 0.2s; box-sizing: border-box; background: var(--color-sidebar); color: var(--color-text-primary); }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: var(--color-primary); }
    
    .stock-search-group { position: relative; }
    .stock-search-wrapper { position: relative; }
    .stock-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: var(--color-card); border: 1px solid var(--color-border-soft); border-radius: 8px; max-height: 200px; overflow-y: auto; z-index: 100; box-shadow: var(--shadow-card); }
    .stock-option { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; cursor: pointer; transition: background 0.2s; }
    .stock-option:hover { background: var(--color-sidebar-hover); }
    .stock-option .stock-symbol { font-weight: 600; color: var(--color-text-primary); }
    .stock-option .stock-name { flex: 1; margin: 0 12px; color: var(--color-text-secondary); font-size: 13px; }
    .stock-option .stock-price { font-weight: 600; color: var(--color-profit); }
    
    .selected-stock { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--overlay-primary-16); border-radius: 8px; margin-top: 8px; }
    .selected-stock .stock-symbol { font-weight: 600; color: var(--color-text-primary); }
    .selected-stock .stock-name { flex: 1; color: var(--color-text-secondary); font-size: 13px; }
    .selected-stock .stock-price { font-weight: 600; color: var(--color-profit); }
    .selected-stock .clear-btn { background: none; border: none; color: var(--color-text-secondary); cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; }
    .selected-stock .clear-btn:hover { color: var(--color-loss); }
    
    .auto-fetch-note { color: var(--color-profit); font-size: 11px; margin-top: 4px; display: block; }
    
    .ticker-strip {
      display: flex;
      gap: 24px;
      padding: 12px 16px;
      background: var(--color-card);
      border-radius: 10px;
      margin-bottom: 16px;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      border: 1px solid var(--color-border-soft);
      scrollbar-width: none;
      -webkit-mask-image: linear-gradient(to right, transparent 0, black 18px, black calc(100% - 18px), transparent 100%);
    }
    .ticker-strip::-webkit-scrollbar { display: none; }
    .ticker-item { font-size: 13px; display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .ticker-item strong { color: var(--color-text-primary); }
    .ticker-item .positive { color: var(--color-profit); display: inline-flex; align-items: center; gap: 2px; }
    .ticker-item .negative { color: var(--color-loss); display: inline-flex; align-items: center; gap: 2px; }
    
    .filters { display: flex; gap: 8px; margin-bottom: 16px; }
    .filters button { padding: 8px 16px; border: 1px solid var(--color-border-soft); background: var(--color-sidebar); color: var(--color-text-secondary); border-radius: 20px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
    .filters button:hover { background: var(--color-sidebar-hover); color: var(--color-text-primary); }
    .filters button.active { background: var(--color-primary); color: var(--color-text-primary); border-color: var(--color-primary); }
    
    .table-card { background: var(--color-card); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-card); border: 1px solid var(--color-border-soft); }
    .loading, .empty-state { padding: 40px; text-align: center; color: var(--color-text-secondary); }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 14px 16px; background: var(--surface-muted-2); font-weight: 600; color: var(--color-text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .data-table td { padding: 14px 16px; border-bottom: 1px solid var(--color-border); color: var(--color-text-primary); }
    .data-table tbody tr:hover td { background: var(--surface-muted-3); }
    .symbol-tag { background: var(--overlay-primary-16); color: var(--color-text-primary); padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; }
    .type-badge { padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.35px; }
    .buy-badge { background: var(--overlay-profit-14); color: var(--color-profit); }
    .sell-badge { background: var(--overlay-loss-14); color: var(--color-loss); }
    .total-val { font-weight: 600; color: var(--color-text-primary); }
    .error-msg { color: var(--color-loss); margin-bottom: 12px; font-size: 13px; }
    .success-msg { color: var(--color-profit); margin-bottom: 12px; font-size: 13px; }
    .btn-submit { background: var(--color-primary); color: var(--color-text-primary); border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-submit:hover:not(:disabled) { background: var(--color-primary-hover); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 900px) {
      .form-row { grid-template-columns: 1fr 1fr; }
      .page-header { grid-template-columns: 1fr auto; }
      .page-header > div:first-child { grid-column: 1 / -1; }
      .wallet-hint { flex-direction: column; }
    }

    @media (max-width: 650px) {
      .form-row { grid-template-columns: 1fr; }
      .page-header { grid-template-columns: 1fr; align-items: flex-start; }
      .btn-add { width: 100%; justify-content: center; }
    }
  `]
})
export class TransactionsComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  loading = true;
  showAddForm = false;
  saving = false;
  formError = '';
  formSuccess = '';
  filterType = '';
  newTxn: CreateTransactionRequest = { symbol: '', type: 'buy', quantity: 0, price: 0, date: '', fees: 0 };
  
  // Stock search
  stockSearchQuery = '';
  stockResults: StockSearchResult[] = [];
  selectedStock: StockSearchResult | null = null;
  showStockDropdown = false;
  
  // Live prices for ticker
  livePrices: {symbol: string, price: number, change: number, changePercent: number}[] = [];
  walletSummary: WalletSummary | null = null;
  
  private refreshSubscription?: Subscription;
  private searchTimeout?: any;
  private previousTickerPrices: Record<string, number> = {};
  private refreshTick = 0;
  private readonly PRICE_REFRESH_INTERVAL = 5000;

  constructor(
    private txnService: TransactionsService,
    private marketService: MarketService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadLivePrices();
    this.loadWalletSummary();
    
    this.refreshSubscription = interval(this.PRICE_REFRESH_INTERVAL).subscribe(() => {
      this.loadLivePrices();
      this.refreshTick += 1;
      if (this.refreshTick % 3 === 0) {
        this.loadTransactions();
      }
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  loadTransactions(): void {
    this.txnService.getTransactions(this.filterType || undefined).subscribe({
      next: (res) => {
        this.transactions = res.data || [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadLivePrices(): void {
    this.marketService.getAllStocks().subscribe({
      next: (res) => {
        if (res.data) {
          this.livePrices = res.data.slice(0, 10).map((s: any) => {
            const previousPrice = this.previousTickerPrices[s.symbol] ?? s.price;
            const change = s.price - previousPrice;
            const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
            this.previousTickerPrices[s.symbol] = s.price;

            return {
              symbol: s.symbol,
              price: s.price,
              change,
              changePercent
            };
          });
        }
      },
      error: () => {}
    });
  }

  filterBy(type: string): void {
    this.filterType = type;
    this.loadTransactions();
  }

  onStockSearch(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    if (!this.stockSearchQuery || this.stockSearchQuery.length < 1) {
      this.stockResults = [];
      return;
    }
    
    this.searchTimeout = setTimeout(() => {
      this.marketService.searchStocks(this.stockSearchQuery).subscribe({
        next: (res) => {
          this.stockResults = res.data || [];
        },
        error: () => {
          this.stockResults = [];
        }
      });
    }, 300);
  }

  selectStock(stock: StockSearchResult): void {
    this.selectedStock = stock;
    this.newTxn.symbol = stock.symbol;
    this.newTxn.price = stock.price;
    this.stockSearchQuery = stock.symbol;
    this.showStockDropdown = false;
    this.stockResults = [];
  }

  clearSelectedStock(): void {
    this.selectedStock = null;
    this.newTxn.symbol = '';
    this.newTxn.price = 0;
    this.stockSearchQuery = '';
  }

  hideStockDropdown(): void {
    setTimeout(() => {
      this.showStockDropdown = false;
    }, 200);
  }

  addTransaction(): void {
    if (!this.newTxn.symbol || !this.newTxn.quantity) {
      this.formError = 'Please select a stock and enter quantity';
      return;
    }
    
    this.saving = true;
    this.formError = '';
    this.formSuccess = '';
    
    // Auto-set date to now
    const now = new Date();
    this.newTxn.date = now.toISOString().split('T')[0];
    
    // If no price provided but stock selected, use live price
    if (!this.newTxn.price && this.selectedStock) {
      this.newTxn.price = this.selectedStock.price;
    }

    if (this.newTxn.type === 'buy' && this.walletSummary) {
      const price = Number(this.newTxn.price || 0);
      const requiredAmount = this.newTxn.quantity * price;
      if (requiredAmount > this.walletSummary.availableToTrade) {
        this.formError = 'Insufficient balance';
        this.saving = false;
        return;
      }
    }
    
    const req = { ...this.newTxn, symbol: this.newTxn.symbol.toUpperCase() };
    this.txnService.createTransaction(req).subscribe({
      next: () => {
        this.saving = false;
        this.formSuccess = this.newTxn.type === 'buy' ? 'Stock bought successfully!' : 'Stock sold successfully!';
        this.newTxn = { symbol: '', type: 'buy', quantity: 0, price: 0, date: '', fees: 0 };
        this.clearSelectedStock();
        this.loadTransactions();
        this.loadWalletSummary();
        setTimeout(() => { this.showAddForm = false; this.formSuccess = ''; }, 2000);
      },
      error: (err) => {
        this.saving = false;
        this.formError = this.getUserSafeError(err.error?.message, 'Failed to process transaction. Please try again.');
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

  private loadWalletSummary(): void {
    this.walletService.getWalletSummary().subscribe({
      next: (res) => {
        this.walletSummary = res.data;
      },
      error: () => {
        this.walletSummary = null;
      }
    });
  }
}
