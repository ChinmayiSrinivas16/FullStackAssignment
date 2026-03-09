import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="empty-state">
      <app-icon [name]="icon" [size]="30"></app-icon>
      <h4>{{ title }}</h4>
      <p>{{ message }}</p>
      @if (actionLabel) {
        <button type="button" class="action-btn" (click)="action.emit()">{{ actionLabel }}</button>
      }
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: grid;
        place-items: center;
        gap: var(--space-2);
        padding: var(--space-6);
        color: var(--color-text-secondary);
        text-align: center;
        border: 1px dashed var(--color-border);
        border-radius: var(--radius-md);
        background: var(--surface-muted-3);
      }
      h4 {
        margin: 0;
        color: var(--color-text-primary);
      }
      p {
        margin: 0;
      }
      .action-btn {
        margin-top: var(--space-2);
        border: 0;
        border-radius: var(--radius-sm);
        background: var(--color-primary);
        color: var(--color-text-primary);
        padding: 10px 18px;
        cursor: pointer;
        font-weight: 600;
      }
      .action-btn:hover {
        background: var(--color-primary-hover);
      }
    `
  ]
})
export class EmptyStateComponent {
  @Input() title = 'No data';
  @Input() message = 'No data is available yet.';
  @Input() icon = 'activity';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}
