import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DemoDialogComponent } from './demo-dialog/demo-dialog.component';
import { VehicleService, Vehicle } from './services/vehicle.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'forms';
  vehicles$: Observable<Vehicle[]>;
  displayedColumns: string[] = ['immatriculation', 'marque', 'modele', 'description', 'owner', 'actions'];

  constructor(
    private dialog: MatDialog,
    private vehicleService: VehicleService
  ) {
    this.vehicles$ = this.vehicleService.getVehicles();
  }

  ngOnInit(): void {}

  openDialog(): void {
    this.dialog.open(DemoDialogComponent, {
      width: '900px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      disableClose: false
    });
  }

  editVehicle(vehicle: Vehicle): void {
    this.dialog.open(DemoDialogComponent, {
      width: '900px',
      maxHeight: '92vh',
      panelClass: 'pro-dialog-panel',
      disableClose: false,
      data: vehicle
    });
  }
}
