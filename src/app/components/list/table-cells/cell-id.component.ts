import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-cell-id',
  imports: [],
  template: `
    <td class="col-id">
      <span class="cell-id">#{{ id }}</span>
    </td>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class CellIdComponent {
  /**
   * L'identifiant à afficher
   */
  @Input({ required: true }) id!: number;
}
