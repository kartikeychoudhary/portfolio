import {
  Component, ChangeDetectionStrategy, OnInit, OnDestroy,
  AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID,
  ChangeDetectorRef, NgZone
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, Subject, fromEvent } from 'rxjs';
import { map, catchError, takeUntil, throttleTime } from 'rxjs/operators';
import { PortfolioService } from '../../services/portfolio.service';
import { ExperienceDto } from '../../../../core/models/experience.model';

@Component({
  selector: 'app-experience-section',
  standalone: false,
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('experienceSection', { static: true }) sectionRef!: ElementRef<HTMLElement>;

  experiences$!: Observable<ExperienceDto[]>;
  sectionScrollProgress = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.experiences$ = this.portfolioService.getExperiences().pipe(
      map(experiences =>
        [...experiences].sort((a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )
      ),
      catchError(error => {
        console.error('Failed to load experiences:', error);
        return of([]);
      })
    );
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'scroll', { passive: true })
        .pipe(
          throttleTime(16, undefined, { leading: true, trailing: true }),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          const progress = this.calculateSectionProgress();
          if (progress !== this.sectionScrollProgress) {
            this.sectionScrollProgress = progress;
            this.ngZone.run(() => this.cdr.markForCheck());
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getYear(exp: ExperienceDto): string {
    if (exp.isCurrent) return 'NOW';
    return new Date(exp.startDate).getFullYear().toString();
  }

  getEntryOpacity(index: number, total: number): number {
    if (total <= 1) return 1;
    const fadeStart = Math.max(0, total - 3);
    if (index < fadeStart) return 1;
    const fadeProgress = (index - fadeStart) / (total - fadeStart);
    return 1 - (fadeProgress * 0.7);
  }

  private calculateSectionProgress(): number {
    const section = this.sectionRef.nativeElement;
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.top >= viewportHeight) return 0;
    if (rect.bottom <= 0) return 1;

    const totalScrollDistance = rect.height + viewportHeight;
    const scrolled = viewportHeight - rect.top;
    return Math.max(0, Math.min(1, scrolled / totalScrollDistance));
  }
}
