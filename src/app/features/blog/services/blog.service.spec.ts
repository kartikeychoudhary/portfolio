import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { BlogService } from './blog.service';
import { ApiService } from '../../../core/services/api.service';
import { BlogDto } from '../../../core/models/blog.model';

describe('BlogService', () => {
  let service: BlogService;
  let apiMock: { get: ReturnType<typeof vi.fn> };

  const mockBlogs: BlogDto[] = [
    {
      id: 'b1', title: 'First Post', slug: 'first-post',
      excerpt: 'First excerpt', content: '<p>First</p>',
      coverImage: 'url1', tags: ['Angular', 'TypeScript'],
      published: true, publishedDate: '2026-01-15T09:00:00Z', readingTime: 5,
      createdAt: '2026-01-14T12:00:00Z', updatedAt: '2026-01-15T09:00:00Z'
    },
    {
      id: 'b2', title: 'Second Post', slug: 'second-post',
      excerpt: 'Second excerpt', content: '<p>Second</p>',
      coverImage: 'url2', tags: ['React'],
      published: true, publishedDate: '2026-01-20T09:00:00Z', readingTime: 3,
      createdAt: '2026-01-19T12:00:00Z', updatedAt: '2026-01-20T09:00:00Z'
    },
    {
      id: 'b3', title: 'Draft Post', slug: 'draft-post',
      excerpt: 'Draft excerpt', content: '<p>Draft</p>',
      coverImage: 'url3', tags: ['Angular'],
      published: false, publishedDate: null, readingTime: null,
      createdAt: '2026-01-22T12:00:00Z', updatedAt: '2026-01-22T12:00:00Z'
    }
  ];

  beforeEach(() => {
    apiMock = {
      get: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        BlogService,
        { provide: ApiService, useValue: apiMock }
      ]
    });

    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPublishedBlogs', () => {
    it('should fetch blogs from /blogs and filter to published only', () => {
      apiMock.get.mockReturnValue(of(mockBlogs));

      service.getPublishedBlogs().subscribe(result => {
        expect(result.length).toBe(2);
        expect(result.every(b => b.published)).toBe(true);
      });

      expect(apiMock.get).toHaveBeenCalledWith('/blogs');
    });

    it('should sort published blogs by publishedDate descending', () => {
      apiMock.get.mockReturnValue(of(mockBlogs));

      service.getPublishedBlogs().subscribe(result => {
        expect(result[0].slug).toBe('second-post');
        expect(result[1].slug).toBe('first-post');
      });
    });

    it('should return empty array when no blogs are published', () => {
      apiMock.get.mockReturnValue(of([mockBlogs[2]]));

      service.getPublishedBlogs().subscribe(result => {
        expect(result.length).toBe(0);
      });
    });
  });

  describe('getBlogBySlug', () => {
    it('should fetch a blog by slug', () => {
      apiMock.get.mockReturnValue(of(mockBlogs));

      service.getBlogBySlug('first-post').subscribe(result => {
        expect(result.title).toBe('First Post');
        expect(result.slug).toBe('first-post');
      });

      expect(apiMock.get).toHaveBeenCalledWith('/blogs');
    });

    it('should throw error when slug not found', () => {
      apiMock.get.mockReturnValue(of(mockBlogs));

      service.getBlogBySlug('non-existent').subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('non-existent');
        }
      });
    });
  });

  describe('getAllTags', () => {
    it('should return unique sorted tags from published blogs', () => {
      apiMock.get.mockReturnValue(of(mockBlogs));

      service.getAllTags().subscribe(result => {
        expect(result).toEqual(['Angular', 'React', 'TypeScript']);
      });
    });

    it('should return empty array when no published blogs exist', () => {
      apiMock.get.mockReturnValue(of([mockBlogs[2]]));

      service.getAllTags().subscribe(result => {
        expect(result).toEqual([]);
      });
    });
  });
});
