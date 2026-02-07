import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { throttleTime, map } from 'rxjs/operators';

/**
 * Centralized scroll-related functionality service.
 *
 * Responsibilities:
 * - Track scroll progress (0-100%)
 * - Smooth scroll to sections with navbar offset
 * - Scroll to top functionality
 * - Provide RxJS observable for scroll progress
 */
@Injectable({
  providedIn: 'root'
})
export class ScrollUtilityService {
  private readonly NAVBAR_HEIGHT = 64;
  private readonly SCROLL_THROTTLE_MS = 16; // ~60fps
  private scrollProgressSubject = new BehaviorSubject<number>(0);

  /** Observable that emits scroll progress percentage (0-100) */
  readonly scrollProgress$: Observable<number> = this.scrollProgressSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (this.isBrowser()) {
      this.initScrollListener();
    }
  }

  /**
   * Initialize scroll event listener with throttling.
   */
  private initScrollListener(): void {
    fromEvent(window, 'scroll', { passive: true })
      .pipe(
        throttleTime(this.SCROLL_THROTTLE_MS),
        map(() => this.calculateScrollProgress())
      )
      .subscribe(progress => this.scrollProgressSubject.next(progress));
  }

  /**
   * Calculate current scroll progress as a percentage (0-100).
   */
  private calculateScrollProgress(): number {
    if (!this.isBrowser()) {
      return 0;
    }

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Avoid division by zero
    const scrollableHeight = documentHeight - windowHeight;
    if (scrollableHeight <= 0) {
      return 0;
    }

    const progress = (scrollTop / scrollableHeight) * 100;
    return Math.min(100, Math.max(0, progress));
  }

  /**
   * Smooth scroll to a section by ID with navbar offset.
   *
   * @param sectionId - The ID of the section to scroll to
   * @param offset - Optional custom offset (defaults to navbar height)
   */
  scrollToSection(sectionId: string, offset: number = this.NAVBAR_HEIGHT): void {
    if (!this.isBrowser()) {
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Scroll to the top of the page smoothly.
   */
  scrollToTop(): void {
    if (!this.isBrowser()) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Get current scroll position.
   */
  getCurrentScrollPosition(): number {
    if (!this.isBrowser()) {
      return 0;
    }

    return window.scrollY || document.documentElement.scrollTop;
  }

  /**
   * Check if platform is browser.
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
