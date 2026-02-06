import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

/**
 * Manages SEO-related metadata for pages.
 *
 * Responsibilities:
 * - Sets the page title.
 * - Sets meta description and Open Graph tags.
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  /**
   * Sets the page title.
   * @param title - The page title to set
   */
  setTitle(title: string): void {
    this.titleService.setTitle(`${title} | Kartikey Choudhary`);
  }

  /**
   * Sets the meta description tag.
   * @param description - The page description
   */
  setDescription(description: string): void {
    this.metaService.updateTag({ name: 'description', content: description });
  }

  /**
   * Sets Open Graph meta tags for social sharing.
   * @param title - The OG title
   * @param description - The OG description
   * @param imageUrl - The OG image URL
   */
  setOpenGraph(title: string, description: string, imageUrl?: string): void {
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    if (imageUrl) {
      this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    }
    if (isPlatformBrowser(this.platformId)) {
      this.metaService.updateTag({ property: 'og:url', content: this.document.location.href });
    }
  }

  /**
   * Sets canonical URL link tag.
   * @param url - The canonical URL
   */
  setCanonicalUrl(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    }
  }
}
