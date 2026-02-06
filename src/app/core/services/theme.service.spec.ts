import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light mode when no saved preference', () => {
    expect(service.isDark()).toBe(false);
  });

  it('should toggle to dark mode', () => {
    service.toggle();
    expect(service.isDark()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle back to light mode', () => {
    service.toggle();
    service.toggle();
    expect(service.isDark()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should persist theme to localStorage', () => {
    service.toggle();
    expect(localStorage.getItem('theme')).toBe('dark');
    service.toggle();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should emit isDark$ observable values', () => {
    return new Promise<void>((resolve) => {
      const values: boolean[] = [];
      service.isDark$.subscribe(val => {
        values.push(val);
        if (values.length === 2) {
          expect(values).toEqual([false, true]);
          resolve();
        }
      });
      service.toggle();
    });
  });

  it('should return correct AG Grid theme class', () => {
    expect(service.getAgGridTheme()).toBe('ag-theme-alpine');
    service.toggle();
    expect(service.getAgGridTheme()).toBe('ag-theme-alpine-dark');
  });

  it('should load dark theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    const newService = new ThemeService('browser' as unknown as object);
    expect(newService.isDark()).toBe(true);
  });
});
