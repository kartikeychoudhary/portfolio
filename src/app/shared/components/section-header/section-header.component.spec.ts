import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionHeaderComponent } from './section-header.component';
import { CommonModule } from '@angular/common';

describe('SectionHeaderComponent', () => {
  let component: SectionHeaderComponent;
  let fixture: ComponentFixture<SectionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [SectionHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const h2 = compiled.querySelector('h2');
    expect(h2?.textContent).toContain('Test Title');
  });

  it('should render subtitle when provided', () => {
    fixture.componentRef.setInput('subtitle', 'Test Subtitle');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const p = compiled.querySelector('p');
    expect(p).toBeTruthy();
    expect(p?.textContent).toContain('Test Subtitle');
  });

  it('should not render subtitle paragraph when not provided', () => {
    fixture.componentRef.setInput('subtitle', '');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const p = compiled.querySelector('p');
    expect(p).toBeNull();
  });
});
