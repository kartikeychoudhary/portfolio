import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ChangePasswordRequest, ChangePasswordResponse, LoginRequest, LoginResponse } from '../models/auth.model';

/**
 * Manages authentication state with JWT token-based authentication.
 *
 * Handles login via backend API, token persistence in localStorage,
 * automatic token expiration, and session management.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenSubject = new BehaviorSubject<string | null>(null);
  private readonly userSubject = new BehaviorSubject<LoginResponse['user'] | null>(null);

  /** Observable of the current authentication token */
  readonly token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Authenticates a user with the provided credentials.
   * @param credentials - Username and password
   * @returns Observable of the login response
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap(response => {
        // Store in memory (BehaviorSubject)
        this.tokenSubject.next(response.token);
        this.userSubject.next(response.user);

        // Persist to localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));

        // Store expiration time (current time + expiresIn seconds)
        const expirationTime = Date.now() + (response.expiresIn * 1000);
        localStorage.setItem('auth_expiration', expirationTime.toString());
      })
    );
  }

  /**
   * Logs out the current user and navigates to login page.
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/admin/login']);
  }

  /**
   * Checks if the user is currently authenticated.
   * @returns true if a token exists and is not expired
   */
  isAuthenticated(): boolean {
    return this.tokenSubject.value !== null && !this.isTokenExpired();
  }

  /**
   * Gets the current authentication token.
   * @returns The token string or null
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Gets the current user info.
   * @returns The user object or null
   */
  getUser(): LoginResponse['user'] | null {
    return this.userSubject.value;
  }

  /**
   * Initialize auth state from localStorage on app startup.
   * Restores token and user if they exist and are not expired.
   */
  initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');
    const expiration = localStorage.getItem('auth_expiration');

    if (token && userJson && expiration) {
      const expirationTime = parseInt(expiration, 10);

      // Check if token is expired
      if (Date.now() < expirationTime) {
        this.tokenSubject.next(token);
        this.userSubject.next(JSON.parse(userJson));
      } else {
        // Token expired, clear storage
        this.clearAuthData();
      }
    }
  }

  /**
   * Check if token is expired based on stored expiration time.
   * @returns true if token is expired or expiration time not found
   */
  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('auth_expiration');
    if (!expiration) return true;
    return Date.now() >= parseInt(expiration, 10);
  }

  /**
   * Changes the password for the currently authenticated user.
   * @param request - Current and new password details
   * @returns Observable of the change password response
   */
  changePassword(request: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    return this.http.post<ChangePasswordResponse>('/api/auth/change-password', request).pipe(
      tap(response => {
        // Update user info in memory and localStorage
        this.userSubject.next(response.user);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      })
    );
  }

  /**
   * Checks if the current user requires a password change.
   * @returns true if password change is required
   */
  requiresPasswordChange(): boolean {
    const user = this.userSubject.value;
    return user?.requiresPasswordChange === true;
  }

  /**
   * Clear auth data from memory and localStorage.
   */
  private clearAuthData(): void {
    this.tokenSubject.next(null);
    this.userSubject.next(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expiration');
  }
}
