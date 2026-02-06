import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';
import { of } from 'rxjs';

import { ManageBlogPageComponent } from './manage-blog-page.component';
import { AdminService } from '../../services/admin.service';
import { BlogDto } from '../../../../core/models/blog.model';

describe('ManageBlogPageComponent', () => {
  let component: ManageBlogPageComponent;
  let fixture: ComponentFixture<ManageBlogPageComponent>;
  let adminServiceMock: {
    getBlogs: ReturnType<typeof vi.fn>;
    createBlog: ReturnType<typeof vi.fn>;
    updateBlog: ReturnType<typeof vi.fn>;
    deleteBlog: ReturnType<typeof vi.fn>;
  };

  const mockBlogs: BlogDto[] = [
    {
      id: 'b1',
      title: 'Published Post',
      slug: 'published-post',
      excerpt: 'Excerpt 1',
      content: '<p>Content 1</p>',
      coverImage: 'url1',
      tags: ['Angular'],
      published: true,
      publishedDate: '2026-01-15T09:00:00Z', readingTime: 5,
      createdAt: '2026-01-14T12:00:00Z',
      updatedAt: '2026-01-15T09:00:00Z',
    },
    {
      id: 'b2',
      title: 'Draft Post',
      slug: 'draft-post',
      excerpt: 'Excerpt 2',
      content: '<p>Content 2</p>',
      coverImage: 'url2',
      tags: ['React'],
      published: false,
      publishedDate: null, readingTime: null,
      createdAt: '2026-01-20T12:00:00Z',
      updatedAt: '2026-01-20T12:00:00Z',
    },
  ];

  beforeEach(async () => {
    adminServiceMock = {
      getBlogs: vi.fn().mockReturnValue(of(mockBlogs)),
      createBlog: vi.fn().mockReturnValue(of(mockBlogs[0])),
      updateBlog: vi.fn().mockReturnValue(of(mockBlogs[0])),
      deleteBlog: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      declarations: [ManageBlogPageComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AdminService, useValue: adminServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageBlogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load blogs on init', () => {
    expect(adminServiceMock.getBlogs).toHaveBeenCalled();
    expect(component.blogs.length).toBe(2);
    expect(component.blogs[0].title).toBe('Published Post');
    expect(component.blogs[1].title).toBe('Draft Post');
  });

  it('should toggle editing mode', () => {
    expect(component.isEditing).toBe(false);

    component.openNewBlogForm();
    expect(component.isEditing).toBe(true);
    expect(component.selectedBlog).toBeNull();

    component.cancelEdit();
    expect(component.isEditing).toBe(false);
    expect(component.selectedBlog).toBeNull();
  });

  it('should generate slug from title', () => {
    expect(component.generateSlug('Hello World')).toBe('hello-world');
    expect(component.generateSlug('My Blog Post!')).toBe('my-blog-post');
    expect(component.generateSlug('Angular & TypeScript')).toBe('angular--typescript');
    expect(component.generateSlug('Test  Multiple   Spaces')).toBe('test-multiple-spaces');
  });

  it('should call AdminService.createBlog on new blog save', () => {
    component.openNewBlogForm();
    component.blogForm.patchValue({
      title: 'New Post',
      slug: 'new-post',
      excerpt: 'A new post',
      content: '<p>Content</p>',
      coverImage: 'https://example.com/img.jpg',
      tags: 'Angular, TypeScript',
      published: false,
    });

    component.saveBlog();

    expect(adminServiceMock.createBlog).toHaveBeenCalledWith({
      title: 'New Post',
      slug: 'new-post',
      excerpt: 'A new post',
      content: '<p>Content</p>',
      coverImage: 'https://example.com/img.jpg',
      tags: ['Angular', 'TypeScript'],
      published: false,
    });
  });

  it('should populate form when editing a blog', () => {
    component.editBlog(mockBlogs[0]);

    expect(component.isEditing).toBe(true);
    expect(component.selectedBlog).toBe(mockBlogs[0]);
    expect(component.blogForm.get('title')?.value).toBe('Published Post');
    expect(component.blogForm.get('slug')?.value).toBe('published-post');
    expect(component.blogForm.get('tags')?.value).toBe('Angular');
    expect(component.blogForm.get('published')?.value).toBe(true);
  });

  it('should call AdminService.updateBlog when saving an existing blog', () => {
    component.editBlog(mockBlogs[0]);
    component.blogForm.patchValue({ title: 'Updated Title', slug: 'updated-title' });

    component.saveBlog();

    expect(adminServiceMock.updateBlog).toHaveBeenCalledWith('b1', expect.objectContaining({
      title: 'Updated Title',
      slug: 'updated-title',
    }));
  });

  it('should call AdminService.deleteBlog with blog id', () => {
    component.deleteBlog('b1');

    expect(adminServiceMock.deleteBlog).toHaveBeenCalledWith('b1');
  });

  it('should not call createBlog if form is invalid', () => {
    component.openNewBlogForm();
    component.blogForm.patchValue({ title: '', slug: '' });

    component.saveBlog();

    expect(adminServiceMock.createBlog).not.toHaveBeenCalled();
  });

  it('should auto-generate slug on title change', () => {
    component.openNewBlogForm();
    component.blogForm.patchValue({ title: 'My New Blog Post' });
    component.onTitleChange();

    expect(component.blogForm.get('slug')?.value).toBe('my-new-blog-post');
  });
});
