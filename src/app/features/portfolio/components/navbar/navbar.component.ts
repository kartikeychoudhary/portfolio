import { Component, ChangeDetectionStrategy, HostListener, ChangeDetectorRef, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../core/services/theme.service';
import { ScrollUtilityService } from '../../../../core/services/scroll-utility.service';
import { SettingsService } from '../../../../core/services/settings.service';
import { SiteSettingsDto } from '../../../../core/models/settings.model';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit, OnDestroy {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  activeSection = signal('home');

  private allSections = [
    { id: 'home', label: 'Home', visibilityKey: 'heroVisible' },
    { id: 'about', label: 'About', visibilityKey: 'aboutVisible' },
    { id: 'skills', label: 'Skills', visibilityKey: 'skillsVisible' },
    { id: 'experience', label: 'Experience', visibilityKey: 'experienceVisible' },
    { id: 'projects', label: 'Projects', visibilityKey: 'projectsVisible' },
    { id: 'contact', label: 'Contact', visibilityKey: 'contactVisible' }
  ];

  sections: { id: string; label: string }[] = this.allSections;

  private settingsSub?: Subscription;

  constructor(
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef,
    private scrollUtility: ScrollUtilityService,
    private router: Router,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.settingsSub = this.settingsService.settings$.subscribe(settings => {
      this.sections = this.allSections.filter(
        s => (settings as unknown as Record<string, unknown>)[s.visibilityKey] !== false
      );
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.settingsSub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    // Update scrolled state for navbar background
    this.isScrolled.set(window.scrollY > 50);

    // Track active section based on scroll position
    this.updateActiveSection();
  }

  private updateActiveSection(): void {
    const scrollPosition = window.scrollY + 100; // Offset for navbar height

    for (const section of this.sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          this.activeSection.set(section.id);
          break;
        }
      }
    }
  }

  scrollTo(sectionId: string): void {
    this.closeMobileMenu();

    // If not on the portfolio page, navigate there first then scroll
    if (this.router.url !== '/' && !this.router.url.startsWith('/#')) {
      this.router.navigate(['/'], { fragment: sectionId }).then(() => {
        setTimeout(() => this.scrollUtility.scrollToSection(sectionId), 100);
      });
    } else {
      this.scrollUtility.scrollToSection(sectionId);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
