import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { PortfolioService } from './portfolio.service';
import { ApiService } from '../../../core/services/api.service';
import { ProfileDto } from '../../../core/models/profile.model';
import { SkillDto } from '../../../core/models/skill.model';
import { ExperienceDto } from '../../../core/models/experience.model';
import { ProjectDto } from '../../../core/models/project.model';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let apiMock: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiMock = {
      get: vi.fn(),
      post: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        PortfolioService,
        { provide: ApiService, useValue: apiMock }
      ]
    });

    service = TestBed.inject(PortfolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch profile from /profile', () => {
    const mockProfile: ProfileDto = {
      id: '1', fullName: 'Test', title: 'Dev', tagline: 'tag',
      bio: '<p>Bio</p>', avatarUrl: 'url', resumeUrl: 'url', socialLinks: []
    };
    apiMock.get.mockReturnValue(of(mockProfile));

    service.getProfile().subscribe(result => {
      expect(result).toEqual(mockProfile);
    });

    expect(apiMock.get).toHaveBeenCalledWith('/profile');
  });

  it('should fetch skills from /skills', () => {
    const mockSkills: SkillDto[] = [
      { id: '1', name: 'Angular', icon: 'icon', category: 'frontend', proficiency: 90, sortOrder: 1 }
    ];
    apiMock.get.mockReturnValue(of(mockSkills));

    service.getSkills().subscribe(result => {
      expect(result).toEqual(mockSkills);
    });

    expect(apiMock.get).toHaveBeenCalledWith('/skills');
  });

  it('should fetch experiences from /experiences', () => {
    const mockExperiences: ExperienceDto[] = [
      { id: '1', company: 'Co', role: 'Dev', location: 'City', startDate: '2023-01-01',
        endDate: null, isCurrent: true, description: 'desc', technologies: ['Angular'], sortOrder: 1 }
    ];
    apiMock.get.mockReturnValue(of(mockExperiences));

    service.getExperiences().subscribe(result => {
      expect(result).toEqual(mockExperiences);
    });

    expect(apiMock.get).toHaveBeenCalledWith('/experiences');
  });

  it('should fetch projects from /projects', () => {
    const mockProjects: ProjectDto[] = [
      { id: '1', title: 'Proj', description: 'desc', thumbnailUrl: 'url',
        technologies: ['Angular'], featured: true, sortOrder: 1 }
    ];
    apiMock.get.mockReturnValue(of(mockProjects));

    service.getProjects().subscribe(result => {
      expect(result).toEqual(mockProjects);
    });

    expect(apiMock.get).toHaveBeenCalledWith('/projects');
  });

  it('should submit contact to /contacts', () => {
    const contact = { name: 'John', email: 'j@test.com', subject: 'Test', message: 'Hello' };
    apiMock.post.mockReturnValue(of(contact));

    service.submitContact(contact).subscribe(result => {
      expect(result).toEqual(contact);
    });

    expect(apiMock.post).toHaveBeenCalledWith('/contacts', contact);
  });
});
