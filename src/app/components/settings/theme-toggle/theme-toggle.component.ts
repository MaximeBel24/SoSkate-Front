import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Theme, ThemeService} from '../../../shared/services/theme.service';

interface ThemeOption {
  value: Theme;
  icon: string;
  label: string;
  tooltip: string;
}

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);

  readonly themeOptions: ThemeOption[] = [
    {
      value: 'light',
      icon: 'sun',
      label: 'Clair',
      tooltip: 'Thème clair'
    },
    {
      value: 'dark',
      icon: 'moon',
      label: 'Sombre',
      tooltip: 'Thème sombre'
    },
    {
      value: 'auto',
      icon: 'monitor',
      label: 'Auto',
      tooltip: 'Suivre les préférences système'
    }
  ];

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  isActive(theme: Theme): boolean {
    return this.themeService.theme() === theme;
  }
}
