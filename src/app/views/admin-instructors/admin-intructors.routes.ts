import {Routes} from '@angular/router';
import {AdminInstructorsComponent} from './admin-instructors.component'
import {InstructorsListComponent} from './components/instructors-list/instructors-list.component';
import {InstructorsFormComponent} from './components/instructors-form/instructors-form.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminInstructorsComponent,
    title: 'Gestion des professeurs',
    children: [
      {
        path: 'list',
        component: InstructorsListComponent
      },
      {
        path: 'new',
        component: InstructorsFormComponent,
        title: 'Ajout d\'un professeur'
      },
      // {
      //   path: ':intructorId/edit',
      //   component: InstructorsFormComponent,
      //   title: "Mis à jour d'une prestation",
      // },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
]
