import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseCompliant } from './raise-compliant';

describe('RaiseCompliant', () => {
  let component: RaiseCompliant;
  let fixture: ComponentFixture<RaiseCompliant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaiseCompliant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaiseCompliant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
