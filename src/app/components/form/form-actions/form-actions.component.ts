import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import {IconArrowLeftComponent} from '../../icons/icon-arrow-left/icon-arrow-left.component';
import {IconCheckComponent} from '../../icons/icon-check/icon-check.component';

@Component({
  selector: 'app-form-actions',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, IconArrowLeftComponent, IconCheckComponent],
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.scss'
})
export class FormActionsComponent {
  // ============================================
  // CANCEL BUTTON
  // ============================================

  /**
   * Texte du bouton annuler
   */
  @Input() cancelText: string = 'Annuler';

  /**
   * Lien pour le bouton annuler (routerLink)
   */
  @Input() cancelLink: any[] = [];

  /**
   * Afficher le bouton annuler
   */
  @Input() showCancel: boolean = true;

  // ============================================
  // SUBMIT BUTTON
  // ============================================

  /**
   * Texte du bouton submit
   */
  @Input() submitText: string = 'Enregistrer';

  /**
   * Texte pendant le chargement
   */
  @Input() loadingText: string = 'Enregistrement...';

  /**
   * État de chargement
   */
  @Input() isLoading: boolean = false;

  /**
   * Formulaire invalide (désactive le bouton)
   */
  @Input() isInvalid: boolean = false;

  /**
   * Mode édition (pour texte dynamique)
   */
  @Input() isEditMode: boolean = false;

  /**
   * Texte pour le mode création
   */
  @Input() createText: string = '';

  /**
   * Texte pour le mode édition
   */
  @Input() updateText: string = 'Mettre à jour';

  // ============================================
  // EVENTS
  // ============================================

  /**
   * Événement émis lors du clic sur annuler (si pas de lien)
   */
  @Output() cancel = new EventEmitter<void>();

  // ============================================
  // COMPUTED
  // ============================================

  /**
   * Texte affiché sur le bouton submit
   */
  get displaySubmitText(): string {
    if (this.submitText) return this.submitText;
    return this.isEditMode ? this.updateText : this.createText;
  }

  /**
   * Bouton submit désactivé
   */
  get isDisabled(): boolean {
    return this.isInvalid || this.isLoading;
  }

  onCancelClick(): void {
    this.cancel.emit();
  }
}
