import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HoldingsService } from '../../core/services/holdings.service';
import { Holding } from '../../core/models/holding.model';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.page.html',
  imports: [CommonModule, FormsModule]
})
export class HoldingsPage implements OnInit {

  holdings: Holding[] = [];
  loading = false;

  constructor(private service: HoldingsService) {}

  ngOnInit(): void {
    this.fetchHoldings();
  }

  fetchHoldings(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data: Holding[]) => {
        this.holdings = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}