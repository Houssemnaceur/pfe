import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-gratuite',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div style="padding:32px">
      <h2>Module GRATUITE</h2>
      <p>Bienvenue {{ user?.prenom }} {{ user?.nom }}</p>
      <button mat-raised-button color="warn" (click)="logout()">
        Se déconnecter
      </button>
    </div>
  `
})
export class GratuiteComponent {
  private authService = inject(AuthService);
  user = this.authService.getCurrentUser();
  logout() { this.authService.logout(); }
}