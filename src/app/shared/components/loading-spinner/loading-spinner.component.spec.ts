import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const p = compiled.querySelector('p');
    expect(p?.textContent).toContain('Loading...');
  });

  it('should display custom message', () => {
    fixture.componentRef.setInput('message', 'Please wait...');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const p = compiled.querySelector('p');
    expect(p?.textContent).toContain('Please wait...');
  });
});
