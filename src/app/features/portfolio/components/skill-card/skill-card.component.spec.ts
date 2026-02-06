import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillCardComponent } from './skill-card.component';
import { SkillDto } from '../../../../core/models/skill.model';

describe('SkillCardComponent', () => {
  let component: SkillCardComponent;
  let fixture: ComponentFixture<SkillCardComponent>;

  const mockSkill: SkillDto = {
    id: '1',
    name: 'Angular',
    icon: 'fa-brands fa-angular',
    category: 'frontend',
    proficiency: 90,
    sortOrder: 1
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillCardComponent],
      imports: [CommonModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('skill', mockSkill);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display skill name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h3');
    expect(heading?.textContent?.trim()).toBe('Angular');
  });
});
