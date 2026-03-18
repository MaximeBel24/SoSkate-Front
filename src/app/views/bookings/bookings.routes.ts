import {Routes} from '@angular/router';
import {BookingsComponent} from './bookings.component';
import {BookingsListComponent} from './components/bookings-list/bookings-list.component'
import {BookingDetailComponent} from './components/booking-detail/booking-detail.component'

export const routes: Routes = [
  {
    path: '',
    component: BookingsComponent,
    title: 'Gestion des réservations',
    children: [
      {
        path: 'list',
        component: BookingsListComponent,
      },
      {
        path: ':id',
        component: BookingDetailComponent,
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
]
