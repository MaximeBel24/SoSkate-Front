import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-header',
  imports: [RouterLink],
  templateUrl: './list-header.component.html',
  styleUrl: './list-header.component.scss'
})
export class ListHeaderComponent {
  /**
   * Titre principal de la liste
   * @example "Liste des spots"
   */
  @Input({ required: true }) title!: string;

  /**
   * Nombre d'éléments dans la liste
   */
  @Input({ required: true }) count!: number;

  /**
   * Label pour le compteur (singulier/pluriel géré automatiquement)
   * @example "spot" -> "3 spot(s)"
   */
  @Input() countLabel: string = 'élément';

  /**
   * Texte du bouton d'action principal
   * @example "Ajouter un spot"
   */
  @Input() buttonText: string = 'Ajouter';

  /**
   * Lien du bouton (tableau pour routerLink)
   * @example ['..', 'new']
   */
  @Input() buttonLink: any[] = [];

  /**
   * Afficher ou non le bouton d'action
   */
  @Input() showButton: boolean = true;

  /**
   * Icône du bouton (optionnel, par défaut "+")
   */
  @Input() buttonIcon: string = '+';
}
