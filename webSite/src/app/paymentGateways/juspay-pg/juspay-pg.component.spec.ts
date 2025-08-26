import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuspayPgComponent } from './juspay-pg.component';

describe('JuspayPgComponent', () => {
  let component: JuspayPgComponent;
  let fixture: ComponentFixture<JuspayPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JuspayPgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JuspayPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
