import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Wrapper around PrimeNG MessageService for consistent toast notifications.
 * Provides simple success/error/info methods used across admin pages.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  success(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 3000
    });
  }

  error(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }

  info(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life: 3000
    });
  }
}
