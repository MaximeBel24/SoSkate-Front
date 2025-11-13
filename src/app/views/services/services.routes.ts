import {Routes} from '@angular/router';
import {ServicesComponent} from './services.component';
import {ServicesListComponent} from './components/services-list/services-list.component';
import {ServicesFormComponent} from './components/services-form/services-form.component';

export const routes: Routes = [
  {
    path: '',
    component: ServicesComponent,
    title: 'Gestions des prestations',
    children: [
      {
        path: 'list',
        component: ServicesListComponent
      },
      {
        path: 'new',
        component: ServicesFormComponent,
        title: 'Création de prestation',
      },
      {
        path: ':serviceId/edit',
        component: ServicesFormComponent,
        title: "Mis à jour d'une prestation",
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
]
