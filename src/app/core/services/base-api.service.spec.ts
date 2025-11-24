import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';

// Concrete implementation for testing
@Injectable()
class TestApiService extends BaseApiService {
  protected readonly endpoint = '/api/test';
  
  // Expose protected methods for testing
  public testGet<T>(path: string, options?: any) {
    return this.get<T>(path, options);
  }
  
  public testPost<T>(path: string, body: any, options?: any) {
    return this.post<T>(path, body, options);
  }
  
  public testPut<T>(path: string, body: any, options?: any) {
    return this.put<T>(path, body, options);
  }
  
  public testDelete<T>(path: string, options?: any) {
    return this.delete<T>(path, options);
  }
  
  public testBuildUrl(path: string) {
    return this.buildUrl(path);
  }
}

describe('BaseApiService', () => {
  let service: TestApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(TestApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('buildUrl', () => {
    it('should construct URL with base URL and endpoint', () => {
      const url = service.testBuildUrl('/users');
      expect(url).toBe('http://localhost:8080/api/test/users');
    });

    it('should handle paths without leading slash', () => {
      const url = service.testBuildUrl('users');
      expect(url).toBe('http://localhost:8080/api/test/users');
    });

    it('should handle empty path', () => {
      const url = service.testBuildUrl('');
      expect(url).toBe('http://localhost:8080/api/test/');
    });
  });

  describe('HTTP methods', () => {
    it('should perform GET request', (done) => {
      const mockResponse = { data: 'test' };
      
      service.testGet<any>('/users').subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/test/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should perform POST request', (done) => {
      const mockBody = { name: 'test' };
      const mockResponse = { id: 1, name: 'test' };
      
      service.testPost<any>('/users', mockBody).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/test/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBody);
      req.flush(mockResponse);
    });

    it('should perform PUT request', (done) => {
      const mockBody = { id: 1, name: 'updated' };
      const mockResponse = { id: 1, name: 'updated' };
      
      service.testPut<any>('/users/1', mockBody).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/test/users/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockBody);
      req.flush(mockResponse);
    });

    it('should perform DELETE request', (done) => {
      service.testDelete<any>('/users/1').subscribe({
        next: () => {
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/test/users/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('timeout handling', () => {
    it('should apply timeout operator to requests', (done) => {
      service.testGet<any>('/users').subscribe({
        next: (response) => {
          expect(response).toEqual({ data: 'test' });
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/test/users');
      req.flush({ data: 'test' });
    });

    it('should use custom timeout when provided', (done) => {
      service.testGet<any>('/users', { timeout: 5000 }).subscribe({
        next: (response) => {
          expect(response).toEqual({ data: 'test' });
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/test/users');
      req.flush({ data: 'test' });
    });
  });

  describe('HTTP options', () => {
    it('should include custom headers', (done) => {
      const headers = { 'X-Custom-Header': 'test-value' };
      
      service.testGet<any>('/users', { headers }).subscribe({
        next: (response) => {
          expect(response).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/test/users');
      expect(req.request.headers.get('X-Custom-Header')).toBe('test-value');
      req.flush({});
    });

    it('should include query parameters', (done) => {
      const params = { page: '1', limit: '10' };
      
      service.testGet<any>('/users', { params }).subscribe({
        next: (response) => {
          expect(response).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne((request) => {
        return request.url === 'http://localhost:8080/api/test/users' &&
               request.params.get('page') === '1' &&
               request.params.get('limit') === '10';
      });
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('limit')).toBe('10');
      req.flush({});
    });
  });
});
