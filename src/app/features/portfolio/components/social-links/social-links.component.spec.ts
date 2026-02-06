import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLinksComponent } from './social-links.component';
import { SocialLink } from '../../../../core/models/profile.model';

describe('SocialLinksComponent', () => {
  let component: SocialLinksComponent;
  let fixture: ComponentFixture<SocialLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialLinksComponent],
      imports: [CommonModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SocialLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render social links when provided', () => {
    const mockLinks: SocialLink[] = [
      { id: '1', platform: 'github', url: 'https://github.com/test', icon: 'pi pi-github', label: 'GitHub', sortOrder: 1 },
      { id: '2', platform: 'linkedin', url: 'https://linkedin.com/in/test', icon: 'pi pi-linkedin', label: 'LinkedIn', sortOrder: 2 }
    ];

    fixture.componentRef.setInput('socialLinks', mockLinks);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('https://github.com/test');
    expect(links[1].getAttribute('href')).toBe('https://linkedin.com/in/test');
  });
});
