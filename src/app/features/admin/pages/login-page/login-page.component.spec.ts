import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authServiceMock: { login: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('form should be valid with username and password', () => {
    component.loginForm.setValue({ username: 'admin', password: 'password' });
    expect(component.loginForm.valid).toBe(true);
  });

  it('should call AuthService.login on submit', () => {
    const mockResponse = {
      token: 'mock-token',
      expiresIn: 3600,
      user: { id: '1', username: 'admin', role: 'admin' as const },
    };
    authServiceMock.login.mockReturnValue(of(mockResponse));

    component.loginForm.setValue({ username: 'admin', password: 'password' });
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'password',
    });
  });

  it('should navigate to dashboard on successful login', () => {
    const mockResponse = {
      token: 'mock-token',
      expiresIn: 3600,
      user: { id: '1', username: 'admin', role: 'admin' as const },
    };
    authServiceMock.login.mockReturnValue(of(mockResponse));

    component.loginForm.setValue({ username: 'admin', password: 'password' });
    component.onSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should show error message on failed login', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.loginForm.setValue({ username: 'admin', password: 'wrong' });
    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid credentials');
    expect(component.isSubmitting).toBe(false);
  });
});
