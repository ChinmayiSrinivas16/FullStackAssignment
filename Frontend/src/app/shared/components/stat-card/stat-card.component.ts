import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <article class="stat-card">
      <header class="card-head">
        <p class="label">{{ label }}</p>
        <app-icon [name]="icon" [size]="18"></app-icon>
      </header>
      <p class="value">{{ value }}</p>
      @if (subtitle) {
        <p class="subtitle" [class.profit]="positive" [class.loss]="!positive">{{ subtitle }}</p>
      }
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .stat-card {
        background: var(--gradient-card), var(--color-card);
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: var(--space-2);
        min-height: 168px;
        height: 100%;
        animation: card-enter 260ms ease-out;
        box-shadow: var(--shadow-card);
        transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .stat-card:hover {
        transform: translateY(-2px);
        border-color: var(--overlay-primary-soft);
        box-shadow: var(--shadow-float);
      }
      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--color-text-secondary);
      }
      .label {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin: 0;
      }
      .value {
        margin: 0;
        font-size: 1.55rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }
      .subtitle {
        margin: 0;
        font-weight: 500;
      }
      .profit {
        color: var(--color-profit);
      }
      .loss {
        color: var(--color-loss);
      }

      @keyframes card-enter {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .stat-card {
          animation: none;
          transition: none;
        }
      }
    `
  ]
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() subtitle = '';
  @Input() positive = true;
  @Input() icon = 'bar-chart-3';
}
