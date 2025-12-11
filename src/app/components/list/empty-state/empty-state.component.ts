import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-empty-state',
  imports: [
    RouterLink
  ],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  /**
   * Icône ou emoji à afficher
   * @example "🛹" ou "📭"
   */
  @Input() icon: string = '📭';

  /**
   * Titre principal
   * @example "Aucun spot disponible"
   */
  @Input({ required: true }) title!: string;

  /**
   * Message descriptif
   * @example "Commencez par ajouter votre premier spot"
   */
  @Input() message: string = '';

  /**
   * Texte du bouton d'action (optionnel)
   * Si non fourni, le bouton ne s'affiche pas
   */
  @Input() buttonText: string = '';

  /**
   * Lien du bouton (tableau pour routerLink)
   * @example ['..', 'new']
   */
  @Input() buttonLink: any[] = [];

  /**
   * Variante de style
   * - 'default': Style standard
   * - 'compact': Version plus compacte pour les cards
   * - 'large': Version grande pour les pages entières
   */
  @Input() variant: 'default' | 'compact' | 'large' = 'default';
}
