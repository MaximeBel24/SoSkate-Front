import { Routes } from '@angular/router';
import {LayoutComponent} from './components/layout/layout/layout.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {authGuard} from './shared/guards/auth.guard'
import {guestGuard} from './shared/guards/guest.guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
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
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }
    ]
  }


];
