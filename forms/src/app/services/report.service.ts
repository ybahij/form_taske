import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface ReportType {
  id: string;
  name: string;
}

export interface ReportCategory {
  categoryName: string;
  reports: ReportType[];
}

export interface SavedReport {
  id: string;
  baseReportName: string;
  descriptionOfReport?: string;
  shareWithUsers?: string;
  drivingOutsideCountry?: string;
  listOfColumns?: string;
  createdAt: Date;
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

  private savedReportsSubject = new BehaviorSubject<SavedReport[]>([]);
  savedReports$ = this.savedReportsSubject.asObservable();

  getReportCategories(): Observable<ReportCategory[]> {
    return of(this.reportCategories);
  }

  addSavedReport(data: Partial<SavedReport>): void {
    const report: SavedReport = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      baseReportName: data.baseReportName || '',
      descriptionOfReport: data.descriptionOfReport,
      shareWithUsers: data.shareWithUsers,
      drivingOutsideCountry: data.drivingOutsideCountry,
      listOfColumns: data.listOfColumns,
      createdAt: new Date()
    };
    this.savedReportsSubject.next([report, ...this.savedReportsSubject.value]);
  }

  updateSavedReport(id: string, data: Partial<SavedReport>): void {
    const updated = this.savedReportsSubject.value.map(r =>
      r.id === id ? { ...r, ...data } : r
    );
    this.savedReportsSubject.next(updated);
  }

  deleteSavedReport(id: string): void {
    this.savedReportsSubject.next(
      this.savedReportsSubject.value.filter(r => r.id !== id)
    );
  }
}
