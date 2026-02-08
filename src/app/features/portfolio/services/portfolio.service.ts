import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { ProfileDto } from '../../../core/models/profile.model';
import { SkillDto } from '../../../core/models/skill.model';
import { ExperienceDto } from '../../../core/models/experience.model';
import { ProjectDto } from '../../../core/models/project.model';
import { ContactRequest } from '../../../core/models/contact.model';
import { EducationDto, ExperienceSummary } from '../../../core/models/education.model';

/**
 * Service for fetching public portfolio data.
 * Includes an in-memory expiring cache (5 min TTL) to avoid redundant API calls.
 */
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private api: ApiService) {}

  /**
   * Returns cached data if available and not expired, otherwise fetches fresh data.
   */
  private getCached<T>(key: string, fetcher: () => Observable<T>): Observable<T> {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return of(cached.data as T);
    }
    return fetcher().pipe(
      tap(data => this.cache.set(key, { data, timestamp: Date.now() }))
    );
  }

  /**
   * Clears all cached data. Call after admin save/delete operations.
   */
  invalidateCache(): void {
    this.cache.clear();
  }

  /**
   * Fetches the profile data including social links.
   * @returns Observable of ProfileDto
   */
  getProfile(): Observable<ProfileDto> {
    return this.getCached('profile', () => this.api.get<ProfileDto>('/profile'));
  }

  /**
   * Fetches all skills sorted by sortOrder.
   * @returns Observable of SkillDto array
   */
  getSkills(): Observable<SkillDto[]> {
    return this.getCached('skills', () => this.api.get<SkillDto[]>('/skills'));
  }

  /**
   * Fetches all experiences sorted by sortOrder.
   * @returns Observable of ExperienceDto array
   */
  getExperiences(): Observable<ExperienceDto[]> {
    return this.getCached('experiences', () => this.api.get<ExperienceDto[]>('/experiences'));
  }

  /**
   * Fetches all projects sorted by sortOrder.
   * @returns Observable of ProjectDto array
   */
  getProjects(): Observable<ProjectDto[]> {
    return this.getCached('projects', () => this.api.get<ProjectDto[]>('/projects'));
  }

  /**
   * Submits a contact form request.
   * @param contact - The contact form data
   * @returns Observable of the created contact
   */
  submitContact(contact: ContactRequest): Observable<ContactRequest> {
    return this.api.post<ContactRequest>('/contacts', contact);
  }

  /**
   * Fetches education data.
   * @returns Observable of EducationDto array
   */
  getEducation(): Observable<EducationDto[]> {
    return this.api.get<EducationDto[]>('/education');
  }

  /**
   * Fetches experience summary for About section.
   * @returns Observable of ExperienceSummary array
   */
  getExperienceSummary(): Observable<ExperienceSummary[]> {
    return this.api.get<ExperienceSummary[]>('/experiences/summary');
  }

  /**
   * Uploads avatar image for a profile.
   * @param profileId - Profile ID (use "default" for main profile)
   * @param avatarBase64 - Base64-encoded image data (without data URI prefix)
   * @param contentType - MIME type (image/jpeg, image/png, image/webp)
   * @returns Observable of updated ProfileDto
   */
  uploadAvatar(profileId: string, avatarBase64: string, contentType: string): Observable<ProfileDto> {
    return this.api.post<ProfileDto>(`/profile/${profileId}/avatar`, {
      avatarBase64,
      contentType
    });
  }

  /**
   * Uploads resume PDF for a profile.
   * @param profileId - Profile ID (use "default" for main profile)
   * @param resumeBase64 - Base64-encoded PDF data (without data URI prefix)
   * @param contentType - MIME type (application/pdf)
   * @returns Observable of updated ProfileDto
   */
  uploadResume(profileId: string, resumeBase64: string, contentType: string): Observable<ProfileDto> {
    return this.api.post<ProfileDto>(`/profile/${profileId}/resume`, {
      resumeBase64,
      contentType
    });
  }
}
