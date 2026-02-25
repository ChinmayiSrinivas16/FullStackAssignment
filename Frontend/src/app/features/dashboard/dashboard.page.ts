import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../core/services/dashboard.service';
import { Dashboard } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  imports: [CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {

  dashboard!: Dashboard;
  loading = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.loading = true;
    this.dashboardService.getSummary().subscribe({
      next: (data: Dashboard) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}