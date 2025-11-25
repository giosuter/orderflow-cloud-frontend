import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { OrdersDetailComponent } from './orders-detail.component';
import { OrderService } from './order.service';
import { Order } from './order.model';

/**
 * Simple unit tests for OrdersDetailComponent:
 *  - loads an order by id from route param
 *  - sets loading / error / order fields correctly
 */

class MockOrderService {
  getById = jasmine.createSpy('getById');
}

describe('OrdersDetailComponent', () => {
  let component: OrdersDetailComponent;
  let fixture: ComponentFixture<OrdersDetailComponent>;
  let mockService: MockOrderService;

  beforeEach(async () => {
    mockService = new MockOrderService();

    await TestBed.configureTestingModule({
      imports: [OrdersDetailComponent],
      providers: [
        {
          provide: OrderService,
          useValue: mockService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load order on init when id is valid', () => {
    const mockOrder: Order = {
      id: 1,
      code: 'ORD-1',
      status: 'NEW',
      customerName: 'Alice',
      total: 99.5,
      createdAt: undefined,
      updatedAt: undefined,
    };

    mockService.getById.and.returnValue(of(mockOrder));

    component.ngOnInit();

    expect(mockService.getById).toHaveBeenCalledWith(1);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
    expect(component.order).toEqual(mockOrder);
  });

  it('should set error when backend call fails', () => {
    mockService.getById.and.returnValue(throwError(() => new Error('Boom')));

    component.ngOnInit();

    expect(mockService.getById).toHaveBeenCalledWith(1);
    expect(component.loading).toBeFalse();
    expect(component.order).toBeNull();
    expect(component.error).toBe('Failed to load order.');
  });
});