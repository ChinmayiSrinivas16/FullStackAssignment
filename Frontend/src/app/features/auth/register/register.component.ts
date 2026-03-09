import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-register',
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
          <p class="subtitle">Create your investor account</p>
          <div class="market-badges">
            <span class="badge">NSE</span>
            <span class="badge">BSE</span>
          </div>
        </div>

        <form (ngSubmit)="onRegister()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input id="firstName" type="text" [(ngModel)]="form.firstName" name="firstName" placeholder="First name" required />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input id="lastName" type="text" [(ngModel)]="form.lastName" name="lastName" placeholder="Last name" required />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" [(ngModel)]="form.email" name="email" placeholder="you@example.com" required />
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" type="text" [(ngModel)]="form.username" name="username" placeholder="Choose a username" required />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" [(ngModel)]="form.password" name="password" placeholder="Create a strong password" required />
          </div>

          @if (error) {
            <div class="error-msg">{{ error }}</div>
          }

          @if (success) {
            <div class="success-msg">{{ success }}</div>
          }

          <button type="submit" class="btn-primary" [disabled]="loading">
            @if (loading) {
              <span class="spinner"></span> Creating account...
            } @else {
              Create Account
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      min-height: 100vh;
      background:
        radial-gradient(circle at 15% 10%, rgba(37, 99, 235, 0.22), transparent 35%),
        linear-gradient(160deg, var(--color-bg) 0%, var(--color-bg) 100%);
      align-items: center;
      justify-content: center;
    }
    .auth-card {
      width: min(560px, 92vw);
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
      gap: var(--space-2);
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
      gap: var(--space-4);
    }
    .form-row {
      display: flex;
      gap: var(--space-4);
    }
    .form-row .form-group { flex: 1; }
    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .form-group input {
      width: 100%;
      padding: 12px 14px;
      background: var(--color-sidebar);
      border: 1px solid var(--color-border-soft);
      border-radius: var(--radius-sm);
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
      color: var(--color-text-primary);
      caret-color: var(--color-text-primary);
    }
    .form-group input:-webkit-autofill,
    .form-group input:-webkit-autofill:hover,
    .form-group input:-webkit-autofill:focus,
    .form-group input:-webkit-autofill:active {
      -webkit-text-fill-color: var(--color-text-primary);
      box-shadow: 0 0 0 1000px var(--color-sidebar) inset;
      -webkit-box-shadow: 0 0 0 1000px var(--color-sidebar) inset;
      caret-color: var(--color-text-primary);
      transition: background-color 9999s ease-out 0s;
    }
    .form-group input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
    }
    .error-msg {
      background: var(--overlay-loss-14);
      color: var(--color-loss);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      border: 1px solid var(--border-loss-soft);
    }
    .success-msg {
      background: var(--overlay-profit-14);
      color: var(--color-profit);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      border: 1px solid var(--border-profit-soft);
    }
    .btn-primary {
      width: 100%;
      padding: 14px;
      background: var(--color-primary);
      color: var(--color-text-primary);
      border: none;
      border-radius: var(--radius-sm);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      background: var(--color-primary-hover);
      box-shadow: 0 10px 22px var(--overlay-primary-36);
    }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .spinner {
      width: 16px; height: 16px;
      border: 2px solid var(--text-on-dark-soft);
      border-top-color: var(--color-text-primary);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .auth-footer {
      text-align: center;
      margin-top: var(--space-6);
      font-size: 14px;
      color: var(--color-text-secondary);
    }
    .auth-footer a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 600;
    }
    @media (max-width: 700px) {
      .auth-card {
        padding: var(--space-6);
      }
      .form-row {
        flex-direction: column;
        gap: var(--space-3);
      }
    }
  `]
})
export class RegisterComponent {
  form = {
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER'
  };
  error = '';
  success = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    if (!this.form.username || !this.form.password || !this.form.email || !this.form.firstName || !this.form.lastName) {
      this.error = 'Please fill in all fields';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    this.authService.register(this.form).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res.message + ' Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
