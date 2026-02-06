import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
  projects$!: Observable<ProjectDto[]>;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.projects$ = this.portfolioService.getProjects();
  }
}
