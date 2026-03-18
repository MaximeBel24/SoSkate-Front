import { Component } from '@angular/core';
import {SectionLayoutComponent} from '../../components/layout/section-layout/section-layout.component';

@Component({
  selector: 'app-bookings',
  imports: [
    SectionLayoutComponent
  ],
  template: `<app-section-layout sectionName="réservations" gender="F" [showNewButton]="false"/>`
})
export class BookingsComponent {}
