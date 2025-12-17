import { Injectable, Renderer2, RendererFactory2, signal, computed, effect } from '@angular/core';

// ============================================
// TYPES
// ============================================
export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

// ============================================
// CONSTANTS
// ============================================
const STORAGE_KEY = 'soskate-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly renderer: Renderer2;
  private mediaQuery: MediaQueryList | null = null;

  // ----------------------------------------
  // SIGNALS
  // ----------------------------------------
  private readonly _theme = signal<Theme>(this.getStoredTheme());
  private readonly _systemTheme = signal<ResolvedTheme>(this.detectSystemTheme());

  /** User's theme preference (light, dark, or auto) */
  readonly theme = this._theme.asReadonly();

  /** System preference (light or dark) */
  readonly systemTheme = this._systemTheme.asReadonly();

  /** The actual applied theme (resolved from auto if needed) */
  readonly resolvedTheme = computed<ResolvedTheme>(() => {
    const currentTheme = this._theme();
    if (currentTheme === 'auto') {
      return this._systemTheme();
    }
    return currentTheme;
  });

  /** Helper computed for template usage */
  readonly isDark = computed(() => this.resolvedTheme() === 'dark');
  readonly isLight = computed(() => this.resolvedTheme() === 'light');
  readonly isAuto = computed(() => this._theme() === 'auto');

  constructor(rendererFactory: RendererFactory2) {
    // Create renderer (works in SSR and browser)
    this.renderer = rendererFactory.createRenderer(null, null);

    console.log('[ThemeService] Constructor called');
    console.log('[ThemeService] Stored theme:', this.getStoredTheme());
    console.log('[ThemeService] System theme:', this.detectSystemTheme());

    // Setup system theme listener (browser only)
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Listen for system theme changes
      this.mediaQuery.addEventListener('change', (e: MediaQueryListEvent) => {
        console.log('[ThemeService] System theme changed:', e.matches ? 'dark' : 'light');
        this._systemTheme.set(e.matches ? 'dark' : 'light');
      });
    }

    // Apply theme whenever resolvedTheme changes
    effect(() => {
      const theme = this.resolvedTheme();
      console.log('[ThemeService] Effect triggered, applying theme:', theme);
      this.applyThemeToDOM(theme);
    });

    // Apply initial theme immediately
    this.applyThemeToDOM(this.resolvedTheme());
  }

  // ----------------------------------------
  // PUBLIC METHODS
  // ----------------------------------------

  /**
   * Set the theme preference
   */
  setTheme(theme: Theme): void {
    console.log('[ThemeService] setTheme called:', theme);
    this._theme.set(theme);
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
   * Initialize the theme (call this from AppComponent or APP_INITIALIZER)
   */
  initialize(): void {
    console.log('[ThemeService] initialize() called');
    this.applyThemeToDOM(this.resolvedTheme());
  }

  // ----------------------------------------
  // PRIVATE METHODS
  // ----------------------------------------

  /**
   * Get stored theme from localStorage
   */
  private getStoredTheme(): Theme {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'auto';
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['light', 'dark', 'auto'].includes(stored)) {
        return stored as Theme;
      }
    } catch (e) {
      console.warn('[ThemeService] Error reading localStorage:', e);
    }

    return 'auto';
  }

  /**
   * Store theme in localStorage
   */
  private storeTheme(theme: Theme): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme);
      console.log('[ThemeService] Theme stored:', theme);
    } catch (e) {
      console.warn('[ThemeService] Error writing localStorage:', e);
    }
  }

  /**
   * Detect system theme preference
   */
  private detectSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') {
      return 'dark'; // Default for SSR
    }

    try {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('[ThemeService] System prefers dark:', prefersDark);
      return prefersDark ? 'dark' : 'light';
    } catch (e) {
      console.warn('[ThemeService] Error detecting system theme:', e);
      return 'dark';
    }
  }

  /**
   * Apply theme to DOM using Renderer2
   */
  private applyThemeToDOM(theme: ResolvedTheme): void {
    if (typeof document === 'undefined') {
      return;
    }

    console.log('[ThemeService] Applying to DOM:', theme);

    // Use Renderer2 for SSR compatibility
    const html = document.documentElement;
    this.renderer.setAttribute(html, 'data-theme', theme);

    // Also add transition class for smooth changes
    this.renderer.addClass(html, 'theme-transition');
    setTimeout(() => {
      this.renderer.removeClass(html, 'theme-transition');
    }, 300);

    // Update meta theme-color
    this.updateMetaThemeColor(theme);
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  private updateMetaThemeColor(theme: ResolvedTheme): void {
    if (typeof document === 'undefined') {
      return;
    }

    const color = theme === 'dark' ? '#1c1917' : '#ffffff';
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;

    if (meta) {
      meta.content = color;
    } else {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }
}
