import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { OrdersListComponent } from './orders-list.component';
import { Order, OrderStatus } from './order.model';
import { OrderService } from './order.service';

/**
 * Shallow unit tests for OrdersListComponent.
 *
 * We do NOT hit a real backend here. Instead, we:
 *  - provide a spy OrderService
 *  - control its getAll() observable
 *  - assert that the component renders the correct DOM output
 *    for success, error, and empty states.
 */
describe('OrdersListComponent', () => {
  let fixture: ComponentFixture<OrdersListComponent>;
  let component: OrdersListComponent;

  let orderServiceSpy: jasmine.SpyObj<OrderService>;

  const mockOrders: Order[] = [
    { id: 1, code: 'A1', status: OrderStatus.NEW, total: 19.95 },
    { id: 2, code: 'A2', status: OrderStatus.PAID, total: 3.95 },
  ];

  beforeEach(async () => {
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
    orderServiceSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load orders on init and render them in the table', () => {
    orderServiceSpy.getAll.and.returnValue(of(mockOrders));

    fixture.detectChanges(); // triggers ngOnInit + loadOrders()

    const rows = fixture.debugElement.queryAll(
      By.css('table.orders-table tbody tr'),
    );
    expect(rows.length).toBe(2);

    const firstRowText = rows[0].nativeElement.textContent as string;
    expect(firstRowText).toContain('A1');
    expect(firstRowText).toContain('NEW');

    const secondRowText = rows[1].nativeElement.textContent as string;
    expect(secondRowText).toContain('A2');
    expect(secondRowText).toContain('PAID');
  });

  it('should show an empty state when no orders are returned', () => {
    orderServiceSpy.getAll.and.returnValue(of([]));

    fixture.detectChanges();

    const emptyEl = fixture.debugElement.query(
      By.css('.orders-state--empty'),
    );
    expect(emptyEl).toBeTruthy();
    expect(
      (emptyEl.nativeElement.textContent as string).toLowerCase(),
    ).toContain('no orders');
  });

  it('should show an error message when loading orders fails', () => {
    orderServiceSpy.getAll.and.returnValue(
      throwError(() => new Error('Network error')),
    );

    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(
      By.css('.orders-state--error'),
    );
    expect(errorEl).toBeTruthy();
    const text = errorEl.nativeElement.textContent as string;
    expect(text.toLowerCase()).toContain('failed to load orders');
  });
});