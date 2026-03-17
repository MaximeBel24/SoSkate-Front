import {Component, inject} from '@angular/core';
import {DashboardService} from '../../shared/services/dashboard.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private dashboardService = inject(DashboardService);

  dashboard = this.dashboardService.dashboardResources;
}
