import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { HeroSectionComponent } from './hero-section.component';
import { PortfolioService } from '../../services/portfolio.service';
import { ProfileDto } from '../../../../core/models/profile.model';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;
  let portfolioServiceMock: { getProfile: ReturnType<typeof vi.fn> };

  const mockProfile: ProfileDto = {
    id: '1',
    fullName: 'Kartikey Chaturvedi',
    title: 'Full Stack Developer',
    tagline: 'Building modern web applications',
    bio: '<p>Bio</p>',
    avatarUrl: 'https://example.com/avatar.jpg',
    resumeUrl: 'https://example.com/resume.pdf',
    socialLinks: []
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getProfile: vi.fn().mockReturnValue(of(mockProfile))
    };

    await TestBed.configureTestingModule({
      declarations: [HeroSectionComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call portfolioService.getProfile on init', () => {
    expect(portfolioServiceMock.getProfile).toHaveBeenCalled();
    expect(component.profile$).toBeDefined();
  });
});
