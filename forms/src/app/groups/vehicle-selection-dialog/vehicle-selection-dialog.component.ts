import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Vehicle, VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-selection-dialog',
  templateUrl: './vehicle-selection-dialog.component.html',
  styleUrls: ['./vehicle-selection-dialog.component.css']
})
export class VehicleSelectionDialogComponent implements OnInit {
  vehicles: Vehicle[] = [];
  selectedIds = new Set<string>();

  constructor(
    public dialogRef: MatDialogRef<VehicleSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedVehicleIds: string[] },
    private vehicleService: VehicleService
  ) {
    if (data && data.selectedVehicleIds) {
      data.selectedVehicleIds.forEach(id => this.selectedIds.add(id));
    }
  }

  ngOnInit(): void {
    this.vehicleService.getVehicles().subscribe(v => {
      this.vehicles = v;
    });
  }

  toggleSelection(vehicleId: string): void {
    if (this.selectedIds.has(vehicleId)) {
      this.selectedIds.delete(vehicleId);
    } else {
      this.selectedIds.add(vehicleId);
    }
  }

  isSelected(vehicleId: string): boolean {
    return this.selectedIds.has(vehicleId);
  }

  onSave(): void {
    this.dialogRef.close(Array.from(this.selectedIds));
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
