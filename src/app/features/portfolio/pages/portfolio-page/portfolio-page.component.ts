import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';
import { SettingsService } from '../../../../core/services/settings.service';
import { SiteSettingsDto, DEFAULT_SETTINGS } from '../../../../core/models/settings.model';

@Component({
  selector: 'app-portfolio-page',
  standalone: false,
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioPageComponent implements OnInit, OnDestroy {
  isLoading = true;
  settings: SiteSettingsDto = DEFAULT_SETTINGS;
  private settingsSub?: Subscription;

  constructor(
    private portfolioService: PortfolioService,
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to settings for section visibility
    this.settingsSub = this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;
      this.cdr.markForCheck();
    });

    // Pre-fetch all data into cache, then hide loader
    forkJoin([
      this.portfolioService.getProfile(),
      this.portfolioService.getSkills(),
      this.portfolioService.getExperiences(),
      this.portfolioService.getProjects()
    ]).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // Still hide loader on error — sections handle their own fallbacks
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.settingsSub?.unsubscribe();
  }
}
