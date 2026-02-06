import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../../core/services/theme.service';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';
import { CommonModule } from '@angular/common';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let mockThemeService: { toggle: ReturnType<typeof vi.fn>; isDark$: BehaviorSubject<boolean> };

  beforeEach(async () => {
    mockThemeService = {
      toggle: vi.fn(),
      isDark$: new BehaviorSubject<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ThemeToggleComponent],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call themeService.toggle() when toggle is called', () => {
    component.toggle();
    expect(mockThemeService.toggle).toHaveBeenCalled();
  });
});
