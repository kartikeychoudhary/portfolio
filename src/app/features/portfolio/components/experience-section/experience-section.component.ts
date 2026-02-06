import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';
import { ExperienceDto } from '../../../../core/models/experience.model';

@Component({
  selector: 'app-experience-section',
  standalone: false,
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceSectionComponent implements OnInit {
  experiences$!: Observable<ExperienceDto[]>;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.experiences$ = this.portfolioService.getExperiences();
  }
}
