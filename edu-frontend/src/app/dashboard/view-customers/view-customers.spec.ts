import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomers } from './view-customers';

describe('ViewCustomers', () => {
  let component: ViewCustomers;
  let fixture: ComponentFixture<ViewCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
