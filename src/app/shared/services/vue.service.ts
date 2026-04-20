import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vue } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class VueService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vues`;

  getAll(): Observable<Vue[]> {
    return this.http.get<Vue[]>(this.apiUrl);
  }

  getById(id: number): Observable<Vue> {
    return this.http.get<Vue>(`${this.apiUrl}/${id}`);
  }

  getByProfil(profilId: number): Observable<Vue[]> {
    return this.http.get<Vue[]>(`${this.apiUrl}/profil/${profilId}`);
  }

  create(vue: Vue): Observable<Vue> {
    return this.http.post<Vue>(this.apiUrl, vue);
  }

  update(id: number, vue: Vue): Observable<Vue> {
    return this.http.put<Vue>(`${this.apiUrl}/${id}`, vue);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}