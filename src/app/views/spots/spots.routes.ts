import {Routes} from '@angular/router';
import {SpotsComponent} from './spots.component';
import {SpotsListComponent} from './components/spots-list/spots-list.component';
import {SpotsFormComponent} from './components/spots-form/spots-form.component';

export const routes: Routes = [
  {
    path: '',
    component: SpotsComponent,
    title: 'Gestions des spots',
    children: [
      {
        path: 'list',
        component: SpotsListComponent
      },
      {
        path: 'new',
        component: SpotsFormComponent,
        title: 'Création d\'un spot'
      },
      {
        path: ':spotId/edit',
        component: SpotsFormComponent,
        title: "Mis à jour d'un spot"
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
]
