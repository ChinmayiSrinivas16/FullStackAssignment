import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  template: `
    <section class="chart-card">
      <header class="card-head">
        <h3>{{ title }}</h3>
        @if (meta) {
          <p>{{ meta }}</p>
        }
      </header>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .chart-card {
        background: var(--gradient-card), var(--color-card);
        border: 1px solid var(--color-border-soft);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        height: 100%;
        display: flex;
        flex-direction: column;
        animation: card-enter 280ms ease-out;
        box-shadow: var(--shadow-card);
        transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .chart-card:hover {
        transform: translateY(-2px);
        border-color: var(--overlay-primary-soft);
        box-shadow: var(--shadow-float);
      }
      .card-head {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-4);
      }
      h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--color-text-primary);
      }
      p {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: 0.84rem;
      }

      .card-body {
        flex: 1;
        min-height: 0;
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
        .chart-card {
          animation: none;
          transition: none;
        }
      }
    `
  ]
})
export class ChartCardComponent {
  @Input() title = '';
  @Input() meta = '';
}
