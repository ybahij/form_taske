import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Partage } from '../../services/partage.service';

export interface PartageDetailsData { partage: Partage; }

@Component({
  selector: 'app-partage-details-dialog',
  template: `
    <!-- Header -->
    <div class="det-header">
      <div class="det-header-left">
        <div class="det-icon-wrap">
          <mat-icon>share</mat-icon>
        </div>
        <div class="det-header-text">
          <h2 class="det-title">{{ data.partage.designation }}</h2>
          <p class="det-subtitle">Détails du partage</p>
        </div>
      </div>
      <button mat-icon-button class="det-close-btn" (click)="close()" matTooltip="Fermer">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <!-- Body -->
    <mat-dialog-content class="det-body">

      <!-- Generated URL card -->
      <div class="url-card">
        <div class="url-card-label">
          <mat-icon>link</mat-icon>
          <span>Lien de partage généré</span>
        </div>
        <div class="url-row">
          <span class="url-text">{{ shareUrl }}</span>
          <button mat-icon-button class="copy-btn"
                  (click)="copyUrl()"
                  [matTooltip]="copied ? 'Copié !' : 'Copier le lien'">
            <mat-icon>{{ copied ? 'check' : 'content_copy' }}</mat-icon>
          </button>
        </div>

        <!-- Status badge -->
        <div class="status-row">
          <span class="status-badge" [class.active]="data.partage.isActive">
            <span class="status-dot"></span>
            {{ data.partage.isActive ? 'Actif' : 'Inactif' }}
          </span>
          <span class="created-label">
            Créé le {{ data.partage.createdAt | date:'dd/MM/yyyy à HH:mm':'':'fr' }}
          </span>
        </div>
      </div>

      <!-- Info section -->
      <div class="det-section">
        <div class="det-section-title">
          <mat-icon>info_outline</mat-icon>
          Informations
        </div>

        <div class="det-row" *ngIf="data.partage.description">
          <span class="det-label">Description</span>
          <span class="det-value">{{ data.partage.description }}</span>
        </div>

        <div class="det-row">
          <span class="det-label">Expiration</span>
          <span class="det-value exp-chip">
            <mat-icon>schedule</mat-icon>
            {{ expirationLabel }}
          </span>
        </div>

        <div class="det-row" *ngIf="data.partage.affectation">
          <span class="det-label">Affectation</span>
          <span class="det-value">{{ data.partage.affectation }}</span>
        </div>
      </div>

      <!-- Vehicles section -->
      <div class="det-section" *ngIf="data.partage.vehicules && data.partage.vehicules.length > 0">
        <div class="det-section-title">
          <mat-icon>directions_car</mat-icon>
          Véhicules partagés ({{ data.partage.vehicules.length }})
        </div>
        <div class="vehicle-chips">
          <span class="vehicle-chip" *ngFor="let v of data.partage.vehicules">
            <mat-icon>directions_car</mat-icon>
            {{ v }}
          </span>
        </div>
      </div>

    </mat-dialog-content>

    <!-- Footer -->
    <div mat-dialog-actions class="det-footer">
      <button mat-button class="btn-close" (click)="close()">Fermer</button>
      <button mat-flat-button class="btn-copy-full" (click)="copyUrl()">
        <mat-icon>{{ copied ? 'check' : 'content_copy' }}</mat-icon>
        {{ copied ? 'Lien copié !' : 'Copier le lien' }}
      </button>
    </div>
  `,
  styles: [`
    /* ── Header ── */
    .det-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px 14px;
      background: rgba(14, 116, 144, 0.05);
      border-bottom: 1px solid rgba(14, 116, 144, 0.1);
      flex-shrink: 0;
    }
    .det-header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .det-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--primary-light, #ecfeff);
      border: 1px solid rgba(14,116,144,.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .det-icon-wrap mat-icon { color: var(--primary-dark, #0e7490); font-size: 22px; }
    .det-title {
      margin: 0;
      font-size: 17px;
      font-weight: 700;
      color: var(--text-primary, #0f172a);
      letter-spacing: -0.2px;
    }
    .det-subtitle { margin: 2px 0 0; font-size: 12px; color: var(--text-secondary, #475569); }
    .det-close-btn { color: var(--text-secondary, #475569) !important; opacity: .7; }
    .det-close-btn:hover { opacity: 1; background: rgba(0,0,0,.05) !important; }

    /* ── Body ── */
    .det-body {
      padding: 20px 24px !important;
      margin: 0 !important;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto !important;
    }

    /* ── URL Card ── */
    .url-card {
      background: linear-gradient(135deg, #f0fffe 0%, #e0f7fa 100%);
      border: 1px solid rgba(14,116,144,.2);
      border-radius: 12px;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .url-card-label {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: var(--primary-dark, #0e7490);
    }
    .url-card-label mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .url-row {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,.75);
      border: 1px solid rgba(14,116,144,.15);
      border-radius: 8px;
      padding: 8px 12px;
    }
    .url-text {
      flex: 1;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: var(--primary-dark, #0e7490);
      font-weight: 500;
      word-break: break-all;
    }
    .copy-btn { color: var(--primary-dark, #0e7490) !important; width: 30px !important; height: 30px !important; flex-shrink: 0; }
    .copy-btn mat-icon { font-size: 17px; }

    /* ── Status row ── */
    .status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: rgba(239,68,68,.08);
      color: #dc2626;
      border: 1px solid rgba(239,68,68,.15);
    }
    .status-badge.active {
      background: rgba(16,185,129,.08);
      color: #059669;
      border-color: rgba(16,185,129,.2);
    }
    .status-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: currentColor;
    }
    .created-label { font-size: 12px; color: var(--text-secondary, #475569); }

    /* ── Info section ── */
    .det-section {
      background: #fff;
      border: 1px solid var(--front-border, #e2e8f0);
      border-radius: 10px;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .det-section-title {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: var(--primary-dark, #0e7490);
      padding-bottom: 10px;
      border-bottom: 1px solid var(--front-border, #e2e8f0);
    }
    .det-section-title mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .det-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .det-label {
      width: 110px;
      flex-shrink: 0;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary, #475569);
      padding-top: 1px;
    }
    .det-value {
      flex: 1;
      font-size: 14px;
      color: var(--text-primary, #0f172a);
      font-weight: 500;
    }
    .exp-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(14,116,144,.07);
      color: var(--primary-dark, #0e7490);
      border-radius: 20px;
      padding: 3px 10px 3px 7px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid rgba(14,116,144,.12);
    }
    .exp-chip mat-icon { font-size: 14px; width: 14px; height: 14px; }

    /* ── Vehicle chips ── */
    .vehicle-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .vehicle-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--primary-light, #ecfeff);
      color: var(--primary-dark, #0e7490);
      border: 1px solid rgba(14,116,144,.15);
      border-radius: 20px;
      padding: 4px 12px 4px 8px;
      font-size: 12px;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
    }
    .vehicle-chip mat-icon { font-size: 13px; width: 13px; height: 13px; }

    /* ── Footer ── */
    .det-footer {
      display: flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      gap: 10px !important;
      padding: 12px 24px 16px !important;
      margin: 0 !important;
      border-top: 1px solid var(--front-border, #e2e8f0) !important;
      background: var(--bg-elevated, #f8fafc) !important;
      min-height: unset !important;
    }
    .btn-close {
      border-radius: 6px !important;
      color: var(--text-secondary, #475569) !important;
      height: 38px !important;
      padding: 0 16px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
    }
    .btn-close:hover { background: rgba(0,0,0,.04) !important; }
    .btn-copy-full {
      background: var(--primary-dark, #0e7490) !important;
      color: white !important;
      border-radius: 6px !important;
      height: 38px !important;
      padding: 0 20px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 12px rgba(14,116,144,.3) !important;
      display: flex !important;
      align-items: center;
      gap: 6px;
    }
    .btn-copy-full mat-icon { font-size: 17px; width: 17px; height: 17px; }
  `]
})
export class PartageDetailsDialogComponent {

  copied = false;

  constructor(
    public dialogRef: MatDialogRef<PartageDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PartageDetailsData,
    private snackBar: MatSnackBar
  ) {}

  get shareUrl(): string {
    const token = btoa(this.data.partage.id).replace(/=/g, '').slice(0, 12);
    return `https://share.goodway.io/p/${token}`;
  }

  get expirationLabel(): string {
    const map: Record<string, string> = {
      '30min': '30 minutes', '1h': '1 heure',
      '3h': '3 heures', '24h': '24 heures',
    };
    const p = this.data.partage;
    if (p.expiration === 'custom' && p.expirationCustomDate) {
      return new Date(p.expirationCustomDate).toLocaleString('fr-FR');
    }
    return map[p.expiration] ?? p.expiration;
  }

  copyUrl(): void {
    navigator.clipboard.writeText(this.shareUrl).then(() => {
      this.copied = true;
      this.snackBar.open('Lien copié dans le presse-papiers', '', {
        duration: 2000, panelClass: ['snack-success']
      });
      setTimeout(() => this.copied = false, 2500);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
