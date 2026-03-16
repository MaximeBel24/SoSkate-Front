import {inject, Injectable, resource} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {InstructorCreateRequest, InstructorResponse} from '../interfaces/instructor.interface';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  baseUrl = environment.apiUrl + '/admin/instructors';
  private http = inject(HttpClient);

  instructorsResources = resource({
    loader: () => firstValueFrom(this.http.get<InstructorResponse[]>(this.baseUrl)),
  })

  async createInstructor(instructorToCreate: InstructorCreateRequest): Promise<InstructorResponse> {
    const body = await firstValueFrom(this.http.post<InstructorResponse>(this.baseUrl, instructorToCreate));
    this.instructorsResources.reload();
    return body;
  }

  async resendInvitation(instructorId: number) {
    await firstValueFrom(this.http.patch(`${this.baseUrl}/${instructorId}/resend`, {}));
    this.instructorsResources.reload();
  }

  async suspendInstructor(instructorId: number) {
    await firstValueFrom(this.http.patch(`${this.baseUrl}/${instructorId}/suspend`, {}));
    this.instructorsResources.reload();
  }

  async reactivateInstructor(instructorId: number) {
    await firstValueFrom(this.http.patch(`${this.baseUrl}/${instructorId}/reactivate`, {}));
    this.instructorsResources.reload();
  }

}
