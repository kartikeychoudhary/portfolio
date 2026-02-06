import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { BlogDto } from '../../../../core/models/blog.model';
import { BlogService } from '../../services/blog.service';
import { SeoService } from '../../../../core/services/seo.service';

/**
 * Blog listing page displaying all published blog posts.
 * Supports filtering by tags and displays a responsive card grid.
 */
@Component({
  selector: 'app-blog-list-page',
  standalone: false,
  templateUrl: './blog-list-page.component.html',
  styleUrls: ['./blog-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListPageComponent implements OnInit {
  /** All published blog posts */
  blogs: BlogDto[] = [];

  /** Filtered blog posts based on selected tag */
  filteredBlogs: BlogDto[] = [];

  /** All available tags from published blogs */
  allTags: string[] = [];

  /** Currently selected tag filter (null = all) */
  selectedTag: string | null = null;

  /** Loading state */
  isLoading = true;

  /** Error message */
  errorMessage = '';

  constructor(
    private blogService: BlogService,
    private seoService: SeoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.seoService.setTitle('Blog | Kartikey Choudhary');
    this.seoService.setDescription('Read articles about web development, Angular, TypeScript, and more.');
    this.loadBlogs();
  }

  /**
   * Loads all published blogs from the API.
   */
  loadBlogs(): void {
    this.isLoading = true;
    this.blogService.getPublishedBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.filteredBlogs = blogs;
        this.extractTags();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Failed to load blog posts. Please try again later.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Extracts unique tags from all loaded blogs.
   */
  private extractTags(): void {
    const tagSet = new Set<string>();
    this.blogs.forEach(b => b.tags.forEach(t => tagSet.add(t)));
    this.allTags = Array.from(tagSet).sort();
  }

  /**
   * Filters blogs by the selected tag.
   * @param tag - The tag to filter by, or null to show all
   */
  filterByTag(tag: string | null): void {
    this.selectedTag = tag;
    if (tag) {
      this.filteredBlogs = this.blogs.filter(b => b.tags.includes(tag));
    } else {
      this.filteredBlogs = [...this.blogs];
    }
    this.cdr.markForCheck();
  }
}
