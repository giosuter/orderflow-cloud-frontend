// Unit tests for OrdersListComponent.
// We do NOT hit a real backend; we mock OrderService instead.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { OrdersListComponent } from './orders-list.component';
import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

describe('OrdersListComponent', () => {
  let component: OrdersListComponent;
  let fixture: ComponentFixture<OrdersListComponent>;

  // Simple Jasmine spy mock for OrderService
  let orderServiceSpy: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj<OrderService>('OrderService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [OrdersListComponent], // standalone component
      providers: [{ provide: OrderService, useValue: spy }],
    }).compileComponents();

    orderServiceSpy = TestBed.inject(
      OrderService,
    ) as jasmine.SpyObj<OrderService>;

    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    orderServiceSpy.getAll.and.returnValue(of([]));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component).toBeTruthy();
  });

  it('should load and display orders on init', () => {
    const mockOrders: Order[] = [
      { id: 1, code: 'A1', status: OrderStatus.NEW, total: 10 },
      { id: 2, code: 'B2', status: OrderStatus.PAID, total: 20 },
    ];

    orderServiceSpy.getAll.and.returnValue(of(mockOrders));

    fixture.detectChanges(); // runs ngOnInit -> loadOrders()

    // The component state should be updated
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
    expect(component.orders.length).toBe(2);

    // Verify DOM rendering
    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('A1');
    expect(rows[1].textContent).toContain('B2');
  });

  it('should show an error message when service fails', () => {
    orderServiceSpy.getAll.and.returnValue(
      throwError(() => new Error('Backend down')),
    );

    fixture.detectChanges(); // runs ngOnInit -> loadOrders()

    expect(component.loading).toBeFalse();
    expect(component.error).toBeTruthy();
    expect(component.orders.length).toBe(0);

    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    const errorEl = compiled.querySelector('.orders-list__state--error');
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toContain('Failed to load orders');
  });
});