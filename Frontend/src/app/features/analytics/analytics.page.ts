import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  imports: [CommonModule, FormsModule]
})
export class AnalyticsPage implements OnInit {

  pnlData: any;
  movers: any;
  loading = false;

  constructor(private service: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading = true;

    this.service.getPnL().subscribe((data: any) => {
      this.pnlData = data;
    });

    this.service.getTopMovers().subscribe((data: any) => {
      this.movers = data;
      this.loading = false;
    });
  }
}