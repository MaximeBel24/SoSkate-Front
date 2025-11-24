import {inject, Injectable, resource} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {SpotRequest, SpotResponse} from '../interfaces/spot.interface';

@Injectable({
  providedIn: 'root'
})
export class SpotService {

  baseUrl = environment.apiUrl + '/spots';
  private http = inject(HttpClient);

  spotsResources = resource({
    loader: async (): Promise<SpotResponse[]> => (await  fetch(this.baseUrl)).json(),
  })

  async createSpot(spotToCreate: SpotRequest): Promise<SpotResponse> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      body: JSON.stringify(spotToCreate),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const body = await response.json();
    if (response.ok) {
      this.spotsResources.reload();
    } else {
      throw new Error(body);
    }
    return body;
  }

  async updateSpot(spotId: number, spotToUpdate: SpotRequest): Promise<SpotResponse> {
    const response = await fetch(`${this.baseUrl}/${spotId}`, {
      method: 'PUT',
      body: JSON.stringify(spotToUpdate),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const body = await response.json();
    if(response.ok) {
      this.spotsResources.reload();
    } else {
      throw new Error(body)
    }
    return body;
  }

  async deleteSpot(spotId: number) {
    await fetch(`${this.baseUrl}/${spotId}`, {
      method: 'DELETE',
    });
    this.spotsResources.reload();
  }
}
