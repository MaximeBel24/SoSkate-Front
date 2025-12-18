import { Component, Input } from '@angular/core';
import {IconAlertCircleComponent} from '../../icons/icon-alert-circle.component';

@Component({
  selector: 'app-validation-summary',
  standalone: true,
  imports: [
    IconAlertCircleComponent
  ],
  templateUrl: './validation-summary.component.html',
  styleUrl: './validation-summary.component.scss'
})
export class ValidationSummaryComponent {
  /**
   * Le formulaire est invalide
   */
  @Input() isInvalid: boolean = false;

  /**
   * Le formulaire a été touché
   */
  @Input() isTouched: boolean = false;

  /**
   * Message à afficher
   */
  @Input() message: string = 'Veuillez corriger les erreurs avant de soumettre le formulaire';

  /**
   * Liste des erreurs spécifiques (optionnel)
   */
  @Input() errors: string[] = [];

  /**
   * Afficher le résumé
   */
  get showSummary(): boolean {
    return this.isInvalid && this.isTouched;
  }
}
