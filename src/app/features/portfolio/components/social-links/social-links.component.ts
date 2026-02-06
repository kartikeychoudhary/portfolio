import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SocialLink } from '../../../../core/models/profile.model';

@Component({
  selector: 'app-social-links',
  standalone: false,
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialLinksComponent {
  @Input() socialLinks: SocialLink[] = [];
}
