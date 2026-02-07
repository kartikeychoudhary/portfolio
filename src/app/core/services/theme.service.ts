import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Theme type definition: light, dark, or purple
 */
export type Theme = 'light' | 'dark' | 'purple';

/**
 * Manages theme switching between light, dark, and purple themes.
 *
 * Responsibilities:
 * - Applies theme classes on <html> for Tailwind dark mode and PrimeNG theming.
 * - Persists preference to localStorage under key 'theme'.
 * - Exposes an observable `theme$` for reactive binding.
 * - Provides AG Grid theme class based on current theme.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly DEFAULT_THEME: Theme = 'dark';
  private readonly themeSubject: BehaviorSubject<Theme>;

  /** Observable that emits the current theme */
  readonly theme$: Observable<Theme>;

  /** @deprecated Use theme$ instead. Observable that emits true when dark mode is active */
  readonly isDark$: Observable<boolean>;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    const savedTheme = this.isBrowser() ? localStorage.getItem(this.STORAGE_KEY) : null;
    const theme = this.isValidTheme(savedTheme) ? savedTheme as Theme : this.DEFAULT_THEME;
    this.themeSubject = new BehaviorSubject<Theme>(theme);
    this.theme$ = this.themeSubject.asObservable();

    // Backwards compatibility
    this.isDark$ = new Observable<boolean>(subscriber => {
      this.theme$.subscribe(t => subscriber.next(t === 'dark' || t === 'purple'));
    });

    if (this.isBrowser()) {
      this.applyTheme(theme);
    }
  }

  /**
   * Sets the theme to the specified value.
   */
  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);

    if (this.isBrowser()) {
      localStorage.setItem(this.STORAGE_KEY, theme);
      this.applyTheme(theme);
    }
  }

  /**
   * @deprecated Use setTheme() instead. Toggles between dark and light themes.
   */
  toggle(): void {
    const current = this.themeSubject.value;
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  /**
   * Returns the current theme.
   */
  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  /**
   * @deprecated Use getCurrentTheme() instead. Returns the current dark mode state.
   */
  isDark(): boolean {
    const theme = this.themeSubject.value;
    return theme === 'dark' || theme === 'purple';
  }

  /**
   * Returns the appropriate AG Grid theme class.
   */
  getAgGridTheme(): string {
    const theme = this.themeSubject.value;
    return (theme === 'dark' || theme === 'purple') ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
  }

  private applyTheme(theme: Theme): void {
    const htmlElement = document.documentElement;

    // Remove all theme classes
    htmlElement.classList.remove('theme-light', 'theme-dark', 'theme-purple', 'dark');

    // Add new theme class
    htmlElement.classList.add(`theme-${theme}`);

    // Add 'dark' class for Tailwind dark mode (for dark and purple themes)
    if (theme === 'dark' || theme === 'purple') {
      htmlElement.classList.add('dark');
    }

    // Force reflow to ensure CSS updates
    void htmlElement.offsetHeight;
  }

  private isValidTheme(theme: string | null): boolean {
    return theme === 'light' || theme === 'dark' || theme === 'purple';
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
