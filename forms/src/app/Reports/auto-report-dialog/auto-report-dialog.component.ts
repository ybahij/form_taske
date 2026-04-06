import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService, Vehicle, VehicleGroup } from '../../services/vehicle.service';

@Component({
  selector: 'app-auto-report-dialog',
  templateUrl: './auto-report-dialog.component.html',
  styleUrls: ['./auto-report-dialog.component.css']
})
export class AutoReportDialogComponent implements OnInit {
  step: number = 1;

  step1Form: FormGroup;
  step2Form: FormGroup;

  vehicles: Vehicle[] = [];
  groups: VehicleGroup[] = [];

  intervals = [
    { value: 'daily', label: 'Quotidien' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuel' },
    { value: 'hourly', label: 'Chaque heure' },
    { value: 'mon-fri', label: 'De Lundi jusqu\'à vendredi' }
  ];

  formats = ['XLSX', 'PDF', 'CSV'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AutoReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private vehicleService: VehicleService
  ) {
    this.step1Form = this.fb.group({
      description: ['', Validators.required],
      reportType: ['system', Validators.required], // system or custom
      interval: ['', Validators.required],
      format: ['', Validators.required],
      recipients: ['', Validators.required] // expects comma separated emails
    });

    this.step2Form = this.fb.group({
      applyTo: ['group', Validators.required], // 'group' or 'car'
      selectedEntity: ['', Validators.required], // ID of group or car
      reportSubtype: ['', Validators.required] // generic options
    });
  }

  ngOnInit(): void {
    // Load vehicles and groups for step 2 dropdowns
    this.vehicleService.getVehicles().subscribe(v => this.vehicles = v);
    this.vehicleService.getVehicleGroups().subscribe(g => this.groups = g);
  }

  nextStep(): void {
    if (this.step === 1 && this.step1Form.valid) {
      this.step = 2;
    } else {
      this.step1Form.markAllAsTouched();
    }
  }

  prevStep(): void {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  onSubmit(): void {
    if (this.step2Form.invalid) {
      this.step2Form.markAllAsTouched();
      return;
    }
    
    const finalReportData = {
      ...this.step1Form.value,
      ...this.step2Form.value
    };

    this.dialogRef.close(finalReportData);
    this.snackBar.open('Rapport automatique planifié avec succès', 'OK', { duration: 3000, panelClass: ['snack-success'] });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
