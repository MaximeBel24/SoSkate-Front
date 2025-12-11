import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-cell-status',
  imports: [],
  template: `
    <td class="col-status">
      <span
        class="status-badge"
        [class.status-active]="isActive"
        [class.status-inactive]="!isActive"
      >
        <span class="status-dot"></span>
        {{ isActive ? activeLabel : inactiveLabel }}
      </span>
    </td>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class CellStatusComponent {
  /**
   * État actif/inactif
   */
  @Input({ required: true }) isActive!: boolean;

  /**
   * Label pour l'état actif
   * @default "Actif"
   */
  @Input() activeLabel: string = 'Actif';

  /**
   * Label pour l'état inactif
   * @default "Inactif"
   */
  @Input() inactiveLabel: string = 'Inactif';
}
