import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PortfolioService } from '../../services/portfolio.service';
import { ProfileDto } from '../../../../core/models/profile.model';

@Component({
  selector: 'app-hero-section',
  standalone: false,
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent implements OnInit {
  profile$!: Observable<ProfileDto>;

  constructor(
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.profile$ = this.portfolioService.getProfile().pipe(
      catchError(error => {
        console.error('Failed to load profile, using fallback data:', error);
        // Return fallback profile data when API fails
        return of({
          id: '1',
          fullName: 'Your Name',
          title: 'Full Stack Developer',
          email: 'your.email@example.com',
          phone: '',
          tagline: 'Building innovative solutions with modern technologies',
          bio: '',
          avatarUrl: 'assets/images/avatar.png',
          resumeUrl: '',
          socialLinks: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as ProfileDto);
      })
    );
  }

  scrollToNext(): void {
    const element = document.getElementById('skills');
    if (element) {
      const navbarHeight = 64;
      const targetPosition = element.offsetTop - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  downloadResume(profile: ProfileDto): void {
    if (profile.resumeUrl) {
      window.open(profile.resumeUrl, '_blank');
    }
  }

  /**
   * Get avatar URL for display (supports both URL and Base64)
   */
  getAvatarUrl(profile: ProfileDto | null): string {
    if (!profile) {
      return 'assets/images/avatar.png';
    }

    // Use Base64 data if available
    if (profile.avatarBase64 && profile.avatarContentType) {
      return `data:${profile.avatarContentType};base64,${profile.avatarBase64}`;
    }

    // Fallback to URL or default
    return profile.avatarUrl || 'assets/images/avatar.png';
  }
}
