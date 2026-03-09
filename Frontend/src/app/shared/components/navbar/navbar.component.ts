import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <div class="logo">
          <span class="logo-icon"><app-icon name="activity" [size]="22"></app-icon></span>
          <span class="logo-text">StockFolio</span>
        </div>
        <span class="market-badge">NSE / BSE</span>
      </div>
      <div class="navbar-end">
        <div class="user-info">
          <span class="user-greeting">Welcome, <strong>{{ username }}</strong></span>
          <button class="btn-logout" (click)="logout()">
            <app-icon name="log-out" [size]="14"></app-icon>
            Logout
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-6);
      height: 64px;
      background: var(--color-overlay-sidebar);
      color: var(--color-text-primary);
      border-bottom: 1px solid var(--color-border);
      backdrop-filter: blur(8px);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .logo-icon {
      color: var(--color-primary);
      display: inline-flex;
    }
    .logo-text {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .market-badge {
      background: var(--color-overlay-primary-soft);
      color: var(--color-text-primary);
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.3px;
    }
    .navbar-end {
      display: flex;
      align-items: center;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    .user-greeting {
      font-size: 14px;
      color: var(--color-text-secondary);
    }
    .user-greeting strong { color: var(--color-text-primary); }
    .btn-logout {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: var(--color-overlay-loss-soft);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border-loss);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background: var(--color-overlay-loss-soft);
      border-color: var(--color-loss);
    }

    @media (max-width: 900px) {
      .navbar {
        padding: 0 var(--space-4);
      }

      .market-badge,
      .user-greeting {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  username: string;

  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.getUsername() || 'Investor';
  }

  logout(): void {
    this.authService.logout();
  }
}
