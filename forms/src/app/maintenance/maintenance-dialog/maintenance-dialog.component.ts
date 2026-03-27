import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VehicleService, Vehicle, MaintenanceRecord } from '../../services/vehicle.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-maintenance-dialog',
  templateUrl: './maintenance-dialog.component.html',
  styleUrls: ['./maintenance-dialog.component.css']
})
export class MaintenanceDialogComponent implements OnInit {
  maintenanceForm: FormGroup;
  vehicles$: Observable<Vehicle[]>;
  conducteurs$: Observable<string[]>;
  maintenanceTypes: string[] = [
    'Vidange moteur',
    'Changement de freins',
    'Remplacement de pneus',
    'Révision générale',
    'Réparation carrosserie',
    'Contrôle technique',
    'Nettoyage complet'
  ];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    public dialogRef: MatDialogRef<MaintenanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vehicles$ = this.vehicleService.getVehicles();
    
    this.conducteurs$ = this.vehicles$.pipe(
      map(vehicles => {
        const owners = vehicles
          .map(v => `${v.firstName} ${v.lastName}`.trim())
          .filter(name => name !== '');
        return Array.from(new Set(owners));
      })
    );

    this.maintenanceForm = this.fb.group({
      vehicle: ['', Validators.required],
      conductor: ['', Validators.required],
      type: ['', Validators.required],
      date: [new Date(), Validators.required],
      cost: [null, [Validators.min(0)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.maintenanceForm.patchValue({
        vehicle: this.data.vehicleImmatriculation,
        conductor: this.data.conductorName,
        type: this.data.maintenanceType,
        date: this.data.date,
        cost: this.data.cost,
        notes: this.data.notes
      });
    }
  }

  onSubmit(): void {
    if (this.maintenanceForm.valid) {
      const formVal = this.maintenanceForm.value;
      const recordData: MaintenanceRecord = {
        id: this.data ? this.data.id : Math.random().toString(36).substr(2, 9),
        vehicleImmatriculation: formVal.vehicle,
        conductorName: formVal.conductor,
        maintenanceType: formVal.type,
        date: formVal.date,
        cost: formVal.cost,
        notes: formVal.notes
      };
      
      if (this.data) {
        this.vehicleService.updateMaintenanceRecord(recordData);
      } else {
        this.vehicleService.addMaintenanceRecord(recordData);
      }
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
