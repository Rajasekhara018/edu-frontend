import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JioPgComponent } from './jio-pg.component';

describe('JioPgComponent', () => {
  let component: JioPgComponent;
  let fixture: ComponentFixture<JioPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JioPgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JioPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
