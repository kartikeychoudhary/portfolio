import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'fa-solid fa-gauge', route: '/admin/dashboard' },
    { label: 'Portfolio', icon: 'fa-solid fa-briefcase', route: '/admin/manage-portfolio' },
    { label: 'Blog', icon: 'fa-solid fa-blog', route: '/admin/manage-blog' },
    { label: 'Settings', icon: 'fa-solid fa-gear', route: '/admin/settings' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
