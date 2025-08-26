import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinelabsPgComponent } from './pinelabs-pg.component';

describe('PinelabsPgComponent', () => {
  let component: PinelabsPgComponent;
  let fixture: ComponentFixture<PinelabsPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PinelabsPgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PinelabsPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
