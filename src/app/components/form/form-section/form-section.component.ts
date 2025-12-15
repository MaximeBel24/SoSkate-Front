import {Component, ContentChild, Input, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-form-section',
  imports: [],
  templateUrl: './form-section.component.html',
  styleUrl: './form-section.component.scss'
})
export class FormSectionComponent {
  /**
   * Titre de la section
   * @example "Informations générales"
   */
  @Input({ required: true }) title!: string;

  /**
   * Template pour l'icône (ng-template passé via content projection)
   */
  @ContentChild('icon') iconTemplate?: TemplateRef<any>;
}
