import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/layout/header/header.component';
import {ThemeService} from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SoSkate-Admin';
  private readonly themeService = inject(ThemeService);
}
