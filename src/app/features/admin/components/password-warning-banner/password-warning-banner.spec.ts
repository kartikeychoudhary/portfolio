import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordWarningBanner } from './password-warning-banner';

describe('PasswordWarningBanner', () => {
  let component: PasswordWarningBanner;
  let fixture: ComponentFixture<PasswordWarningBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordWarningBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordWarningBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
