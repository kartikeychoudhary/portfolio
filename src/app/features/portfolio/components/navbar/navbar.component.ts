import { Component, ChangeDetectionStrategy, HostListener, ChangeDetectorRef, signal } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { ScrollUtilityService } from '../../../../core/services/scroll-utility.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  activeSection = signal('home');

  sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  constructor(
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef,
    private scrollUtility: ScrollUtilityService
  ) {}

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
    this.scrollUtility.scrollToSection(sectionId);
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
