import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcPayments } from './cc-payments';

describe('CcPayments', () => {
  let component: CcPayments;
  let fixture: ComponentFixture<CcPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CcPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
