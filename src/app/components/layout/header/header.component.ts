import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SettingsMenuComponent} from '../../settings/settings-menu/settings-menu.component';
import {IconDollarComponent} from '../../icons/icon-dollar.component';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    SettingsMenuComponent,
    IconDollarComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  /**
   * Toggle du menu mobile
   * Si vous implémentez cette fonctionnalité, ajoutez (click)="toggleMobileMenu()"
   * sur le bouton .mobile-menu-btn et utilisez [class.hide]="!isMobileMenuOpen"
   * sur .mobile-nav
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /**
   * Ferme le menu mobile (utile quand on clique sur un lien)
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  navbarLogoPath = 'assets/images/soskate-logo-navbar.png';
}
