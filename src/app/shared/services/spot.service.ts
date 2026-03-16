import {inject, Injectable, resource} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {SpotRequest, SpotResponse} from '../interfaces/spot.interface';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotService {

  baseUrl = environment.apiUrl + '/spots';
  private http = inject(HttpClient);

  spotsResources = resource({
    loader: () => firstValueFrom(this.http.get<SpotResponse[]>(this.baseUrl)),
  })

  async createSpot(spotToCreate: SpotRequest): Promise<SpotResponse> {
    const body = await firstValueFrom(this.http.post<SpotResponse>(this.baseUrl, spotToCreate));
    this.spotsResources.reload();
    return body;
  }

  async updateSpot(spotId: number, spotToUpdate: SpotRequest): Promise<SpotResponse> {
    const body = await firstValueFrom(this.http.put<SpotResponse>(this.baseUrl + `/${spotId}`, spotToUpdate));
    this.spotsResources.reload();
    return body;
  }

  async deleteSpot(spotId: number) {
    await firstValueFrom(this.http.delete(this.baseUrl + `/${spotId}`));
    this.spotsResources.reload();
  }
}
