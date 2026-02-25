import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketDataService } from '../../core/services/marketdata.service';
import { MarketStock } from '../../core/models/stock.model';

@Component({
  selector: 'app-marketdata',
  templateUrl: './marketdata.page.html',
  imports: [CommonModule, FormsModule]
})
export class MarketdataPage {

  symbol = '';
  quote!: MarketStock;
  loading = false;

  constructor(private service: MarketDataService) {}

  fetchQuote(): void {
    if (!this.symbol) return;

    this.loading = true;
    this.service.getStockPrice(this.symbol).subscribe({
      next: (data: MarketStock) => {
        this.quote = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
