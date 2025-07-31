import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintStatus } from './complaint-status';

describe('ComplaintStatus', () => {
  let component: ComplaintStatus;
  let fixture: ComponentFixture<ComplaintStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplaintStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
