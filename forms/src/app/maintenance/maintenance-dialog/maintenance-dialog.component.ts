import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  isLoading = false;

  tagInput = '';
  tags: string[] = [];

  dateTypes = [
    { value: 'jour', label: 'Jour' },
    { value: 'semaine', label: 'Semaine' },
    { value: 'mois', label: 'Mois' },
    { value: 'annee', label: 'Année' }
  ];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    public dialogRef: MatDialogRef<MaintenanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MaintenanceRecord | null,
    private snackBar: MatSnackBar
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
      vehicle:    ['', Validators.required],
      conductor:  ['', Validators.required],
      notes:      [''],
      cost:       [null, [Validators.min(0)]],
      date:       [new Date(), Validators.required],
      nextOdometer:  [0],
      engineHours:   [0],
      // Recurrence
      recurrenceEnabled: [false],
      dateType:          ['jour'],
      dateInterval:      [0],
      dateRelative:      ['Oui'],
      odometerInterval:  [0],
      odometerRelative:  ['Oui'],
      engineHoursInterval: [0],
      engineHoursRelative: ['Oui']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.tags = this.data.tags ? [...this.data.tags] : [];
      this.maintenanceForm.patchValue({
        vehicle:           this.data.vehicleImmatriculation,
        conductor:         this.data.conductorName,
        notes:             this.data.notes,
        cost:              this.data.cost,
        date:              this.data.date,
        nextOdometer:      this.data.nextOdometer ?? 0,
        engineHours:       this.data.engineHours ?? 0,
        recurrenceEnabled: this.data.recurrence?.enabled ?? false,
        dateType:          this.data.recurrence?.dateType ?? 'jour',
        dateInterval:      this.data.recurrence?.dateInterval ?? 0,
        dateRelative:      this.data.recurrence?.dateRelative ? 'Oui' : 'Non',
        odometerInterval:  this.data.recurrence?.odometerInterval ?? 0,
        odometerRelative:  this.data.recurrence?.odometerRelative ? 'Oui' : 'Non',
        engineHoursInterval: this.data.recurrence?.engineHoursInterval ?? 0,
        engineHoursRelative: this.data.recurrence?.engineHoursRelative ? 'Oui' : 'Non'
      });
    }
  }

  get recurrenceEnabled(): boolean {
    return this.maintenanceForm.get('recurrenceEnabled')?.value === true;
  }

  addTag(): void {
    const t = this.tagInput.trim();
    if (t && !this.tags.includes(t)) {
      this.tags.push(t);
    }
    this.tagInput = '';
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onTagInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }

  onSubmit(): void {
    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const v = this.maintenanceForm.value;

    const recordData: MaintenanceRecord = {
      id: this.data
        ? this.data.id
        : Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      vehicleImmatriculation: v.vehicle,
      conductorName:          v.conductor,
      maintenanceType:        v.dateType,
      date:                   v.date,
      cost:                   v.cost,
      notes:                  v.notes,
      tags:                   this.tags,
      nextOdometer:           v.nextOdometer,
      engineHours:            v.engineHours,
      recurrence: {
        enabled:              v.recurrenceEnabled,
        dateType:             v.dateType,
        dateInterval:         v.dateInterval,
        dateRelative:         v.dateRelative === 'Oui',
        odometerInterval:     v.odometerInterval,
        odometerRelative:     v.odometerRelative === 'Oui',
        engineHoursInterval:  v.engineHoursInterval,
        engineHoursRelative:  v.engineHoursRelative === 'Oui'
      }
    };

    if (this.data) {
      this.vehicleService.updateMaintenanceRecord(recordData);
    } else {
      this.vehicleService.addMaintenanceRecord(recordData);
    }
    this.isLoading = false;
    this.snackBar.open('Intervention enregistrée avec succès', 'OK', {
      duration: 2500, panelClass: ['snack-success']
    });
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
