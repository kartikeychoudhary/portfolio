import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated initially', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(service.getUser()).toBeNull();
  });

  it('should login successfully with valid credentials', () => {
    const mockUsers = [{ id: 'u1', username: 'admin', password: 'admin123', role: 'admin' as const }];

    service.login({ username: 'admin', password: 'admin123' }).subscribe(response => {
      expect(response.token).toBeTruthy();
      expect(response.user.username).toBe('admin');
      expect(service.isAuthenticated()).toBe(true);
      expect(service.getToken()).toBeTruthy();
    });

    const req = httpMock.expectOne(r => r.url === '/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should throw error for invalid credentials', () => {
    const mockUsers = [{ id: 'u1', username: 'admin', password: 'admin123', role: 'admin' as const }];

    service.login({ username: 'admin', password: 'wrong' }).subscribe({
      error: (err) => {
        expect(err.message).toBe('Invalid credentials');
        expect(service.isAuthenticated()).toBe(false);
      }
    });

    const req = httpMock.expectOne(r => r.url === '/api/users');
    req.flush(mockUsers);
  });

  it('should logout and navigate to login page', () => {
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/login']);
  });

  it('should emit token$ values', () => {
    return new Promise<void>((resolve) => {
      const values: (string | null)[] = [];
      service.token$.subscribe(val => {
        values.push(val);
        if (values.length === 2) {
          expect(values[0]).toBeNull();
          expect(values[1]).toBeTruthy();
          resolve();
        }
      });

      const mockUsers = [{ id: 'u1', username: 'admin', password: 'admin123', role: 'admin' as const }];
      service.login({ username: 'admin', password: 'admin123' }).subscribe();
      const req = httpMock.expectOne(r => r.url === '/api/users');
      req.flush(mockUsers);
    });
  });
});
