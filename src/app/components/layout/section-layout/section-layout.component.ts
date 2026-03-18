import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-section-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './section-layout.component.html',
  styleUrl: './section-layout.component.scss'
})
export class SectionLayoutComponent {
  /**
   * Nom de la section au singulier (ex: "spot", "prestation", "instructeur")
   */
  @Input({ required: true }) sectionName!: string;

  /**
   * Nom de la section au pluriel pour l'affichage (ex: "spots", "prestations", "instructeurs")
   * Si non fourni, ajoute un "s" au sectionName
   */
  @Input() sectionNamePlural?: string;

  /**
   * Genre du nom pour l'accord (ex: "Nouveau spot" vs "Nouvelle prestation")
   * 'M' = masculin, 'F' = féminin
   */
  @Input() gender: 'M' | 'F' = 'M';

  /**
   * Afficher ou non le lien "Nouveau/Nouvelle"
   */
  @Input() showNewButton: boolean = true;


  get listLabel(): string {
    return `Liste des ${this.sectionNamePlural || this.sectionName + 's'}`;
  }

  get newLabel(): string {
    const prefix = this.gender === 'F' ? 'Nouvelle' : 'Nouveau';
    return `${prefix} ${this.sectionName}`;
  }
}
