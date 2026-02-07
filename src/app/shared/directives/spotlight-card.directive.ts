import { Directive, ElementRef, OnInit, OnDestroy, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

/**
 * Spotlight Card Directive
 *
 * Adds a mouse-tracking spotlight effect to cards with:
 * - Radial gradient that follows cursor
 * - Theme-aware colors using CSS custom properties
 * - GPU-accelerated animations
 * - Border highlight effect
 *
 * Usage:
 * <div class="card" appSpotlightCard>Card content</div>
 */
@Directive({
  selector: '[appSpotlightCard]',
  standalone: false
})
export class SpotlightCardDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private spotlightOverlay!: HTMLElement;
  private borderOverlay!: HTMLElement;
  private primaryRgb = '59, 130, 246'; // Default blue

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (!this.isBrowser()) {
      return;
    }

    this.setupCard();
    this.createOverlays();
    this.readThemeColor();
    this.setupMouseTracking();
    this.observeThemeChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup card styles for positioning overlays.
   */
  private setupCard(): void {
    const element = this.el.nativeElement;
    const position = window.getComputedStyle(element).position;

    // Ensure card has relative positioning for absolute overlays
    if (position === 'static') {
      this.renderer.setStyle(element, 'position', 'relative');
    }

    // Enable overflow hidden to clip overlays
    this.renderer.setStyle(element, 'overflow', 'hidden');
  }

  /**
   * Create spotlight and border overlay elements.
   */
  private createOverlays(): void {
    // Background glow overlay
    this.spotlightOverlay = this.renderer.createElement('div');
    this.renderer.setStyle(this.spotlightOverlay, 'position', 'absolute');
    this.renderer.setStyle(this.spotlightOverlay, 'top', '0');
    this.renderer.setStyle(this.spotlightOverlay, 'left', '0');
    this.renderer.setStyle(this.spotlightOverlay, 'width', '100%');
    this.renderer.setStyle(this.spotlightOverlay, 'height', '100%');
    this.renderer.setStyle(this.spotlightOverlay, 'opacity', '0');
    this.renderer.setStyle(this.spotlightOverlay, 'transition', 'opacity 300ms ease');
    this.renderer.setStyle(this.spotlightOverlay, 'pointer-events', 'none');
    this.renderer.setStyle(this.spotlightOverlay, 'z-index', '1');
    this.renderer.appendChild(this.el.nativeElement, this.spotlightOverlay);

    // Border highlight overlay
    this.borderOverlay = this.renderer.createElement('div');
    this.renderer.setStyle(this.borderOverlay, 'position', 'absolute');
    this.renderer.setStyle(this.borderOverlay, 'top', '0');
    this.renderer.setStyle(this.borderOverlay, 'left', '0');
    this.renderer.setStyle(this.borderOverlay, 'width', '100%');
    this.renderer.setStyle(this.borderOverlay, 'height', '100%');
    this.renderer.setStyle(this.borderOverlay, 'opacity', '0');
    this.renderer.setStyle(this.borderOverlay, 'transition', 'opacity 300ms ease');
    this.renderer.setStyle(this.borderOverlay, 'pointer-events', 'none');
    this.renderer.setStyle(this.borderOverlay, 'border-radius', 'inherit');
    this.renderer.setStyle(this.borderOverlay, 'z-index', '2');
    this.renderer.appendChild(this.el.nativeElement, this.borderOverlay);

    // Ensure card content is above overlays
    const children = Array.from(this.el.nativeElement.children).filter(
      child => child !== this.spotlightOverlay && child !== this.borderOverlay
    );
    children.forEach(child => {
      if (child instanceof HTMLElement) {
        this.renderer.setStyle(child, 'position', 'relative');
        this.renderer.setStyle(child, 'z-index', '3');
      }
    });
  }

  /**
   * Read primary color RGB value from CSS custom properties.
   */
  private readThemeColor(): void {
    const rgb = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary-rgb')
      .trim();

    if (rgb) {
      this.primaryRgb = rgb;
    }
  }

  /**
   * Setup mouse tracking with throttled events.
   */
  private setupMouseTracking(): void {
    const element = this.el.nativeElement;

    // Mouse enter - show spotlight
    fromEvent<MouseEvent>(element, 'mouseenter')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.renderer.setStyle(this.spotlightOverlay, 'opacity', '1');
        this.renderer.setStyle(this.borderOverlay, 'opacity', '1');
      });

    // Mouse move - update spotlight position
    fromEvent<MouseEvent>(element, 'mousemove')
      .pipe(
        throttleTime(16), // ~60fps
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        this.updateSpotlightPosition(event);
      });

    // Mouse leave - hide spotlight
    fromEvent<MouseEvent>(element, 'mouseleave')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.renderer.setStyle(this.spotlightOverlay, 'opacity', '0');
        this.renderer.setStyle(this.borderOverlay, 'opacity', '0');
      });
  }

  /**
   * Update spotlight position based on mouse coordinates.
   */
  private updateSpotlightPosition(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Background glow gradient
    const backgroundGradient = `radial-gradient(600px circle at ${x}px ${y}px, rgba(${this.primaryRgb}, 0.15), transparent 40%)`;
    this.renderer.setStyle(this.spotlightOverlay, 'background', backgroundGradient);

    // Border highlight gradient
    const borderGradient = `radial-gradient(400px circle at ${x}px ${y}px, rgba(${this.primaryRgb}, 0.3), transparent 40%)`;
    this.renderer.setStyle(this.borderOverlay, 'background', borderGradient);
  }

  /**
   * Observe theme changes using MutationObserver to update colors.
   */
  private observeThemeChanges(): void {
    const observer = new MutationObserver(() => {
      this.readThemeColor();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup on destroy
    this.destroy$.subscribe(() => observer.disconnect());
  }

  /**
   * Check if platform is browser.
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
