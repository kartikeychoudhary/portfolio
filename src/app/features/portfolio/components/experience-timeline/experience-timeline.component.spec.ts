import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceTimelineComponent } from './experience-timeline.component';
import { ExperienceDto } from '../../../../core/models/experience.model';

describe('ExperienceTimelineComponent', () => {
  let component: ExperienceTimelineComponent;
  let fixture: ComponentFixture<ExperienceTimelineComponent>;

  const mockExperiences: ExperienceDto[] = [
    {
      id: '1',
      company: 'Tech Corp',
      role: 'Senior Developer',
      location: 'Remote',
      startDate: '2023-01-15',
      endDate: null,
      isCurrent: true,
      description: '<p>Building awesome apps</p>',
      technologies: ['Angular', 'TypeScript'],
      sortOrder: 1
    },
    {
      id: '2',
      company: 'Startup Inc',
      role: 'Junior Developer',
      location: 'New York',
      startDate: '2021-06-01',
      endDate: '2022-12-31',
      isCurrent: false,
      description: '<p>Frontend development</p>',
      technologies: ['React', 'JavaScript'],
      sortOrder: 2
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExperienceTimelineComponent],
      imports: [CommonModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date range correctly for current position', () => {
    const result = component.formatDateRange(mockExperiences[0]);
    expect(result).toContain('Jan 2023');
    expect(result).toContain('Present');
  });

  it('should format date range correctly for past position', () => {
    const result = component.formatDateRange(mockExperiences[1]);
    expect(result).toContain('Jun 2021');
    expect(result).toContain('Dec 2022');
  });
});
