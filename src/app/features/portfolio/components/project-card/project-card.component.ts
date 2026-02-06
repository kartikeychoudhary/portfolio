import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ProjectDto } from '../../../../core/models/project.model';

@Component({
  selector: 'app-project-card',
  standalone: false,
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
  @Input() project!: ProjectDto;
}
