import {inject, Injectable, resource} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {InstructorCreateRequest, InstructorResponse} from '../interfaces/instructor.interface';
import {SpotRequest, SpotResponse} from '../interfaces/spot.interface';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  baseUrl = environment.apiUrl + '/admin/instructors';
  private http = inject(HttpClient);

  instructorsResources = resource({
    loader: async (): Promise<InstructorResponse[]> => (await fetch(this.baseUrl)).json(),
  })

  async createInstructor(instructorToCreate: InstructorCreateRequest): Promise<InstructorResponse> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      body: JSON.stringify(instructorToCreate),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const body = await response.json();
    if (response.ok) {
      this.instructorsResources.reload();
    } else {
      throw new Error(body);
    }
    return body;
  }

  async resendInvitation(instructorId: number) {
    const response = await fetch(`${this.baseUrl}/${instructorId}/resend-invitation`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
    });
    if(response.ok) {
      this.instructorsResources.reload();
    } else {
      console.log('Erreur lors de la suspension')
    }
  }

  async suspendInstructor(instructorId: number) {
    const response = await fetch(`${this.baseUrl}/${instructorId}/suspend`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
    });
    if(response.ok) {
      this.instructorsResources.reload();
    } else {
      console.log('Erreur lors de la suspension')
    }
  }

  async reactivateInstructor(instructorId: number) {
    const response = await fetch(`${this.baseUrl}/${instructorId}/reactivate`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
    });
    if(response.ok) {
      this.instructorsResources.reload();
    } else {
      console.log('Erreur lors de la suspension')
    }
  }


}
