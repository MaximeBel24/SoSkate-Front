import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {IconEditComponent} from '../../icons/icon-edit/icon-edit.component';
import {IconDeleteComponent} from '../../icons/icon-delete/icon-delete.component';

@Component({
  selector: 'app-cell-actions',
  imports: [RouterLink, IconEditComponent, IconDeleteComponent],
  template: `
    <td class="col-actions">
      <div class="action-buttons">
        @if (showEdit && editLink.length > 0) {
          <button
            [routerLink]="editLink"
            class="btn-action btn-action-edit"
            [title]="editTitle"
          >
            <app-icon-edit [size]="16" />
            <span class="xs-hide">{{ editLabel }}</span>
          </button>
        }

        @if (showDelete) {
          <button
            (click)="onDelete()"
            class="btn-action btn-action-delete"
            [title]="deleteTitle"
            [disabled]="deleteDisabled"
          >
            <app-icon-delete [size]="16" />
            <span class="xs-hide">{{ deleteLabel }}</span>
          </button>
        }

        @if (showView && viewLink.length > 0) {
          <button
            [routerLink]="viewLink"
            class="btn-action btn-action-view"
            [title]="viewTitle"
          >
<!--            <app-icon-view [size]="16" />-->
            <span class="xs-hide">{{ viewLabel }}</span>
          </button>
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
export class CellActionsComponent {
  // ============================================
  // EDIT ACTION
  // ============================================

  /**
   * Afficher le bouton d'édition
   * @default true
   */
  @Input() showEdit: boolean = true;

  /**
   * Lien pour l'édition (tableau pour routerLink)
   * @example ['..', 1, 'edit']
   */
  @Input() editLink: any[] = [];

  /**
   * Label du bouton d'édition
   * @default "Modifier"
   */
  @Input() editLabel: string = 'Modifier';

  /**
   * Title (tooltip) du bouton d'édition
   * @default "Modifier"
   */
  @Input() editTitle: string = 'Modifier';

  // ============================================
  // DELETE ACTION
  // ============================================

  /**
   * Afficher le bouton de suppression
   * @default true
   */
  @Input() showDelete: boolean = true;

  /**
   * Label du bouton de suppression
   * @default "Supprimer"
   */
  @Input() deleteLabel: string = 'Supprimer';

  /**
   * Title (tooltip) du bouton de suppression
   * @default "Supprimer"
   */
  @Input() deleteTitle: string = 'Supprimer';

  /**
   * Désactiver le bouton de suppression
   * @default false
   */
  @Input() deleteDisabled: boolean = false;

  /**
   * Événement émis lors du clic sur supprimer
   */
  @Output() delete = new EventEmitter<void>();

  // ============================================
  // VIEW ACTION (optionnel)
  // ============================================

  /**
   * Afficher le bouton de visualisation
   * @default false
   */
  @Input() showView: boolean = false;

  /**
   * Lien pour la visualisation
   */
  @Input() viewLink: any[] = [];

  /**
   * Label du bouton de visualisation
   * @default "Voir"
   */
  @Input() viewLabel: string = 'Voir';

  /**
   * Title (tooltip) du bouton de visualisation
   * @default "Voir les détails"
   */
  @Input() viewTitle: string = 'Voir les détails';

  // ============================================
  // METHODS
  // ============================================

  onDelete(): void {
    this.delete.emit();
  }
}
