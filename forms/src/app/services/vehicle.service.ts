import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Vehicle {
  description: string;
  marque: string;
  modele: string;
  immatriculation: string;
  idVehicule: string;
  activite: string;
  imei: string;
  odometreVirtuel: string;
  typeVehicule: string;
  statutEquipement: string;
  indexIgnition: string;
  nombreSieges: number;
  notesGenerales: string;
  isActive: boolean;
  imageUrl: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  notes?: string;
  // Administration fields
  dateSortie?: string;
  prixVehicule?: number;
  dureeLocation?: number;
  odometreSortie?: number;
  montantMensuel?: number;
  montantAvance?: number;
  // History and Icon customization
  historyColor?: string;
  customIcon?: string;
  sim1?: string;
  sim2?: string;
  capaciteCarburant?: number;
  economieCarburant?: number;
  repartitionReservoir?: string;
  profilReservoir?: string;
  coutCarburant?: number;
  lls1?: string;
  lls2?: string;
  isSameSchedule?: boolean;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
  monday_friday?: boolean;
  // Infraction Fields
  debutPlusTot?: string;
  finPlusTot?: string;
  debutNocturne?: string;
  debutPlusTard?: string;
  finPlusTard?: string;
  finNocturne?: string;
  // Max Infraction Fields
  distMaxJour?: number;
  seuilVitesse?: number;
  tempsTravailMax?: string;
  tempsConduiteMaxJour?: string;
  tempsConduiteContinueMax?: string;
  // G-Force Infraction Fields
  accelMaxG?: number;
  seuilFusionAccel?: string;
  seuilFusionFreinage?: string;
  // Eco Conduite Fields
  vitesseMaxEco?: number;
  seuilFusionVitesse?: string;
  ecoScoreMin?: number;
  seuilFusionEcoScore?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehiclesSubject = new BehaviorSubject<Vehicle[]>([
    {
      description: 'Véhicule de fonction',
      marque: 'Renault',
      modele: 'Clio',
      immatriculation: 'AA-123-BB',
      idVehicule: 'V001',
      activite: 'Transport',
      imei: '358941000123456',
      odometreVirtuel: '0',
      typeVehicule: 'Berline',
      statutEquipement: 'Actif',
      indexIgnition: '100',
      nombreSieges: 5,
      notesGenerales: 'R.A.S',
      isActive: true,
      imageUrl: 'assets/red_car.jpg',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    },
    {
      description: 'Liaison technique',
      marque: 'Peugeot',
      modele: '208',
      immatriculation: 'CC-456-DD',
      idVehicule: 'V002',
      activite: 'Maintenance',
      imei: '358941000654321',
      odometreVirtuel: '0',
      typeVehicule: 'Citadine',
      statutEquipement: 'Maintenance',
      indexIgnition: '50',
      nombreSieges: 2,
      notesGenerales: 'Vérifier freins',
      isActive: false,
      imageUrl: 'assets/red_car.jpg',
      firstName: 'Jane',
      lastName: 'Smith'
    }
  ]);

  getVehicles(): Observable<Vehicle[]> {
    return this.vehiclesSubject.asObservable();
  }

  addVehicle(vehicle: Vehicle): void {
    const currentVehicles = this.vehiclesSubject.value;
    this.vehiclesSubject.next([...currentVehicles, vehicle]);
  }

  updateVehicle(originalImmatriculation: string, updatedVehicle: Vehicle): void {
    const currentVehicles = this.vehiclesSubject.value;
    const index = currentVehicles.findIndex(v => v.immatriculation === originalImmatriculation);
    if (index !== -1) {
      const updatedList = [...currentVehicles];
      updatedList[index] = updatedVehicle;
      this.vehiclesSubject.next(updatedList);
    }
  }
}
