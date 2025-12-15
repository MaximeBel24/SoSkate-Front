import { Injectable, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

// ============================================
// TYPES
// ============================================
export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

// ============================================
// CONSTANTS
// ============================================
const STORAGE_KEY = 'soskate-theme';
const THEME_TRANSITION_CLASS = 'theme-transition';
const TRANSITION_DURATION = 300; // ms

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private mediaQuery: MediaQueryList;

  // ----------------------------------------
  // SIGNALS
  // ----------------------------------------
  /** User's theme preference (light, dark, or auto) */
  readonly theme = signal<Theme>(this.getStoredTheme());

  /** System preference (light or dark) */
  readonly systemTheme = signal<ResolvedTheme>(this.getSystemTheme());

  /** The actual applied theme (resolved from auto if needed) */
  readonly resolvedTheme = computed<ResolvedTheme>(() => {
    const currentTheme = this.theme();
    if (currentTheme === 'auto') {
      return this.systemTheme();
    }
    return currentTheme;
  });

  /** Helper computed for template usage */
  readonly isDark = computed(() => this.resolvedTheme() === 'dark');
  readonly isLight = computed(() => this.resolvedTheme() === 'light');
  readonly isAuto = computed(() => this.theme() === 'auto');

  constructor() {
    // Initialize media query listener
    this.mediaQuery = this.document.defaultView!.matchMedia('(prefers-color-scheme: dark)');

    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', (e) => {
      this.systemTheme.set(e.matches ? 'dark' : 'light');
    });

    // Effect to apply theme changes to DOM
    effect(() => {
      this.applyTheme(this.resolvedTheme());
    });

    // Apply initial theme immediately (without transition)
    this.applyTheme(this.resolvedTheme(), false);
  }

  // ----------------------------------------
  // PUBLIC METHODS
  // ----------------------------------------

  /**
   * Set the theme preference
   * @param theme - The theme to set ('light', 'dark', or 'auto')
   */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.storeTheme(theme);
  }

  /**
   * Toggle between light and dark (ignores auto)
   */
  toggleTheme(): void {
    const newTheme = this.resolvedTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Cycle through themes: light -> dark -> auto -> light
   */
  cycleTheme(): void {
    const current = this.theme();
    const next: Theme = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
    this.setTheme(next);
  }

  // ----------------------------------------
  // PRIVATE METHODS
  // ----------------------------------------

  /**
   * Apply theme to the document
   */
  private applyTheme(theme: ResolvedTheme, withTransition = true): void {
    const html = this.document.documentElement;

    if (withTransition) {
      // Add transition class for smooth theme change
      html.classList.add(THEME_TRANSITION_CLASS);

      // Remove transition class after animation completes
      setTimeout(() => {
        html.classList.remove(THEME_TRANSITION_CLASS);
      }, TRANSITION_DURATION);
    }

    // Apply theme attribute
    html.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  }

  /**
   * Get stored theme from localStorage
   */
  private getStoredTheme(): Theme {
    if (typeof window === 'undefined') return 'auto';

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['light', 'dark', 'auto'].includes(stored)) {
      return stored as Theme;
    }
    return 'auto'; // Default to auto
  }

  /**
   * Store theme preference in localStorage
   */
  private storeTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, theme);
  }

  /**
   * Get system theme preference
   */
  private getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'dark';
    return this.mediaQuery?.matches ? 'dark' : 'light';
  }

  /**
   * Update meta theme-color for mobile browser chrome
   */
  private updateMetaThemeColor(theme: ResolvedTheme): void {
    const metaThemeColor = this.document.querySelector('meta[name="theme-color"]');
    const color = theme === 'dark' ? '#1c1917' : '#ffffff';

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      // Create meta tag if it doesn't exist
      const meta = this.document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      this.document.head.appendChild(meta);
    }
  }
}
