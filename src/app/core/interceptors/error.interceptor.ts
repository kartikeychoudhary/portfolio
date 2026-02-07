import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Intercepts HTTP errors and handles authentication failures globally.
 *
 * Automatically logs out the user and redirects to login page
 * when receiving 401 (Unauthorized) or 403 (Forbidden) responses.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Only redirect to login if we're already on an admin route
          // Public routes should handle 401/403 gracefully without redirecting
          const currentUrl = this.router.url;
          const isAdminRoute = currentUrl.startsWith('/admin');

          if (isAdminRoute) {
            // Unauthorized or Forbidden on admin route - logout and redirect
            this.authService.logout();
            this.router.navigate(['/admin/login'], {
              queryParams: { returnUrl: currentUrl }
            });
          }
          // For public routes, just let the error propagate
          // Components can handle it (show error message, use fallback data, etc.)
        }

        return throwError(() => error);
      })
    );
  }
}
