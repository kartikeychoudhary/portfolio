import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SeoService,
        Title,
        Meta,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set page title with suffix', () => {
    service.setTitle('Home');
    expect(titleService.getTitle()).toBe('Home | Kartikey Choudhary');
  });

  it('should set meta description', () => {
    service.setDescription('Test description');
    const meta = metaService.getTag('name="description"');
    expect(meta?.content).toBe('Test description');
  });

  it('should set Open Graph tags', () => {
    service.setOpenGraph('OG Title', 'OG Description', 'https://example.com/image.jpg');
    const ogTitle = metaService.getTag('property="og:title"');
    const ogDesc = metaService.getTag('property="og:description"');
    const ogImage = metaService.getTag('property="og:image"');

    expect(ogTitle?.content).toBe('OG Title');
    expect(ogDesc?.content).toBe('OG Description');
    expect(ogImage?.content).toBe('https://example.com/image.jpg');
  });

  it('should set Open Graph without image', () => {
    service.setOpenGraph('Title', 'Description');
    const ogTitle = metaService.getTag('property="og:title"');
    expect(ogTitle?.content).toBe('Title');
  });

  it('should set canonical URL', () => {
    const doc = TestBed.inject(DOCUMENT);
    service.setCanonicalUrl('https://example.com/test');
    const link = doc.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe('https://example.com/test');
  });
});
