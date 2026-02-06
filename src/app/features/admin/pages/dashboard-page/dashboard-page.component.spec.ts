import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';

import { DashboardPageComponent } from './dashboard-page.component';
import { AdminService } from '../../services/admin.service';
import { ContactDto } from '../../../../core/models/contact.model';
import { BlogDto } from '../../../../core/models/blog.model';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let adminServiceMock: {
    getContacts: ReturnType<typeof vi.fn>;
    getBlogs: ReturnType<typeof vi.fn>;
    markContactRead: ReturnType<typeof vi.fn>;
  };

  const mockContacts: ContactDto[] = [
    {
      id: 'c1',
      name: 'Alice',
      email: 'alice@test.com',
      subject: 'Hello',
      message: 'Hi there',
      read: false,
      createdAt: '2026-01-10T08:00:00Z',
    },
    {
      id: 'c2',
      name: 'Bob',
      email: 'bob@test.com',
      subject: 'Question',
      message: 'How are you?',
      read: true,
      createdAt: '2026-01-12T10:00:00Z',
    },
    {
      id: 'c3',
      name: 'Charlie',
      email: 'charlie@test.com',
      subject: 'Feedback',
      message: 'Great work',
      read: false,
      createdAt: '2026-01-15T14:00:00Z',
    },
  ];

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
    {
      id: 'b3',
      title: 'Another Published',
      slug: 'another-published',
      excerpt: 'Excerpt 3',
      content: '<p>Content 3</p>',
      coverImage: 'url3',
      tags: ['TypeScript'],
      published: true,
      publishedDate: '2026-01-22T10:00:00Z', readingTime: 5,
      createdAt: '2026-01-21T08:00:00Z',
      updatedAt: '2026-01-22T10:00:00Z',
    },
  ];

  beforeEach(async () => {
    adminServiceMock = {
      getContacts: vi.fn().mockReturnValue(of(mockContacts)),
      getBlogs: vi.fn().mockReturnValue(of(mockBlogs)),
      markContactRead: vi.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardPageComponent],
      providers: [
        { provide: AdminService, useValue: adminServiceMock },
        ChangeDetectorRef,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contacts on init', () => {
    expect(adminServiceMock.getContacts).toHaveBeenCalled();
    expect(component.contacts).toEqual(mockContacts);
    expect(component.contacts.length).toBe(3);
  });

  it('should load blogs on init', () => {
    expect(adminServiceMock.getBlogs).toHaveBeenCalled();
    expect(component.blogs).toEqual(mockBlogs);
    expect(component.blogs.length).toBe(3);
  });

  it('should compute stats correctly', () => {
    expect(component.totalContacts).toBe(3);
    expect(component.unreadContacts).toBe(2);
    expect(component.totalBlogs).toBe(3);
    expect(component.publishedBlogs).toBe(2);
  });

  it('should set isLoading to false after data loads', () => {
    expect(component.isLoading).toBe(false);
  });

  it('should update chart data with correct published and draft counts', () => {
    expect(component.blogChartData.datasets[0].data).toEqual([2, 1]);
  });

  it('should have contact column definitions', () => {
    expect(component.contactColumnDefs.length).toBe(5);
    expect(component.contactColumnDefs.map((c) => c.field)).toEqual([
      'name',
      'email',
      'subject',
      'read',
      'createdAt',
    ]);
  });

  it('should mark a contact as read', () => {
    const updatedContact: ContactDto = { ...mockContacts[0], read: true };
    adminServiceMock.markContactRead.mockReturnValue(of(updatedContact));

    component.markAsRead('c1');

    expect(adminServiceMock.markContactRead).toHaveBeenCalledWith('c1');
    expect(component.contacts[0].read).toBe(true);
  });
});
