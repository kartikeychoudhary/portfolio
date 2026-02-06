import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ScrollToTopComponent } from './scroll-to-top.component';
import { vi } from 'vitest';
import { CommonModule } from '@angular/common';

describe('ScrollToTopComponent', () => {
  let component: ScrollToTopComponent;
  let fixture: ComponentFixture<ScrollToTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ScrollToTopComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollToTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible initially', () => {
    expect(component.isVisible).toBe(false);
  });

  it('should call window.scrollTo when scrollToTop is called', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    component.scrollToTop();
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollToSpy.mockRestore();
  });
});
