import { Component, signal, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent {
  private elementRef = inject(ElementRef);

  isOpen = signal(false);

  toggle(): void {
    this.isOpen.update(value => !value);
  }

  close(): void {
    this.isOpen.set(false);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  // Close on Escape key
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.close();
  }
}
