import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazorpayPgComponent } from './razorpay-pg.component';

describe('RazorpayPgComponent', () => {
  let component: RazorpayPgComponent;
  let fixture: ComponentFixture<RazorpayPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RazorpayPgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RazorpayPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
