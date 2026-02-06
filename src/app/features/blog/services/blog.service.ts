import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { BlogDto } from '../../../core/models/blog.model';

/**
 * Service for fetching public blog data.
 * Only returns published blogs for the public-facing pages.
 */
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private api: ApiService) {}

  /**
   * Fetches all published blogs, sorted by publishedDate descending.
   * Filters to only published === true entries.
   * @returns Observable of BlogDto array
   */
  getPublishedBlogs(): Observable<BlogDto[]> {
    return this.api.get<BlogDto[]>('/blogs').pipe(
      map(blogs => blogs
        .filter(b => b.published)
        .sort((a, b) => {
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
          return dateB - dateA;
        })
      )
    );
  }

  /**
   * Fetches a single blog post by its slug.
   * @param slug - The blog post slug
   * @returns Observable of BlogDto
   */
  getBlogBySlug(slug: string): Observable<BlogDto> {
    return this.api.get<BlogDto[]>('/blogs').pipe(
      map(blogs => {
        const blog = blogs.find(b => b.slug === slug);
        if (!blog) {
          throw new Error(`Blog post not found: ${slug}`);
        }
        return blog;
      })
    );
  }

  /**
   * Fetches all unique tags from published blogs.
   * @returns Observable of string array
   */
  getAllTags(): Observable<string[]> {
    return this.getPublishedBlogs().pipe(
      map(blogs => {
        const tagSet = new Set<string>();
        blogs.forEach(b => b.tags.forEach(t => tagSet.add(t)));
        return Array.from(tagSet).sort();
      })
    );
  }
}
