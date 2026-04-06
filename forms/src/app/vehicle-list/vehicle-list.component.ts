import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DemoDialogComponent } from '../demo-dialog/demo-dialog.component';
import { VehicleService, Vehicle, MaintenanceRecord, VehicleGroup } from '../services/vehicle.service';
import { GroupDialogComponent } from '../groups/group-dialog/group-dialog.component';
import { Observable } from 'rxjs';
import { MaintenanceDialogComponent } from '../maintenance/maintenance-dialog/maintenance-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnDestroy {
  vehicles$: Observable<Vehicle[]>;
  maintenanceRecords$: Observable<MaintenanceRecord[]>;
  groups$: Observable<VehicleGroup[]>;
  displayedColumns: string[] = ['immatriculation', 'marque', 'modele', 'description', 'owner', 'actions'];
  
  selectedGroup: VehicleGroup | null = null;
  allVehicles: Vehicle[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar
  ) {
    this.vehicles$ = this.vehicleService.getVehicles();
    this.maintenanceRecords$ = this.vehicleService.getMaintenanceRecords();
    this.groups$ = this.vehicleService.getVehicleGroups();

    this.vehicles$.pipe(takeUntil(this.destroy$)).subscribe(v => this.allVehicles = v);
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
      if (confirmed) {
        this.vehicleService.deleteVehicle(vehicle.immatriculation);
        this.snackBar.open('Véhicule supprimé définitivement.', 'Fermer', { duration: 3000, panelClass: ['snackbar-error'], horizontalPosition: 'right', verticalPosition: 'bottom' });
      }
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
      if (confirmed) {
        this.vehicleService.deleteMaintenanceRecord(record.id);
        this.snackBar.open('Enregistrement d\'intervention supprimé.', 'Fermer', { duration: 3000, panelClass: ['snackbar-error'], horizontalPosition: 'right', verticalPosition: 'bottom' });
      }
    });
  }

  openAddGroupDialog(): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '600px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop'
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.vehicleService.addVehicleGroup(result);
        this.snackBar.open('Le groupe a été créé avec succès.', 'Fermer', { duration: 3000, panelClass: ['snack-success'], horizontalPosition: 'right', verticalPosition: 'bottom' });
      }
    });
  }

  editGroup(group: VehicleGroup): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '600px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      data: { group }
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.vehicleService.updateVehicleGroup(result);
        this.snackBar.open('Le groupe a été mis à jour avec succès.', 'Fermer', { duration: 3000, panelClass: ['snack-success'], horizontalPosition: 'right', verticalPosition: 'bottom' });
        if (this.selectedGroup && this.selectedGroup.id === result.id) {
          this.selectedGroup = result;
        }
      }
    });
  }

  deleteGroup(group: VehicleGroup): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      data: {
        title: 'Supprimer le groupe',
        message: `Êtes-vous sûr de vouloir supprimer le groupe ${group.name} ? Cette action est irréversible.`
      }
    });
    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(confirmed => {
      if (confirmed) {
        this.vehicleService.deleteVehicleGroup(group.id);
        this.snackBar.open('Le groupe a été supprimé définitivement.', 'Fermer', { duration: 3000, panelClass: ['snackbar-error'], horizontalPosition: 'right', verticalPosition: 'bottom' });
      }
    });
  }

  getRootGroups(groups: VehicleGroup[]): VehicleGroup[] {
    return groups.filter(g => !g.parentGroupId);
  }

  getChildGroups(groupId: string, groups: VehicleGroup[]): VehicleGroup[] {
    return groups.filter(g => g.parentGroupId === groupId);
  }

  selectGroup(group: VehicleGroup, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedGroup = group;
  }

  getVehiclesForGroup(groupIds: string[] | undefined): Vehicle[] {
    if (!groupIds || groupIds.length === 0) return [];
    return this.allVehicles.filter(v => groupIds.includes(v.immatriculation));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  }
}
