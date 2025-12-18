import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import {IconEditComponent} from '../../../icons/icon-edit.component';
import {IconDeleteComponent} from '../../../icons/icon-delete.component';
import {IconPauseCircleComponent} from '../../../icons/icon-pause-circle.component';
import {IconPlayCircleComponent} from '../../../icons/icon-play-circle.component';
import {IconRefreshComponent} from '../../../icons/icon-refresh.component';

// Icônes


@Component({
  selector: 'app-cell-actions',
  standalone: true,
  imports: [
    RouterLink,
    IconEditComponent,
    IconDeleteComponent,
    IconPauseCircleComponent,
    IconPlayCircleComponent,
    IconRefreshComponent,

  ],
  templateUrl: './cell-actions.component.html',
  styleUrl: './cell-actions.component.scss'
})
export class CellActionsComponent {

  // ═══════════════════════════════════════════════════════════════════════════
  // EDIT ACTION
  // ═══════════════════════════════════════════════════════════════════════════

  @Input() showEdit = true;
  @Input() editLink: any[] = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE ACTION
  // ═══════════════════════════════════════════════════════════════════════════

  @Input() showDelete = true;
  @Output() delete = new EventEmitter<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // SUSPEND ACTION (pour les comptes ACTIVE)
  // ═══════════════════════════════════════════════════════════════════════════

  @Input() showSuspend = false;
  @Output() suspend = new EventEmitter<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // REACTIVATE ACTION (pour les comptes SUSPENDED)
  // ═══════════════════════════════════════════════════════════════════════════

  @Input() showReactivate = false;
  @Output() reactivate = new EventEmitter<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // RESEND INVITE ACTION (pour les comptes INVITED)
  // ═══════════════════════════════════════════════════════════════════════════

  @Input() showResendInvite = false;
  @Output() resendInvite = new EventEmitter<void>();
}
