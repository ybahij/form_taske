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

// ── Third-party ───────────────────────────────────────────────────────────────
import { ColorPickerModule } from 'ngx-color-picker';

// ── Components ────────────────────────────────────────────────────────────────
import { DemoDialogComponent }       from './demo-dialog/demo-dialog.component';
import { AddValueDialogComponent }   from './demo-dialog/components/add-value-dialog/add-value-dialog.component';
import { VehicleHeaderComponent }    from './demo-dialog/components/vehicle-header/vehicle-header.component';
import { ImportFileDialogComponent } from './demo-dialog/components/import-file-dialog/import-file-dialog.component';
import { VehicleListComponent }      from './vehicle-list/vehicle-list.component';
import { MaintenanceDialogComponent} from './maintenance/maintenance-dialog/maintenance-dialog.component';
import { RaportDialogComponent }     from './Reports/raport-dialog/raport-dialog.component';
import { ConfirmDialogComponent }    from './shared/confirm-dialog.component';

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
];

const FEATURE_COMPONENTS = [
  DemoDialogComponent,
  AddValueDialogComponent,
  VehicleHeaderComponent,
  ImportFileDialogComponent,
  VehicleListComponent,
  MaintenanceDialogComponent,
  RaportDialogComponent,
  ConfirmDialogComponent,
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
  ],
  exports: [
    VehicleListComponent,   // the entry-point component used in routing
    MatIconModule,          // used in AppComponent template
  ],
  providers: [
    { provide: MAT_SELECT_CONFIG, useValue: { disableOptionCentering: true } },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
})
export class VehicleManagementModule {}
