import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FichierImport, LigneFichier } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class FichierService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/fichiers`;
  private lignesUrl = `${environment.apiUrl}/lignes`;

  // Importer un fichier Excel
  importer(file: File, utilisateurId: number): Observable<FichierImport> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('utilisateurId', utilisateurId.toString());
    return this.http.post<FichierImport>(`${this.apiUrl}/importer`, formData);
  }

  // Historique des fichiers d'un utilisateur
  getByUtilisateur(utilisateurId: number): Observable<FichierImport[]> {
    return this.http.get<FichierImport[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }

  // Lignes en erreur d'un fichier
  getErreurs(fichierId: number): Observable<LigneFichier[]> {
    return this.http.get<LigneFichier[]>(`${this.lignesUrl}/fichier/${fichierId}/erreurs`);
  }

  // Lignes valides d'un fichier
  getValides(fichierId: number): Observable<LigneFichier[]> {
    return this.http.get<LigneFichier[]>(`${this.lignesUrl}/fichier/${fichierId}/valides`);
  }

  // Télécharger le fichier final
  telecharger(fichierId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${fichierId}/telecharger`, {
      responseType: 'blob'
    });
  }
}