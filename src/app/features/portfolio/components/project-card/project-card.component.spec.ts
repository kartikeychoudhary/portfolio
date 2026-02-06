import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from './project-card.component';
import { ProjectDto } from '../../../../core/models/project.model';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  const mockProject: ProjectDto = {
    id: '1',
    title: 'Portfolio App',
    description: 'A personal portfolio website',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/portfolio',
    technologies: ['Angular', 'TypeScript'],
    featured: true,
    sortOrder: 1
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectCardComponent],
      imports: [CommonModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', mockProject);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display project title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h3');
    expect(heading?.textContent?.trim()).toBe('Portfolio App');
  });
});
