import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AppFooterComponent } from '../../shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, AppFooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="layout-wrapper">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <section class="page-content">
          <router-outlet></router-outlet>
        </section>
        <app-footer></app-footer>
      </main>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      margin-top: 64px;
    }
    .main-content {
      margin-left: 240px;
      flex: 1;
      min-height: calc(100vh - 64px);
      display: flex;
      flex-direction: column;
      padding: var(--space-6);
      background: transparent;
      transition: margin-left 0.25s ease;
    }

    .page-content {
      flex: 1;
      min-width: 0;
    }

    @media (max-width: 900px) {
      .main-content {
        margin-left: 0;
        padding: var(--space-4);
        padding-bottom: 84px;
      }
    }
  `]
})
export class MainLayoutComponent {}
