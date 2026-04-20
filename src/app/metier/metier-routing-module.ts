import { Routes } from '@angular/router';
import { MetierLayoutComponent } from './metier-layout.component';

export const metierRoutes: Routes = [
  {
    path: '',
    component: MetierLayoutComponent,
    children: [
      // Route dédiée directeur région
      {
        path: 'region',
        loadComponent: () =>
          import('./region-view.component/region-view.component')
            .then(m => m.RegionViewComponent)
      },
      // Route générique par magasin (kelibia, korba, nabeul...)
      {
        path: ':magasin',
        loadComponent: () =>
          import('./magasin-view.component/magasin-view.component')
            .then(m => m.MagasinViewComponent)
      },
      { path: '', redirectTo: 'gratuite', pathMatch: 'full' }
    ]
  }
];