import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { ThemeService } from '../../../../core/services/theme.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have navLinks', () => {
    expect(component.navLinks.length).toBe(4);
    expect(component.navLinks[0].label).toBe('Skills');
    expect(component.navLinks[1].label).toBe('Experience');
    expect(component.navLinks[2].label).toBe('Projects');
    expect(component.navLinks[3].label).toBe('Contact');
  });

  it('should set isScrolled on scroll', () => {
    expect(component.isScrolled).toBe(false);

    // Simulate scrollY > 50
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    component.onScroll();
    expect(component.isScrolled).toBe(true);

    // Simulate scrollY <= 50
    Object.defineProperty(window, 'scrollY', { value: 10, writable: true });
    component.onScroll();
    expect(component.isScrolled).toBe(false);
  });
});
