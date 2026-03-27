import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoDialogComponent } from './demo-dialog/demo-dialog.component';
import { AddValueDialogComponent } from './demo-dialog/components/add-value-dialog/add-value-dialog.component';
import { VehicleHeaderComponent } from './demo-dialog/components/vehicle-header/vehicle-header.component';
import { ImportFileDialogComponent } from './demo-dialog/components/import-file-dialog/import-file-dialog.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { MaintenanceDialogComponent } from './maintenance/maintenance-dialog/maintenance-dialog.component';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { RaportDialogComponent } from './Reports/raport-dialog/raport-dialog.component';


registerLocaleData(localeFr);

@NgModule({

  declarations: [
    AppComponent,
    DemoDialogComponent,
    AddValueDialogComponent,
    VehicleHeaderComponent,
    ImportFileDialogComponent,
    VehicleListComponent,
    MaintenanceDialogComponent,
    RaportDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
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
    MatCheckboxModule,
    MatSlideToggleModule,
    MatExpansionModule,
    FormsModule,
    ColorPickerModule
  ],
  providers: [
    { provide: MAT_SELECT_CONFIG, useValue:  { disableOptionCentering: true } },
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
