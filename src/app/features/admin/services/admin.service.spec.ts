import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { AdminService } from './admin.service';
import { ApiService } from '../../../core/services/api.service';
import { ContactDto } from '../../../core/models/contact.model';
import { BlogDto } from '../../../core/models/blog.model';
import { ProfileDto } from '../../../core/models/profile.model';
import { SkillDto } from '../../../core/models/skill.model';
import { ExperienceDto } from '../../../core/models/experience.model';
import { ProjectDto } from '../../../core/models/project.model';

describe('AdminService', () => {
  let service: AdminService;
  let apiMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockContacts: ContactDto[] = [
    {
      id: 'c1', name: 'Alice', email: 'alice@test.com',
      subject: 'Hello', message: 'Hi there', read: false,
      createdAt: '2026-01-10T08:00:00Z'
    },
    {
      id: 'c2', name: 'Bob', email: 'bob@test.com',
      subject: 'Question', message: 'How are you?', read: true,
      createdAt: '2026-01-12T10:00:00Z'
    }
  ];

  const mockBlogs: BlogDto[] = [
    {
      id: 'b1', title: 'Published Post', slug: 'published-post',
      excerpt: 'Excerpt 1', content: '<p>Content 1</p>',
      coverImage: 'url1', tags: ['Angular'],
      published: true, publishedDate: '2026-01-15T09:00:00Z', readingTime: 5,
      createdAt: '2026-01-14T12:00:00Z', updatedAt: '2026-01-15T09:00:00Z'
    },
    {
      id: 'b2', title: 'Draft Post', slug: 'draft-post',
      excerpt: 'Excerpt 2', content: '<p>Content 2</p>',
      coverImage: 'url2', tags: ['React'],
      published: false, publishedDate: null, readingTime: null,
      createdAt: '2026-01-20T12:00:00Z', updatedAt: '2026-01-20T12:00:00Z'
    }
  ];

  const mockProfile: ProfileDto = {
    id: '1', fullName: 'Kartikey', title: 'Developer', tagline: 'Building things',
    bio: '<p>About me</p>', avatarUrl: 'avatar.jpg', resumeUrl: 'resume.pdf',
    socialLinks: []
  };

  const mockSkill: SkillDto = {
    id: 's1', name: 'Angular', icon: 'fa-brands fa-angular',
    category: 'frontend', proficiency: 90, sortOrder: 1
  };

  const mockExperience: ExperienceDto = {
    id: 'e1', company: 'Acme Corp', role: 'Senior Developer', location: 'Remote',
    startDate: '2023-01-01', endDate: null, isCurrent: true,
    description: 'Building web apps', technologies: ['Angular', 'TypeScript'], sortOrder: 1
  };

  const mockProject: ProjectDto = {
    id: 'p1', title: 'Portfolio', description: 'My portfolio site',
    thumbnailUrl: 'thumb.jpg', technologies: ['Angular'], featured: true, sortOrder: 1
  };

  beforeEach(() => {
    apiMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AdminService,
        { provide: ApiService, useValue: apiMock }
      ]
    });

    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── Contacts ──────────────────────────────────────────────

  describe('getContacts', () => {
    it('should fetch all contacts from /contacts', () => {
      apiMock.get.mockReturnValue(of(mockContacts));

      service.getContacts().subscribe(result => {
        expect(result).toEqual(mockContacts);
        expect(result.length).toBe(2);
      });

      expect(apiMock.get).toHaveBeenCalledWith('/contacts');
    });
  });

  describe('markContactRead', () => {
    it('should PATCH /contacts/{id} with read true', () => {
      const updatedContact: ContactDto = { ...mockContacts[0], read: true };
      apiMock.patch.mockReturnValue(of(updatedContact));

      service.markContactRead('c1').subscribe(result => {
        expect(result.read).toBe(true);
        expect(result.id).toBe('c1');
      });

      expect(apiMock.patch).toHaveBeenCalledWith('/contacts/c1', { read: true });
    });
  });

  describe('deleteContact', () => {
    it('should DELETE /contacts/{id}', () => {
      apiMock.delete.mockReturnValue(of(undefined));

      service.deleteContact('c1').subscribe();

      expect(apiMock.delete).toHaveBeenCalledWith('/contacts/c1');
    });
  });

  // ── Blogs ─────────────────────────────────────────────────

  describe('getBlogs', () => {
    it('should fetch all blogs from /blogs including drafts', () => {
      apiMock.get.mockReturnValue(of(mockBlogs));

      service.getBlogs().subscribe(result => {
        expect(result).toEqual(mockBlogs);
        expect(result.length).toBe(2);
        expect(result.some(b => !b.published)).toBe(true);
      });

      expect(apiMock.get).toHaveBeenCalledWith('/blogs');
    });
  });

  describe('createBlog', () => {
    it('should POST to /blogs with the blog data', () => {
      const newBlog: Partial<BlogDto> = {
        title: 'New Post', slug: 'new-post', excerpt: 'New excerpt',
        content: '<p>New</p>', coverImage: 'url', tags: ['Vue'],
        published: false
      };
      apiMock.post.mockReturnValue(of({ ...newBlog, id: 'b3', publishedDate: null, readingTime: null,
        createdAt: '2026-02-01T12:00:00Z', updatedAt: '2026-02-01T12:00:00Z' }));

      service.createBlog(newBlog).subscribe(result => {
        expect(result.id).toBe('b3');
        expect(result.title).toBe('New Post');
      });

      expect(apiMock.post).toHaveBeenCalledWith('/blogs', newBlog);
    });
  });

  describe('updateBlog', () => {
    it('should PUT to /blogs/{id} with updated data', () => {
      const updates: Partial<BlogDto> = { title: 'Updated Title' };
      apiMock.put.mockReturnValue(of({ ...mockBlogs[0], ...updates }));

      service.updateBlog('b1', updates).subscribe(result => {
        expect(result.title).toBe('Updated Title');
      });

      expect(apiMock.put).toHaveBeenCalledWith('/blogs/b1', updates);
    });
  });

  describe('deleteBlog', () => {
    it('should DELETE /blogs/{id}', () => {
      apiMock.delete.mockReturnValue(of(undefined));

      service.deleteBlog('b1').subscribe();

      expect(apiMock.delete).toHaveBeenCalledWith('/blogs/b1');
    });
  });

  // ── Profile ───────────────────────────────────────────────

  describe('updateProfile', () => {
    it('should PUT to /profile with updated data', () => {
      const updates: Partial<ProfileDto> = { fullName: 'Kartikey S.', tagline: 'New tagline' };
      apiMock.put.mockReturnValue(of({ ...mockProfile, ...updates }));

      service.updateProfile(updates).subscribe(result => {
        expect(result.fullName).toBe('Kartikey S.');
        expect(result.tagline).toBe('New tagline');
      });

      expect(apiMock.put).toHaveBeenCalledWith('/profile', updates);
    });
  });

  // ── Skills ────────────────────────────────────────────────

  describe('createSkill', () => {
    it('should POST to /skills with skill data', () => {
      const newSkill: Partial<SkillDto> = {
        name: 'React', icon: 'fa-brands fa-react', category: 'frontend',
        proficiency: 80, sortOrder: 2
      };
      apiMock.post.mockReturnValue(of({ ...newSkill, id: 's2' }));

      service.createSkill(newSkill).subscribe(result => {
        expect(result.id).toBe('s2');
        expect(result.name).toBe('React');
      });

      expect(apiMock.post).toHaveBeenCalledWith('/skills', newSkill);
    });
  });

  describe('updateSkill', () => {
    it('should PUT to /skills/{id} with updated data', () => {
      const updates: Partial<SkillDto> = { proficiency: 95 };
      apiMock.put.mockReturnValue(of({ ...mockSkill, ...updates }));

      service.updateSkill('s1', updates).subscribe(result => {
        expect(result.proficiency).toBe(95);
      });

      expect(apiMock.put).toHaveBeenCalledWith('/skills/s1', updates);
    });
  });

  describe('deleteSkill', () => {
    it('should DELETE /skills/{id}', () => {
      apiMock.delete.mockReturnValue(of(undefined));

      service.deleteSkill('s1').subscribe();

      expect(apiMock.delete).toHaveBeenCalledWith('/skills/s1');
    });
  });

  // ── Experiences ───────────────────────────────────────────

  describe('createExperience', () => {
    it('should POST to /experiences with experience data', () => {
      const newExp: Partial<ExperienceDto> = {
        company: 'New Co', role: 'Engineer', location: 'NYC',
        startDate: '2025-06-01', endDate: null, isCurrent: true,
        description: 'New role', technologies: ['React'], sortOrder: 2
      };
      apiMock.post.mockReturnValue(of({ ...newExp, id: 'e2' }));

      service.createExperience(newExp).subscribe(result => {
        expect(result.id).toBe('e2');
        expect(result.company).toBe('New Co');
      });

      expect(apiMock.post).toHaveBeenCalledWith('/experiences', newExp);
    });
  });

  describe('updateExperience', () => {
    it('should PUT to /experiences/{id} with updated data', () => {
      const updates: Partial<ExperienceDto> = { role: 'Lead Developer' };
      apiMock.put.mockReturnValue(of({ ...mockExperience, ...updates }));

      service.updateExperience('e1', updates).subscribe(result => {
        expect(result.role).toBe('Lead Developer');
      });

      expect(apiMock.put).toHaveBeenCalledWith('/experiences/e1', updates);
    });
  });

  describe('deleteExperience', () => {
    it('should DELETE /experiences/{id}', () => {
      apiMock.delete.mockReturnValue(of(undefined));

      service.deleteExperience('e1').subscribe();

      expect(apiMock.delete).toHaveBeenCalledWith('/experiences/e1');
    });
  });

  // ── Projects ──────────────────────────────────────────────

  describe('createProject', () => {
    it('should POST to /projects with project data', () => {
      const newProject: Partial<ProjectDto> = {
        title: 'New Project', description: 'A new project',
        thumbnailUrl: 'new-thumb.jpg', technologies: ['Vue'], featured: false, sortOrder: 2
      };
      apiMock.post.mockReturnValue(of({ ...newProject, id: 'p2' }));

      service.createProject(newProject).subscribe(result => {
        expect(result.id).toBe('p2');
        expect(result.title).toBe('New Project');
      });

      expect(apiMock.post).toHaveBeenCalledWith('/projects', newProject);
    });
  });

  describe('updateProject', () => {
    it('should PUT to /projects/{id} with updated data', () => {
      const updates: Partial<ProjectDto> = { title: 'Updated Portfolio' };
      apiMock.put.mockReturnValue(of({ ...mockProject, ...updates }));

      service.updateProject('p1', updates).subscribe(result => {
        expect(result.title).toBe('Updated Portfolio');
      });

      expect(apiMock.put).toHaveBeenCalledWith('/projects/p1', updates);
    });
  });

  describe('deleteProject', () => {
    it('should DELETE /projects/{id}', () => {
      apiMock.delete.mockReturnValue(of(undefined));

      service.deleteProject('p1').subscribe();

      expect(apiMock.delete).toHaveBeenCalledWith('/projects/p1');
    });
  });
});
