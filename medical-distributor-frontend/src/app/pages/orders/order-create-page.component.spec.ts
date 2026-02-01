import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { OrderCreatePageComponent } from './order-create-page.component';
import { OrderService } from '../../core/services/order.service';

class OrderServiceStub {
  create() {
    return of({ id: '1' });
  }
}

describe('OrderCreatePageComponent', () => {
  let component: OrderCreatePageComponent;
  let fixture: ComponentFixture<OrderCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderCreatePageComponent],
      imports: [ReactiveFormsModule, SharedModule],
      providers: [{ provide: OrderService, useClass: OrderServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates and has a default line', () => {
    expect(component).toBeTruthy();
    expect(component.lines.length).toBeGreaterThan(0);
  });
});
