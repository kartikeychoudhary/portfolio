import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PortfolioService } from '../../services/portfolio.service';
import { EducationDto, ExperienceSummary } from '../../../../core/models/education.model';
import { ProfileDto } from '../../../../core/models/profile.model';

/**
 * About Section Component
 *
 * Displays:
 * - Bio/introduction card
 *
 * Single-column centered layout.
 * (Education, experience summary, and profile card sections are currently commented out)
 */
@Component({
  selector: 'app-about-section',
  standalone: false,
  templateUrl: './about-section.component.html',
  styleUrls: ['./about-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutSectionComponent implements OnInit {
  // profile$!: Observable<ProfileDto>; // COMMENTED OUT - profile card removed
  // education$!: Observable<EducationDto[]>; // COMMENTED OUT - education section hidden
  // experienceSummary$!: Observable<ExperienceSummary[]>; // COMMENTED OUT - experience summary hidden

  // Mock data - COMMENTED OUT (not currently used)
  /*
  private mockEducation: EducationDto[] = [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University Name',
      duration: '2015 - 2019',
      achievements: [
        'Dean\'s List all semesters',
        'Computer Science Excellence Award',
        'Led student tech community'
      ],
      gpa: 3.8,
      major: 'Computer Science'
    }
  ];

  private mockExperienceSummary: ExperienceSummary[] = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: 'Tech Company',
      duration: '2021 - Present',
      isCurrent: true,
      description: 'Leading development of cloud-native applications'
    }
  ];

  keySkills = ['Angular', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker'];
  */

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    // Observables commented out - sections currently hidden
    /*
    this.profile$ = this.portfolioService.getProfile();

    this.education$ = this.portfolioService.getEducation().pipe(
      catchError(() => of(this.mockEducation))
    );

    this.experienceSummary$ = this.portfolioService.getExperienceSummary().pipe(
      catchError(() => of(this.mockExperienceSummary))
    );
    */
  }

  // downloadResume() - COMMENTED OUT (profile card removed)
  /*
  downloadResume(): void {
    // TODO: Implement resume download
    console.log('Download resume');
  }
  */
}
