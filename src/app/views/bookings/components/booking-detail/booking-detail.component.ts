import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {DatePipe, DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {BookingService} from '../../../../shared/services/booking.service';
import {BookingResponse} from '../../../../shared/interfaces/booking.interface';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-booking-detail',
  imports: [DatePipe, FormsModule, RouterLink, ConfirmationModalComponent, DecimalPipe],
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.scss'
})
export class BookingDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);

  booking = signal<BookingResponse | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  // Notes editing
  editingNotes = signal(false);
  notesValue = '';
  isSavingNotes = signal(false);

  // Cancel modal
  cancelModal = {
    isOpen: false,
    isLoading: false,
  };

  // Status update
  isUpdatingStatus = signal(false);

  availableStatuses = computed(() => {
    const status = this.booking()?.status;
    switch (status) {
      case 'OPEN':
      case 'FULL':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['CANCELLED'];
      default:
        return [];
    }
  });

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      await this.router.navigate(['/bookings']);
      return;
    }
    await this.loadBooking(id);
  }

  async loadBooking(id: number) {
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const booking = await this.bookingService.getBookingById(id);
      this.booking.set(booking);
      this.notesValue = booking.notes || '';
    } catch (error) {
      this.errorMessage.set('Impossible de charger la réservation');
    } finally {
      this.isLoading.set(false);
    }
  }

  // === Notes ===

  startEditNotes() {
    this.notesValue = this.booking()?.notes || '';
    this.editingNotes.set(true);
  }

  cancelEditNotes() {
    this.notesValue = this.booking()?.notes || '';
    this.editingNotes.set(false);
  }

  async saveNotes() {
    const booking = this.booking();
    if (!booking) return;

    this.isSavingNotes.set(true);
    try {
      const updated = await this.bookingService.updateNotes(booking.id, this.notesValue);
      this.booking.set(updated);
      this.editingNotes.set(false);
    } catch (error) {
      alert('Erreur lors de la sauvegarde des notes');
    } finally {
      this.isSavingNotes.set(false);
    }
  }

  // === Cancel ===

  canCancel(): boolean {
    const status = this.booking()?.status;
    return status !== 'CANCELLED' && status !== 'COMPLETED';
  }

  openCancelModal() {
    this.cancelModal = { isOpen: true, isLoading: false };
  }

  closeCancelModal() {
    this.cancelModal = { isOpen: false, isLoading: false };
  }

  async confirmCancel() {
    const booking = this.booking();
    if (!booking) return;

    this.cancelModal.isLoading = true;
    try {
      const updated = await this.bookingService.cancelBooking(booking.id);
      this.booking.set(updated);
      this.closeCancelModal();
    } catch (error) {
      alert("Erreur lors de l'annulation");
      this.cancelModal.isLoading = false;
    }
  }

  // === Status change ===

  async onStatusChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;
    const booking = this.booking();
    if (!booking || !newStatus) return;

    this.isUpdatingStatus.set(true);
    try {
      const updated = await this.bookingService.updateStatus(booking.id, newStatus);
      this.booking.set(updated);
    } catch (error) {
      alert('Erreur lors du changement de statut');
    } finally {
      this.isUpdatingStatus.set(false);
      select.value = '';
    }
  }

  // === Status helpers ===

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

  getStatusLabel(status: string): string {
    switch (status) {
      case 'OPEN': return 'Ouvert';
      case 'FULL': return 'Complet';
      case 'CONFIRMED': return 'Confirme';
      case 'COMPLETED': return 'Termine';
      case 'CANCELLED': return 'Annule';
      default: return status;
    }
  }

  getParticipantStatusLabel(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'Confirme';
      case 'CANCELLED': return 'Annule';
      case 'REFUNDED': return 'Rembourse';
      case 'PENDING': return 'En attente';
      default: return status;
    }
  }
}
