import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ExperienceDto } from '../../../../core/models/experience.model';

@Component({
  selector: 'app-experience-timeline',
  standalone: false,
  templateUrl: './experience-timeline.component.html',
  styleUrls: ['./experience-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceTimelineComponent {
  @Input() experiences: ExperienceDto[] = [];

  formatDateRange(exp: ExperienceDto): string {
    const start = new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (exp.isCurrent) {
      return `${start} - Present`;
    }
    const end = exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
    return `${start} - ${end}`;
  }
}
