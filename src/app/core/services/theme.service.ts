import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Manages dark/light theme toggling.
 *
 * Responsibilities:
 * - Toggles `dark` class on <html> for Tailwind dark mode and PrimeNG dark mode selector.
 * - Persists preference to localStorage under key 'theme'.
 * - Exposes an observable `isDark$` for reactive binding.
 * - Provides AG Grid theme class based on current theme.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly isDarkSubject: BehaviorSubject<boolean>;

  /** Observable that emits true when dark mode is active */
  readonly isDark$: Observable<boolean>;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    const savedTheme = this.isBrowser() ? localStorage.getItem(this.STORAGE_KEY) : null;
    const isDark = savedTheme === 'dark';
    this.isDarkSubject = new BehaviorSubject<boolean>(isDark);
    this.isDark$ = this.isDarkSubject.asObservable();

    if (this.isBrowser()) {
      this.applyTheme(isDark);
    }
  }

  /**
   * Toggles between dark and light themes.
   */
  toggle(): void {
    const newValue = !this.isDarkSubject.value;
    this.isDarkSubject.next(newValue);

    if (this.isBrowser()) {
      localStorage.setItem(this.STORAGE_KEY, newValue ? 'dark' : 'light');
      this.applyTheme(newValue);
    }
  }

  /**
   * Returns the current dark mode state.
   */
  isDark(): boolean {
    return this.isDarkSubject.value;
  }

  /**
   * Returns the appropriate AG Grid theme class.
   */
  getAgGridTheme(): string {
    return this.isDarkSubject.value ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
  }

  private applyTheme(isDark: boolean): void {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
