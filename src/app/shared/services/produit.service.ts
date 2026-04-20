import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produit } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/produits`;

  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  getByMagasin(magasinId: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/magasin/${magasinId}`);
  }

  getAlertes(magasinId: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/magasin/${magasinId}/alertes`);
  }

  getRuptures(magasinId: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/magasin/${magasinId}/ruptures`);
  }

  getStockTotal(magasinId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/magasin/${magasinId}/stock-total`);
  }

  create(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  update(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}