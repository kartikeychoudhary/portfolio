import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';
import { ProfileDto } from '../../../../core/models/profile.model';

@Component({
  selector: 'app-hero-section',
  standalone: false,
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent implements OnInit {
  profile$!: Observable<ProfileDto>;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.profile$ = this.portfolioService.getProfile();
  }

  scrollToSkills(): void {
    const element = document.getElementById('skills');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
