import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProfileDto } from '../../../../core/models/profile.model';
import { SkillDto, SkillCategory } from '../../../../core/models/skill.model';
import { ExperienceDto } from '../../../../core/models/experience.model';
import { ProjectDto } from '../../../../core/models/project.model';
import { AdminService } from '../../services/admin.service';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';

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

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
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
      tagline: [''],
      bio: [''],
      avatarUrl: [''],
      resumeUrl: [''],
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
      thumbnailUrl: [''],
      liveUrl: [''],
      repoUrl: [''],
      technologies: [''],
      featured: [false],
      sortOrder: [0],
    });
  }

  // ── Profile ───────────────────────────────────────────────

  loadProfile(): void {
    this.profileLoading = true;
    this.cdr.markForCheck();

    this.portfolioService.getProfile().subscribe({
      next: (profile: ProfileDto) => {
        this.profileForm.patchValue({
          fullName: profile.fullName,
          title: profile.title,
          tagline: profile.tagline,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          resumeUrl: profile.resumeUrl,
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
        this.cdr.markForCheck();
      },
      error: () => {
        this.profileSaving = false;
        this.cdr.markForCheck();
      },
    });
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
          this.cdr.markForCheck();
        },
        error: () => {
          this.skillSaving = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      this.adminService.createSkill(formValue).subscribe({
        next: (created: SkillDto) => {
          this.skills = [...this.skills, created];
          this.skillSaving = false;
          this.showSkillForm = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.skillSaving = false;
          this.cdr.markForCheck();
        },
      });
    }
  }

  deleteSkill(skill: SkillDto): void {
    this.adminService.deleteSkill(skill.id).subscribe({
      next: () => {
        this.skills = this.skills.filter(s => s.id !== skill.id);
        this.cdr.markForCheck();
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
          this.cdr.markForCheck();
        },
        error: () => {
          this.experienceSaving = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      this.adminService.createExperience(payload).subscribe({
        next: (created: ExperienceDto) => {
          this.experiences = [...this.experiences, created];
          this.experienceSaving = false;
          this.showExperienceForm = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.experienceSaving = false;
          this.cdr.markForCheck();
        },
      });
    }
  }

  deleteExperience(exp: ExperienceDto): void {
    this.adminService.deleteExperience(exp.id).subscribe({
      next: () => {
        this.experiences = this.experiences.filter(e => e.id !== exp.id);
        this.cdr.markForCheck();
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
    this.projectForm.reset({
      title: '', description: '', thumbnailUrl: '',
      liveUrl: '', repoUrl: '', technologies: '',
      featured: false, sortOrder: 0,
    });
    this.showProjectForm = true;
    this.cdr.markForCheck();
  }

  openEditProject(project: ProjectDto): void {
    this.editingProject = project;
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      thumbnailUrl: project.thumbnailUrl,
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

    if (this.editingProject) {
      this.adminService.updateProject(this.editingProject.id, payload).subscribe({
        next: (updated: ProjectDto) => {
          const idx = this.projects.findIndex(p => p.id === updated.id);
          if (idx !== -1) {
            this.projects[idx] = updated;
            this.projects = [...this.projects];
          }
          this.projectSaving = false;
          this.showProjectForm = false;
          this.editingProject = null;
          this.cdr.markForCheck();
        },
        error: () => {
          this.projectSaving = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      this.adminService.createProject(payload).subscribe({
        next: (created: ProjectDto) => {
          this.projects = [...this.projects, created];
          this.projectSaving = false;
          this.showProjectForm = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.projectSaving = false;
          this.cdr.markForCheck();
        },
      });
    }
  }

  deleteProject(project: ProjectDto): void {
    this.adminService.deleteProject(project.id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== project.id);
        this.cdr.markForCheck();
      },
    });
  }
}
