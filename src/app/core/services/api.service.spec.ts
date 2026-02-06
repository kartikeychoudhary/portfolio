import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ApiService
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform GET request with correct URL', () => {
    const mockData = { id: '1', name: 'Test' };
    service.get('/profile').subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/profile');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should perform POST request with correct URL and body', () => {
    const body = { name: 'Test' };
    const mockResponse = { id: '1', name: 'Test' };
    service.post('/contacts', body).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/contacts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('should perform PUT request with correct URL and body', () => {
    const body = { id: '1', name: 'Updated' };
    service.put('/profile', body).subscribe(data => {
      expect(data).toEqual(body);
    });

    const req = httpMock.expectOne('/api/profile');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(body);
  });

  it('should perform PATCH request with correct URL and body', () => {
    const body = { isRead: true };
    service.patch('/contacts/1', body).subscribe(data => {
      expect(data).toEqual(body);
    });

    const req = httpMock.expectOne('/api/contacts/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);
    req.flush(body);
  });

  it('should perform DELETE request with correct URL', () => {
    service.delete('/contacts/1').subscribe(data => {
      expect(data).toBeNull();
    });

    const req = httpMock.expectOne('/api/contacts/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
