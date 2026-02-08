import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { SiteSettingsDto, AVATAR_SIZE_MAP, DEFAULT_SETTINGS, AvatarSize } from '../models/settings.model';

/**
 * Service for managing site-wide settings (avatar size, accent color, font, section visibility).
 * Fetches from /api/settings and applies CSS variables to the document root.
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<SiteSettingsDto>(DEFAULT_SETTINGS);
  private loaded = false;

  /** Observable of current settings for components to subscribe to */
  settings$ = this.settingsSubject.asObservable();

  constructor(private api: ApiService) {}

  /**
   * Gets settings from cache or API.
   */
  getSettings(): Observable<SiteSettingsDto> {
    if (this.loaded) {
      return of(this.settingsSubject.value);
    }
    return this.api.get<SiteSettingsDto>('/settings').pipe(
      tap(settings => {
        this.settingsSubject.next(settings);
        this.loaded = true;
      })
    );
  }

  /**
   * Updates settings via API and applies them immediately.
   */
  updateSettings(settings: SiteSettingsDto): Observable<SiteSettingsDto> {
    return this.api.put<SiteSettingsDto>('/settings', settings).pipe(
      tap(saved => {
        this.settingsSubject.next(saved);
        this.applySettings(saved);
      })
    );
  }

  /**
   * Loads settings from API and applies CSS variables. Call on app startup.
   */
  loadAndApplySettings(): void {
    this.getSettings().subscribe({
      next: settings => this.applySettings(settings),
      error: () => this.applySettings(DEFAULT_SETTINGS),
    });
  }

  /**
   * Applies settings as CSS variables to document root.
   */
  applySettings(settings: SiteSettingsDto): void {
    const root = document.documentElement;

    // Avatar size
    const avatarSize = AVATAR_SIZE_MAP[settings.avatarSize as AvatarSize] || AVATAR_SIZE_MAP.medium;
    root.style.setProperty('--hero-avatar-size', avatarSize);

    // Generate color palette from accent color
    this.applyColorPalette(settings.accentColor);

    // Font family
    root.style.setProperty('--font-family', `'${settings.fontFamily}', sans-serif`);
    this.loadGoogleFont(settings.fontFamily);
  }

  /**
   * Generates a full color palette (50-900) from a single hex color using HSL manipulation.
   */
  private applyColorPalette(hex: string): void {
    const root = document.documentElement;
    const { h, s, l } = this.hexToHsl(hex);

    // Generate shades (lighter to darker)
    const shades: Record<number, { s: number; l: number }> = {
      50:  { s: Math.min(s + 10, 100), l: 96 },
      100: { s: Math.min(s + 8, 100),  l: 91 },
      200: { s: Math.min(s + 5, 100),  l: 82 },
      300: { s: Math.min(s + 2, 100),  l: 70 },
      400: { s: s,                      l: 58 },
      500: { s: s,                      l: l },
      600: { s: s,                      l: Math.max(l - 8, 10) },
      700: { s: Math.max(s - 3, 0),    l: Math.max(l - 16, 10) },
      800: { s: Math.max(s - 5, 0),    l: Math.max(l - 24, 10) },
      900: { s: Math.max(s - 8, 0),    l: Math.max(l - 32, 5) },
    };

    for (const [shade, { s: ss, l: ll }] of Object.entries(shades)) {
      const color = this.hslToHex(h, ss, ll);
      root.style.setProperty(`--color-primary-${shade}`, color);
    }

    // Also set an RGB version for opacity usage
    const { r, g, b } = this.hexToRgb(hex);
    root.style.setProperty('--color-primary-rgb', `${r}, ${g}, ${b}`);

    // Set the main accent as primary-500
    root.style.setProperty('--color-primary', hex);
  }

  /**
   * Dynamically loads a Google Font by injecting a <link> tag.
   */
  private loadGoogleFont(fontFamily: string): void {
    const existingLink = document.getElementById('dynamic-font');
    if (existingLink) existingLink.remove();

    const link = document.createElement('link');
    link.id = 'dynamic-font';
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }

  // ── Color Utility Methods ───────────────────────────────

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 59, g: 130, b: 246 };
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const { r, g, b } = this.hexToRgb(hex);
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let h = 0, s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
        case gn: h = ((bn - rn) / d + 2) / 6; break;
        case bn: h = ((rn - gn) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  private hslToHex(h: number, s: number, l: number): string {
    const sn = s / 100, ln = l / 100;
    const a = sn * Math.min(ln, 1 - ln);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
}
