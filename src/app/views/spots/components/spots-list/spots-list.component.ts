import {Component, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SpotService} from '../../../../shared/services/spot.service';
import {DatePipe, DecimalPipe} from '@angular/common';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-spots-list',
  imports: [
    RouterLink,
    DecimalPipe,
    DatePipe,
    ConfirmationModalComponent
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
