import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Base API service for making HTTP requests.
 * All feature services should use this service for API communication.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Performs a GET request to the specified endpoint.
   * @param endpoint - The API endpoint path (e.g., '/profile')
   * @returns Observable of the response
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Performs a POST request to the specified endpoint.
   * @param endpoint - The API endpoint path
   * @param body - The request body
   * @returns Observable of the response
   */
  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Performs a PUT request to the specified endpoint.
   * @param endpoint - The API endpoint path
   * @param body - The request body
   * @returns Observable of the response
   */
  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Performs a PATCH request to the specified endpoint.
   * @param endpoint - The API endpoint path
   * @param body - The partial request body
   * @returns Observable of the response
   */
  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Performs a DELETE request to the specified endpoint.
   * @param endpoint - The API endpoint path
   * @returns Observable of the response
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
