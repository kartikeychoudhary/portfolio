import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-password-warning-banner',
  template: `
    <div *ngIf="shouldShowWarning()" class="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation text-yellow-600 dark:text-yellow-400"></i>
          <p class="text-sm text-yellow-800 dark:text-yellow-200">
            You are using the default password. Please change it for security.
          </p>
        </div>
        <button
          (click)="navigateToSettings()"
          class="text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 underline"
        >
          Change Now
        </button>
      </div>
    </div>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordWarningBanner {
  constructor(private authService: AuthService, private router: Router) {}

  shouldShowWarning(): boolean {
    return this.authService.requiresPasswordChange();
  }

  navigateToSettings(): void {
    this.router.navigate(['/admin/settings']);
  }
}
