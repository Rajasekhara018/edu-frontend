import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLoginChangePassword } from './first-login-change-password';

describe('FirstLoginChangePassword', () => {
  let component: FirstLoginChangePassword;
  let fixture: ComponentFixture<FirstLoginChangePassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstLoginChangePassword]
    }).compileComponents();

    fixture = TestBed.createComponent(FirstLoginChangePassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
