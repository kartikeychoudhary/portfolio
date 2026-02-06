import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BlogDto } from '../../../../core/models/blog.model';

/**
 * Displays a blog post preview card with cover image, title, excerpt, tags, and date.
 * Used in the blog list page for each blog entry.
 */
@Component({
  selector: 'app-blog-card',
  standalone: false,
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogCardComponent {
  /** The blog post data to display */
  @Input() blog!: BlogDto;
}
