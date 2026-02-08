import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogDto } from '../../../../core/models/blog.model';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-manage-blog-page',
  templateUrl: './manage-blog-page.component.html',
  styleUrls: ['./manage-blog-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageBlogPageComponent implements OnInit {
  blogs: BlogDto[] = [];
  isEditing = false;
  selectedBlog: BlogDto | null = null;
  blogForm: FormGroup;
  saving = false;

  // Cover image upload
  coverImagePreview: string | null = null;
  coverImageBase64: string | null = null;
  coverImageContentType: string | null = null;
  coverImageError: string | null = null;

  // Content limits (MEDIUMTEXT = 16MB, show practical limit)
  readonly CONTENT_MAX_LENGTH = 500000;

  // Quill editor config
  quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ]
  };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      excerpt: [''],
      content: ['', Validators.required],
      tags: [''],
      published: [false],
    });
  }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.adminService.getBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.cdr.markForCheck();
      },
      error: () => {
        this.blogs = [];
        this.cdr.markForCheck();
      },
    });
  }

  get contentLength(): number {
    const content = this.blogForm.get('content')?.value || '';
    return new Blob([content]).size;
  }

  get contentPercent(): number {
    return Math.min(100, (this.contentLength / this.CONTENT_MAX_LENGTH) * 100);
  }

  onCoverImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.coverImageError = null;

    if (!file) return;

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.coverImageError = 'Image must be under 2MB';
      input.value = '';
      this.cdr.markForCheck();
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.coverImageError = 'Only JPEG, PNG, and WebP are allowed';
      input.value = '';
      this.cdr.markForCheck();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.coverImagePreview = result;
      // Extract base64 data (remove "data:image/...;base64," prefix)
      this.coverImageBase64 = result.split(',')[1];
      this.coverImageContentType = file.type;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  removeCoverImage(): void {
    this.coverImagePreview = null;
    this.coverImageBase64 = null;
    this.coverImageContentType = null;
    this.coverImageError = null;
    this.cdr.markForCheck();
  }

  private uploadCoverImageIfNeeded(blogId: string): void {
    if (this.coverImageBase64 && this.coverImageContentType) {
      this.adminService.uploadBlogCoverImage(blogId, this.coverImageBase64, this.coverImageContentType)
        .subscribe({
          next: () => {
            this.removeCoverImage();
            this.loadBlogs();
          },
          error: () => {
            this.coverImageError = 'Failed to upload cover image';
            this.notification.error('Failed to upload cover image');
            this.cdr.markForCheck();
          }
        });
    }
  }

  createBlog(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.cdr.markForCheck();

    const formValue = this.blogForm.value;
    const blogData: Partial<BlogDto> = {
      title: formValue.title,
      slug: formValue.slug,
      excerpt: formValue.excerpt,
      content: formValue.content,
      tags: formValue.tags
        ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
        : [],
      published: formValue.published,
    };

    this.adminService.createBlog(blogData).subscribe({
      next: (created) => {
        if (this.coverImageBase64 && created.id) {
          this.uploadCoverImageIfNeeded(created.id);
        }
        this.saving = false;
        this.notification.success('Blog created successfully');
        this.cancelEdit();
        this.loadBlogs();
      },
      error: () => {
        this.saving = false;
        this.notification.error('Failed to create blog');
        this.cdr.markForCheck();
      },
    });
  }

  updateBlog(): void {
    if (this.blogForm.invalid || !this.selectedBlog) {
      this.blogForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.cdr.markForCheck();

    const formValue = this.blogForm.value;
    const blogData: Partial<BlogDto> = {
      title: formValue.title,
      slug: formValue.slug,
      excerpt: formValue.excerpt,
      content: formValue.content,
      coverImage: this.selectedBlog.coverImage,
      tags: formValue.tags
        ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
        : [],
      published: formValue.published,
    };

    this.adminService.updateBlog(this.selectedBlog.id, blogData).subscribe({
      next: () => {
        if (this.coverImageBase64 && this.selectedBlog) {
          this.uploadCoverImageIfNeeded(this.selectedBlog.id);
        }
        this.saving = false;
        this.notification.success('Blog updated successfully');
        this.cancelEdit();
        this.loadBlogs();
      },
      error: () => {
        this.saving = false;
        this.notification.error('Failed to update blog');
        this.cdr.markForCheck();
      },
    });
  }

  deleteBlog(id: string): void {
    this.adminService.deleteBlog(id).subscribe({
      next: () => {
        this.notification.success('Blog deleted');
        this.loadBlogs();
      },
      error: () => {
        this.notification.error('Failed to delete blog');
        this.cdr.markForCheck();
      },
    });
  }

  editBlog(blog: BlogDto): void {
    this.isEditing = true;
    this.selectedBlog = blog;
    this.removeCoverImage();
    this.blogForm.patchValue({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      tags: blog.tags.join(', '),
      published: blog.published,
    });
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedBlog = null;
    this.blogForm.reset({ published: false });
    this.removeCoverImage();
    this.cdr.markForCheck();
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  onTitleChange(): void {
    const title = this.blogForm.get('title')?.value || '';
    this.blogForm.patchValue({ slug: this.generateSlug(title) });
  }

  saveBlog(): void {
    if (this.selectedBlog) {
      this.updateBlog();
    } else {
      this.createBlog();
    }
  }

  openNewBlogForm(): void {
    this.isEditing = true;
    this.selectedBlog = null;
    this.blogForm.reset({ published: false });
    this.removeCoverImage();
    this.cdr.markForCheck();
  }
}
