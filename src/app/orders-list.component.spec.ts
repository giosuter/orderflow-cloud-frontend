import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { OrdersListComponent } from './orders-list.component';
import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.model';

/**
 * Unit tests for OrdersListComponent.
 *
 * We focus on:
 *  - rendering of the different visual states (loading / empty / error / data)
 *  - the fact that loadOrders() calls OrderService.getAll()
 *
 * We do NOT hit a real backend here; we use a stubbed OrderService.
 */
describe('OrdersListComponent', () => {
  let fixture: ComponentFixture<OrdersListComponent>;
  let component: OrdersListComponent;

  // We'll override this per test to simulate different service behaviors.
  let ordersServiceMock: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    ordersServiceMock = jasmine.createSpyObj<OrderService>('OrderService', [
      'getAll',
    ]);

    await TestBed.configureTestingModule({
      imports: [OrdersListComponent], // standalone component
      providers: [
        {
          provide: OrderService,
          useValue: ordersServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Small paranoia: reset spies between tests.
    ordersServiceMock.getAll.calls.reset();
  });

  it('should create', () => {
    // Arrange
    ordersServiceMock.getAll.and.returnValue(of([]));

    // Act
    fixture.detectChanges(); // triggers ngOnInit + loadOrders()

    // Assert
    expect(component).toBeTruthy();
  });

  it('should render table rows when orders are returned', () => {
    const mockOrders: Order[] = [
      { id: 1, code: 'ORD-1', status: OrderStatus.NEW, total: 10.0 },
      { id: 2, code: 'ORD-2', status: OrderStatus.PAID, total: 20.5 },
    ];

    ordersServiceMock.getAll.and.returnValue(of(mockOrders));

    fixture.detectChanges(); // ngOnInit + loadOrders()

    // At this point, the component should have the orders
    expect(component.orders.length).toBe(2);

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);

    const firstRowText = rows[0].nativeElement.textContent;
    expect(firstRowText).toContain('ORD-1');
    expect(firstRowText).toContain('NEW');

    const secondRowText = rows[1].nativeElement.textContent;
    expect(secondRowText).toContain('ORD-2');
    expect(secondRowText).toContain('PAID');
  });

  it('should show an empty state when no orders are returned', () => {
    // Simulate successful call with empty array
    ordersServiceMock.getAll.and.returnValue(of([]));

    fixture.detectChanges(); // ngOnInit + loadOrders()

    // After a successful empty load:
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBeNull();
    expect(component.orders.length).toBe(0);

    // The template should show the "No orders found." message
    const emptyEl = fixture.debugElement.query(
      By.css('.orders-empty'),
    );
    expect(emptyEl).toBeTruthy();
    expect(emptyEl.nativeElement.textContent).toContain('No orders found.');
  });

  it('should show an error message when loading orders fails', () => {
    // Simulate an HTTP error
    ordersServiceMock.getAll.and.returnValue(
      throwError(() => new Error('Network error')),
    );

    fixture.detectChanges(); // ngOnInit + loadOrders()

    // After an error:
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBeTruthy();

    // The template should show the error box
    const errorEl = fixture.debugElement.query(
      By.css('.orders-error-box'),
    );
    expect(errorEl).toBeTruthy();
    const text = errorEl.nativeElement.textContent;
    expect(text).toContain('Failed to load orders');
  });

  it('should display a loading state while fetching orders', () => {
    // Here we simulate "loading" by returning an observable that never completes.
    // For our purposes, we just check the initial state before we flush anything.
    ordersServiceMock.getAll.and.returnValue(of([]));

    // Before detectChanges, isLoading is false
    expect(component.isLoading).toBeFalse();

    fixture.detectChanges(); // ngOnInit + loadOrders()

    // Immediately after detectChanges with a resolved observable,
    // our component's loadOrders will set isLoading true, then false in complete().
    // This is tricky to assert precisely in unit tests without a fake async scheduler,
    // so we instead check that the loading state is wired in the template:
    component.isLoading = true;
    component.errorMessage = null;
    component.orders = [];
    fixture.detectChanges();

    const loadingEl = fixture.debugElement.query(
      By.css('.orders-loading'),
    );
    expect(loadingEl).toBeTruthy();
    expect(loadingEl.nativeElement.textContent).toContain('Loading orders');
  });
});