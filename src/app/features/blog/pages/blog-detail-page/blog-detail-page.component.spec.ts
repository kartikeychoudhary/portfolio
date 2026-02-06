import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BlogDetailPageComponent } from './blog-detail-page.component';
import { BlogService } from '../../services/blog.service';
import { SeoService } from '../../../../core/services/seo.service';
import { BlogDto } from '../../../../core/models/blog.model';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('BlogDetailPageComponent', () => {
  let component: BlogDetailPageComponent;
  let fixture: ComponentFixture<BlogDetailPageComponent>;
  let blogServiceMock: { getBlogBySlug: ReturnType<typeof vi.fn> };
  let seoServiceMock: { setTitle: ReturnType<typeof vi.fn>; setDescription: ReturnType<typeof vi.fn> };

  const mockBlog: BlogDto = {
    id: 'b1', title: 'Angular Signals', slug: 'angular-signals',
    excerpt: 'Learn about signals', content: '<h2>Introduction</h2><p>Content here</p>',
    coverImage: 'url1', tags: ['Angular', 'TypeScript'],
    published: true, publishedDate: '2026-01-15T09:00:00Z', readingTime: 5,
    createdAt: '2026-01-14T12:00:00Z', updatedAt: '2026-01-15T09:00:00Z'
  };

  function createComponent(slug: string | null = 'angular-signals') {
    blogServiceMock = {
      getBlogBySlug: vi.fn().mockReturnValue(of(mockBlog))
    };

    seoServiceMock = {
      setTitle: vi.fn(),
      setDescription: vi.fn()
    };

    TestBed.configureTestingModule({
      declarations: [BlogDetailPageComponent, SafeHtmlPipe, TimeAgoPipe],
      providers: [
        { provide: BlogService, useValue: blogServiceMock },
        { provide: SeoService, useValue: seoServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue(slug)
              }
            }
          }
        },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: vi.fn((val: string) => val),
            sanitize: vi.fn((ctx: unknown, val: string) => val)
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetailPageComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should load blog by slug on init', () => {
    createComponent('angular-signals');
    fixture.detectChanges();

    expect(blogServiceMock.getBlogBySlug).toHaveBeenCalledWith('angular-signals');
    expect(component.blog).toEqual(mockBlog);
    expect(component.isLoading).toBe(false);
  });

  it('should set SEO metadata after loading blog', () => {
    createComponent('angular-signals');
    fixture.detectChanges();

    expect(seoServiceMock.setTitle).toHaveBeenCalledWith('Angular Signals | Kartikey Choudhary');
    expect(seoServiceMock.setDescription).toHaveBeenCalledWith('Learn about signals');
  });

  it('should display blog title', () => {
    createComponent('angular-signals');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Angular Signals');
  });

  it('should display blog tags', () => {
    createComponent('angular-signals');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Angular');
    expect(compiled.textContent).toContain('TypeScript');
  });

  it('should handle error when blog not found', () => {
    createComponent('angular-signals');
    blogServiceMock.getBlogBySlug.mockReturnValue(throwError(() => new Error('Not found')));
    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBeTruthy();
  });

  it('should show error when slug is missing', () => {
    createComponent(null);
    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Blog post not found.');
    expect(blogServiceMock.getBlogBySlug).not.toHaveBeenCalled();
  });

  it('should have back to blog link', () => {
    createComponent('angular-signals');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Back to Blog');
  });
});
