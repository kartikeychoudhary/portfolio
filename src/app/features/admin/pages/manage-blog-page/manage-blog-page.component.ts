import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogDto } from '../../../../core/models/blog.model';
import { AdminService } from '../../services/admin.service';

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

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      excerpt: [''],
      content: [''],
      coverImage: [''],
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

  createBlog(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    const formValue = this.blogForm.value;
    const blogData: Partial<BlogDto> = {
      title: formValue.title,
      slug: formValue.slug,
      excerpt: formValue.excerpt,
      content: formValue.content,
      coverImage: formValue.coverImage,
      tags: formValue.tags
        ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
        : [],
      published: formValue.published,
    };

    this.adminService.createBlog(blogData).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadBlogs();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  updateBlog(): void {
    if (this.blogForm.invalid || !this.selectedBlog) {
      this.blogForm.markAllAsTouched();
      return;
    }

    const formValue = this.blogForm.value;
    const blogData: Partial<BlogDto> = {
      title: formValue.title,
      slug: formValue.slug,
      excerpt: formValue.excerpt,
      content: formValue.content,
      coverImage: formValue.coverImage,
      tags: formValue.tags
        ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
        : [],
      published: formValue.published,
    };

    this.adminService.updateBlog(this.selectedBlog.id, blogData).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadBlogs();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  deleteBlog(id: string): void {
    this.adminService.deleteBlog(id).subscribe({
      next: () => {
        this.loadBlogs();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  editBlog(blog: BlogDto): void {
    this.isEditing = true;
    this.selectedBlog = blog;
    this.blogForm.patchValue({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      tags: blog.tags.join(', '),
      published: blog.published,
    });
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedBlog = null;
    this.blogForm.reset({ published: false });
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
    this.cdr.markForCheck();
  }
}
