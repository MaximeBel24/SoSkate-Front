import { Component } from '@angular/core';
import {SectionLayoutComponent} from '../../components/section-layout/section-layout.component';

@Component({
  selector: 'app-admin-instructors',
  imports: [
    SectionLayoutComponent
  ],
  template: `<app-section-layout sectionName="professeur" />`
})
export class AdminInstructorsComponent {

}
