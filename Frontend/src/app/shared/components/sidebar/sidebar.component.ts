import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarItemComponent } from '../sidebar-item/sidebar-item.component';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarItemComponent],
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        @for (item of navItems; track item.route) {
          <app-sidebar-item
            [route]="item.route"
            [label]="item.label"
            [icon]="item.icon"
            [exact]="item.exact ?? false"></app-sidebar-item>
        }
      </nav>
      <div class="sidebar-footer">
        <div class="market-status">
          <span class="status-dot"></span>
          <span class="status-text">Market Open</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: calc(100vh - 64px);
      position: fixed;
      top: 64px;
      left: 0;
      background: var(--color-sidebar);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: var(--space-4) 0;
      z-index: 999;
      border-right: 1px solid var(--color-border);
      transition: transform 0.25s ease;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      padding: 0 var(--space-3);
    }
    .sidebar-footer {
      padding: var(--space-4) var(--space-5);
      border-top: 1px solid var(--color-border);
      display: flex;
      justify-content: center;
    }
    .market-status {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding-top: 2px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: var(--color-profit);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .status-text {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }

    @media (max-width: 900px) {
      .sidebar {
        width: 100%;
        height: auto;
        top: auto;
        bottom: 0;
        padding: var(--space-2) var(--space-3);
        border-right: 0;
        border-top: 1px solid var(--color-border);
        transform: none;
      }

      .sidebar-nav {
        flex-direction: row;
        overflow-x: auto;
        gap: var(--space-2);
        padding: 0;
      }

      .sidebar-footer {
        display: none;
      }
    }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'layout-dashboard', route: '/dashboard', exact: true },
    { label: 'Holdings', icon: 'briefcase', route: '/holdings' },
    { label: 'Transactions', icon: 'receipt', route: '/transactions' },
    { label: 'Market Data', icon: 'line-chart', route: '/market' },
    { label: 'Analytics', icon: 'bar-chart', route: '/analytics' },
    { label: 'Reports', icon: 'file-text', route: '/reports' },
    { label: 'Wallet', icon: 'wallet', route: '/wallet' }
  ];
}
