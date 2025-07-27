import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTransfer } from './bill-transfer';

describe('BillTransfer', () => {
  let component: BillTransfer;
  let fixture: ComponentFixture<BillTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillTransfer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillTransfer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
