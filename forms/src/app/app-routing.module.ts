import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { PartageListComponent } from './partage/partage-list/partage-list.component';
import { ReportListComponent } from './Reports/report-list/report-list.component';

const routes: Routes = [
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'partage',  component: PartageListComponent },
  { path: 'reports',  component: ReportListComponent },
  { path: '', redirectTo: '/vehicles', pathMatch: 'full' },
  { path: '**', redirectTo: '/vehicles' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
