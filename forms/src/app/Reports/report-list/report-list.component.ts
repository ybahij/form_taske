import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService, SavedReport } from '../../services/report.service';
import { RaportDialogComponent } from '../raport-dialog/raport-dialog.component';
import { AutoReportDialogComponent } from '../auto-report-dialog/auto-report-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit, OnDestroy {

  reports: SavedReport[] = [];
  displayedColumns = ['name', 'description', 'baseReport', 'createdAt', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private reportService: ReportService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.reportService.savedReports$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.reports = data);
  }

  openNew(): void {
    const ref = this.dialog.open(RaportDialogComponent, {
      width: '700px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      data: null
    });

    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.reportService.addSavedReport(result);
        this.snackBar.open('Rapport créé avec succès', 'OK', {
          duration: 2500, panelClass: ['snack-success']
        });
      }
    });
  }

  openEdit(report: SavedReport): void {
    const ref = this.dialog.open(RaportDialogComponent, {
      width: '700px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      data: report
    });

    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.reportService.updateSavedReport(report.id, result);
        this.snackBar.open('Rapport mis à jour', 'OK', {
          duration: 2500, panelClass: ['snack-success']
        });
      }
    });
  }

  confirmDelete(report: SavedReport): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Supprimer le rapport',
        message: `Supprimer "${report.baseReportName}" ? Cette action est irréversible.`
      }
    });

    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(confirmed => {
      if (confirmed) {
        this.reportService.deleteSavedReport(report.id);
        this.snackBar.open('Rapport supprimé', 'OK', {
          duration: 2000, panelClass: ['snack-success']
        });
      }
    });
  }

  openAutoReport(): void {
    this.dialog.open(AutoReportDialogComponent, {
      width: '650px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
