import {Component, computed, inject} from '@angular/core';
import {ServiceService} from '../../../../shared/services/service.service';
import {DatePipe, DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ServiceTypeLabel} from '../../../../shared/models/service.type';
import {DurationPipe} from '../../../../shared/pipes/duration.pipe';
import {PricePipe} from '../../../../shared/pipes/price.pipe';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-services-list',
  imports: [
    DatePipe,
    RouterLink,
    DurationPipe,
    PricePipe,
    ConfirmationModalComponent
  ],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent {

  private serviceService = inject(ServiceService);

  readonly label = ServiceTypeLabel;

  services = computed(() => this.serviceService.servicesResources.value() || []);

  deleteModal = {
    isOpen: false,
    isLoading: false,
    serviceId: null as number | null,
    serviceName: ''
  };

  /**
   * Ouvre le modal de confirmation de suppression
   */
  openDeleteModal(serviceId: number, serviceName: string): void {
    this.deleteModal = {
      isOpen: true,
      isLoading: false,
      serviceId,
      serviceName
    };
  }

  /**
   * Ferme le modal de suppression
   */
  closeDeleteModal(): void {
    this.deleteModal = {
      isOpen: false,
      isLoading: false,
      serviceId: null,
      serviceName: ''
    };
  }

  /**
   * Confirme et exécute la suppression
   */
  async confirmDelete(): Promise<void> {
    if (!this.deleteModal.serviceId) return;

    this.deleteModal.isLoading = true;

    try {
      await this.serviceService.deleteService(this.deleteModal.serviceId);
      console.log('Prestation supprimé avec succès');
      this.closeDeleteModal();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la prestation');
      this.deleteModal.isLoading = false;
    }
  }
}
