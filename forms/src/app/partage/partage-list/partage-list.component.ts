import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PartageService, Partage } from '../../services/partage.service';
import { PartageDialogComponent } from '../partage-dialog/partage-dialog.component';
import { PartageDetailsDialogComponent } from '../partage-details-dialog/partage-details-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-partage-list',
  templateUrl: './partage-list.component.html',
  styleUrls: ['./partage-list.component.css']
})
export class PartageListComponent implements OnInit, OnDestroy {

  partages: Partage[] = [];
  displayedColumns = ['designation', 'description', 'expiration', 'vehicules', 'createdAt', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private partageService: PartageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.partageService.partages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.partages = data);
  }

  openDetails(p: Partage): void {
    this.dialog.open(PartageDetailsDialogComponent, {
      width: '520px',
      maxHeight: '90vh',
      panelClass: 'confirm-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      data: { partage: p }
    });
  }

  openNew(): void {
    const ref = this.dialog.open(PartageDialogComponent, {
      width: '560px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      data: {}
    });

    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.partageService.add(result);
        this.snackBar.open('Partage créé avec succès', 'OK', {
          duration: 2500, panelClass: ['snack-success']
        });
      }
    });
  }

  openEdit(p: Partage): void {
    const ref = this.dialog.open(PartageDialogComponent, {
      width: '560px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      data: { partage: p }
    });

    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.partageService.update(p.id, result);
        this.snackBar.open('Partage mis à jour', 'OK', {
          duration: 2500, panelClass: ['snack-success']
        });
      }
    });
  }

  confirmDelete(p: Partage): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Supprimer le partage',
        message: `Supprimer "${p.designation}" ? Cette action est irréversible.`
      }
    });

    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(confirmed => {
      if (confirmed) {
        this.partageService.delete(p.id);
        this.snackBar.open('Partage supprimé', 'OK', {
          duration: 2000, panelClass: ['snack-success']
        });
      }
    });
  }

  expirationLabel(p: Partage): string {
    return this.partageService.expirationLabel(p);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
