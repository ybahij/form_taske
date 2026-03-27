import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddValueDialogComponent } from './components/add-value-dialog/add-value-dialog.component';
import { ImportFileDialogComponent } from './components/import-file-dialog/import-file-dialog.component';
import { VehicleService, Vehicle } from '../services/vehicle.service';

@Component({
  selector: 'app-demo-dialog',
  templateUrl: './demo-dialog.component.html',
  styleUrls: ['./demo-dialog.component.css']
})
export class DemoDialogComponent implements OnInit {

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


  marqueOptions: string[] = ['Renault', 'Peugeot', 'Citroën'];
  modeleOptions: string[] = ['Clio', '208', 'C3'];
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

  hourOptions: string[] = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minuteOptions: string[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  secondOptions: string[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DemoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle,
    private vehicleService: VehicleService,
    private dialog: MatDialog
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

    this.infractionForm = this.fb.group({
      debutPlusTotH: ['07', Validators.required], debutPlusTotM: ['00', Validators.required],
      finPlusTotH: ['16', Validators.required], finPlusTotM: ['00', Validators.required],
      debutNocturneH: ['22', Validators.required], debutNocturneM: ['00', Validators.required],
      debutPlusTardH: ['09', Validators.required], debutPlusTardM: ['00', Validators.required],
      finPlusTardH: ['18', Validators.required], finPlusTardM: ['00', Validators.required],
      finNocturneH: ['06', Validators.required], finNocturneM: ['00', Validators.required]
    });

    this.infractionMaxForm = this.fb.group({
      distMaxJour: [-1],
      seuilVitesse: [null, [Validators.min(0)]],
      tempsTravailH: ['08', Validators.required], tempsTravailM: ['00', Validators.required],
      tempsConduiteH: ['09', Validators.required], tempsConduiteM: ['00', Validators.required],
      tempsContinueH: ['04', Validators.required], tempsContinueM: ['30', Validators.required]
    });

    this.infractionGForm = this.fb.group({
      accelMaxG: [0.3],
      fusionAccelH: ['00', Validators.required], fusionAccelM: ['03', Validators.required],
      fusionFreinageH: ['00', Validators.required], fusionFreinageM: ['03', Validators.required]
    });

    this.infractionEcoForm = this.fb.group({
      vitesseMaxEco: [-1],
      vitesseFusionH: ['00', Validators.required], vitesseFusionM: ['00', Validators.required], vitesseFusionS: ['10', Validators.required],
      ecoScoreMin: [-1],
      ecoScoreFusionH: ['00', Validators.required], ecoScoreFusionM: ['00', Validators.required], ecoScoreFusionS: ['10', Validators.required]
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
      
      if (this.data.tempsTravailMax) {
        const [h, m] = this.data.tempsTravailMax.split(':');
        this.infractionMaxForm.patchValue({ tempsTravailH: h, tempsTravailM: m });
      }
      if (this.data.tempsConduiteMaxJour) {
        const [h, m] = this.data.tempsConduiteMaxJour.split(':');
        this.infractionMaxForm.patchValue({ tempsConduiteH: h, tempsConduiteM: m });
      }
      if (this.data.tempsConduiteContinueMax) {
        const [h, m] = this.data.tempsConduiteContinueMax.split(':');
        this.infractionMaxForm.patchValue({ tempsContinueH: h, tempsContinueM: m });
      }

      if (this.data.seuilFusionAccel) {
        const [h, m] = this.data.seuilFusionAccel.split(':');
        this.infractionGForm.patchValue({ fusionAccelH: h, fusionAccelM: m });
      }
      if (this.data.seuilFusionFreinage) {
        const [h, m] = this.data.seuilFusionFreinage.split(':');
        this.infractionGForm.patchValue({ fusionFreinageH: h, fusionFreinageM: m });
      }

      if (this.data.seuilFusionVitesse) {
        const [h, m, s] = this.data.seuilFusionVitesse.split(':');
        this.infractionEcoForm.patchValue({ vitesseFusionH: h, vitesseFusionM: m, vitesseFusionS: s || '00' });
      }
      if (this.data.seuilFusionEcoScore) {
        const [h, m, s] = this.data.seuilFusionEcoScore.split(':');
        this.infractionEcoForm.patchValue({ ecoScoreFusionH: h, ecoScoreFusionM: m, ecoScoreFusionS: s || '00' });
      }


      // Parse time strings back to H/M controls
      if (this.data.debutPlusTot) {
        const [h, m] = this.data.debutPlusTot.split(':');
        this.infractionForm.patchValue({ debutPlusTotH: h, debutPlusTotM: m });
      }
      if (this.data.finPlusTot) {
        const [h, m] = this.data.finPlusTot.split(':');
        this.infractionForm.patchValue({ finPlusTotH: h, finPlusTotM: m });
      }
      if (this.data.debutNocturne) {
        const [h, m] = this.data.debutNocturne.split(':');
        this.infractionForm.patchValue({ debutNocturneH: h, debutNocturneM: m });
      }
      if (this.data.debutPlusTard) {
        const [h, m] = this.data.debutPlusTard.split(':');
        this.infractionForm.patchValue({ debutPlusTardH: h, debutPlusTardM: m });
      }
      if (this.data.finPlusTard) {
        const [h, m] = this.data.finPlusTard.split(':');
        this.infractionForm.patchValue({ finPlusTardH: h, finPlusTardM: m });
      }
      if (this.data.finNocturne) {
        const [h, m] = this.data.finNocturne.split(':');
        this.infractionForm.patchValue({ finNocturneH: h, finNocturneM: m });
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
    if (this.infractionForm.valid || this.infractionMaxForm.valid || this.infractionGForm.valid || this.infractionEcoForm.valid) {
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
      vitesseMaxEco: f.vitesseMaxEco,
      seuilFusionVitesse: `${f.vitesseFusionH}:${f.vitesseFusionM}:${f.vitesseFusionS}`,
      ecoScoreMin: f.ecoScoreMin,
      seuilFusionEcoScore: `${f.ecoScoreFusionH}:${f.ecoScoreFusionM}:${f.ecoScoreFusionS}`
    };
  }

  private getCombinedGForceLimits(): any {
    const f = this.infractionGForm.getRawValue();
    return {
      accelMaxG: f.accelMaxG,
      seuilFusionAccel: `${f.fusionAccelH}:${f.fusionAccelM}`,
      seuilFusionFreinage: `${f.fusionFreinageH}:${f.fusionFreinageM}`
    };
  }


  private getCombinedMaxLimits(): any {
    const f = this.infractionMaxForm.getRawValue();
    return {
      distMaxJour: f.distMaxJour,
      seuilVitesse: f.seuilVitesse,
      tempsTravailMax: `${f.tempsTravailH}:${f.tempsTravailM}`,
      tempsConduiteMaxJour: `${f.tempsConduiteH}:${f.tempsConduiteM}`,
      tempsConduiteContinueMax: `${f.tempsContinueH}:${f.tempsContinueM}`
    };
  }

  private getCombinedInfractions(): any {
    const f = this.infractionForm.getRawValue();
    return {
      debutPlusTot: `${f.debutPlusTotH}:${f.debutPlusTotM}`,
      finPlusTot: `${f.finPlusTotH}:${f.finPlusTotM}`,
      debutNocturne: `${f.debutNocturneH}:${f.debutNocturneM}`,
      debutPlusTard: `${f.debutPlusTardH}:${f.debutPlusTardM}`,
      finPlusTard: `${f.finPlusTardH}:${f.finPlusTardM}`,
      finNocturne: `${f.finNocturneH}:${f.finNocturneM}`
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

    dialogRef.afterClosed().subscribe(result => {
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
      // Transition to edit mode for subsequent saves in the same session
      this.isEdit = true;
    }
    this.data = updatedVehicle;
    this.dialogRef.close(updatedVehicle);
  }


  openAddValueDialog(type: 'Marque' | 'Modéle' | 'Activité'): void {
    const dialogRef = this.dialog.open(AddValueDialogComponent, {
      width: '400px',
      data: { title: `Ajouter ${type}` }
    });

    dialogRef.afterClosed().subscribe(result => {
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
        // Important: transition to EDIT mode so next tabs click don't create duplicates
        this.isEdit = true;
      }
      this.data = updatedVehicle;
      // Note: we don't close the dialog here to allow switching tabs
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  isCurrentTabValid(): boolean {
    switch (this.activeTabIndex) {
      case 0: return this.form.valid;
      case 1: return this.adminForm.valid;
      case 2: return this.colorIconForm.valid;
      case 3: return this.simForm.valid;
      case 4: return this.fuelForm.valid;
      case 5: return this.workHoursForm.valid;
      case 6: return this.infractionForm.valid || this.infractionMaxForm.valid || 
                     this.infractionGForm.valid || this.infractionEcoForm.valid;
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

