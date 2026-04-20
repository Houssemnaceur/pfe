import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component/admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard.component/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'utilisateurs',
        loadComponent: () =>
          import('./utilisateurs.component/utilisateurs.component')
            .then(m => m.UtilisateursComponent)
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./roles.component/roles.component')
            .then(m => m.RolesComponent)
      },
      {
        path: 'profils',
        loadComponent: () =>
          import('./profils.component/profils.component')
            .then(m => m.ProfilsComponent)
      },
      {
        path: 'vues',
        loadComponent: () =>
          import('./vues.component/vues.component')
            .then(m => m.VuesComponent)
      },
      {
        path: 'magasins',
        loadComponent: () =>
          import('./magasins.component/magasins.component')
            .then(m => m.MagasinsComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];