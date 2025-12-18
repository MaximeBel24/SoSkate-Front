import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

// Services
import { SpotService } from '../../../../shared/services/spot.service';

// Composants partagés
import { ConfirmationModalComponent } from '../../../../components/confirmation-modal/confirmation-modal.component';
import { ListHeaderComponent } from '../../../../components/list/list-header/list-header.component'
import { EmptyStateComponent } from '../../../../components/list/empty-state/empty-state.component'

// Composants de cellules de tableau
import { CellIdComponent } from '../../../../components/list/table-cells/cell-id.component';
import { CellStatusComponent } from '../../../../components/list/table-cells/cell-status.component';
import { CellDatesComponent } from '../../../../components/list/table-cells/cell-dates.component';
import { CellActionsComponent } from '../../../../components/list/table-cells/cell-actions/cell-actions.component';

@Component({
  selector: 'app-spots-list',
  imports: [
    DecimalPipe,
    // Composants partagés
    ConfirmationModalComponent,
    ListHeaderComponent,
    EmptyStateComponent,
    // Cellules de tableau
    CellIdComponent,
    CellStatusComponent,
    CellDatesComponent,
    CellActionsComponent
  ],
  templateUrl: './spots-list.component.html',
  styleUrl: './spots-list.component.scss'
})
export class SpotsListComponent {
  private spotService = inject(SpotService);

  spots = computed(() => this.spotService.spotsResources.value() || []);

  deleteModal = {
    isOpen: false,
    isLoading: false,
    spotId: null as number | null,
    spotName: ''
  };

  /**
   * Ouvre le modal de confirmation de suppression
   */
  openDeleteModal(spotId: number, spotName: string): void {
    this.deleteModal = {
      isOpen: true,
      isLoading: false,
      spotId,
      spotName
    };
  }

  /**
   * Ferme le modal de suppression
   */
  closeDeleteModal(): void {
    this.deleteModal = {
      isOpen: false,
      isLoading: false,
      spotId: null,
      spotName: ''
    };
  }

  /**
   * Confirme et exécute la suppression
   */
  async confirmDelete(): Promise<void> {
    if (!this.deleteModal.spotId) return;

    this.deleteModal.isLoading = true;

    try {
      await this.spotService.deleteSpot(this.deleteModal.spotId);
      console.log('Spot supprimé avec succès');
      this.closeDeleteModal();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du spot');
      this.deleteModal.isLoading = false;
    }
  }
}
