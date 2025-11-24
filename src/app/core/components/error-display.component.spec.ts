import { TestBed } from '@angular/core/testing';
import { ErrorDisplayComponent } from './error-display.component';
import { ErrorService } from '../services/error.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

describe('ErrorDisplayComponent', () => {
  let component: ErrorDisplayComponent;
  let errorService: ErrorService;
  let errorSubject: Subject<any>;

  beforeEach(() => {
    // Create a mock error subject
    errorSubject = new Subject();

    // Create a mock error service
    const mockErrorService = {
      error$: errorSubject.asObservable()
    };

    TestBed.configureTestingModule({
      imports: [ErrorDisplayComponent],
      providers: [
        { provide: ErrorService, useValue: mockErrorService }
      ]
    });

    errorService = TestBed.inject(ErrorService);
    const fixture = TestBed.createComponent(ErrorDisplayComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to error service on init', () => {
    spyOn(errorService.error$, 'subscribe').and.callThrough();
    component.ngOnInit();
    expect(errorService.error$.subscribe).toHaveBeenCalled();
  });

  it('should display error with SweetAlert2 when error is emitted', (done) => {
    const mockError = {
      message: 'Test error message',
      statusCode: 404,
      details: 'Resource not found'
    };

    // Spy on Swal.fire
    spyOn(Swal, 'fire');

    component.ngOnInit();

    // Emit an error
    errorSubject.next(mockError);

    // Wait for async operations
    setTimeout(() => {
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'error',
        title: 'Error 404',
        text: 'Test error message',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      }));
      done();
    }, 100);
  });

  it('should display error without status code when not provided', (done) => {
    const mockError = {
      message: 'Test error message'
    };

    spyOn(Swal, 'fire');

    component.ngOnInit();
    errorSubject.next(mockError);

    setTimeout(() => {
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'error',
        title: 'Error',
        text: 'Test error message'
      }));
      done();
    }, 100);
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnInit();
    const subscription = (component as any).errorSubscription;
    spyOn(subscription, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});
