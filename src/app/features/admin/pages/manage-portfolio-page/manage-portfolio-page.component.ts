import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProfileDto } from '../../../../core/models/profile.model';
import { SkillDto, SkillCategory } from '../../../../core/models/skill.model';
import { ExperienceDto } from '../../../../core/models/experience.model';
import { ProjectDto } from '../../../../core/models/project.model';
import { AdminService } from '../../services/admin.service';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';

export type PortfolioTab = 'profile' | 'skills' | 'experiences' | 'projects';

@Component({
  selector: 'app-manage-portfolio-page',
  templateUrl: './manage-portfolio-page.component.html',
  styleUrls: ['./manage-portfolio-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagePortfolioPageComponent implements OnInit {
  activeTab: PortfolioTab = 'profile';

  // ── Profile ───────────────────────────────────────────────
  profileForm!: FormGroup;
  profileLoading = false;
  profileSaving = false;

  // ── Skills ────────────────────────────────────────────────
  skills: SkillDto[] = [];
  skillsLoading = false;
  editingSkill: SkillDto | null = null;
  showSkillForm = false;
  skillForm!: FormGroup;
  skillSaving = false;

  skillCategories: SkillCategory[] = [
    'frontend', 'backend', 'database', 'devops', 'tools', 'other'
  ];

  // ── Experiences ───────────────────────────────────────────
  experiences: ExperienceDto[] = [];
  experiencesLoading = false;
  editingExperience: ExperienceDto | null = null;
  showExperienceForm = false;
  experienceForm!: FormGroup;
  experienceSaving = false;

  // ── Projects ──────────────────────────────────────────────
  projects: ProjectDto[] = [];
  projectsLoading = false;
  editingProject: ProjectDto | null = null;
  showProjectForm = false;
  projectForm!: FormGroup;
  projectSaving = false;
  pendingThumbnail: { base64: string; contentType: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadProfile();
    this.loadSkills();
    this.loadExperiences();
    this.loadProjects();
  }

  // ── Tab Navigation ────────────────────────────────────────

  switchTab(tab: PortfolioTab): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  // ── Form Initialization ───────────────────────────────────

  private initForms(): void {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      title: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      tagline: [''],
      bio: [''],
    });

    this.skillForm = this.fb.group({
      name: ['', Validators.required],
      icon: [''],
      category: ['frontend', Validators.required],
      proficiency: [50, [Validators.required, Validators.min(1), Validators.max(100)]],
      sortOrder: [0],
    });

    this.experienceForm = this.fb.group({
      company: ['', Validators.required],
      companyLogo: [''],
      role: ['', Validators.required],
      location: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      isCurrent: [false],
      description: [''],
      technologies: [''],
      sortOrder: [0],
    });

    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      liveUrl: [''],
      repoUrl: [''],
      technologies: [''],
      featured: [false],
      sortOrder: [0],
    });
  }

  // ── Profile ───────────────────────────────────────────────
  currentProfile: ProfileDto | null = null;

  loadProfile(): void {
    this.profileLoading = true;
    this.cdr.markForCheck();

    this.portfolioService.getProfile().subscribe({
      next: (profile: ProfileDto) => {
        this.currentProfile = profile;
        this.profileForm.patchValue({
          fullName: profile.fullName,
          title: profile.title,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          tagline: profile.tagline,
          bio: profile.bio,
        });
        this.profileLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.profileLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.profileSaving = true;
    this.cdr.markForCheck();

    this.adminService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.profileSaving = false;
        this.notification.success('Profile saved');
        this.cdr.markForCheck();
      },
      error: () => {
        this.profileSaving = false;
        this.notification.error('Failed to save profile');
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Handle avatar upload from AvatarUploadComponent
   */
  onAvatarUploaded(event: { base64: string; contentType: string }): void {
    if (!this.currentProfile?.id) {
      console.error('No profile loaded');
      return;
    }

    this.profileSaving = true;
    this.cdr.markForCheck();

    const profileId = this.currentProfile.id || 'default';

    this.portfolioService.uploadAvatar(profileId, event.base64, event.contentType).subscribe({
      next: (updated: ProfileDto) => {
        this.currentProfile = updated;
        this.profileSaving = false;
        this.notification.success('Avatar uploaded');
        this.cdr.markForCheck();
      },
      error: () => {
        this.profileSaving = false;
        this.notification.error('Failed to upload avatar');
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Get avatar URL for display (supports both URL and Base64)
   */
  getAvatarUrl(): string | undefined {
    if (!this.currentProfile) {
      return undefined;
    }

    // Use Base64 data if available
    if (this.currentProfile.avatarBase64 && this.currentProfile.avatarContentType) {
      return `data:${this.currentProfile.avatarContentType};base64,${this.currentProfile.avatarBase64}`;
    }

    // Fallback to URL
    return this.currentProfile.avatarUrl;
  }

  /**
   * Handle resume upload from file input
   */
  onResumeUploaded(event: { base64: string; contentType: string }): void {
    if (!this.currentProfile?.id) {
      console.error('No profile loaded');
      return;
    }

    this.profileSaving = true;
    this.cdr.markForCheck();

    const profileId = this.currentProfile.id || 'default';

    this.portfolioService.uploadResume(profileId, event.base64, event.contentType).subscribe({
      next: (updated: ProfileDto) => {
        this.currentProfile = updated;
        this.profileSaving = false;
        this.notification.success('Resume uploaded');
        this.cdr.markForCheck();
      },
      error: () => {
        this.profileSaving = false;
        this.notification.error('Failed to upload resume');
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Handle resume file selection - reads file and triggers upload
   */
  onResumeFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate file type
    if (file.type !== 'application/pdf') {
      this.notification.error('Only PDF files are allowed');
      input.value = '';
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.notification.error('File size exceeds 10MB limit');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URI prefix to get pure base64
      const base64 = result.split(',')[1];
      this.onResumeUploaded({ base64, contentType: file.type });
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  /**
   * Get resume URL for display/download
   */
  getResumeUrl(): string | undefined {
    if (!this.currentProfile) return undefined;

    // Check if resume BLOB exists
    if (this.currentProfile.resumeBase64) {
      return '/api/profile/resume';
    }

    // Fallback to URL
    return this.currentProfile.resumeUrl || undefined;
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number | undefined): string {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // ── Skills ────────────────────────────────────────────────

  loadSkills(): void {
    this.skillsLoading = true;
    this.cdr.markForCheck();

    this.portfolioService.getSkills().subscribe({
      next: (skills: SkillDto[]) => {
        this.skills = skills;
        this.skillsLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.skillsLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  openAddSkill(): void {
    this.editingSkill = null;
    this.skillForm.reset({ name: '', icon: '', category: 'frontend', proficiency: 50, sortOrder: 0 });
    this.showSkillForm = true;
    this.cdr.markForCheck();
  }

  openEditSkill(skill: SkillDto): void {
    this.editingSkill = skill;
    this.skillForm.patchValue({
      name: skill.name,
      icon: skill.icon,
      category: skill.category,
      proficiency: skill.proficiency,
      sortOrder: skill.sortOrder,
    });
    this.showSkillForm = true;
    this.cdr.markForCheck();
  }

  cancelSkillForm(): void {
    this.showSkillForm = false;
    this.editingSkill = null;
    this.cdr.markForCheck();
  }

  saveSkill(): void {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    this.skillSaving = true;
    this.cdr.markForCheck();

    const formValue = this.skillForm.value;

    if (this.editingSkill) {
      this.adminService.updateSkill(this.editingSkill.id, formValue).subscribe({
        next: (updated: SkillDto) => {
          const idx = this.skills.findIndex(s => s.id === updated.id);
          if (idx !== -1) {
            this.skills[idx] = updated;
            this.skills = [...this.skills];
          }
          this.skillSaving = false;
          this.showSkillForm = false;
          this.editingSkill = null;
          this.notification.success('Skill updated');
          this.cdr.markForCheck();
        },
        error: () => {
          this.skillSaving = false;
          this.notification.error('Failed to save skill');
          this.cdr.markForCheck();
        },
      });
    } else {
      this.adminService.createSkill(formValue).subscribe({
        next: (created: SkillDto) => {
          this.skills = [...this.skills, created];
          this.skillSaving = false;
          this.showSkillForm = false;
          this.notification.success('Skill created');
          this.cdr.markForCheck();
        },
        error: () => {
          this.skillSaving = false;
          this.notification.error('Failed to save skill');
          this.cdr.markForCheck();
        },
      });
    }
  }

  deleteSkill(skill: SkillDto): void {
    this.adminService.deleteSkill(skill.id).subscribe({
      next: () => {
        this.skills = this.skills.filter(s => s.id !== skill.id);
        this.notification.success('Skill deleted');
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to delete skill');
      },
    });
  }

  // ── Experiences ───────────────────────────────────────────

  loadExperiences(): void {
    this.experiencesLoading = true;
    this.cdr.markForCheck();

    this.portfolioService.getExperiences().subscribe({
      next: (experiences: ExperienceDto[]) => {
        this.experiences = experiences;
        this.experiencesLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.experiencesLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  openAddExperience(): void {
    this.editingExperience = null;
    this.experienceForm.reset({
      company: '', companyLogo: '', role: '', location: '',
      startDate: '', endDate: '', isCurrent: false,
      description: '', technologies: '', sortOrder: 0,
    });
    this.showExperienceForm = true;
    this.cdr.markForCheck();
  }

  openEditExperience(exp: ExperienceDto): void {
    this.editingExperience = exp;
    this.experienceForm.patchValue({
      company: exp.company,
      companyLogo: exp.companyLogo || '',
      role: exp.role,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent,
      description: exp.description,
      technologies: exp.technologies.join(', '),
      sortOrder: exp.sortOrder,
    });
    this.showExperienceForm = true;
    this.cdr.markForCheck();
  }

  cancelExperienceForm(): void {
    this.showExperienceForm = false;
    this.editingExperience = null;
    this.cdr.markForCheck();
  }

  saveExperience(): void {
    if (this.experienceForm.invalid) {
      this.experienceForm.markAllAsTouched();
      return;
    }

    this.experienceSaving = true;
    this.cdr.markForCheck();

    const formValue = this.experienceForm.value;
    const payload: Partial<ExperienceDto> = {
      ...formValue,
      endDate: formValue.isCurrent ? null : (formValue.endDate || null),
      technologies: typeof formValue.technologies === 'string'
        ? formValue.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t)
        : formValue.technologies,
    };

    if (this.editingExperience) {
      this.adminService.updateExperience(this.editingExperience.id, payload).subscribe({
        next: (updated: ExperienceDto) => {
          const idx = this.experiences.findIndex(e => e.id === updated.id);
          if (idx !== -1) {
            this.experiences[idx] = updated;
            this.experiences = [...this.experiences];
          }
          this.experienceSaving = false;
          this.showExperienceForm = false;
          this.editingExperience = null;
          this.notification.success('Experience updated');
          this.cdr.markForCheck();
        },
        error: () => {
          this.experienceSaving = false;
          this.notification.error('Failed to save experience');
          this.cdr.markForCheck();
        },
      });
    } else {
      this.adminService.createExperience(payload).subscribe({
        next: (created: ExperienceDto) => {
          this.experiences = [...this.experiences, created];
          this.experienceSaving = false;
          this.showExperienceForm = false;
          this.notification.success('Experience created');
          this.cdr.markForCheck();
        },
        error: () => {
          this.experienceSaving = false;
          this.notification.error('Failed to save experience');
          this.cdr.markForCheck();
        },
      });
    }
  }

  deleteExperience(exp: ExperienceDto): void {
    this.adminService.deleteExperience(exp.id).subscribe({
      next: () => {
        this.experiences = this.experiences.filter(e => e.id !== exp.id);
        this.notification.success('Experience deleted');
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to delete experience');
      },
    });
  }

  // ── Projects ──────────────────────────────────────────────

  loadProjects(): void {
    this.projectsLoading = true;
    this.cdr.markForCheck();

    this.portfolioService.getProjects().subscribe({
      next: (projects: ProjectDto[]) => {
        this.projects = projects;
        this.projectsLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.projectsLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  openAddProject(): void {
    this.editingProject = null;
    this.pendingThumbnail = null;
    this.projectForm.reset({
      title: '', description: '',
      liveUrl: '', repoUrl: '', technologies: '',
      featured: false, sortOrder: 0,
    });
    this.showProjectForm = true;
    this.cdr.markForCheck();
  }

  openEditProject(project: ProjectDto): void {
    this.editingProject = project;
    this.pendingThumbnail = null;
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      liveUrl: project.liveUrl || '',
      repoUrl: project.repoUrl || '',
      technologies: project.technologies.join(', '),
      featured: project.featured,
      sortOrder: project.sortOrder,
    });
    this.showProjectForm = true;
    this.cdr.markForCheck();
  }

  cancelProjectForm(): void {
    this.showProjectForm = false;
    this.editingProject = null;
    this.pendingThumbnail = null;
    this.cdr.markForCheck();
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.projectSaving = true;
    this.cdr.markForCheck();

    const formValue = this.projectForm.value;
    const payload: Partial<ProjectDto> = {
      ...formValue,
      technologies: typeof formValue.technologies === 'string'
        ? formValue.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t)
        : formValue.technologies,
    };

    const saveOperation = this.editingProject
      ? this.adminService.updateProject(this.editingProject.id, payload)
      : this.adminService.createProject(payload);

    saveOperation.subscribe({
      next: (savedProject: ProjectDto) => {
        // Upload thumbnail if pending
        if (this.pendingThumbnail) {
          this.adminService.uploadProjectThumbnail(
            savedProject.id,
            this.pendingThumbnail.base64,
            this.pendingThumbnail.contentType
          ).subscribe({
            next: () => {
              this.pendingThumbnail = null;
              this.finishProjectSave();
            },
            error: () => {
              this.notification.error('Project saved but thumbnail upload failed');
              this.pendingThumbnail = null;
              this.finishProjectSave();
            },
          });
        } else {
          this.finishProjectSave();
        }
      },
      error: () => {
        this.projectSaving = false;
        this.notification.error('Failed to save project');
        this.cdr.markForCheck();
      },
    });
  }

  private finishProjectSave(): void {
    this.projectSaving = false;
    this.showProjectForm = false;
    this.editingProject = null;
    this.notification.success('Project saved');
    this.loadProjects();
    this.cdr.markForCheck();
  }

  /**
   * Handle thumbnail file selection
   */
  onThumbnailFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.notification.error('Only JPEG, PNG, and WebP images are allowed');
      input.value = '';
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.notification.error('Image size exceeds 2MB limit');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      this.pendingThumbnail = { base64, contentType: file.type };
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  /**
   * Get thumbnail URL for display (supports both URL and Base64)
   */
  getThumbnailUrl(project: ProjectDto | null): string | undefined {
    if (!project) return undefined;

    // Use Base64 data if available
    if (project.thumbnailBase64 && project.thumbnailContentType) {
      return `data:${project.thumbnailContentType};base64,${project.thumbnailBase64}`;
    }

    // Fallback to URL
    return project.thumbnailUrl || undefined;
  }

  /**
   * Get pending thumbnail preview for the form
   */
  getPendingThumbnailPreview(): string | undefined {
    if (this.pendingThumbnail) {
      return `data:${this.pendingThumbnail.contentType};base64,${this.pendingThumbnail.base64}`;
    }
    if (this.editingProject) {
      return this.getThumbnailUrl(this.editingProject);
    }
    return undefined;
  }

  deleteProject(project: ProjectDto): void {
    this.adminService.deleteProject(project.id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== project.id);
        this.notification.success('Project deleted');
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to delete project');
      },
    });
  }
}
