import { Component, computed, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

// Services
import { InstructorService } from '../../../../shared/services/instructor.service';

// Models
import {
  InstructorStatusLabel,
  SkateSpecialtyLabel
} from '../../../../shared/models/intructor.type';

// Components
import { ListHeaderComponent } from '../../../../components/list/list-header/list-header.component';
import { CellIdComponent } from '../../../../components/list/table-cells/cell-id.component';
import { CellActionsComponent } from '../../../../components/list/table-cells/cell-actions/cell-actions.component';
import { InstructorStatusBadgeComponent } from '../../../../components/list/instructor-status-badge/instructor-status-badge.component';
import { ConfirmationModalComponent } from '../../../../components/confirmation-modal/confirmation-modal.component';

// Pipes
import { PhoneFrPipe } from '../../../../shared/pipes/phone-fr.pipe';

@Component({
  selector: 'app-instructors-list',
  imports: [
    DatePipe,
    ListHeaderComponent,
    CellIdComponent,
    CellActionsComponent,
    InstructorStatusBadgeComponent,
    ConfirmationModalComponent,
    PhoneFrPipe
  ],
  templateUrl: './instructors-list.component.html',
  styleUrl: './instructors-list.component.scss'
})
export class InstructorsListComponent implements OnInit {

  private instructorService = inject(InstructorService);

  readonly skateSpecialtyLabel = SkateSpecialtyLabel;

  instructors = computed(() => this.instructorService.instructorsResources.value() || []);

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MODAL DE SUSPENSION
  // ═══════════════════════════════════════════════════════════════════════════

  suspendModal = {
    isOpen: false,
    isLoading: false,
    instructorId: null as number | null,
    instructorFirstname: '',
    instructorLastname: ''
  };

  openSuspendModal(instructorId: number, instructorFirstname: string, instructorLastname: string): void {
    this.suspendModal = {
      isOpen: true,
      isLoading: false,
      instructorId,
      instructorFirstname,
      instructorLastname
    };
  }

  closeSuspendModal(): void {
    this.suspendModal = {
      isOpen: false,
      isLoading: false,
      instructorId: null,
      instructorFirstname: '',
      instructorLastname: ''
    };
  }

  async confirmSuspend(): Promise<void> {
    if (!this.suspendModal.instructorId) return;

    this.suspendModal.isLoading = true;

    try {
      await this.instructorService.suspendInstructor(this.suspendModal.instructorId);
      console.log('Compte suspendu avec succès');
      this.closeSuspendModal();
    } catch (error) {
      console.error('Erreur lors de la suspension :', error);
      alert('Erreur lors de la suspension du compte');
      this.suspendModal.isLoading = false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MODAL DE RÉACTIVATION
  // ═══════════════════════════════════════════════════════════════════════════

  reactivateModal = {
    isOpen: false,
    isLoading: false,
    instructorId: null as number | null,
    instructorFirstname: '',
    instructorLastname: ''
  };

  openReactivateModal(instructorId: number, instructorFirstname: string, instructorLastname: string): void {
    this.reactivateModal = {
      isOpen: true,
      isLoading: false,
      instructorId,
      instructorFirstname,
      instructorLastname
    };
  }

  closeReactivateModal(): void {
    this.reactivateModal = {
      isOpen: false,
      isLoading: false,
      instructorId: null,
      instructorFirstname: '',
      instructorLastname: ''
    };
  }

  async confirmReactivate(): Promise<void> {
    if (!this.reactivateModal.instructorId) return;

    this.reactivateModal.isLoading = true;

    try {
      await this.instructorService.reactivateInstructor(this.reactivateModal.instructorId);
      console.log('Compte réactivé avec succès');
      this.closeReactivateModal();
    } catch (error) {
      console.error('Erreur lors de la réactivation :', error);
      alert('Erreur lors de la réactivation du compte');
      this.reactivateModal.isLoading = false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENVOI D'INVITATION
  // ═══════════════════════════════════════════════════════════════════════════

  async resendInvite(instructorId: number): Promise<void> {
    try {
      await this.instructorService.resendInvitation(instructorId);
      console.log('Invitation renvoyée avec succès');
      // TODO: Afficher une notification de succès (toast)
    } catch (error) {
      console.error('Erreur lors du renvoi de l\'invitation :', error);
      alert('Erreur lors du renvoi de l\'invitation');
    }
  }
}
