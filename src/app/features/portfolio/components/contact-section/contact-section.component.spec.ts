import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { ContactSectionComponent } from './contact-section.component';
import { PortfolioService } from '../../services/portfolio.service';

describe('ContactSectionComponent', () => {
  let component: ContactSectionComponent;
  let fixture: ComponentFixture<ContactSectionComponent>;
  let portfolioServiceMock: { submitContact: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    portfolioServiceMock = {
      submitContact: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [ContactSectionComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.contactForm.valid).toBeFalsy();
  });

  it('should call submitContact when form is valid and submitted', () => {
    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'Test message'
    });

    component.onSubmit();

    expect(portfolioServiceMock.submitContact).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'Test message'
    });
  });
});
