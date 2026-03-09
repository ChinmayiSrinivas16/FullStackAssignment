import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      class="icon"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.stroke-width]="strokeWidth"
      [attr.aria-label]="name"
      role="img">
      @for (segment of segments; track $index) {
        @if (segment.type === 'path') {
          <path [attr.d]="segment.value"></path>
        } @else if (segment.type === 'line') {
          <line [attr.x1]="segment.value[0]" [attr.y1]="segment.value[1]" [attr.x2]="segment.value[2]" [attr.y2]="segment.value[3]"></line>
        } @else if (segment.type === 'circle') {
          <circle [attr.cx]="segment.value[0]" [attr.cy]="segment.value[1]" [attr.r]="segment.value[2]"></circle>
        }
      }
    </svg>
  `,
  styles: [
    `
      .icon {
        display: inline-block;
        vertical-align: middle;
      }
    `
  ]
})
export class IconComponent {
  @Input() name = 'circle';
  @Input() size = 20;
  @Input() strokeWidth = 2;

  private readonly iconPaths: Record<string, Array<{ type: 'path' | 'line' | 'circle'; value: any }>> = {
    circle: [{ type: 'circle', value: [12, 12, 10] }],
    'layout-dashboard': [
      { type: 'path', value: 'M3 3h7v7H3z' },
      { type: 'path', value: 'M14 3h7v4h-7z' },
      { type: 'path', value: 'M14 10h7v11h-7z' },
      { type: 'path', value: 'M3 14h7v7H3z' }
    ],
    briefcase: [
      { type: 'path', value: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' },
      { type: 'path', value: 'M2 7h20' },
      { type: 'path', value: 'M5 7v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7' }
    ],
    repeat: [
      { type: 'path', value: 'm17 2 4 4-4 4' },
      { type: 'path', value: 'M3 11V9a4 4 0 0 1 4-4h14' },
      { type: 'path', value: 'm7 22-4-4 4-4' },
      { type: 'path', value: 'M21 13v2a4 4 0 0 1-4 4H3' }
    ],
    receipt: [
      { type: 'path', value: 'M4 3h16v18l-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1z' },
      { type: 'line', value: [8, 7, 16, 7] },
      { type: 'line', value: [8, 11, 16, 11] },
      { type: 'line', value: [8, 15, 13, 15] }
    ],
    'line-chart': [
      { type: 'path', value: 'M3 3v18h18' },
      { type: 'path', value: 'm19 9-5 5-4-4-3 3' }
    ],
    'pie-chart': [
      { type: 'path', value: 'M21.21 15.89A10 10 0 1 1 12 2v10z' },
      { type: 'path', value: 'M22 12A10 10 0 0 0 12 2v10z' }
    ],
    'file-text': [
      { type: 'path', value: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
      { type: 'path', value: 'M14 2v6h6' },
      { type: 'line', value: [16, 13, 8, 13] },
      { type: 'line', value: [16, 17, 8, 17] },
      { type: 'line', value: [10, 9, 8, 9] }
    ],
    wallet: [
      { type: 'path', value: 'M19 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a3 3 0 0 1 0-6h14' },
      { type: 'path', value: 'M15 13h.01' }
    ],
    'bar-chart-3': [
      { type: 'path', value: 'M3 3v18h18' },
      { type: 'path', value: 'M18 17V9' },
      { type: 'path', value: 'M13 17V5' },
      { type: 'path', value: 'M8 17v-3' }
    ],
    'bar-chart': [
      { type: 'path', value: 'M3 3v18h18' },
      { type: 'path', value: 'M18 17V9' },
      { type: 'path', value: 'M13 17V5' },
      { type: 'path', value: 'M8 17v-3' }
    ],
    trophy: [
      { type: 'path', value: 'M8 21h8' },
      { type: 'path', value: 'M12 17v4' },
      { type: 'path', value: 'M7 4h10v4a5 5 0 0 1-10 0z' },
      { type: 'path', value: 'M17 5h2a2 2 0 0 1 0 4h-2' },
      { type: 'path', value: 'M7 5H5a2 2 0 0 0 0 4h2' }
    ],
    'trending-up': [
      { type: 'path', value: 'm22 7-8.5 8.5-5-5L2 17' },
      { type: 'path', value: 'M16 7h6v6' }
    ],
    'trending-down': [
      { type: 'path', value: 'm22 17-8.5-8.5-5 5L2 7' },
      { type: 'path', value: 'M16 17h6v-6' }
    ],
    refresh: [
      { type: 'path', value: 'M21 12a9 9 0 1 1-3.3-6.9' },
      { type: 'path', value: 'M21 3v6h-6' }
    ],
    search: [
      { type: 'circle', value: [11, 11, 8] },
      { type: 'line', value: [21, 21, 16.65, 16.65] }
    ],
    user: [
      { type: 'path', value: 'M20 21a8 8 0 0 0-16 0' },
      { type: 'circle', value: [12, 7, 4] }
    ],
    lock: [
      { type: 'path', value: 'M6 10h12v10H6z' },
      { type: 'path', value: 'M8 10V7a4 4 0 0 1 8 0v3' }
    ],
    eye: [
      { type: 'path', value: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7' },
      { type: 'circle', value: [12, 12, 3] }
    ],
    'eye-off': [
      { type: 'path', value: 'm3 3 18 18' },
      { type: 'path', value: 'M10.58 10.58a2 2 0 1 0 2.83 2.83' },
      { type: 'path', value: 'M9.88 5.09A10.94 10.94 0 0 1 12 5c6 0 10 7 10 7a18.12 18.12 0 0 1-3.17 3.98' },
      { type: 'path', value: 'M6.61 6.61A18.08 18.08 0 0 0 2 12s4 7 10 7a9.76 9.76 0 0 0 5.39-1.61' }
    ],
    activity: [
      { type: 'path', value: 'M22 12h-4l-3 9L9 3l-3 9H2' }
    ],
    logOut: [
      { type: 'path', value: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' },
      { type: 'path', value: 'm16 17 5-5-5-5' },
      { type: 'line', value: [21, 12, 9, 12] }
    ],
    'log-out': [
      { type: 'path', value: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' },
      { type: 'path', value: 'm16 17 5-5-5-5' },
      { type: 'line', value: [21, 12, 9, 12] }
    ],
    x: [
      { type: 'line', value: [18, 6, 6, 18] },
      { type: 'line', value: [6, 6, 18, 18] }
    ],
    plus: [
      { type: 'line', value: [12, 5, 12, 19] },
      { type: 'line', value: [5, 12, 19, 12] }
    ],
    'chevron-up': [
      { type: 'path', value: 'm18 15-6-6-6 6' }
    ],
    'chevron-down': [
      { type: 'path', value: 'm6 9 6 6 6-6' }
    ]
  };

  get segments(): Array<{ type: 'path' | 'line' | 'circle'; value: any }> {
    return this.iconPaths[this.name] ?? this.iconPaths['circle'];
  }
}
