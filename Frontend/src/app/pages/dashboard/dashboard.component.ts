import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <nav class="navbar">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span class="logo-text">InvestPro</span>
        </div>
        <div class="user-menu">
          <span class="user-name">{{ userName }}</span>
          <button (click)="logout()" class="btn btn-outline">Logout</button>
        </div>
      </nav>

      <main class="dashboard-content">
        <h1>Dashboard</h1>
        <p class="welcome-text">Welcome to your portfolio dashboard!</p>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon icon-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="12 1 12 23"></polyline>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Value</span>
              <span class="stat-value">₹ 0.00</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon icon-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Gain/Loss</span>
              <span class="stat-value">₹ 0.00</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon icon-purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Holdings</span>
              <span class="stat-value">0</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon icon-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Transactions</span>
              <span class="stat-value">0</span>
            </div>
          </div>
        </div>

        <div class="dashboard-sections">
          <div class="section-card">
            <h2>Holdings</h2>
            <p class="placeholder-text">No holdings yet. Add your first transaction to get started.</p>
          </div>
          
          <div class="section-card">
            <h2>Recent Transactions</h2>
            <p class="placeholder-text">No transactions yet. Add your first transaction to get started.</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f8f9fb;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 40px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid #e5e7eb;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 700;
    }

    .logo svg {
      width: 24px;
      height: 24px;
      color: #5b7cfa;
    }

    .logo-text {
      background: linear-gradient(135deg, #5b7cfa 0%, #748ffc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-name {
      color: #666;
      font-weight: 500;
      font-size: 14px;
    }

    .btn {
      padding: 8px 20px;
      border-radius: 6px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      font-size: 13px;
    }

    .btn-outline {
      background: transparent;
      color: #5b7cfa;
      border: 1px solid #5b7cfa;
    }

    .btn-outline:hover {
      background: #e7f0ff;
    }

    .dashboard-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px;
    }

    .dashboard-content h1 {
      color: #1a1a1a;
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
    }

    .welcome-text {
      color: #666;
      margin: 0 0 32px 0;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      transform: translateY(-4px);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-blue {
      background: #e7f0ff;
      color: #5b7cfa;
    }

    .icon-green {
      background: #e7f5f0;
      color: #16a34a;
    }

    .icon-purple {
      background: #f4e7ff;
      color: #9333ea;
    }

    .icon-orange {
      background: #fff5e7;
      color: #f97316;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      color: #666;
      font-size: 13px;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      color: #1a1a1a;
      font-size: 20px;
      font-weight: 700;
    }

    .dashboard-sections {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .section-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
    }

    .section-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .section-card h2 {
      color: #1a1a1a;
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .placeholder-text {
      color: #999;
      text-align: center;
      padding: 40px 20px;
      margin: 0;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-sections {
        grid-template-columns: 1fr;
      }

      .navbar {
        padding: 16px 20px;
      }

      .dashboard-content {
        padding: 20px;
      }

      .dashboard-content h1 {
        font-size: 24px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.firstName || user.email || 'User';
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
