import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, JwtResponse, CurrentUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl  = `${environment.apiUrl}/auth`;
  private vuesUrl = `${environment.apiUrl}/vues`;
  private readonly USER_KEY = 'current_user';

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.saveUser(response))
    );
  }

  private saveUser(response: JwtResponse): void {
    const user: CurrentUser = {
      token:    response.token,
      id:       response.id,
      email:    response.email,
      nom:      response.nom,
      prenom:   response.prenom,
      role:     response.role,
      profilId: response.profilId
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getCurrentUser(): CurrentUser | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return this.getCurrentUser()?.token || null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }

  getRole(): string {
    return this.getCurrentUser()?.role || '';
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/auth/login']);
  }

  redirectAfterLogin(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    const user = this.getCurrentUser();
    if (user?.profilId) {
      this.http.get<any[]>(`${this.vuesUrl}/profil/${user.profilId}`).subscribe({
        next: (vues) => {
          if (vues && vues.length > 0) {
            // Priorité 1 : vue /metier/region (directeur région)
            const regionVue = vues.find(v => v.url === '/metier/region');
            if (regionVue) {
              this.router.navigate(['/metier/region']);
              return;
            }
            // Priorité 2 : première vue assignée
            this.router.navigate([vues[0].url]);
          } else {
            this.router.navigate(['/metier/gratuite']);
          }
        },
        error: () => this.router.navigate(['/metier/gratuite'])
      });
    } else {
      this.router.navigate(['/metier/gratuite']);
    }
  }
}