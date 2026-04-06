import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Partage {
  id: string;
  designation: string;
  description: string;
  expiration: '30min' | '1h' | '3h' | '24h' | 'custom';
  expirationCustomDate?: Date | null;
  affectation: string;
  vehicules: string[];
  createdAt: Date;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class PartageService {

  private store = new BehaviorSubject<Partage[]>([]);
  partages$: Observable<Partage[]> = this.store.asObservable();

  getAll(): Partage[] {
    return this.store.getValue();
  }

  add(data: Omit<Partage, 'id' | 'createdAt' | 'isActive'>): void {
    const newPartage: Partage = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      isActive: true,
    };
    this.store.next([...this.store.getValue(), newPartage]);
  }

  update(id: string, data: Partial<Partage>): void {
    const updated = this.store.getValue().map(p =>
      p.id === id ? { ...p, ...data } : p
    );
    this.store.next(updated);
  }

  delete(id: string): void {
    this.store.next(this.store.getValue().filter(p => p.id !== id));
  }

  expirationLabel(p: Partage): string {
    const map: Record<string, string> = {
      '30min': '30 minutes', '1h': '1 heure',
      '3h': '3 heures', '24h': '24 heures',
    };
    if (p.expiration === 'custom' && p.expirationCustomDate) {
      return new Date(p.expirationCustomDate).toLocaleString('fr-FR');
    }
    return map[p.expiration] ?? p.expiration;
  }
}
