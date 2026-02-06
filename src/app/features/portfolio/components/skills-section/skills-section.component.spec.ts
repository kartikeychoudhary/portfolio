import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { SkillsSectionComponent } from './skills-section.component';
import { PortfolioService } from '../../services/portfolio.service';
import { SkillDto } from '../../../../core/models/skill.model';

describe('SkillsSectionComponent', () => {
  let component: SkillsSectionComponent;
  let fixture: ComponentFixture<SkillsSectionComponent>;
  let portfolioServiceMock: { getSkills: ReturnType<typeof vi.fn> };

  const mockSkills: SkillDto[] = [
    { id: '1', name: 'Angular', icon: 'fa-brands fa-angular', category: 'frontend', proficiency: 90, sortOrder: 1 },
    { id: '2', name: 'Node.js', icon: 'fa-brands fa-node', category: 'backend', proficiency: 85, sortOrder: 2 }
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getSkills: vi.fn().mockReturnValue(of(mockSkills))
    };

    await TestBed.configureTestingModule({
      declarations: [SkillsSectionComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSkills on init', () => {
    expect(portfolioServiceMock.getSkills).toHaveBeenCalled();
    expect(component.skills$).toBeDefined();
  });
});
