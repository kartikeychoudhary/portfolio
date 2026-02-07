import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ScrollUtilityService } from '../../../core/services/scroll-utility.service';
import { Observable } from 'rxjs';

/**
 * Scroll Progress Bar Component
 *
 * Displays a fixed progress bar at the top of the page showing scroll position.
 * Uses gradient background with primary theme colors.
 */
@Component({
  selector: 'app-scroll-progress-bar',
  standalone: false,
  templateUrl: './scroll-progress-bar.component.html',
  styleUrls: ['./scroll-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollProgressBarComponent {
  scrollProgress$: Observable<number>;

  constructor(private scrollUtility: ScrollUtilityService) {
    this.scrollProgress$ = this.scrollUtility.scrollProgress$;
  }
}
