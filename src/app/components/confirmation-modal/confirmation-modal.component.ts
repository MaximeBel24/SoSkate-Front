import {Component, EventEmitter, Input, Output} from '@angular/core';

export type ModalType = 'delete' | 'update' | 'warning' | 'info';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  // Contrôle de visibilité
  @Input() isOpen = false;

  // Type de modal (change les couleurs et l'icône)
  @Input() type: ModalType = 'warning';

  // Contenu du modal
  @Input() title = 'Confirmation';
  @Input() message = 'Êtes-vous sûr de vouloir effectuer cette action ?';
  @Input() confirmText = 'Confirmer';
  @Input() cancelText = 'Annuler';

  // État de chargement
  @Input() isLoading = false;

  // Événements
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  /**
   * Ferme le modal
   */
  onClose(): void {
    if (!this.isLoading) {
      this.close.emit();
    }
  }

  /**
   * Annule l'action
   */
  onCancel(): void {
    if (!this.isLoading) {
      this.cancel.emit();
    }
  }

  /**
   * Confirme l'action
   */
  onConfirm(): void {
    if (!this.isLoading) {
      this.confirm.emit();
    }
  }

  /**
   * Empêche la propagation du clic (ne ferme pas le modal si on clique sur le contenu)
   */
  onContentClick(event: Event): void {
    event.stopPropagation();
  }
}
