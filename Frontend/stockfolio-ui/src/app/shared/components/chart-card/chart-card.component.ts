import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent {
  @Input() title: string;
  @Input() chartData: any; // Replace 'any' with the appropriate type for your chart data
  @Input() chartOptions: any; // Replace 'any' with the appropriate type for your chart options

  constructor() {}
}