import {inject, Injectable, resource} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import { DashboardResponse } from '../interfaces/dashboard.interface';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  baseUrl: string = environment.apiUrl + '/admin/dashboard';
  private http = inject(HttpClient);

  dashboardResources = resource({
    loader: () => firstValueFrom(this.http.get<DashboardResponse>(this.baseUrl))
  })
}
