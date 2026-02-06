import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-portfolio-page',
  standalone: false,
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioPageComponent { }
