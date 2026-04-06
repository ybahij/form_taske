import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Partage } from '../../services/partage.service';

export interface PartageDialogData { partage?: Partage; }

@Component({
  selector: 'app-partage-dialog',
  templateUrl: './partage-dialog.component.html',
  styleUrls: ['./partage-dialog.component.css']
})
export class PartageDialogComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  form: FormGroup;
  expirationOptions = [
    { value: '30min', label: '30 minutes' },
    { value: '1h',    label: '1 heure'    },
    { value: '3h',    label: '3 heures'   },
    { value: '24h',   label: '24 heures'  },
    { value: 'custom', label: 'Personnalisé…' },
  ];

  hours   = Array.from({ length: 24 }, (_, i) => i);   // 0–23
  minutes = Array.from({ length: 60 }, (_, i) => i);   // 0–59

  // Replace with real data from your API
  affectations  = ['Direction', 'Commercial', 'Logistique', 'Maintenance', 'RH'];
  vehiculesList = [
    'VH001 - Peugeot 308',  'VH002 - Renault Clio',
    'VH003 - Ford Focus',   'VH004 - Toyota Corolla',
    'VH005 - Citroën C3',   'VH006 - Volkswagen Golf',
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PartageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PartageDialogData
  ) {
    this.form = this.fb.group({
      designation:  ['', Validators.required],
      description:  [''],
      expiration:   ['1h', Validators.required],
      startDate:    [null],
      startHour:    [0],
      startMinute:  [0],
      endDate:      [null],
      endHour:      [23],
      endMinute:    [59],
      affectation:  ['', Validators.required],
      vehicules:    [[]],
    });
  }

  ngOnInit(): void {
    if (this.data?.partage) {
      this.form.patchValue(this.data.partage);
    }

    // Toggle required validators on startDate/endDate based on expiration
    this.form.get('expiration')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.updateDateValidators(value));

    // Run once on init with the current value
    this.updateDateValidators(this.form.get('expiration')!.value);
  }

  private updateDateValidators(expiration: string): void {
    const startDate = this.form.get('startDate')!;
    const endDate   = this.form.get('endDate')!;

    if (expiration === 'custom') {
      startDate.setValidators(Validators.required);
      endDate.setValidators(Validators.required);
    } else {
      startDate.clearValidators();
      endDate.clearValidators();
    }

    startDate.updateValueAndValidity();
    endDate.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isCustomExpiration(): boolean {
    return this.form.get('expiration')?.value === 'custom';
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.dialogRef.close(this.form.getRawValue());
  }

  cancel(): void { this.dialogRef.close(); }
}
