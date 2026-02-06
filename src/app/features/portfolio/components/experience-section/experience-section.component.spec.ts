import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { ExperienceSectionComponent } from './experience-section.component';
import { PortfolioService } from '../../services/portfolio.service';
import { ExperienceDto } from '../../../../core/models/experience.model';

describe('ExperienceSectionComponent', () => {
  let component: ExperienceSectionComponent;
  let fixture: ComponentFixture<ExperienceSectionComponent>;
  let portfolioServiceMock: { getExperiences: ReturnType<typeof vi.fn> };

  const mockExperiences: ExperienceDto[] = [
    {
      id: '1',
      company: 'Tech Corp',
      role: 'Senior Developer',
      location: 'Remote',
      startDate: '2023-01-01',
      endDate: null,
      isCurrent: true,
      description: '<p>Building awesome apps</p>',
      technologies: ['Angular', 'TypeScript'],
      sortOrder: 1
    }
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getExperiences: vi.fn().mockReturnValue(of(mockExperiences))
    };

    await TestBed.configureTestingModule({
      declarations: [ExperienceSectionComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getExperiences on init', () => {
    expect(portfolioServiceMock.getExperiences).toHaveBeenCalled();
    expect(component.experiences$).toBeDefined();
  });
});
