import { Component } from '@angular/core';
import {SectionLayoutComponent} from '../../components/section-layout/section-layout.component';


@Component({
  selector: 'app-spots',
  standalone: true,
  imports: [
    SectionLayoutComponent
  ],
  template: `<app-section-layout sectionName="spot" />`
})
export class SpotsComponent {}
