import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogDto } from '../../../../core/models/blog.model';
import { BlogService } from '../../services/blog.service';
import { SeoService } from '../../../../core/services/seo.service';

/**
 * Blog detail page displaying a full blog post.
 * Fetches the blog by slug from the route parameter.
 */
@Component({
  selector: 'app-blog-detail-page',
  standalone: false,
  templateUrl: './blog-detail-page.component.html',
  styleUrls: ['./blog-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailPageComponent implements OnInit {
  /** The full blog post data */
  blog: BlogDto | null = null;

  /** Loading state */
  isLoading = true;

  /** Error message */
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private seoService: SeoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadBlog(slug);
    } else {
      this.errorMessage = 'Blog post not found.';
      this.isLoading = false;
    }
  }

  /**
   * Loads a blog post by slug from the API.
   * @param slug - The blog slug from the route
   */
  loadBlog(slug: string): void {
    this.isLoading = true;
    this.blogService.getBlogBySlug(slug).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.seoService.setTitle(`${blog.title} | Kartikey Choudhary`);
        this.seoService.setDescription(blog.excerpt);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Blog post not found or failed to load.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
