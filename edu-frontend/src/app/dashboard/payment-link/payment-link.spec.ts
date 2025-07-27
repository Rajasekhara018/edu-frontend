import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentLink } from './payment-link';

describe('PaymentLink', () => {
  let component: PaymentLink;
  let fixture: ComponentFixture<PaymentLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
