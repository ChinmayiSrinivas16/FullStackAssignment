import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketdataService } from '../../core/services/marketdata.service';
import { MarketData } from '../../core/models/analytics.model';

@Component({
  selector: 'app-marketdata',
  templateUrl: './marketdata.page.html',
  imports: [CommonModule, FormsModule]
})
export class MarketdataPage {

  symbol = '';
  quote!: MarketData;
  loading = false;

  constructor(private service: MarketdataService) {}

  fetchQuote(): void {
    if (!this.symbol) return;

    this.loading = true;
    this.service.getQuote(this.symbol).subscribe({
      next: (data: MarketData) => {
        this.quote = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}