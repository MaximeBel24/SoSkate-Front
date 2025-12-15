import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss'
})
export class InfoCardComponent {
  /**
   * Titre de la carte
   */
  @Input({ required: true }) title!: string;

  /**
   * Description
   */
  @Input() description: string = '';

  /**
   * État actif (surbrillance)
   */
  @Input() isActive: boolean = false;

  /**
   * Carte cliquable
   */
  @Input() clickable: boolean = false;

  /**
   * Valeur associée à la carte (pour la sélection)
   */
  @Input() value: any;

  /**
   * Template pour l'icône
   */
  @ContentChild('icon') iconTemplate?: TemplateRef<any>;

  /**
   * Événement émis lors du clic
   */
  @Output() cardClick = new EventEmitter<any>();

  onClick(): void {
    if (this.clickable) {
      this.cardClick.emit(this.value);
    }
  }
}
