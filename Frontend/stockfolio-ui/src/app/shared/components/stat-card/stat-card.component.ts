import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() title: string;
  @Input() value: number;
  @Input() change: number;
  @Input() changePercent: number;
  @Input() icon: string; // SVG icon name from Lucide icons
}