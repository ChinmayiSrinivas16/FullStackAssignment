import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, map, of } from 'rxjs';
import { AboutService } from '../../../core/services/about.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer" aria-label="Footer information">
      <div class="footer-inner">
        @if (aboutInfo$ | async; as about) {
          <div class="footer-identity">
            <strong>{{ about.companyName }}</strong>
            <span>{{ about.supportEmail }}</span>
            <span class="footer-address">{{ about.registeredOffice }}</span>
          </div>

          <div class="footer-actions">
            <small class="footer-copy">© {{ currentYear }} StockFolio. All rights reserved.</small>
            <button type="button" class="know-more-btn" (click)="showDetails = true">Know More</button>
          </div>

          @if (showDetails) {
            <div class="details-overlay" (click)="closeDetails()">
              <article class="details-card" role="dialog" aria-modal="true" aria-label="About details" (click)="$event.stopPropagation()">
                <header>
                  <h4>About StockFolio</h4>
                  <button type="button" class="close-btn" (click)="closeDetails()" aria-label="Close details">×</button>
                </header>

                <div class="details-grid">
                  <p><span>Company ID</span><strong>{{ about.companyId }}</strong></p>
                  <p><span>GST Number</span><strong>{{ about.gstNumber }}</strong></p>
                  <p><span>PAN Number</span><strong>{{ about.panNumber }}</strong></p>
                  <p><span>CIN Number</span><strong>{{ about.cinNumber }}</strong></p>
                  <p><span>Support Email</span><strong>{{ about.supportEmail }}</strong></p>
                  <p><span>Support Phone</span><strong>{{ about.supportPhone }}</strong></p>
                  <p><span>Website</span><strong>{{ about.website }}</strong></p>
                  <p><span>Registered Office</span><strong>{{ about.registeredOffice }}</strong></p>
                </div>
              </article>
            </div>
          }
        } @else {
          <div class="footer-identity">
            <strong>StockFolio</strong>
            <span>Company information is currently unavailable.</span>
          </div>
        }
      </div>
    </footer>
  `,
  styles: [
    `
      .app-footer {
        margin-top: var(--space-6);
        border-top: 1px solid var(--color-border);
        background: linear-gradient(180deg, rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.7));
      }
      .footer-inner {
        min-height: 72px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
      }
      .footer-identity {
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      .footer-identity strong {
        color: var(--color-text-primary);
      }
      .footer-identity span {
        color: var(--color-text-secondary);
        font-size: 0.82rem;
      }
      .footer-address {
        max-width: 620px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .footer-actions {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }
      .footer-copy {
        color: var(--color-text-secondary);
      }
      .know-more-btn {
        border: 1px solid rgba(59, 130, 246, 0.45);
        background: rgba(59, 130, 246, 0.16);
        color: #bfdbfe;
        border-radius: var(--radius-sm);
        padding: 7px 10px;
        cursor: pointer;
      }
      .know-more-btn:hover {
        background: rgba(59, 130, 246, 0.25);
      }
      .details-overlay {
        position: fixed;
        inset: 0;
        background: rgba(2, 6, 23, 0.6);
        display: grid;
        place-items: end center;
        z-index: 2000;
        padding: 0 12px 90px;
      }
      .details-card {
        width: min(460px, 100%);
        border: 1px solid var(--color-border-soft);
        background: linear-gradient(160deg, rgba(30, 64, 175, 0.22), rgba(15, 23, 42, 0.97));
        border-radius: 14px;
        padding: 14px;
        box-shadow: 0 18px 40px rgba(2, 6, 23, 0.48);
      }
      .details-card header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .details-card h4 {
        margin: 0;
        font-size: 1rem;
      }
      .close-btn {
        border: 0;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: rgba(148, 163, 184, 0.2);
        color: var(--color-text-primary);
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
      }
      .details-grid {
        display: grid;
        gap: 8px;
      }
      .details-grid p {
        margin: 0;
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 8px;
        background: rgba(15, 23, 42, 0.45);
        padding: 8px 10px;
        display: grid;
        gap: 2px;
      }
      .details-grid span {
        color: var(--color-text-secondary);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .details-grid strong {
        color: var(--color-text-primary);
        font-size: 0.85rem;
        word-break: break-word;
      }
      @media (max-width: 900px) {
        .footer-inner {
          padding-bottom: 76px;
          flex-direction: column;
          align-items: start;
        }
        .footer-actions {
          width: 100%;
          justify-content: space-between;
        }
        .footer-address {
          max-width: 100%;
        }
        .details-overlay {
          place-items: center;
          padding: 12px;
        }
      }
    `
  ]
})
export class AppFooterComponent {
  readonly aboutInfo$ = this.aboutService.getAboutInfo().pipe(
    map((response) => response.data),
    catchError(() => of(null))
  );
  readonly currentYear = new Date().getFullYear();
  showDetails = false;

  constructor(private aboutService: AboutService) {}

  closeDetails(): void {
    this.showDetails = false;
  }
}
