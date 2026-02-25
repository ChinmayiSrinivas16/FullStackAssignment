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

  portfolioId: number = 1; // Default portfolio ID
  summary: any;

  constructor(private service: ReportsService) {}

  loadSummary(): void {
    this.service.getSummary(this.portfolioId).subscribe((data: any) => {
      this.summary = data;
    });
  }

  downloadCSV(): void {
    this.service.exportCSV(this.portfolioId).subscribe((blob: any) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-report.csv';
      a.click();
    });
  }

  downloadPDF(): void {
    this.service.exportPDF(this.portfolioId).subscribe((blob: any) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-report.pdf';
      a.click();
    });
  }
}
