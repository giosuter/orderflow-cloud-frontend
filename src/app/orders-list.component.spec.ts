// src/app/order-list.component.spec.ts
//
// Unit tests for OrderListComponent.
//
// IMPORTANT:
//  - We mock OrderService so that no real HTTP calls are made during tests.
//  - This prevents "Failed to load orders / Network error" messages in Karma.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { OrdersListComponent } from './orders-list.component';
import { OrderService } from './order.service';
import { Order } from './order.model';
import { RouterTestingModule } from '@angular/router/testing';

// Simple fake OrderService used only in tests.
// It returns a small, static list of orders instead of calling the backend.
class FakeOrderService {
  getAll() {
    // We don't need real data here; an empty list is enough to avoid HTTP calls.
    const mockOrders: Order[] = [] as Order[];
    return of(mockOrders);
  }
}

describe('OrderListComponent', () => {
  let component: OrdersListComponent;
  let fixture: ComponentFixture<OrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Since OrderListComponent is a standalone component, we put it in imports.
      imports: [
        OrdersListComponent,
        RouterTestingModule, // in case the template uses routerLink etc.
      ],
      providers: [
        // Override the real OrderService with our fake one
        { provide: OrderService, useClass: FakeOrderService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;

    // Triggers ngOnInit(), which now uses FakeOrderService.getAll()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});