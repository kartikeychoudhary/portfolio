import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-public-layout',
  standalone: false,
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {
  currentYear = new Date().getFullYear();
}
