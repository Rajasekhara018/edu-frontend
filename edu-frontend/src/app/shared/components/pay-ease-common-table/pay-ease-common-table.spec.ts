import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayEaseCommonTable } from './pay-ease-common-table';

describe('PayEaseCommonTable', () => {
  let component: PayEaseCommonTable;
  let fixture: ComponentFixture<PayEaseCommonTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayEaseCommonTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayEaseCommonTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
