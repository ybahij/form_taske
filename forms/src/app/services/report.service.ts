import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ReportType {
  id: string;
  name: string;
}

export interface ReportCategory {
  categoryName: string;
  reports: ReportType[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private reportCategories: ReportCategory[] = [
    {
      categoryName: 'Trajets et Activité',
      reports: [
        { id: 't1', name: 'Rapport Détaillé des Trajets' },
        { id: 't2', name: 'Synthèse d\'Activité Quotidienne' },
        { id: 't3', name: 'Temps d\'Arrêt et Ralenti' },
        { id: 't4', name: 'Rapport de Comportement au Volant' },
        { id: 't5', name: 'Utilisation Hors Horaires' }
      ]
    },
    {
      categoryName: 'Maintenance et Flotte',
      reports: [
        { id: 'm1', name: 'Prochaines Révisions' },
        { id: 'm2', name: 'Historique des Interventions' },
        { id: 'm3', name: 'Coûts de Maintenance' },
        { id: 'm4', name: 'Analyse de la Consommation' },
        { id: 'm5', name: 'État Général du Parc' }
      ]
    },
    {
      categoryName: 'Événements et Alertes',
      reports: [
        { id: 'e1', name: 'Rapport des Excès de Vitesse' },
        { id: 'e2', name: 'Sorties de Zone (Geofencing)' },
        { id: 'e3', name: 'Déconnexions du Tracker' },
        { id: 'e4', name: 'Alertes de Carburant' },
        { id: 'e5', name: 'Rapport Global des Infractions' }
      ]
    }
  ];

  constructor() { }

  getReportCategories(): Observable<ReportCategory[]> {
    return of(this.reportCategories);
  }
}
