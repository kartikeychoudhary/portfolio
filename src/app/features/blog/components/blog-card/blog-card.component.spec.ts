import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BlogCardComponent } from './blog-card.component';
import { BlogDto } from '../../../../core/models/blog.model';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

describe('BlogCardComponent', () => {
  let component: BlogCardComponent;
  let fixture: ComponentFixture<BlogCardComponent>;

  const mockBlog: BlogDto = {
    id: 'b1',
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    excerpt: 'A short excerpt about the test blog post.',
    content: '<p>Full content here</p>',
    coverImage: 'https://example.com/image.jpg',
    tags: ['Angular', 'TypeScript'],
    published: true,
    publishedDate: '2026-01-15T09:00:00Z', readingTime: 5,
    createdAt: '2026-01-14T12:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogCardComponent, TimeAgoPipe],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display blog title', () => {
    fixture.componentRef.setInput('blog', mockBlog);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Blog Post');
  });

  it('should display blog excerpt', () => {
    fixture.componentRef.setInput('blog', mockBlog);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('A short excerpt about the test blog post.');
  });

  it('should display blog tags', () => {
    fixture.componentRef.setInput('blog', mockBlog);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Angular');
    expect(compiled.textContent).toContain('TypeScript');
  });

  it('should have link to blog detail page', () => {
    fixture.componentRef.setInput('blog', mockBlog);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    const slugLinks = Array.from(links).filter(a =>
      a.getAttribute('ng-reflect-router-link')?.includes('test-blog-post') ||
      a.textContent?.includes('Read More')
    );
    expect(slugLinks.length).toBeGreaterThan(0);
  });

  it('should display cover image', () => {
    fixture.componentRef.setInput('blog', mockBlog);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/image.jpg');
  });

  it('should not render when blog is not set', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.bg-white');
    expect(card).toBeNull();
  });
});
