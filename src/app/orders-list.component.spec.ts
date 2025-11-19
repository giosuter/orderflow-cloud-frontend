import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { OrdersListComponent } from './orders-list.component';
import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.model';

/**
 * Unit tests for OrdersListComponent.
 *
 * We use a Jasmine spy for OrderService so:
 *  - no real HTTP calls are made
 *  - we can fully control success / error scenarios
 */
describe('OrdersListComponent', () => {
  let component: OrdersListComponent;
  let fixture: ComponentFixture<OrdersListComponent>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    // Create a spy object with the methods used by the component
    orderServiceSpy = jasmine.createSpyObj<OrderService>('OrderService', [
      'getAll',
    ]);

    await TestBed.configureTestingModule({
      imports: [OrdersListComponent],
      providers: [{ provide: OrderService, useValue: orderServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    orderServiceSpy.getAll.and.returnValue(of([])); // default stub
    fixture.detectChanges(); // triggers ngOnInit + loadOrders()
    expect(component).toBeTruthy();
  });

  it('should load orders on init and render them in the table', () => {
    const mockOrders: Order[] = [
      { id: 1, code: 'A1', status: OrderStatus.NEW, total: 19.95 },
      { id: 2, code: 'A2', status: OrderStatus.PAID, total: 3.95 },
    ];

    orderServiceSpy.getAll.and.returnValue(of(mockOrders));

    // When we detect changes, ngOnInit() is called and loadOrders() runs.
    fixture.detectChanges();

    expect(orderServiceSpy.getAll).toHaveBeenCalled();

    // After the observable emits, the component should hold the orders.
    expect(component.orders.length).toBe(2);

    const compiled: HTMLElement = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tbody tr');

    // There should be 2 rows in the table.
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('A1');
    expect(rows[1].textContent).toContain('A2');
  });

  it('should show an error message when loading orders fails', () => {
    orderServiceSpy.getAll.and.returnValue(
      throwError(() => new Error('Backend error')),
    );

    fixture.detectChanges();

    expect(orderServiceSpy.getAll).toHaveBeenCalled();
    expect(component.errorMessage).toBeTruthy();

    const compiled: HTMLElement = fixture.nativeElement;
    const errorDiv = compiled.querySelector('.state-error');

    expect(errorDiv).withContext('Error div should be present').not.toBeNull();
    expect(errorDiv?.textContent).toContain('Failed to load orders');
  });
});