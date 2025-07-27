import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeaseIdleTimeoutDailog } from './payease-idle-timeout-dailog';

describe('PayeaseIdleTimeoutDailog', () => {
  let component: PayeaseIdleTimeoutDailog;
  let fixture: ComponentFixture<PayeaseIdleTimeoutDailog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayeaseIdleTimeoutDailog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayeaseIdleTimeoutDailog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
