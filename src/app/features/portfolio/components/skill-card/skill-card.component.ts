import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SkillDto } from '../../../../core/models/skill.model';

@Component({
  selector: 'app-skill-card',
  standalone: false,
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillCardComponent {
  @Input() skill!: SkillDto;
}
