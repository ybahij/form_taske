import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VehicleService, MaintenanceRecord } from '../services/vehicle.service';
import { Observable } from 'rxjs';
import { MaintenanceDialogComponent } from './maintenance-dialog/maintenance-dialog.component';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MaintenanceComponent implements OnInit {
  maintenanceRecords$: Observable<MaintenanceRecord[]>;

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog
  ) {
    this.maintenanceRecords$ = this.vehicleService.getMaintenanceRecords();
  }

  ngOnInit(): void {}

  openAddMaintenanceDialog(record?: MaintenanceRecord): void {
    const dialogRef = this.dialog.open(MaintenanceDialogComponent, {
      width: '740px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel', 
      backdropClass: 'pro-dialog-backdrop',
      data: record
    });

    dialogRef.afterClosed().subscribe(result => {
      // Refresh or handle post-close if needed
    });
  }

  editRecord(record: MaintenanceRecord): void {
    this.openAddMaintenanceDialog(record);
  }

  deleteRecord(record: MaintenanceRecord): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.vehicleService.deleteMaintenanceRecord(record.id);
    }
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  }
}
