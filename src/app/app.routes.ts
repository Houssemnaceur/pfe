import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';
import { adminGuard } from './shared/guards/admin-guard';

export const routes: Routes = [
  // Redirection par défaut
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Auth (public)
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () =>
          import('./auth/login.component/login.component').then(m => m.LoginComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Admin (ADMIN uniquement)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./admin/admin-routing-module').then(m => m.adminRoutes)
  },

  // Métier (tout utilisateur connecté)
  {
    path: 'metier',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./metier/metier-routing-module').then(m => m.metierRoutes)
  },

  { path: '**', redirectTo: '/auth/login' }
];