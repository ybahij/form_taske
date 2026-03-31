import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DemoDialogComponent } from '../demo-dialog/demo-dialog.component';
import { VehicleService, Vehicle, MaintenanceRecord } from '../services/vehicle.service';
import { ReportService, ReportCategory } from '../services/report.service';
import { Observable } from 'rxjs';
import { MaintenanceDialogComponent } from '../maintenance/maintenance-dialog/maintenance-dialog.component';
import { RaportDialogComponent } from '../Reports/raport-dialog/raport-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnDestroy {
  vehicles$: Observable<Vehicle[]>;
  maintenanceRecords$: Observable<MaintenanceRecord[]>;
  reportCategories$: Observable<ReportCategory[]>;
  selectedReportType: string = '';
  displayedColumns: string[] = ['immatriculation', 'marque', 'modele', 'description', 'owner', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private vehicleService: VehicleService,
    private reportService: ReportService
  ) {
    this.vehicles$ = this.vehicleService.getVehicles();
    this.maintenanceRecords$ = this.vehicleService.getMaintenanceRecords();
    this.reportCategories$ = this.reportService.getReportCategories();
  }

  openReportDialog(): void {
    if (!this.selectedReportType) {
      return;
    }
    this.dialog.open(RaportDialogComponent, {
      width: '740px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      disableClose: false,
      data: {baseReportType: this.selectedReportType}
    });
  }

  openDialog(): void {
    this.dialog.open(DemoDialogComponent, {
      width: '900px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      disableClose: false
    });
  }

  editVehicle(vehicle: Vehicle): void {
    this.dialog.open(DemoDialogComponent, {
      width: '900px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      disableClose: false,
      data: vehicle
    });
  }

  openAddMaintenanceDialog(record?: MaintenanceRecord): void {
    this.dialog.open(MaintenanceDialogComponent, {
      width: '740px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel', 
      backdropClass: 'pro-dialog-backdrop',
      data: record
    });
  }

  editRecord(record: MaintenanceRecord): void {
    this.openAddMaintenanceDialog(record);
  }

  deleteVehicle(vehicle: Vehicle): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      data: {
        title: 'Supprimer le véhicule',
        message: `Êtes-vous sûr de vouloir supprimer le véhicule ${vehicle.immatriculation} ? Cette action est irréversible.`
      }
    });
    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(confirmed => {
      if (confirmed) this.vehicleService.deleteVehicle(vehicle.immatriculation);
    });
  }

  deleteRecord(record: MaintenanceRecord): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      data: {
        title: 'Supprimer l\'enregistrement',
        message: 'Êtes-vous sûr de vouloir supprimer cet enregistrement ? Cette action est irréversible.'
      }
    });
    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(confirmed => {
      if (confirmed) this.vehicleService.deleteMaintenanceRecord(record.id);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  }
}
