import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';
import { ProfileDto } from '../../../../core/models/profile.model';
import { DoublePendulumService } from '../../../../core/services/double-pendulum.service';

@Component({
  selector: 'app-hero-section',
  standalone: false,
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pendulumCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  profile$!: Observable<ProfileDto>;

  constructor(
    private portfolioService: PortfolioService,
    private pendulumService: DoublePendulumService
  ) {}

  ngOnInit(): void {
    this.profile$ = this.portfolioService.getProfile();
  }

  ngAfterViewInit(): void {
    // Initialize the canvas animation after view is ready
    if (this.canvasRef?.nativeElement) {
      setTimeout(() => {
        this.pendulumService.initCanvas(this.canvasRef.nativeElement);
      }, 100);
    }
  }

  ngOnDestroy(): void {
    // Clean up animation when component is destroyed
    this.pendulumService.destroy();
  }

  scrollToNext(): void {
    const element = document.getElementById('skills');
    if (element) {
      const navbarHeight = 64;
      const targetPosition = element.offsetTop - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  downloadResume(profile: ProfileDto): void {
    if (profile.resumeUrl) {
      window.open(profile.resumeUrl, '_blank');
    }
  }
}
