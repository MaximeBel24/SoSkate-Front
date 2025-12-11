import {Component, Input} from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-cell-dates',
  imports: [DatePipe],
  template: `
    <td class="col-dates xs-hide">
      <div class="cell-dates">
        <span class="date-item">
          <span class="date-label">{{ createdLabel }}:</span>
          {{ createdAt | date: dateFormat }}
        </span>
        @if (updatedAt) {
          <span class="date-item">
            <span class="date-label">{{ updatedLabel }}:</span>
            {{ updatedAt | date: dateFormat }}
          </span>
        }
      </div>
    </td>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class CellDatesComponent {
  /**
   * Date de création
   */
  @Input({ required: true }) createdAt!: string | Date;

  /**
   * Date de mise à jour (optionnelle)
   */
  @Input() updatedAt?: string | Date;

  /**
   * Label pour la date de création
   * @default "Créé"
   */
  @Input() createdLabel: string = 'Créé';

  /**
   * Label pour la date de mise à jour
   * @default "MAJ"
   */
  @Input() updatedLabel: string = 'MAJ';

  /**
   * Format de date Angular
   * @default "dd/MM/yyyy"
   */
  @Input() dateFormat: string = 'dd/MM/yyyy';

  /**
   * Afficher sur mobile
   * @default false (caché par défaut avec xs-hide)
   */
  @Input() showOnMobile: boolean = false;
}
