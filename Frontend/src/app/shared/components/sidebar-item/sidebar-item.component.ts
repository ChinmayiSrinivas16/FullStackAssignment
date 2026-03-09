import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <a
      class="sidebar-item"
      [routerLink]="route"
      routerLinkActive="active"
      [routerLinkActiveOptions]="{ exact: exact }">
      <app-icon [name]="icon" [size]="20"></app-icon>
      <span>{{ label }}</span>
    </a>
  `,
  styles: [
    `
      .sidebar-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: 10px 12px;
        border-radius: var(--radius-sm);
        color: var(--color-text-secondary);
        text-decoration: none;
        transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        font-weight: 500;
      }
      .sidebar-item:hover {
        background: var(--color-sidebar-hover);
        color: var(--color-text-primary);
        transform: translateX(2px);
      }
      .sidebar-item.active {
        background: var(--color-primary);
        color: var(--color-text-primary);
        box-shadow: inset 0 0 0 1px rgba(248, 250, 252, 0.1);
      }
    `
  ]
})
export class SidebarItemComponent {
  @Input() route = '/';
  @Input() label = '';
  @Input() icon = 'circle';
  @Input() exact = false;
}
