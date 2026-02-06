import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  standalone: false,
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
