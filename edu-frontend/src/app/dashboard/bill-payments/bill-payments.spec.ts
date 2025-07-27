import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPayments } from './bill-payments';

describe('BillPayments', () => {
  let component: BillPayments;
  let fixture: ComponentFixture<BillPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
