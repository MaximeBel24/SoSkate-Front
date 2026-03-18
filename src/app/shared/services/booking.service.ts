import {inject, Injectable, resource} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {BookingResponse} from '../interfaces/booking.interface'
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  baseUrl = environment.apiUrl + '/admin/bookings';
  private http = inject(HttpClient);

  bookingsResources = resource({
    loader: () => firstValueFrom(this.http.get<BookingResponse[]>(this.baseUrl)),
  })

  async cancelBooking(id: number): Promise<BookingResponse> {
    const response = await firstValueFrom(
      this.http.patch<BookingResponse>(`${this.baseUrl}/${id}/cancel`, {})
    );
    this.bookingsResources.reload();
    return response;
  }

  async getBookingById(id: number): Promise<BookingResponse> {
    return firstValueFrom(
      this.http.get<BookingResponse>(`${this.baseUrl}/${id}`)
    );
  }

  async updateNotes(id: number, notes: string): Promise<BookingResponse> {
    return firstValueFrom(
      this.http.patch<BookingResponse>(`${this.baseUrl}/${id}/notes`, { notes })
    );
  }

  updateStatus(id: number, status: string): Promise<BookingResponse> {
    return firstValueFrom(
      this.http.patch<BookingResponse>(`${this.baseUrl}/${id}/status`, { status })
    );
  }

}
