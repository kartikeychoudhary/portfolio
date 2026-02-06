import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { ProjectsSectionComponent } from './projects-section.component';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectDto } from '../../../../core/models/project.model';

describe('ProjectsSectionComponent', () => {
  let component: ProjectsSectionComponent;
  let fixture: ComponentFixture<ProjectsSectionComponent>;
  let portfolioServiceMock: { getProjects: ReturnType<typeof vi.fn> };

  const mockProjects: ProjectDto[] = [
    {
      id: '1',
      title: 'Portfolio App',
      description: 'A personal portfolio website',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com/example/portfolio',
      technologies: ['Angular', 'TypeScript'],
      featured: true,
      sortOrder: 1
    },
    {
      id: '2',
      title: 'Chat App',
      description: 'A real-time chat application',
      thumbnailUrl: 'https://example.com/thumb2.jpg',
      technologies: ['React', 'Node.js'],
      featured: false,
      sortOrder: 2
    }
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getProjects: vi.fn().mockReturnValue(of(mockProjects))
    };

    await TestBed.configureTestingModule({
      declarations: [ProjectsSectionComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProjects on init', () => {
    expect(portfolioServiceMock.getProjects).toHaveBeenCalled();
    expect(component.projects$).toBeDefined();
  });
});
