import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ProfileDto } from '../../../core/models/profile.model';
import { SkillDto } from '../../../core/models/skill.model';
import { ExperienceDto } from '../../../core/models/experience.model';
import { ProjectDto } from '../../../core/models/project.model';
import { ContactRequest } from '../../../core/models/contact.model';
import { EducationDto, ExperienceSummary } from '../../../core/models/education.model';

/**
 * Service for fetching public portfolio data.
 * All methods call the API through the ApiService.
 */
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  constructor(private api: ApiService) {}

  /**
   * Fetches the profile data including social links.
   * @returns Observable of ProfileDto
   */
  getProfile(): Observable<ProfileDto> {
    return this.api.get<ProfileDto>('/profile');
  }

  /**
   * Fetches all skills sorted by sortOrder.
   * @returns Observable of SkillDto array
   */
  getSkills(): Observable<SkillDto[]> {
    return this.api.get<SkillDto[]>('/skills');
  }

  /**
   * Fetches all experiences sorted by sortOrder.
   * @returns Observable of ExperienceDto array
   */
  getExperiences(): Observable<ExperienceDto[]> {
    return this.api.get<ExperienceDto[]>('/experiences');
  }

  /**
   * Fetches all projects sorted by sortOrder.
   * @returns Observable of ProjectDto array
   */
  getProjects(): Observable<ProjectDto[]> {
    return this.api.get<ProjectDto[]>('/projects');
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
}
