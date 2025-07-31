import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionStatus } from './transaction-status';

describe('TransactionStatus', () => {
  let component: TransactionStatus;
  let fixture: ComponentFixture<TransactionStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
