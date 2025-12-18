import { Component, Input, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import {InstructorStatusLabel, SkateSpecialtyLabel} from '../../../shared/models/intructor.type';

export type InstructorStatus = 'INVITED' | 'ACTIVE' | 'SUSPENDED';

@Component({
  selector: 'app-instructor-status-badge',
  imports: [NgClass],
  templateUrl: './instructor-status-badge.component.html',
  styleUrls: ['./instructor-status-badge.component.scss']
})
export class InstructorStatusBadgeComponent {
  @Input({ required: true }) status!: InstructorStatus;

  readonly instructorStatusLabel = InstructorStatusLabel;

  get badgeClass(): string {
    switch (this.status) {
      case 'INVITED': return 'is-invited';   // bleu
      case 'ACTIVE': return 'is-active';     // vert
      case 'SUSPENDED': return 'is-suspended'; // rouge
      default: return '';
    }
  }
}
