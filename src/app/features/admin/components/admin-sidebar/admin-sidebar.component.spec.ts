import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AdminSidebarComponent } from './admin-sidebar.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('AdminSidebarComponent', () => {
  let component: AdminSidebarComponent;
  let fixture: ComponentFixture<AdminSidebarComponent>;
  let authServiceMock: { logout: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = {
      logout: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [AdminSidebarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have navigation items', () => {
    expect(component.navItems.length).toBe(3);
    expect(component.navItems[0].label).toBe('Dashboard');
    expect(component.navItems[1].label).toBe('Portfolio');
    expect(component.navItems[2].label).toBe('Blog');
  });

  it('should call logout on AuthService', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
