import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <span class="logo-icon"><app-icon name="activity" [size]="28"></app-icon></span>
            <h1>StockFolio</h1>
          </div>
          <p class="subtitle">Indian Stock Portfolio Manager</p>
          <div class="market-badges">
            <span class="badge">NSE</span>
            <span class="badge">BSE</span>
          </div>
        </div>

        <form (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-wrapper">
              <span class="input-icon"><app-icon name="user" [size]="16"></app-icon></span>
              <input
                id="username"
                type="text"
                [(ngModel)]="username"
                name="username"
                placeholder="Enter your username"
                required />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <span class="input-icon"><app-icon name="lock" [size]="16"></app-icon></span>
              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                placeholder="Enter your password"
                required />
              <button type="button" class="toggle-pwd" (click)="showPassword = !showPassword">
                <app-icon [name]="showPassword ? 'eye-off' : 'eye'" [size]="16"></app-icon>
              </button>
            </div>
          </div>

          @if (error) {
            <div class="error-msg">{{ error }}</div>
          }

          <button type="submit" class="btn-primary" [disabled]="loading">
            @if (loading) {
              <span class="spinner"></span> Logging in...
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </div>
      </div>

      <div class="auth-info">
        <h2>Track Your Investments</h2>
        <ul>
          <li><app-icon name="bar-chart-3" [size]="16"></app-icon>Real-time portfolio tracking</li>
          <li><app-icon name="line-chart" [size]="16"></app-icon>P&L analytics and insights</li>
          <li><app-icon name="file-text" [size]="16"></app-icon>Transaction history management</li>
          <li><app-icon name="activity" [size]="16"></app-icon>Indian stock market (NSE/BSE)</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      min-height: 100vh;
      background:
        radial-gradient(circle at 85% 20%, rgba(37, 99, 235, 0.26), transparent 35%),
        linear-gradient(160deg, var(--color-bg) 0%, var(--color-bg) 100%);
    }
    .auth-card {
      width: 480px;
      margin: auto;
      padding: var(--space-10);
      background: var(--surface-strong);
      border: 1px solid var(--color-border-soft);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
    }
    .auth-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
    }
    .logo-icon {
      color: var(--color-primary);
      display: inline-flex;
    }
    .logo h1 {
      font-size: 1.8rem;
      margin: 0;
      color: var(--color-text-primary);
    }
    .subtitle {
      color: var(--color-text-secondary);
      margin-top: var(--space-2);
      font-size: 14px;
    }
    .market-badges {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: var(--space-3);
    }
    .badge {
      background: var(--overlay-primary-20);
      color: var(--color-text-primary);
      padding: 4px 14px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.7px;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .input-wrapper {
      display: flex;
      align-items: center;
      background: var(--surface-muted);
      border: 1px solid var(--color-border-soft);
      border-radius: var(--radius-md);
      padding: 0 14px;
      transition: border-color 0.2s, background-color 0.2s;
    }
    .input-wrapper:focus-within {
      border-color: var(--color-primary);
      background: var(--surface-muted-strong);
    }
    .input-icon {
      color: var(--color-text-secondary);
      margin-right: 10px;
      display: inline-flex;
    }
    .input-wrapper input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 14px 0;
      font-size: 14px;
      outline: none;
      color: var(--color-text-primary);
      caret-color: var(--color-text-primary);
    }
    .input-wrapper input:-webkit-autofill,
    .input-wrapper input:-webkit-autofill:hover,
    .input-wrapper input:-webkit-autofill:focus,
    .input-wrapper input:-webkit-autofill:active {
      -webkit-text-fill-color: var(--color-text-primary);
      box-shadow: 0 0 0 1000px var(--surface-muted-strong) inset;
      -webkit-box-shadow: 0 0 0 1000px var(--surface-muted-strong) inset;
      caret-color: var(--color-text-primary);
      transition: background-color 9999s ease-out 0s;
    }
    .toggle-pwd {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-secondary);
      padding: 4px;
      display: inline-flex;
      align-items: center;
    }
    .error-msg {
      background: var(--overlay-loss-12);
      color: var(--color-loss);
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      border: 1px solid var(--border-loss-soft);
    }
    .btn-primary {
      width: 100%;
      padding: 14px;
      background: var(--color-primary);
      color: var(--color-text-primary);
      border: none;
      border-radius: var(--radius-md);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 10px 22px var(--overlay-primary-36);
    }
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--text-on-dark-soft);
      border-top-color: var(--color-text-primary);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: var(--color-text-secondary);
    }
    .auth-footer a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 600;
    }
    .auth-footer a:hover { text-decoration: underline; }
    .auth-info {
      display: none;
    }
    @media (min-width: 1024px) {
      .auth-card { margin: auto 0; margin-left: 10%; }
      .auth-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 48px 64px;
        color: var(--color-text-primary);
        flex: 1;
      }
      .auth-info h2 {
        font-size: 22px;
        margin-bottom: 24px;
        color: var(--color-text-primary);
      }
      .auth-info ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .auth-info li {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: 16px;
        color: var(--color-text-secondary);
      }
    }

    @media (max-width: 600px) {
      .auth-card {
        width: min(480px, 92vw);
        padding: var(--space-6);
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}
