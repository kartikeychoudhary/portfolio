import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Pipe that sanitizes and renders trusted HTML content.
 * Use with caution — only for content from trusted sources.
 *
 * @example
 * <div [innerHTML]="htmlContent | safeHtml"></div>
 */
@Pipe({
  name: 'safeHtml',
  standalone: false
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Transforms an HTML string into a SafeHtml value.
   * @param value - The HTML string to sanitize
   * @returns SafeHtml value or empty string for falsy input
   */
  transform(value: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
