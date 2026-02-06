import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { vi } from 'vitest';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: { isAuthenticated: ReturnType<typeof vi.fn> };
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = { isAuthenticated: vi.fn() };
    routerMock = { createUrlTree: vi.fn().mockReturnValue({} as UrlTree) };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    expect(guard.canActivate()).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    guard.canActivate();
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/admin/login']);
  });

  it('should return UrlTree when not authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    const result = guard.canActivate();
    expect(result).not.toBe(true);
  });
});
