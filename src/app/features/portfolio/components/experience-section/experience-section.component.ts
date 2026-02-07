import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PortfolioService } from '../../services/portfolio.service';
import { ExperienceDto } from '../../../../core/models/experience.model';

@Component({
  selector: 'app-experience-section',
  standalone: false,
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceSectionComponent implements OnInit {
  experiences$!: Observable<ExperienceDto[]>;
  selectedIndex = signal(0);
  selectedExperience = signal<ExperienceDto | null>(null);

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    // Get experiences sorted by start date (newest first)
    this.experiences$ = this.portfolioService.getExperiences().pipe(
      map(experiences => {
        const sorted = [...experiences].sort((a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        // Set the first (most recent) experience as selected
        if (sorted.length > 0) {
          this.selectedExperience.set(sorted[0]);
        }
        return sorted;
      })
    );
  }

  selectExperience(index: number, experience: ExperienceDto): void {
    this.selectedIndex.set(index);
    this.selectedExperience.set(experience);
  }

  calculateDuration(exp: ExperienceDto): string {
    const start = new Date(exp.startDate);
    const end = exp.isCurrent ? new Date() : new Date(exp.endDate || '');

    const months = (end.getFullYear() - start.getFullYear()) * 12 +
                   (end.getMonth() - start.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
