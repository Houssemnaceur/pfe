import { Component, Input, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/auth.service';
import { VueService } from '../services/vue.service';
import { Vue } from '../models/app.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatListModule, MatIconModule,
    MatDividerModule, MatTooltipModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = true;

  private authService = inject(AuthService);
  private vueService = inject(VueService);

  user = this.authService.getCurrentUser();
  isAdmin = this.authService.isAdmin();

  // Menu admin fixe
  adminMenuItems = [
    { label: 'Dashboard',    icon: 'dashboard',            route: '/admin/dashboard' },
    { label: 'Utilisateurs', icon: 'people',               route: '/admin/utilisateurs' },
    { label: 'Rôles',        icon: 'admin_panel_settings', route: '/admin/roles' },
    { label: 'Profils',      icon: 'badge',                route: '/admin/profils' },
    { label: 'Vues',         icon: 'visibility',           route: '/admin/vues' },
    { label: 'Magasins',     icon: 'store',                route: '/admin/magasins' },
  ];

  // Menu directeur
  isRegion = signal(false);
  regionExpanded = signal(true);
  userMenuItems = signal<{ label: string; icon: string; route: string }[]>([]);
  magasinItems = signal<{ label: string; icon: string; route: string }[]>([]);

  ngOnInit() {
    if (!this.isAdmin && this.user?.profilId) {
      this.vueService.getByProfil(this.user.profilId).subscribe(vues => {

        const hasRegion = vues.some(v => v.url === '/metier/region');

        if (hasRegion) {
          // Directeur région — menu avec sous-items magasins
          this.isRegion.set(true);

          // Extraire les vues magasins (tout sauf /metier/region)
          const magasins = vues
            .filter(v => v.url.startsWith('/metier/') && v.url !== '/metier/region')
            .map(v => ({
              label: v.nom,
              icon: 'store',
              route: v.url
            }));

          this.magasinItems.set(magasins);

        } else {
          // Directeur ville — menu simple
          this.isRegion.set(false);
          const items = vues.map(v => ({
            label: v.nom,
            icon: this.getIconForVue(v.url),
            route: v.url
          }));
          this.userMenuItems.set(items);
        }
      });
    }
  }

  toggleRegion() {
    this.regionExpanded.set(!this.regionExpanded());
  }

  private getIconForVue(url: string): string {
    if (url.includes('dashboard')) return 'dashboard';
    if (url.includes('utilisateur')) return 'people';
    if (url.includes('region')) return 'map';
    if (url.includes('metier') || url.includes('magasin')) return 'store';
    return 'web';
  }
}