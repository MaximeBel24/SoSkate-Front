import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'spots',
    loadChildren: async () => (await import('./views/spots/spots.routes')).routes
  },
  {
    path: 'services',
    loadChildren: async () => (await import('./views/services/services.routes')).routes
  },
  {
    path: 'instructors',
    loadChildren: async () => (await import('./views/admin-instructors/admin-intructors.routes')).routes
  }
];
