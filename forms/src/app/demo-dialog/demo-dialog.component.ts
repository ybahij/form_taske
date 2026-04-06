import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddValueDialogComponent } from './components/add-value-dialog/add-value-dialog.component';
import { ImportFileDialogComponent } from './components/import-file-dialog/import-file-dialog.component';
import { VehicleService, Vehicle } from '../services/vehicle.service';

@Component({
  selector: 'app-demo-dialog',
  templateUrl: './demo-dialog.component.html',
  styleUrls: ['./demo-dialog.component.css']
})
export class DemoDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;
  adminForm: FormGroup;
  colorIconForm: FormGroup;
  simForm: FormGroup;
  fuelForm: FormGroup;
  workHoursForm: FormGroup;
  infractionForm: FormGroup;
  infractionMaxForm: FormGroup;
  infractionGForm!: FormGroup;
  infractionEcoForm!: FormGroup;
  activeTabIndex: number = 0;
  isEdit: boolean;
  private destroy$ = new Subject<void>();


  vehicleTypes: string[] = ['Berline', 'SUV', 'Utilitaire', 'Camion', 'Moto', 'Autre'];
  equipmentStatuses: string[] = ['Actif', 'Maintenance', 'HORS SERVICE', 'En Attente'];
  ignitionIndices: string[] = ['0', '50', '100', '150', '200'];
  historyColors: string[] = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'];
  customIcons: any[] = [
    { value: 'assets/balck_car.png', label: 'Voiture Noire' },
    { value: 'assets/bleu_car.png', label: 'Voiture Bleue' },
    { value: 'assets/gray_car.png', label: 'Voiture Grise' },
    { value: 'assets/grean_car.png', label: 'Voiture Verte' },
    { value: 'assets/ornge_car.png', label: 'Voiture Orange' },
    { value: 'assets/red_car.jpg', label: 'Voiture Rouge' },
    { value: 'assets/sky_car.png', label: 'Voiture Ciel' },
    { value: 'assets/yallow_car.png', label: 'Voiture Jaune' }
  ];

  repartitionOptions: string[] = ['Standard', 'Double Réservoir', 'Personnalisé'];
  profilOptions: string[] = ['Urbain', 'Routier', 'Mixte', 'Off-road'];

  /*
   * timeToDate  — builds a Date whose H/M/S match the stored "HH:MM" or
   *               "HH:MM:SS" string so the timepicker shows the right value.
   *               The calendar date portion is irrelevant; only the time part
   *               is read by ngx-mat-timepicker.
   */
  private timeToDate(h: string, m: string, s = '00'): Date {
    const d = new Date();
    d.setHours(+h, +m, +s, 0);
    return d;
  }

  /*
   * dateToTimeStr  — extracts HH:MM (or HH:MM:SS when withSeconds=true) from
   *                  a Date object so it can be stored / sent to the API as a
   *                  plain string, just like before.
   */
  private dateToTimeStr(d: Date | null, withSeconds = false): string {
    if (!d) { return withSeconds ? '00:00:00' : '00:00'; }
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    if (withSeconds) {
      const ss = d.getSeconds().toString().padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    }
    return `${hh}:${mm}`;
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DemoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle,
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      description: ['', Validators.required],
      marque: [''],
      modele: [''],
      immatriculation: ['', Validators.required],
      idVehicule: [''],
      activite: [''],
      imei: ['', [Validators.pattern('^[0-9]*$')]],
      odometreVirtuel: [''],
      typeVehicule: [''],
      statutEquipement: [''],
      indexIgnition: [''],
      nombreSieges: [null, [Validators.min(0)]],
      notesGenerales: [''],
      isActive: [true],
      imageUrl: ['assets/red_car.jpg'],
      firstName: [''],
      lastName:  [''],
      email:     ['', [Validators.email]],
      phone:     [''],
      city:      [''],
      notes:     ['']
    });

    this.adminForm = this.fb.group({
      dateSortie: [null, Validators.required],
      prixVehicule: [null, [Validators.min(0)]],
      dureeLocation: [null, [Validators.min(0)]],
      odometreSortie: [null, [Validators.min(0)]],
      montantMensuel: [null, [Validators.min(0)]],
      montantAvance: [null, [Validators.min(0)]]
    });

    this.colorIconForm = this.fb.group({
      historyColor: ['#3b82f6'],
      customIcon: ['directions_car']
    });

    this.simForm = this.fb.group({
      sim1: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(14)]],
      sim2: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(14)]]
    });

    this.fuelForm = this.fb.group({
      capaciteCarburant: [null, [Validators.min(0)]],
      economieCarburant: [null, [Validators.min(0)]],
      repartitionReservoir: ['Standard'],
      profilReservoir: ['Mixte'],
      coutCarburant: [null, [Validators.min(0)]],
      lls1: ['Non importé'],
      lls2: ['Non importé']
    });

    this.workHoursForm = this.fb.group({
      isSameSchedule: [false],
      monday: [true],
      tuesday: [true],
      wednesday: [true],
      thursday: [true],
      friday: [true],
      saturday: [false],
      sunday: [false],
      monday_friday: [true]
    });

    // Each time field is now a single Date control.
    // ngx-mat-timepicker reads/writes Date; only H/M(/S) matter — date part is ignored.
    this.infractionForm = this.fb.group({
      debutPlusTot:  [this.timeToDate('07', '00'), Validators.required],
      finPlusTot:    [this.timeToDate('16', '00'), Validators.required],
      debutNocturne: [this.timeToDate('22', '00'), Validators.required],
      debutPlusTard: [this.timeToDate('09', '00'), Validators.required],
      finPlusTard:   [this.timeToDate('18', '00'), Validators.required],
      finNocturne:   [this.timeToDate('06', '00'), Validators.required],
    });

    this.infractionMaxForm = this.fb.group({
      distMaxJour:   [-1],
      seuilVitesse:  [null, [Validators.min(0)]],
      tempsTravail:  [this.timeToDate('08', '00'), Validators.required],
      tempsConduite: [this.timeToDate('09', '00'), Validators.required],
      tempsContinue: [this.timeToDate('04', '30'), Validators.required],
    });

    this.infractionGForm = this.fb.group({
      accelMaxG:     [0.3],
      fusionAccel:   [this.timeToDate('00', '03'), Validators.required],
      fusionFreinage:[this.timeToDate('00', '03'), Validators.required],
    });

    // vitesseFusion & ecoScoreFusion include seconds → timeToDate('HH','MM','SS')
    this.infractionEcoForm = this.fb.group({
      vitesseMaxEco:  [-1],
      vitesseFusion:  [this.timeToDate('00', '00', '10'), Validators.required],
      ecoScoreMin:    [-1],
      ecoScoreFusion: [this.timeToDate('00', '00', '10'), Validators.required],
    });
  }


  ngOnInit(): void {
    if (this.isEdit && this.data) {
      this.form.patchValue(this.data);
      this.adminForm.patchValue(this.data);
      this.colorIconForm.patchValue(this.data);
      this.simForm.patchValue(this.data);
      this.fuelForm.patchValue(this.data);
      this.workHoursForm.patchValue(this.data);
      this.infractionMaxForm.patchValue({
        distMaxJour: this.data.distMaxJour,
        seuilVitesse: this.data.seuilVitesse
      });
      this.infractionGForm.patchValue({
        accelMaxG: this.data.accelMaxG
      });
      this.infractionEcoForm.patchValue({
        vitesseMaxEco: this.data.vitesseMaxEco,
        ecoScoreMin: this.data.ecoScoreMin
      });
      
      // infractionMaxForm — convert stored "HH:MM" strings → Date objects
      if (this.data.tempsTravailMax) {
        const [h, m] = this.data.tempsTravailMax.split(':');
        this.infractionMaxForm.patchValue({ tempsTravail: this.timeToDate(h, m) });
      }
      if (this.data.tempsConduiteMaxJour) {
        const [h, m] = this.data.tempsConduiteMaxJour.split(':');
        this.infractionMaxForm.patchValue({ tempsConduite: this.timeToDate(h, m) });
      }
      if (this.data.tempsConduiteContinueMax) {
        const [h, m] = this.data.tempsConduiteContinueMax.split(':');
        this.infractionMaxForm.patchValue({ tempsContinue: this.timeToDate(h, m) });
      }

      // infractionGForm — convert stored "HH:MM" strings → Date objects
      if (this.data.seuilFusionAccel) {
        const [h, m] = this.data.seuilFusionAccel.split(':');
        this.infractionGForm.patchValue({ fusionAccel: this.timeToDate(h, m) });
      }
      if (this.data.seuilFusionFreinage) {
        const [h, m] = this.data.seuilFusionFreinage.split(':');
        this.infractionGForm.patchValue({ fusionFreinage: this.timeToDate(h, m) });
      }

      // infractionEcoForm — convert stored "HH:MM:SS" strings → Date objects
      if (this.data.seuilFusionVitesse) {
        const [h, m, s] = this.data.seuilFusionVitesse.split(':');
        this.infractionEcoForm.patchValue({ vitesseFusion: this.timeToDate(h, m, s || '00') });
      }
      if (this.data.seuilFusionEcoScore) {
        const [h, m, s] = this.data.seuilFusionEcoScore.split(':');
        this.infractionEcoForm.patchValue({ ecoScoreFusion: this.timeToDate(h, m, s || '00') });
      }

      // infractionForm — convert stored "HH:MM" strings → Date objects
      if (this.data.debutPlusTot) {
        const [h, m] = this.data.debutPlusTot.split(':');
        this.infractionForm.patchValue({ debutPlusTot: this.timeToDate(h, m) });
      }
      if (this.data.finPlusTot) {
        const [h, m] = this.data.finPlusTot.split(':');
        this.infractionForm.patchValue({ finPlusTot: this.timeToDate(h, m) });
      }
      if (this.data.debutNocturne) {
        const [h, m] = this.data.debutNocturne.split(':');
        this.infractionForm.patchValue({ debutNocturne: this.timeToDate(h, m) });
      }
      if (this.data.debutPlusTard) {
        const [h, m] = this.data.debutPlusTard.split(':');
        this.infractionForm.patchValue({ debutPlusTard: this.timeToDate(h, m) });
      }
      if (this.data.finPlusTard) {
        const [h, m] = this.data.finPlusTard.split(':');
        this.infractionForm.patchValue({ finPlusTard: this.timeToDate(h, m) });
      }
      if (this.data.finNocturne) {
        const [h, m] = this.data.finNocturne.split(':');
        this.infractionForm.patchValue({ finNocturne: this.timeToDate(h, m) });
      }
    }
  }

  selectIcon(value: string): void {
    this.colorIconForm.get('customIcon')?.setValue(value);
    this.colorIconForm.get('customIcon')?.markAsDirty();
  }

  saveAdmin(): void {
    if (this.adminForm.valid) {
      this.saveFullVehicle(this.adminForm.getRawValue());
    }
  }

  saveColorIcon(): void {
    if (this.colorIconForm.valid) {
      this.saveFullVehicle(this.colorIconForm.getRawValue());
    }
  }

  saveSim(): void {
    if (this.simForm.valid) {
      this.saveFullVehicle(this.simForm.getRawValue());
    }
  }

  saveFuel(): void {
    if (this.fuelForm.valid) {
      this.saveFullVehicle(this.fuelForm.getRawValue());
    }
  }

  saveWorkHours(): void {
    if (this.workHoursForm.valid) {
      this.saveFullVehicle(this.workHoursForm.getRawValue());
    }
  }

  saveInfraction(): void {
    if (this.infractionForm.valid && this.infractionMaxForm.valid && this.infractionGForm.valid && this.infractionEcoForm.valid) {
      const combinedData = {
        ...this.getCombinedInfractions(),
        ...this.getCombinedMaxLimits(),
        ...this.getCombinedGForceLimits(),
        ...this.getCombinedEcoLimits()
      };
      this.saveFullVehicle(combinedData);
    }
  }

  private getCombinedEcoLimits(): any {
    const f = this.infractionEcoForm.getRawValue();
    return {
      vitesseMaxEco:       f.vitesseMaxEco,
      // withSeconds=true → produces "HH:MM:SS"
      seuilFusionVitesse:  this.dateToTimeStr(f.vitesseFusion,  true),
      ecoScoreMin:         f.ecoScoreMin,
      seuilFusionEcoScore: this.dateToTimeStr(f.ecoScoreFusion, true),
    };
  }

  private getCombinedGForceLimits(): any {
    const f = this.infractionGForm.getRawValue();
    return {
      accelMaxG:           f.accelMaxG,
      seuilFusionAccel:    this.dateToTimeStr(f.fusionAccel),
      seuilFusionFreinage: this.dateToTimeStr(f.fusionFreinage),
    };
  }

  private getCombinedMaxLimits(): any {
    const f = this.infractionMaxForm.getRawValue();
    return {
      distMaxJour:              f.distMaxJour,
      seuilVitesse:             f.seuilVitesse,
      tempsTravailMax:          this.dateToTimeStr(f.tempsTravail),
      tempsConduiteMaxJour:     this.dateToTimeStr(f.tempsConduite),
      tempsConduiteContinueMax: this.dateToTimeStr(f.tempsContinue),
    };
  }

  private getCombinedInfractions(): any {
    const f = this.infractionForm.getRawValue();
    return {
      debutPlusTot:  this.dateToTimeStr(f.debutPlusTot),
      finPlusTot:    this.dateToTimeStr(f.finPlusTot),
      debutNocturne: this.dateToTimeStr(f.debutNocturne),
      debutPlusTard: this.dateToTimeStr(f.debutPlusTard),
      finPlusTard:   this.dateToTimeStr(f.finPlusTard),
      finNocturne:   this.dateToTimeStr(f.finNocturne),
    };
  }

  private getUpdatedVehicleData(extraValues: any = {}): Vehicle {
    const combinedInfractions = this.getCombinedInfractions();
    const combinedMaxLimits = this.getCombinedMaxLimits();
    const combinedGForceLimits = this.getCombinedGForceLimits();
    const combinedEcoLimits = this.getCombinedEcoLimits();
    
    return { 
      ...this.data, 
      ...this.form.getRawValue(), 
      ...this.adminForm.getRawValue(), 
      ...this.colorIconForm.getRawValue(),
      ...this.simForm.getRawValue(),
      ...this.fuelForm.getRawValue(),
      ...this.workHoursForm.getRawValue(),
      ...combinedMaxLimits,
      ...combinedInfractions,
      ...combinedGForceLimits,
      ...combinedEcoLimits,
      ...extraValues 
    };
  }

  openImportDialog(field: 'lls1' | 'lls2'): void {
    const dialogRef = this.dialog.open(ImportFileDialogComponent, {
      width: '800px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.fuelForm.patchValue({ [field]: result.fileName });
      }
    });
  }

  private saveFullVehicle(extraData: any): void {
    const updatedVehicle = this.getUpdatedVehicleData(extraData);

    if (this.isEdit) {
      this.vehicleService.updateVehicle(this.data.immatriculation, updatedVehicle);
    } else {
      this.vehicleService.addVehicle(updatedVehicle);
      this.isEdit = true;
    }
    this.data = updatedVehicle;
    this.snackBar.open('Enregistré avec succès', 'OK', { duration: 2500, panelClass: ['snack-success'], horizontalPosition: 'right', verticalPosition: 'bottom' });
  }


  openAddValueDialog(type: 'Marque' | 'Modéle' | 'Activité'): void {
    const dialogRef = this.dialog.open(AddValueDialogComponent, {
      width: '400px',
      data: { title: `Ajouter ${type}` }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        if (type === 'Marque') this.form.patchValue({ marque: result });
        if (type === 'Modéle') this.form.patchValue({ modele: result });
        if (type === 'Activité') this.form.patchValue({ activite: result });
      }
    });
  }

  save() {
    if (this.form.valid) {
      const updatedVehicle = this.getUpdatedVehicleData();
      if (this.isEdit) {
        this.vehicleService.updateVehicle(this.data.immatriculation, updatedVehicle);
      } else {
        this.vehicleService.addVehicle(updatedVehicle);
        this.isEdit = true;
      }
      this.data = updatedVehicle;
      this.snackBar.open('Enregistré avec succès', 'OK', { duration: 2500, panelClass: ['snack-success'], horizontalPosition: 'right', verticalPosition: 'bottom' });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isCurrentTabValid(): boolean {
    switch (this.activeTabIndex) {
      case 0: return this.form.valid;
      case 1: return this.adminForm.valid;
      case 2: return this.colorIconForm.valid;
      case 3: return this.simForm.valid;
      case 4: return this.fuelForm.valid;
      case 5: return this.workHoursForm.valid;
      case 6: return this.infractionForm.valid && this.infractionMaxForm.valid &&
                     this.infractionGForm.valid && this.infractionEcoForm.valid;
      default: return true;
    }
  }

  saveCurrentTab(): void {
    switch (this.activeTabIndex) {
      case 0: this.save(); break;
      case 1: this.saveAdmin(); break;
      case 2: this.saveColorIcon(); break;
      case 3: this.saveSim(); break;
      case 4: this.saveFuel(); break;
      case 5: this.saveWorkHours(); break;
      case 6: this.saveInfraction(); break;
    }
  }
}

