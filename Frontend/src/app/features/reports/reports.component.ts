import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, interval, Subscription } from 'rxjs';
import { AllocationItem, PortfolioSummary } from '../../core/models';
import { AnalyticsService } from '../../core/services/analytics.service';
import { AuthService } from '../../core/services/auth.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ReportsService } from '../../core/services/reports.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { FINTECH_CHART_PALETTE } from '../../shared/theme/chart-palette';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, InrPipe, IconComponent, EmptyStateComponent, ChartCardComponent],
  template: `
    <div class="reports-page">
      <header class="page-header">
        <div>
          <h2>Reports and Insights</h2>
          <p class="subtitle">Generate portfolio exports for tracking and tax purposes</p>
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
          <p>Loading report data...</p>
        </div>
      } @else {
        <app-chart-card title="Portfolio Summary Report" meta="Live snapshot of core portfolio KPIs">
          @if (summary) {
            <div class="summary-grid">
              <div class="summary-row"><span>Total Investment</span><strong>{{ summary.totalInvestment | inr }}</strong></div>
              <div class="summary-row"><span>Current Value</span><strong>{{ summary.currentValue | inr }}</strong></div>
              <div class="summary-row"><span>Total Gain/Loss</span><strong [class.profit]="summary.totalGain >= 0" [class.loss]="summary.totalGain < 0">{{ summary.totalGain | inr }} ({{ summary.totalGainPercentage >= 0 ? '+' : '' }}{{ summary.totalGainPercentage | number:'1.2-2' }}%)</strong></div>
              <div class="summary-row"><span>Total P&L</span><strong [class.profit]="summary.totalPnL >= 0" [class.loss]="summary.totalPnL < 0">{{ summary.totalPnL | inr }}</strong></div>
              <div class="summary-row"><span>Win Rate</span><strong>{{ summary.winRate | number:'1.1-1' }}%</strong></div>
              <div class="summary-row"><span>Total Trades</span><strong>{{ summary.totalTrades }}</strong></div>
              <div class="summary-row"><span>Last Updated</span><strong>{{ summary.lastUpdated | date:'dd MMM yyyy, hh:mm a' }}</strong></div>
            </div>
          }
        </app-chart-card>

        <app-chart-card title="Investment Distribution" meta="Asset mix and values">
          @if (allocationKeys.length > 0) {
            <div class="allocation-bars">
              @for (key of allocationKeys; track key) {
                <div class="alloc-item">
                  <div class="alloc-header">
                    <span>{{ key | titlecase }}</span>
                    <strong>{{ allocationData[key].percentage }}%</strong>
                  </div>
                  <div class="alloc-track">
                    <div class="alloc-fill" [style.width.%]="allocationData[key].percentage" [style.background]="getAllocColor(key)"></div>
                  </div>
                  <small>{{ allocationData[key].value | inr }}</small>
                </div>
              }
            </div>
          } @else {
            <app-empty-state title="No allocation data" message="Allocation insights appear once your holdings are available." icon="pie-chart"></app-empty-state>
          }
        </app-chart-card>

        <app-chart-card title="Generate Report" meta="Export in PDF or Excel format">
          <form (ngSubmit)="generateReport()" class="report-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Report Type</label>
                <select [(ngModel)]="reportRequest.type" name="type" required>
                  <option value="performance">Performance Report</option>
                  <option value="holdings">Holdings Report</option>
                  <option value="transactions">Transaction History</option>
                  <option value="tax">Tax Report</option>
                </select>
              </div>
              <div class="form-group">
                <label>Period</label>
                <select [(ngModel)]="reportRequest.period" name="period" required>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <div class="form-group">
                <label>Format</label>
                <select [(ngModel)]="reportRequest.format" name="format" required>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
            </div>

            <button type="submit" class="generate-btn" [disabled]="generating">
              <app-icon name="file-text" [size]="14"></app-icon>
              @if (generating) {
                Generating...
              } @else {
                Generate Report
              }
            </button>
          </form>

          @if (reportSuccess) {
            <div class="success-msg">
              <span>{{ reportSuccess }}</span>
              <button class="download-btn" (click)="downloadLastReport()">
                <app-icon name="file-text" [size]="13"></app-icon>
                Download
              </button>
            </div>
          }

          @if (reportError) {
            <p class="error-msg">{{ reportError }}</p>
          }
        </app-chart-card>

        <app-chart-card title="Recent Reports" meta="Download previously generated files">
          <button class="refresh-list-btn" (click)="loadReportsList()" [disabled]="loadingReports">
            <app-icon name="refresh" [size]="13"></app-icon>
            Refresh list
          </button>

          @if (reportsList.length > 0) {
            <div class="reports-list">
              @for (report of reportsList; track report.reportId) {
                <article class="report-item">
                  <div class="report-info">
                    <app-icon name="file-text" [size]="18"></app-icon>
                    <div>
                      <strong>{{ report.fileName }}</strong>
                      <small>{{ report.createdAt | date:'dd MMM yyyy, hh:mm a' }}</small>
                    </div>
                  </div>
                  <button class="download-small" (click)="downloadReportByFileName(report.fileName, report.reportId)">
                    Download
                  </button>
                </article>
              }
            </div>
          } @else {
            <app-empty-state title="No reports generated" message="Create your first report using the form above." icon="file-text"></app-empty-state>
          }
        </app-chart-card>
      }
    </div>
  `,
  styles: [
    `
      .reports-page {
        max-width: 1100px;
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
      .summary-grid {
        display: grid;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        gap: var(--space-4);
        padding: 10px 0;
        border-bottom: 1px solid var(--color-border);
      }
      .summary-row:last-child {
        border-bottom: 0;
      }
      .summary-row span {
        color: var(--color-text-secondary);
      }
      .summary-row strong {
        text-align: right;
      }
      .allocation-bars {
        display: grid;
        gap: var(--space-3);
      }
      .alloc-item {
        display: grid;
        gap: var(--space-1);
      }
      .alloc-header {
        display: flex;
        justify-content: space-between;
      }
      .alloc-header span {
        color: var(--color-text-secondary);
      }
      .alloc-track {
        height: 10px;
        border-radius: 999px;
        overflow: hidden;
        background: var(--border-text-soft-2);
      }
      .alloc-fill {
        height: 100%;
        border-radius: inherit;
      }
      .alloc-item small {
        color: var(--color-text-secondary);
      }
      .report-form {
        display: grid;
        gap: var(--space-4);
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
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
      .form-group select {
        width: 100%;
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-sm);
        padding: 10px;
        background: var(--surface-muted);
        color: var(--color-text-primary);
      }
      .generate-btn {
        justify-self: start;
        border: 0;
        border-radius: var(--radius-sm);
        background: var(--color-primary);
        color: var(--color-text-primary);
        padding: 10px 14px;
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        cursor: pointer;
      }
      .generate-btn:disabled {
        opacity: 0.65;
      }
      .success-msg {
        margin-top: var(--space-3);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-profit-soft);
        background: var(--overlay-profit-14);
        color: var(--color-profit);
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-3);
      }
      .download-btn {
        border: 0;
        border-radius: var(--radius-sm);
        background: var(--color-primary);
        color: var(--color-text-primary);
        padding: 7px 10px;
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        cursor: pointer;
      }
      .error-msg {
        margin: var(--space-3) 0 0;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-loss-soft);
        background: var(--overlay-loss-14);
        color: var(--color-loss);
        padding: 10px;
      }
      .refresh-list-btn {
        margin-bottom: var(--space-3);
        border: 1px solid var(--color-border-soft);
        background: var(--surface-muted-2);
        color: var(--color-text-primary);
        border-radius: var(--radius-sm);
        padding: 8px 10px;
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        cursor: pointer;
      }
      .reports-list {
        display: grid;
        gap: var(--space-2);
      }
      .report-item {
        border: 1px solid var(--color-border-soft);
        background: var(--surface-muted-3);
        border-radius: var(--radius-sm);
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .report-info {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
      }
      .report-info strong {
        display: block;
      }
      .report-info small {
        color: var(--color-text-secondary);
      }
      .download-small {
        border: 0;
        border-radius: var(--radius-sm);
        background: rgba(37, 99, 235, 0.85);
        color: var(--color-text-primary);
        padding: 8px 10px;
        cursor: pointer;
      }
      .profit {
        color: var(--color-profit);
      }
      .loss {
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
      @media (max-width: 860px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 700px) {
        .page-header {
          flex-direction: column;
        }
        .success-msg {
          flex-direction: column;
          align-items: start;
        }
      }
    `
  ]
})
export class ReportsComponent implements OnInit, OnDestroy {
  loading = true;
  loadingReports = false;
  summary: PortfolioSummary | null = null;
  allocationData: { [key: string]: AllocationItem } = {};
  allocationKeys: string[] = [];
  generating = false;
  reportSuccess = '';
  reportError = '';
  reportsList: any[] = [];
  lastReportId = '';
  lastReportFileName = '';

  reportRequest = {
    type: 'performance',
    period: 'monthly',
    format: 'pdf'
  };

  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL = 30000;

  private allocColors: { [key: string]: string } = {
    stocks: FINTECH_CHART_PALETTE[0],
    bonds: FINTECH_CHART_PALETTE[1],
    cash: FINTECH_CHART_PALETTE[3],
    equity: FINTECH_CHART_PALETTE[4],
    debt: FINTECH_CHART_PALETTE[2],
    gold: FINTECH_CHART_PALETTE[0]
  };

  constructor(
    private portfolioService: PortfolioService,
    private analyticsService: AnalyticsService,
    private reportsService: ReportsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.reportError = 'Please log in to access reports.';
      this.loading = false;
      return;
    }

    this.loadData();
    this.loadReportsList();

    this.refreshSubscription = interval(this.REFRESH_INTERVAL).subscribe(() => {
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadData(): void {
    forkJoin({
      summary: this.portfolioService.getSummary(),
      allocation: this.analyticsService.getAssetAllocation()
    }).subscribe({
      next: (res) => {
        this.summary = res.summary.data;
        this.allocationData = res.allocation.data || {};
        this.allocationKeys = Object.keys(this.allocationData);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.reportError = 'Session expired. Please log in again.';
        }
      }
    });
  }

  loadReportsList(): void {
    this.loadingReports = true;
    this.reportsService.listReports().subscribe({
      next: (res) => {
        this.reportsList = res.data || [];
        this.loadingReports = false;
      },
      error: () => {
        this.loadingReports = false;
      }
    });
  }

  refreshData(): void {
    this.loading = true;
    this.loadData();
  }

  getAllocColor(key: string): string {
    return this.allocColors[key.toLowerCase()] || FINTECH_CHART_PALETTE[3];
  }

  generateReport(): void {
    this.generating = true;
    this.reportSuccess = '';
    this.reportError = '';
    this.reportsService.generateReport(this.reportRequest).subscribe({
      next: (res) => {
        this.generating = false;
        this.lastReportId = res.data.reportId;
        this.lastReportFileName = res.data.fileName || '';
        const fileName = res.data.fileName || '';
        this.reportSuccess = `Report ready: ${res.data.reportId} (${fileName.endsWith('.xlsx') ? 'Excel' : 'PDF'})`;
        this.loadReportsList();
      },
      error: (err) => {
        this.generating = false;
        this.reportError = err.error?.message || 'Failed to generate report. Please try again.';
      }
    });
  }

  downloadLastReport(): void {
    if (this.lastReportId) {
      this.downloadReport(this.lastReportId);
    }
  }

  downloadReport(reportId: string): void {
    this.reportError = '';

    this.reportsService.downloadReport(reportId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const contentType = blob.type;
        const extension = contentType.includes('spreadsheet') || contentType.includes('excel') ? 'xlsx' : 'pdf';
        link.download = `${reportId}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.reportError = 'Failed to download report: ' + (err.message || 'Please try again. Make sure you are logged in.');
      }
    });
  }

  downloadReportByFileName(fileName: string, reportId: string): void {
    this.reportError = '';

    this.reportsService.downloadReport(reportId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.reportError = 'Failed to download report: ' + (err.message || 'Please try again. Make sure you are logged in.');
      }
    });
  }
}
