import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vente, KpiMagasin } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class VenteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ventes`;

  getByMagasin(magasinId: number): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${this.apiUrl}/magasin/${magasinId}`);
  }

  getKpi(magasinId: number): Observable<KpiMagasin> {
    return this.http.get<KpiMagasin>(`${this.apiUrl}/magasin/${magasinId}/kpi`);
  }

  getTopProduits(magasinId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/magasin/${magasinId}/top-produits`);
  }

  create(vente: Vente): Observable<Vente> {
    return this.http.post<Vente>(this.apiUrl, vente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}