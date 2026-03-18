import {Component, computed, inject, signal} from '@angular/core';
import { DatePipe } from '@angular/common';

// Services
import { BookingService } from '../../../../shared/services/booking.service';

// Composants partagés
import { ListHeaderComponent } from '../../../../components/list/list-header/list-header.component';
import { EmptyStateComponent } from '../../../../components/list/empty-state/empty-state.component';

// Composants de cellules de tableau
import { CellIdComponent } from '../../../../components/list/table-cells/cell-id.component';
import { CellDatesComponent } from '../../../../components/list/table-cells/cell-dates.component';
import {BookingResponse} from '../../../../shared/interfaces/booking.interface';
import {CellActionsComponent} from '../../../../components/list/table-cells/cell-actions/cell-actions.component';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-bookings-list',
  imports: [
    DatePipe,
    // Composants partagés
    ListHeaderComponent,
    EmptyStateComponent,
    // Cellules de tableau
    CellIdComponent,
    CellDatesComponent,
    CellActionsComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './bookings-list.component.html',
  styleUrl: './bookings-list.component.scss'
})
export class BookingsListComponent {

  private bookingService = inject(BookingService);

  bookings = computed(() => this.bookingService.bookingsResources.value() || []);

  bookingToCancel = signal<BookingResponse | null>(null);
  selectedStatus = signal<string>('');
  searchQuery = signal<string>('')

  filteredBookings = computed(() => {
    const bookings = this.bookingService.bookingsResources.value() ?? [];
    const status = this.selectedStatus();
    const query = this.searchQuery().toLowerCase();

    return bookings.filter(b => {
      const matchStatus = !status || b.status === status;
      const matchSearch = !query
        || b.instructor.firstname.toLowerCase().includes(query)
        || b.instructor.lastname.toLowerCase().includes(query)
        || b.service.name.toLowerCase().includes(query)
        || b.spot.name.toLowerCase().includes(query);
      return matchStatus && matchSearch;
    });
  });


  filterByStatus(status: string) {
    this.selectedStatus.set(status);
  }



  /**
   * Retourne la classe CSS correspondant au statut du booking
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'OPEN': return 'status-open';
      case 'FULL': return 'status-full';
      case 'CONFIRMED': return 'status-confirmed';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  /**
   * Retourne le label français du statut
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'OPEN': return 'Ouvert';
      case 'FULL': return 'Complet';
      case 'CONFIRMED': return 'Confirmé';
      case 'COMPLETED': return 'Terminé';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  }

  cancelModal = {
    isOpen: false,
    isLoading: false,
    bookingId: null as number | null,
  }

  openCancelModal(
    bookingId: number
  ) {
    this.cancelModal = {
      isOpen: true,
      isLoading: false,
      bookingId
    }

  }

  closeCancelModal(): void {
    this.cancelModal = {
      isOpen: false,
      isLoading: false,
      bookingId: null
    };
  }

  async confirmCancel() {
    if (!this.cancelModal.bookingId) return;

    this.cancelModal.isLoading = true;

    try {
      await this.bookingService.cancelBooking(this.cancelModal.bookingId);
      console.log("Réservation annulée avec succès");
      this.closeCancelModal();
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      alert("Erreur lors de l'annulation de la réservation");
      this.cancelModal.isLoading = false;
    }
  }
}
