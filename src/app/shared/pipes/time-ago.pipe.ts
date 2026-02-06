import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms ISO date strings into relative time descriptions.
 *
 * @example
 * {{ '2026-01-15T09:00:00Z' | timeAgo }} // "3 weeks ago"
 */
@Pipe({
  name: 'timeAgo',
  standalone: false
})
export class TimeAgoPipe implements PipeTransform {
  /**
   * Transforms a date string into a relative time string.
   * @param value - ISO date string or Date object
   * @returns Relative time string (e.g., '2 days ago', 'just now')
   */
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 0) {
      return 'in the future';
    }

    if (seconds < 60) {
      return 'just now';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }

    const years = Math.floor(months / 12);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
}
