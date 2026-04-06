import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { VehicleGroup, VehicleService } from '../../services/vehicle.service';
import { VehicleSelectionDialogComponent } from '../vehicle-selection-dialog/vehicle-selection-dialog.component';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.css']
})
export class GroupDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean = false;
  groups: VehicleGroup[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vehicleService: VehicleService,
    private dialog: MatDialog
  ) {
    this.isEditMode = !!(data && data.group);
    const existingGroup = this.isEditMode ? data.group : null;

    this.form = this.fb.group({
      id: [existingGroup?.id || ''],
      name: [existingGroup?.name || '', Validators.required],
      description: [existingGroup?.description || '', Validators.required],
      parentGroupId: [existingGroup?.parentGroupId || null],
      vehicleIds: [existingGroup?.vehicleIds || []]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.vehicleService.getVehicleGroups().subscribe(g => {
        const currentId = this.data?.group?.id;
        // Exclude the current group and ALL its recursive descendants to prevent circular dependency loops
        this.groups = g.filter(group => !this.isDescendant(group.id, currentId, g));
      });
    }
  }

  private isDescendant(groupIdToCheck: string, ancestorId: string, allGroups: VehicleGroup[]): boolean {
    if (!ancestorId) return false;
    let currentGroupId = groupIdToCheck;
    const seen = new Set<string>();
    
    while (currentGroupId) {
      if (currentGroupId === ancestorId) return true;
      if (seen.has(currentGroupId)) return false; // Break out of corrupted loops
      seen.add(currentGroupId);
      
      const group = allGroups.find(g => g.id === currentGroupId);
      if (group && group.parentGroupId) {
        currentGroupId = group.parentGroupId;
      } else {
        break;
      }
    }
    return false;
  }

  openVehicleSelection(): void {
    const dialogRef = this.dialog.open(VehicleSelectionDialogComponent, {
      width: '500px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      backdropClass: 'pro-dialog-backdrop',
      data: { selectedVehicleIds: this.form.value.vehicleIds || [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.form.patchValue({ vehicleIds: result });
      }
    });
  }

  onSave(): void {
    if (this.form.valid) {
      const groupData = this.form.getRawValue();
      if (!this.isEditMode) {
        groupData.id = 'GRP' + new Date().getTime();
        groupData.vehicleIds = [];
      }
      
      // Failsafe: Prevent assignment to itself under any circumstance
      if (groupData.parentGroupId === groupData.id) {
        groupData.parentGroupId = null;
      }

      this.dialogRef.close(groupData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
