import { Component } from '@angular/core';
import {SectionLayoutComponent} from '../../components/section-layout/section-layout.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    SectionLayoutComponent
  ],
  template: `<app-section-layout sectionName="prestation" gender="F" />`
})
export class ServicesComponent {}
