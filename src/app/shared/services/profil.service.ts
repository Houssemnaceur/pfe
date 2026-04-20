import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profil } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class ProfilService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profils`;

  getAll(): Observable<Profil[]> {
    return this.http.get<Profil[]>(this.apiUrl);
  }

  getById(id: number): Observable<Profil> {
    return this.http.get<Profil>(`${this.apiUrl}/${id}`);
  }

  create(profil: Profil): Observable<Profil> {
    return this.http.post<Profil>(this.apiUrl, profil);
  }

  update(id: number, profil: Profil): Observable<Profil> {
    return this.http.put<Profil>(`${this.apiUrl}/${id}`, profil);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  associerVues(profilId: number, vueIds: number[]): Observable<Profil> {
    return this.http.put<Profil>(`${this.apiUrl}/${profilId}/vues`, vueIds);
  }
}