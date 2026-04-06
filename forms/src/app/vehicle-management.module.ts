/**
 * VehicleManagementModule
 * -----------------------
 * Self-contained feature module for vehicle management.
 * Drop this into any Angular 13 + Angular Material 13 project:
 *
 *   1. Copy the entire src/app/ folder into your project.
 *   2. Install the one extra dependency:
 *        npm install ngx-color-picker
 *   3. In your AppModule:
 *        import { VehicleManagementModule } from './vehicle-management.module';
 *        imports: [ BrowserModule, BrowserAnimationsModule, VehicleManagementModule ]
 *   4. Add a route:
 *        { path: 'vehicles', component: VehicleListComponent }
 *   5. Make sure assets/  car images are in src/assets/.
 */

import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import localeFr from '@angular/common/locales/fr';

// ── Angular Material ─────────────────────────────────────────────────────────
import { MatCardModule }          from '@angular/material/card';
import { MatButtonModule }        from '@angular/material/button';
import { MatDialogModule }        from '@angular/material/dialog';
import { MatFormFieldModule }     from '@angular/material/form-field';
import { MatInputModule }         from '@angular/material/input';
import { MatIconModule }          from '@angular/material/icon';
import { MatTableModule }         from '@angular/material/table';
import { MatTabsModule }          from '@angular/material/tabs';
import { MatSelectModule, MAT_SELECT_CONFIG } from '@angular/material/select';
import { MatDatepickerModule }    from '@angular/material/datepicker';
import { MatNativeDateModule }    from '@angular/material/core';
import { MatSnackBarModule }      from '@angular/material/snack-bar';
import { MatTooltipModule }       from '@angular/material/tooltip';
import { MatCheckboxModule }      from '@angular/material/checkbox';
import { MatSlideToggleModule }   from '@angular/material/slide-toggle';
import { MatExpansionModule }     from '@angular/material/expansion';
import { MatButtonToggleModule }  from '@angular/material/button-toggle';
import { MatMenuModule }          from '@angular/material/menu';
import { MatRadioModule }         from '@angular/material/radio';

// ── Third-party ───────────────────────────────────────────────────────────────
import { ColorPickerModule } from 'ngx-color-picker';
/*
 * @angular-material-components/datetime-picker  (v7 → Angular 13)
 *
 * NgxMatTimepickerModule  → registers the <ngx-mat-timepicker> component and
 *                           the [ngxMatTimepicker] input directive.
 * NgxMatNativeDateModule  → provides the date adapter that makes the library
 *                           work with plain JS Date objects (no moment.js).
 */
import {
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';

// ── Components ────────────────────────────────────────────────────────────────
import { DemoDialogComponent }       from './demo-dialog/demo-dialog.component';
import { AddValueDialogComponent }   from './demo-dialog/components/add-value-dialog/add-value-dialog.component';
import { VehicleHeaderComponent }    from './demo-dialog/components/vehicle-header/vehicle-header.component';
import { ImportFileDialogComponent } from './demo-dialog/components/import-file-dialog/import-file-dialog.component';
import { VehicleListComponent }      from './vehicle-list/vehicle-list.component';
import { MaintenanceDialogComponent} from './maintenance/maintenance-dialog/maintenance-dialog.component';
import { RaportDialogComponent }     from './Reports/raport-dialog/raport-dialog.component';
import { AutoReportDialogComponent } from './Reports/auto-report-dialog/auto-report-dialog.component';
import { ConfirmDialogComponent }    from './shared/confirm-dialog.component';
import { PartageListComponent }          from './partage/partage-list/partage-list.component';
import { PartageDialogComponent }        from './partage/partage-dialog/partage-dialog.component';
import { PartageDetailsDialogComponent } from './partage/partage-details-dialog/partage-details-dialog.component';

// Group
import { GroupDialogComponent } from './groups/group-dialog/group-dialog.component';
import { VehicleSelectionDialogComponent } from './groups/vehicle-selection-dialog/vehicle-selection-dialog.component';
import { ReportListComponent } from './Reports/report-list/report-list.component';

registerLocaleData(localeFr);

const MATERIAL_MODULES = [
  MatCardModule,
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatTableModule,
  MatTabsModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatButtonToggleModule,
  MatMenuModule,
  MatRadioModule,
];

const FEATURE_COMPONENTS = [
  DemoDialogComponent,
  AddValueDialogComponent,
  VehicleHeaderComponent,
  ImportFileDialogComponent,
  VehicleListComponent,
  MaintenanceDialogComponent,
  RaportDialogComponent,
  AutoReportDialogComponent,
  ConfirmDialogComponent,
  PartageListComponent,
  PartageDialogComponent,
  PartageDetailsDialogComponent,
  GroupDialogComponent,
  VehicleSelectionDialogComponent,
  ReportListComponent,
];

@NgModule({
  declarations: FEATURE_COMPONENTS,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ...MATERIAL_MODULES,
    ColorPickerModule,
    NgxMatTimepickerModule,   // provides <ngx-mat-timepicker> component
    NgxMatNativeDateModule,   // provides native-Date adapter (no moment needed)
  ],
  exports: [
    VehicleListComponent,   // used in routing
    PartageListComponent,   // used in routing
    ReportListComponent,    // used in routing
    MatIconModule,          // used in AppComponent template
  ],
  providers: [
    { provide: MAT_SELECT_CONFIG, useValue: { disableOptionCentering: true } },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
})
export class VehicleManagementModule {}
