import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectDto } from '../../../../core/models/project.model';

@Component({
  selector: 'app-projects-section',
  standalone: false,
  templateUrl: './projects-section.component.html',
  styleUrls: ['./projects-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsSectionComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef<HTMLDivElement>;

  projects$!: Observable<ProjectDto[]>;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.projects$ = this.portfolioService.getProjects().pipe(
      catchError(error => {
        console.error('Failed to load projects, using fallback data:', error);
        // Return empty array as fallback when API fails
        return of([]);
      })
    );
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: -370, // Card width + gap
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: 370, // Card width + gap
        behavior: 'smooth'
      });
    }
  }
}
