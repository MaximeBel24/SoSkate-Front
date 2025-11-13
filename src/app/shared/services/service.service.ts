import {inject, Injectable, resource} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {ServiceRequest, ServiceResponse} from '../interfaces/service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  baseUrl = environment.apiUrl + '/services';
  private http = inject(HttpClient);

  servicesResources = resource({
    loader: async (): Promise<ServiceResponse[]> => (await  fetch(this.baseUrl)).json(),
  })

  async createService(serviceToCreate: ServiceRequest) {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      body: JSON.stringify(serviceToCreate),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const body = await response.json();
    if (response.ok) {
      this.servicesResources.reload();
    } else {
      throw new Error(body);
    }
  }

  async updateService(serviceId: number, serviceToUpdate: ServiceRequest) {
    const response = await fetch(`${this.baseUrl}/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(serviceToUpdate),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const body = await response.json();
    if(response.ok) {
      this.servicesResources.reload();
    } else {
      throw new Error(body)
    }
  }

  async deleteService(serviceId: number) {
    await fetch(`${this.baseUrl}/${serviceId}`, {
      method: 'DELETE',
    });
    this.servicesResources.reload();
  }
}
