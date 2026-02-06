import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';
import { of } from 'rxjs';

import { ManagePortfolioPageComponent } from './manage-portfolio-page.component';
import { AdminService } from '../../services/admin.service';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { ProfileDto } from '../../../../core/models/profile.model';
import { SkillDto } from '../../../../core/models/skill.model';
import { ExperienceDto } from '../../../../core/models/experience.model';
import { ProjectDto } from '../../../../core/models/project.model';

describe('ManagePortfolioPageComponent', () => {
  let component: ManagePortfolioPageComponent;
  let fixture: ComponentFixture<ManagePortfolioPageComponent>;

  let adminServiceMock: {
    updateProfile: ReturnType<typeof vi.fn>;
    createSkill: ReturnType<typeof vi.fn>;
    updateSkill: ReturnType<typeof vi.fn>;
    deleteSkill: ReturnType<typeof vi.fn>;
    createExperience: ReturnType<typeof vi.fn>;
    updateExperience: ReturnType<typeof vi.fn>;
    deleteExperience: ReturnType<typeof vi.fn>;
    createProject: ReturnType<typeof vi.fn>;
    updateProject: ReturnType<typeof vi.fn>;
    deleteProject: ReturnType<typeof vi.fn>;
  };

  let portfolioServiceMock: {
    getProfile: ReturnType<typeof vi.fn>;
    getSkills: ReturnType<typeof vi.fn>;
    getExperiences: ReturnType<typeof vi.fn>;
    getProjects: ReturnType<typeof vi.fn>;
  };

  const mockProfile: ProfileDto = {
    id: '1',
    fullName: 'Kartikey',
    title: 'Developer',
    tagline: 'Building things',
    bio: '<p>About me</p>',
    avatarUrl: 'avatar.jpg',
    resumeUrl: 'resume.pdf',
    socialLinks: [],
  };

  const mockSkills: SkillDto[] = [
    {
      id: 's1',
      name: 'Angular',
      icon: 'fa-brands fa-angular',
      category: 'frontend',
      proficiency: 90,
      sortOrder: 1,
    },
    {
      id: 's2',
      name: 'Node.js',
      icon: 'fa-brands fa-node-js',
      category: 'backend',
      proficiency: 80,
      sortOrder: 2,
    },
  ];

  const mockExperiences: ExperienceDto[] = [
    {
      id: 'e1',
      company: 'Acme Corp',
      role: 'Senior Developer',
      location: 'Remote',
      startDate: '2023-01-01',
      endDate: null,
      isCurrent: true,
      description: 'Building web apps',
      technologies: ['Angular', 'TypeScript'],
      sortOrder: 1,
    },
  ];

  const mockProjects: ProjectDto[] = [
    {
      id: 'p1',
      title: 'Portfolio',
      description: 'My portfolio site',
      thumbnailUrl: 'thumb.jpg',
      technologies: ['Angular'],
      featured: true,
      sortOrder: 1,
    },
  ];

  beforeEach(async () => {
    adminServiceMock = {
      updateProfile: vi.fn(),
      createSkill: vi.fn(),
      updateSkill: vi.fn(),
      deleteSkill: vi.fn(),
      createExperience: vi.fn(),
      updateExperience: vi.fn(),
      deleteExperience: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
    };

    portfolioServiceMock = {
      getProfile: vi.fn().mockReturnValue(of(mockProfile)),
      getSkills: vi.fn().mockReturnValue(of(mockSkills)),
      getExperiences: vi.fn().mockReturnValue(of(mockExperiences)),
      getProjects: vi.fn().mockReturnValue(of(mockProjects)),
    };

    await TestBed.configureTestingModule({
      declarations: [ManagePortfolioPageComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AdminService, useValue: adminServiceMock },
        { provide: PortfolioService, useValue: portfolioServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePortfolioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile on init', () => {
    expect(portfolioServiceMock.getProfile).toHaveBeenCalled();
    expect(component.profileForm.value.fullName).toBe('Kartikey');
    expect(component.profileForm.value.title).toBe('Developer');
    expect(component.profileForm.value.tagline).toBe('Building things');
    expect(component.profileForm.value.bio).toBe('<p>About me</p>');
    expect(component.profileForm.value.avatarUrl).toBe('avatar.jpg');
    expect(component.profileForm.value.resumeUrl).toBe('resume.pdf');
    expect(component.profileLoading).toBe(false);
  });

  it('should load skills on init', () => {
    expect(portfolioServiceMock.getSkills).toHaveBeenCalled();
    expect(component.skills.length).toBe(2);
    expect(component.skills[0].name).toBe('Angular');
    expect(component.skillsLoading).toBe(false);
  });

  it('should load experiences on init', () => {
    expect(portfolioServiceMock.getExperiences).toHaveBeenCalled();
    expect(component.experiences.length).toBe(1);
    expect(component.experiences[0].company).toBe('Acme Corp');
    expect(component.experiencesLoading).toBe(false);
  });

  it('should load projects on init', () => {
    expect(portfolioServiceMock.getProjects).toHaveBeenCalled();
    expect(component.projects.length).toBe(1);
    expect(component.projects[0].title).toBe('Portfolio');
    expect(component.projectsLoading).toBe(false);
  });

  it('should switch tabs', () => {
    expect(component.activeTab).toBe('profile');

    component.switchTab('skills');
    expect(component.activeTab).toBe('skills');

    component.switchTab('experiences');
    expect(component.activeTab).toBe('experiences');

    component.switchTab('projects');
    expect(component.activeTab).toBe('projects');

    component.switchTab('profile');
    expect(component.activeTab).toBe('profile');
  });

  it('should call AdminService.updateProfile on save', () => {
    const updatedProfile: Partial<ProfileDto> = {
      fullName: 'Kartikey S.',
      title: 'Senior Developer',
      tagline: 'New tagline',
      bio: '<p>Updated bio</p>',
      avatarUrl: 'new-avatar.jpg',
      resumeUrl: 'new-resume.pdf',
    };
    adminServiceMock.updateProfile.mockReturnValue(of({ ...mockProfile, ...updatedProfile }));

    component.profileForm.setValue({
      fullName: 'Kartikey S.',
      title: 'Senior Developer',
      tagline: 'New tagline',
      bio: '<p>Updated bio</p>',
      avatarUrl: 'new-avatar.jpg',
      resumeUrl: 'new-resume.pdf',
    });

    component.saveProfile();

    expect(adminServiceMock.updateProfile).toHaveBeenCalledWith({
      fullName: 'Kartikey S.',
      title: 'Senior Developer',
      tagline: 'New tagline',
      bio: '<p>Updated bio</p>',
      avatarUrl: 'new-avatar.jpg',
      resumeUrl: 'new-resume.pdf',
    });
    expect(component.profileSaving).toBe(false);
  });

  it('should not save profile when form is invalid', () => {
    component.profileForm.patchValue({ fullName: '', title: '' });

    component.saveProfile();

    expect(adminServiceMock.updateProfile).not.toHaveBeenCalled();
  });

  it('should create a skill via AdminService', () => {
    const newSkill: SkillDto = {
      id: 's3',
      name: 'React',
      icon: 'fa-brands fa-react',
      category: 'frontend',
      proficiency: 70,
      sortOrder: 3,
    };
    adminServiceMock.createSkill.mockReturnValue(of(newSkill));

    component.openAddSkill();
    component.skillForm.setValue({
      name: 'React',
      icon: 'fa-brands fa-react',
      category: 'frontend',
      proficiency: 70,
      sortOrder: 3,
    });
    component.saveSkill();

    expect(adminServiceMock.createSkill).toHaveBeenCalledWith({
      name: 'React',
      icon: 'fa-brands fa-react',
      category: 'frontend',
      proficiency: 70,
      sortOrder: 3,
    });
    expect(component.skills.length).toBe(3);
    expect(component.showSkillForm).toBe(false);
  });

  it('should delete a skill via AdminService', () => {
    adminServiceMock.deleteSkill.mockReturnValue(of(undefined));

    component.deleteSkill(mockSkills[0]);

    expect(adminServiceMock.deleteSkill).toHaveBeenCalledWith('s1');
    expect(component.skills.length).toBe(1);
    expect(component.skills[0].id).toBe('s2');
  });

  it('should open edit skill form with correct values', () => {
    component.openEditSkill(mockSkills[0]);

    expect(component.editingSkill).toBe(mockSkills[0]);
    expect(component.showSkillForm).toBe(true);
    expect(component.skillForm.value.name).toBe('Angular');
    expect(component.skillForm.value.category).toBe('frontend');
    expect(component.skillForm.value.proficiency).toBe(90);
  });

  it('should cancel skill form', () => {
    component.openAddSkill();
    expect(component.showSkillForm).toBe(true);

    component.cancelSkillForm();
    expect(component.showSkillForm).toBe(false);
    expect(component.editingSkill).toBeNull();
  });

  it('should create an experience via AdminService', () => {
    const newExperience: ExperienceDto = {
      id: 'e2',
      company: 'New Co',
      role: 'Engineer',
      location: 'NYC',
      startDate: '2025-06-01',
      endDate: null,
      isCurrent: true,
      description: 'New role',
      technologies: ['React'],
      sortOrder: 2,
    };
    adminServiceMock.createExperience.mockReturnValue(of(newExperience));

    component.openAddExperience();
    component.experienceForm.setValue({
      company: 'New Co',
      companyLogo: '',
      role: 'Engineer',
      location: 'NYC',
      startDate: '2025-06-01',
      endDate: '',
      isCurrent: true,
      description: 'New role',
      technologies: 'React',
      sortOrder: 2,
    });
    component.saveExperience();

    expect(adminServiceMock.createExperience).toHaveBeenCalled();
    expect(component.experiences.length).toBe(2);
    expect(component.showExperienceForm).toBe(false);
  });

  it('should delete an experience via AdminService', () => {
    adminServiceMock.deleteExperience.mockReturnValue(of(undefined));

    component.deleteExperience(mockExperiences[0]);

    expect(adminServiceMock.deleteExperience).toHaveBeenCalledWith('e1');
    expect(component.experiences.length).toBe(0);
  });

  it('should create a project via AdminService', () => {
    const newProject: ProjectDto = {
      id: 'p2',
      title: 'New Project',
      description: 'A new project',
      thumbnailUrl: 'new-thumb.jpg',
      technologies: ['Vue'],
      featured: false,
      sortOrder: 2,
    };
    adminServiceMock.createProject.mockReturnValue(of(newProject));

    component.openAddProject();
    component.projectForm.setValue({
      title: 'New Project',
      description: 'A new project',
      thumbnailUrl: 'new-thumb.jpg',
      liveUrl: '',
      repoUrl: '',
      technologies: 'Vue',
      featured: false,
      sortOrder: 2,
    });
    component.saveProject();

    expect(adminServiceMock.createProject).toHaveBeenCalled();
    expect(component.projects.length).toBe(2);
    expect(component.showProjectForm).toBe(false);
  });

  it('should delete a project via AdminService', () => {
    adminServiceMock.deleteProject.mockReturnValue(of(undefined));

    component.deleteProject(mockProjects[0]);

    expect(adminServiceMock.deleteProject).toHaveBeenCalledWith('p1');
    expect(component.projects.length).toBe(0);
  });
});
