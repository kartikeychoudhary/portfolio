import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { BlogListPageComponent } from './blog-list-page.component';
import { BlogService } from '../../services/blog.service';
import { SeoService } from '../../../../core/services/seo.service';
import { BlogDto } from '../../../../core/models/blog.model';

describe('BlogListPageComponent', () => {
  let component: BlogListPageComponent;
  let fixture: ComponentFixture<BlogListPageComponent>;
  let blogServiceMock: { getPublishedBlogs: ReturnType<typeof vi.fn> };
  let seoServiceMock: { setTitle: ReturnType<typeof vi.fn>; setDescription: ReturnType<typeof vi.fn> };

  const mockBlogs: BlogDto[] = [
    {
      id: 'b1', title: 'Angular Signals', slug: 'angular-signals',
      excerpt: 'Learn about signals', content: '<p>Content</p>',
      coverImage: 'url1', tags: ['Angular', 'TypeScript'],
      published: true, publishedDate: '2026-01-20T09:00:00Z', readingTime: 5,
      createdAt: '2026-01-19T12:00:00Z', updatedAt: '2026-01-20T09:00:00Z'
    },
    {
      id: 'b2', title: 'React Hooks', slug: 'react-hooks',
      excerpt: 'Learn about hooks', content: '<p>Content</p>',
      coverImage: 'url2', tags: ['React'],
      published: true, publishedDate: '2026-01-15T09:00:00Z', readingTime: 5,
      createdAt: '2026-01-14T12:00:00Z', updatedAt: '2026-01-15T09:00:00Z'
    }
  ];

  beforeEach(async () => {
    blogServiceMock = {
      getPublishedBlogs: vi.fn().mockReturnValue(of(mockBlogs))
    };

    seoServiceMock = {
      setTitle: vi.fn(),
      setDescription: vi.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [BlogListPageComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceMock },
        { provide: SeoService, useValue: seoServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load blogs on init', () => {
    fixture.detectChanges();

    expect(blogServiceMock.getPublishedBlogs).toHaveBeenCalled();
    expect(component.blogs.length).toBe(2);
    expect(component.isLoading).toBe(false);
  });

  it('should set SEO metadata on init', () => {
    fixture.detectChanges();

    expect(seoServiceMock.setTitle).toHaveBeenCalledWith('Blog | Kartikey Choudhary');
    expect(seoServiceMock.setDescription).toHaveBeenCalled();
  });

  it('should extract unique sorted tags from blogs', () => {
    fixture.detectChanges();

    expect(component.allTags).toEqual(['Angular', 'React', 'TypeScript']);
  });

  it('should filter blogs by tag', () => {
    fixture.detectChanges();

    component.filterByTag('Angular');
    expect(component.selectedTag).toBe('Angular');
    expect(component.filteredBlogs.length).toBe(1);
    expect(component.filteredBlogs[0].slug).toBe('angular-signals');
  });

  it('should show all blogs when tag filter is cleared', () => {
    fixture.detectChanges();

    component.filterByTag('Angular');
    expect(component.filteredBlogs.length).toBe(1);

    component.filterByTag(null);
    expect(component.selectedTag).toBeNull();
    expect(component.filteredBlogs.length).toBe(2);
  });

  it('should handle error when loading blogs', () => {
    blogServiceMock.getPublishedBlogs.mockReturnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBeTruthy();
  });

  it('should display loading state initially', () => {
    expect(component.isLoading).toBe(true);
  });
});
