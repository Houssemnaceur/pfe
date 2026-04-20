import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StockMouvement } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/stocks`;

  getByMagasin(magasinId: number): Observable<StockMouvement[]> {
    return this.http.get<StockMouvement[]>(`${this.apiUrl}/magasin/${magasinId}`);
  }

  entree(mouvement: StockMouvement): Observable<StockMouvement> {
    return this.http.post<StockMouvement>(`${this.apiUrl}/entree`, mouvement);
  }

  transfert(mouvement: StockMouvement): Observable<StockMouvement> {
    return this.http.post<StockMouvement>(`${this.apiUrl}/transfert`, mouvement);
  }
}