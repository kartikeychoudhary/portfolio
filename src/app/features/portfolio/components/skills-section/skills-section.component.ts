import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PortfolioService } from '../../services/portfolio.service';
import { SkillDto, SkillCategory } from '../../../../core/models/skill.model';

@Component({
  selector: 'app-skills-section',
  standalone: false,
  templateUrl: './skills-section.component.html',
  styleUrls: ['./skills-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsSectionComponent implements OnInit {
  skills$!: Observable<SkillDto[]>;
  selectedCategory: SkillCategory | 'all' = 'all';

  categories: { label: string; value: SkillCategory | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
    { label: 'Database', value: 'database' },
    { label: 'DevOps', value: 'devops' },
    { label: 'Tools', value: 'tools' }
  ];

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.skills$ = this.portfolioService.getSkills().pipe(
      catchError(error => {
        console.error('Failed to load skills, using fallback data:', error);
        // Return empty array as fallback when API fails
        return of([]);
      })
    );
  }

  filterSkills(skills: SkillDto[]): SkillDto[] {
    if (this.selectedCategory === 'all') {
      return skills;
    }
    return skills.filter(s => s.category === this.selectedCategory);
  }

  onCategoryChange(category: SkillCategory | 'all'): void {
    this.selectedCategory = category;
  }
}
