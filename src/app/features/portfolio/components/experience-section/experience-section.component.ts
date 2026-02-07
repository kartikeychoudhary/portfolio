import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    // Get experiences sorted by start date (newest first)
    this.experiences$ = this.portfolioService.getExperiences().pipe(
      map(experiences =>
        [...experiences].sort((a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )
      ),
      catchError(error => {
        console.error('Failed to load experiences, using fallback data:', error);
        // Return empty array as fallback when API fails
        return of([]);
      })
    );
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
