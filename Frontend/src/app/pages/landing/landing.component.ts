import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-container">
      <!-- Navigation Bar -->
      <nav class="navbar">
        <div class="logo-section">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
          <span class="logo-text">InvestPro</span>
        </div>
        <div class="nav-links">
          <a routerLink="/login" class="btn btn-ghost">Sign In</a>
          <a routerLink="/signup" class="btn btn-primary">Get Started</a>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Your Professional <span class="gradient-text">Investment Portfolio</span> Manager</h1>
          <p class="subtitle">
            Track, analyze, and grow your investments with institutional-grade portfolio management tools designed for serious investors.
          </p>
          <div class="cta-buttons">
            <a routerLink="/signup" class="btn btn-primary btn-large">Start Investing Free</a>
            <a routerLink="/login" class="btn btn-secondary btn-large">Sign In</a>
          </div>
          <p class="footer-text">Join 50,000+ investors managing their portfolios</p>
        </div>

        <!-- Features Grid -->
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-header">
              <div class="icon-box icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="2" x2="12" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>Real-time Portfolio Tracking</h3>
            </div>
            <p>Monitor your holdings with live price updates, performance metrics, and detailed breakdowns</p>
          </div>

          <div class="feature-card">
            <div class="feature-header">
              <div class="icon-box icon-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
              <h3>Advanced Analytics</h3>
            </div>
            <p>Analyze gains, losses, and performance trends with professional-grade reporting tools</p>
          </div>

          <div class="feature-card">
            <div class="feature-header">
              <div class="icon-box icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 3h-2.17a2 2 0 0 0-3.66 0H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"></path>
                </svg>
              </div>
              <h3>Portfolio Management</h3>
            </div>
            <p>Manage multiple holdings and transactions with organized, intuitive portfolio tools</p>
          </div>

          <div class="feature-card">
            <div class="feature-header">
              <div class="icon-box icon-orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3>Market Insights</h3>
            </div>
            <p>Stay informed with live market data, price quotes, and investment opportunities</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2026 InvestPro. Professional Portfolio Management.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
      color: #f1f5f9;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 60px;
      background: rgba(30, 41, 59, 0.8);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid #475569;
      backdrop-filter: blur(10px);
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      border-radius: 8px;
      color: white;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .logo-text {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .btn {
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      font-size: 14px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
    }

    .btn-ghost {
      background: transparent;
      color: #818cf8;
      border: 1px solid #475569;
    }

    .btn-ghost:hover {
      background: rgba(99, 102, 241, 0.1);
      border-color: #818cf8;
    }

    .btn-secondary {
      background: transparent;
      color: #818cf8;
      border: 2px solid #818cf8;
    }

    .btn-secondary:hover {
      background: rgba(99, 102, 241, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
    }

    .btn-large {
      padding: 14px 40px;
      font-size: 16px;
    }

    .hero {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 60px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .hero-content {
      text-align: center;
      margin-bottom: 80px;
    }

    .hero-content h1 {
      font-size: 56px;
      font-weight: 800;
      margin: 0 0 24px 0;
      line-height: 1.2;
      color: #f1f5f9;
    }

    .gradient-text {
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 18px;
      color: #cbd5e1;
      max-width: 700px;
      margin: 0 auto 40px;
      line-height: 1.6;
    }

    .cta-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-bottom: 20px;
    }

    .footer-text {
      font-size: 14px;
      color: #94a3b8;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      width: 100%;
    }

    .feature-card {
      background: rgba(30, 41, 59, 0.6);
      border-radius: 12px;
      padding: 32px 24px;
      border: 1px solid #475569;
      transition: all 0.3s ease;
      text-align: left;
      backdrop-filter: blur(10px);
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(99, 102, 241, 0.2);
      border-color: #6366f1;
      background: rgba(30, 41, 59, 0.8);
    }

    .feature-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
    }

    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-blue {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
    }

    .icon-green {
      background: rgba(16, 185, 129, 0.15);
      color: #86efac;
    }

    .icon-purple {
      background: rgba(147, 51, 234, 0.15);
      color: #d8b4fe;
    }

    .icon-orange {
      background: rgba(249, 115, 22, 0.15);
      color: #fdba74;
    }

    .feature-card h3 {
      font-size: 16px;
      margin: 0;
      font-weight: 600;
      color: #f1f5f9;
    }

    .feature-card p {
      color: #cbd5e1;
      margin: 12px 0 0 0;
      font-size: 14px;
      line-height: 1.5;
    }

    .footer {
      padding: 40px;
      text-align: center;
      color: #94a3b8;
      font-size: 14px;
      border-top: 1px solid #475569;
    }

    @media (max-width: 1200px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 16px 24px;
      }

      .hero-content h1 {
        font-size: 36px;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .cta-buttons {
        flex-direction: column;
      }

      .btn-large {
        width: 100%;
      }
    }
  `]
})
export class LandingComponent {}
