import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../core/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  imports: [CommonModule, FormsModule]
})
export class ReportsPage {

  summary: any;

  constructor(private service: ReportsService) {}

  loadSummary(): void {
    this.service.getSummary().subscribe((data: any) => {
      this.summary = data;
    });
  }

  downloadCSV(): void {
    this.service.exportCSV().subscribe((blob: any) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-report.csv';
      a.click();
    });
  }
}