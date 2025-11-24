import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * HTTP request options interface
 */
export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  timeout?: number;
}

/**
 * Abstract base class for all API services
 * Provides common HTTP methods and URL construction
 */
export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected abstract readonly endpoint: string;
  
  /**
   * Constructs full URL by combining base URL and endpoint path
   * @param path - The path to append to the endpoint
   * @returns Full URL string
   */
  protected buildUrl(path: string): string {
    const baseUrl = environment.apiBaseUrl;
    const endpoint = this.endpoint;
    
    // Ensure no double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${baseUrl}${cleanEndpoint}${cleanPath}`;
  }
  
  /**
   * Performs HTTP GET request
   * @param path - The path relative to the endpoint
   * @param options - Optional HTTP options
   * @returns Observable of the response
   */
  protected get<T>(path: string, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(path);
    const timeoutMs = options?.timeout ?? environment.apiTimeout;
    
    return this.http.get<T>(url, {
      headers: options?.headers,
      params: options?.params
    }).pipe(
      timeout(timeoutMs)
    );
  }
  
  /**
   * Performs HTTP POST request
   * @param path - The path relative to the endpoint
   * @param body - The request body
   * @param options - Optional HTTP options
   * @returns Observable of the response
   */
  protected post<T>(path: string, body: any, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(path);
    const timeoutMs = options?.timeout ?? environment.apiTimeout;
    
    return this.http.post<T>(url, body, {
      headers: options?.headers,
      params: options?.params
    }).pipe(
      timeout(timeoutMs)
    );
  }
  
  /**
   * Performs HTTP PUT request
   * @param path - The path relative to the endpoint
   * @param body - The request body
   * @param options - Optional HTTP options
   * @returns Observable of the response
   */
  protected put<T>(path: string, body: any, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(path);
    const timeoutMs = options?.timeout ?? environment.apiTimeout;
    
    return this.http.put<T>(url, body, {
      headers: options?.headers,
      params: options?.params
    }).pipe(
      timeout(timeoutMs)
    );
  }
  
  /**
   * Performs HTTP DELETE request
   * @param path - The path relative to the endpoint
   * @param options - Optional HTTP options
   * @returns Observable of the response
   */
  protected delete<T>(path: string, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(path);
    const timeoutMs = options?.timeout ?? environment.apiTimeout;
    
    return this.http.delete<T>(url, {
      headers: options?.headers,
      params: options?.params
    }).pipe(
      timeout(timeoutMs)
    );
  }
}
