import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ContactDto } from '../../../core/models/contact.model';
import { BlogDto } from '../../../core/models/blog.model';
import { ProfileDto } from '../../../core/models/profile.model';
import { SkillDto } from '../../../core/models/skill.model';
import { ExperienceDto } from '../../../core/models/experience.model';
import { ProjectDto } from '../../../core/models/project.model';

/**
 * Service for admin operations on the portfolio.
 * Provides CRUD operations for contacts, blogs, profile, skills, experiences, and projects.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private api: ApiService) {}

  // ── Contacts ──────────────────────────────────────────────

  /**
   * Fetches all contact submissions.
   * @returns Observable of ContactDto array
   */
  getContacts(): Observable<ContactDto[]> {
    return this.api.get<ContactDto[]>('/contacts');
  }

  /**
   * Marks a contact submission as read.
   * @param id - The contact ID
   * @returns Observable of the updated ContactDto
   */
  markContactRead(id: string): Observable<ContactDto> {
    return this.api.patch<ContactDto>(`/contacts/${id}`, { read: true });
  }

  /**
   * Deletes a contact submission.
   * @param id - The contact ID
   * @returns Observable of void
   */
  deleteContact(id: string): Observable<void> {
    return this.api.delete<void>(`/contacts/${id}`);
  }

  // ── Blogs ─────────────────────────────────────────────────

  /**
   * Fetches all blogs including drafts.
   * @returns Observable of BlogDto array
   */
  getBlogs(): Observable<BlogDto[]> {
    return this.api.get<BlogDto[]>('/blogs');
  }

  /**
   * Creates a new blog post.
   * @param blog - Partial blog data
   * @returns Observable of the created BlogDto
   */
  createBlog(blog: Partial<BlogDto>): Observable<BlogDto> {
    return this.api.post<BlogDto>('/blogs', blog);
  }

  /**
   * Updates an existing blog post.
   * @param id - The blog ID
   * @param blog - Partial blog data to update
   * @returns Observable of the updated BlogDto
   */
  updateBlog(id: string, blog: Partial<BlogDto>): Observable<BlogDto> {
    return this.api.put<BlogDto>(`/blogs/${id}`, blog);
  }

  /**
   * Deletes a blog post.
   * @param id - The blog ID
   * @returns Observable of void
   */
  deleteBlog(id: string): Observable<void> {
    return this.api.delete<void>(`/blogs/${id}`);
  }

  // ── Profile ───────────────────────────────────────────────

  /**
   * Updates the user profile.
   * @param profile - Partial profile data to update
   * @returns Observable of the updated ProfileDto
   */
  updateProfile(profile: Partial<ProfileDto>): Observable<ProfileDto> {
    return this.api.put<ProfileDto>('/profile', profile);
  }

  // ── Skills ────────────────────────────────────────────────

  /**
   * Creates a new skill.
   * @param skill - Partial skill data
   * @returns Observable of the created SkillDto
   */
  createSkill(skill: Partial<SkillDto>): Observable<SkillDto> {
    return this.api.post<SkillDto>('/skills', skill);
  }

  /**
   * Updates an existing skill.
   * @param id - The skill ID
   * @param skill - Partial skill data to update
   * @returns Observable of the updated SkillDto
   */
  updateSkill(id: string, skill: Partial<SkillDto>): Observable<SkillDto> {
    return this.api.put<SkillDto>(`/skills/${id}`, skill);
  }

  /**
   * Deletes a skill.
   * @param id - The skill ID
   * @returns Observable of void
   */
  deleteSkill(id: string): Observable<void> {
    return this.api.delete<void>(`/skills/${id}`);
  }

  // ── Experiences ───────────────────────────────────────────

  /**
   * Creates a new experience entry.
   * @param exp - Partial experience data
   * @returns Observable of the created ExperienceDto
   */
  createExperience(exp: Partial<ExperienceDto>): Observable<ExperienceDto> {
    return this.api.post<ExperienceDto>('/experiences', exp);
  }

  /**
   * Updates an existing experience entry.
   * @param id - The experience ID
   * @param exp - Partial experience data to update
   * @returns Observable of the updated ExperienceDto
   */
  updateExperience(id: string, exp: Partial<ExperienceDto>): Observable<ExperienceDto> {
    return this.api.put<ExperienceDto>(`/experiences/${id}`, exp);
  }

  /**
   * Deletes an experience entry.
   * @param id - The experience ID
   * @returns Observable of void
   */
  deleteExperience(id: string): Observable<void> {
    return this.api.delete<void>(`/experiences/${id}`);
  }

  // ── Projects ──────────────────────────────────────────────

  /**
   * Creates a new project.
   * @param project - Partial project data
   * @returns Observable of the created ProjectDto
   */
  createProject(project: Partial<ProjectDto>): Observable<ProjectDto> {
    return this.api.post<ProjectDto>('/projects', project);
  }

  /**
   * Updates an existing project.
   * @param id - The project ID
   * @param project - Partial project data to update
   * @returns Observable of the updated ProjectDto
   */
  updateProject(id: string, project: Partial<ProjectDto>): Observable<ProjectDto> {
    return this.api.put<ProjectDto>(`/projects/${id}`, project);
  }

  /**
   * Deletes a project.
   * @param id - The project ID
   * @returns Observable of void
   */
  deleteProject(id: string): Observable<void> {
    return this.api.delete<void>(`/projects/${id}`);
  }
}
