import {inject, Injectable, resource} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {ServiceRequest, ServiceResponse} from '../interfaces/service.interface';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  baseUrl = environment.apiUrl + '/services';
  private http = inject(HttpClient);

  servicesResources = resource({
    loader: () => firstValueFrom(this.http.get<ServiceResponse[]>(this.baseUrl)),
  })

  async createService(serviceToCreate: ServiceRequest): Promise<ServiceResponse> {
    const body = await firstValueFrom(this.http.post<ServiceResponse>(this.baseUrl, serviceToCreate));
    this.servicesResources.reload();
    return body;
  }

  async updateService(serviceId: number, serviceToUpdate: ServiceRequest): Promise<ServiceResponse> {
    const body = await firstValueFrom(this.http.put<ServiceResponse>(this.baseUrl + `/${serviceId}`, serviceToUpdate));
    this.servicesResources.reload();
    return body;
  }

  async deleteService(serviceId: number) {
    await firstValueFrom(this.http.delete(this.baseUrl + `/${serviceId}`));
    this.servicesResources.reload();
  }
}
