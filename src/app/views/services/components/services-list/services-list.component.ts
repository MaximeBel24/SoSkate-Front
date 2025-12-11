import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

// Services
import { ServiceService } from '../../../../shared/services/service.service';

// Models & Pipes
import { ServiceTypeLabel } from '../../../../shared/models/service.type';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { PricePipe } from '../../../../shared/pipes/price.pipe';

// Composants partagés
import { ConfirmationModalComponent } from '../../../../components/confirmation-modal/confirmation-modal.component';
import {ListHeaderComponent} from '../../../../components/list/list-header/list-header.component';

import {EmptyStateComponent} from '../../../../components/list/empty-state/empty-state.component';


// Composants de cellules de tableau
import {CellStatusComponent} from '../../../../components/list/table-cells/cell-status.component';
import {CellDatesComponent} from '../../../../components/list/table-cells/cell-dates.component';
import {CellActionsComponent} from '../../../../components/list/table-cells/cell-actions.component';
import {CellIdComponent} from '../../../../components/list/table-cells/cell-id.component';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [

    // Pipes
    DurationPipe,
    PricePipe,

    // Composants partagés
    ConfirmationModalComponent,
    ListHeaderComponent,
    EmptyStateComponent,

    // Cellules de tableau
    CellStatusComponent,
    CellDatesComponent,
    CellActionsComponent,
    CellIdComponent,

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
      console.log('Prestation supprimée avec succès');
      this.closeDeleteModal();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la prestation');
      this.deleteModal.isLoading = false;
    }
  }
}
