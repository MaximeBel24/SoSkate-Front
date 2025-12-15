import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-form-header',
  imports: [],
  templateUrl: './form-header.component.html',
  styleUrl: './form-header.component.scss'
})
export class FormHeaderComponent {
  /**
   * Titre principal du formulaire
   * @example "Créer un spot"
   */
  @Input({ required: true }) title!: string;

  /**
   * Sous-titre descriptif (optionnel)
   * @example "Ajoutez un nouveau lieu de skateboard"
   */
  @Input() subtitle: string = '';

  /**
   * Mode du formulaire (pour affichage dynamique)
   */
  @Input() isEditMode: boolean = false;

  /**
   * Nom de l'entité pour le titre dynamique
   * @example "spot", "prestation"
   */
  @Input() entityName: string = '';

  /**
   * Génère le titre automatiquement si entityName est fourni
   */
  get displayTitle(): string {
    if (this.title) return this.title;
    if (this.entityName) {
      return `${this.isEditMode ? 'Modifier' : 'Créer'} ${this.entityName}`;
    }
    return '';
  }
}
