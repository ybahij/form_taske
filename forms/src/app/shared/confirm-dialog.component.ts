import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="confirm-header">
      <div class="confirm-icon-wrap">
        <mat-icon class="confirm-warn-icon">warning_amber</mat-icon>
      </div>
      <div class="confirm-text">
        <h2 class="confirm-title">{{ data.title }}</h2>
        <p class="confirm-message">{{ data.message }}</p>
      </div>
    </div>
    <mat-dialog-actions class="confirm-actions">
      <button mat-button class="confirm-btn-cancel" (click)="dialogRef.close(false)">
        Annuler
      </button>
      <button mat-raised-button class="confirm-btn-delete" (click)="dialogRef.close(true)">
        <mat-icon>delete</mat-icon>
        Supprimer
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .confirm-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 28px 28px 20px;
    }
    .confirm-icon-wrap {
      width: 48px;
      height: 48px;
      min-width: 48px;
      border-radius: 12px;
      background: rgba(239, 68, 68, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .confirm-warn-icon {
      color: #ef4444;
      font-size: 26px;
      width: 26px;
      height: 26px;
    }
    .confirm-text {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .confirm-title {
      margin: 0;
      font-size: 17px;
      font-weight: 600;
      color: #111827;
    }
    .confirm-message {
      margin: 0;
      font-size: 13px;
      color: #4b5563;
      line-height: 1.5;
    }
    .confirm-actions {
      padding: 12px 24px 20px !important;
      justify-content: flex-end !important;
      gap: 10px;
      border-top: 1px solid rgba(0,0,0,0.06);
      margin: 0 !important;
    }
    .confirm-btn-cancel {
      border-radius: 6px !important;
      font-size: 13px !important;
      color: #4b5563 !important;
      height: 36px !important;
    }
    .confirm-btn-delete {
      background-color: #ef4444 !important;
      color: white !important;
      border-radius: 6px !important;
      font-size: 13px !important;
      height: 36px !important;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .confirm-btn-delete mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
