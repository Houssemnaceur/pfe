import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../shared/services/auth.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { RoleService } from '../../shared/services/role.service';
import { ProfilService } from '../../shared/services/profil.service';
import { MagasinService } from '../../shared/services/magasin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private utilisateurService = inject(UtilisateurService);
  private roleService = inject(RoleService);
  private profilService = inject(ProfilService);
  private magasinService = inject(MagasinService);

  user = this.authService.getCurrentUser();

  // Signals — détection automatique dans Angular 21 zoneless
  nbUtilisateurs = signal(0);
  nbRoles        = signal(0);
  nbProfils      = signal(0);
  nbMagasins     = signal(0);

  quickLinks = [
    { label: 'Utilisateurs', icon: 'people',               route: '/admin/utilisateurs', color: '#e30613' },
    { label: 'Rôles',        icon: 'admin_panel_settings', route: '/admin/roles',        color: '#1565c0' },
    { label: 'Profils',      icon: 'badge',                route: '/admin/profils',      color: '#2e7d32' },
    { label: 'Vues',         icon: 'visibility',           route: '/admin/vues',         color: '#6a1b9a' },
    { label: 'Magasins',     icon: 'store',                route: '/admin/magasins',     color: '#e65100' },
    { label: 'Import Excel', icon: 'upload_file',          route: '/metier/gratuite',    color: '#00838f' },
  ];

  ngOnInit() {
    this.utilisateurService.getAll().subscribe(d => this.nbUtilisateurs.set(d.length));
    this.roleService.getAll().subscribe(d => this.nbRoles.set(d.length));
    this.profilService.getAll().subscribe(d => this.nbProfils.set(d.length));
    this.magasinService.getAll().subscribe(d => this.nbMagasins.set(d.length));
  }
}