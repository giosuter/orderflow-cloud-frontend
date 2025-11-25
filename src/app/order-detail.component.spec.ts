import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { OrderDetailComponent } from './order-detail.component';
import { OrderService } from './order.service';
import { Order } from './order.model';

describe('OrderDetailComponent', () => {
  let fixture: ComponentFixture<OrderDetailComponent>;
  let component: OrderDetailComponent;

  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    // Spy for OrderService
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['getById']);

    // Simple stub for ActivatedRoute with a fixed :id = "1"
    activatedRouteStub = {
      paramMap: of(convertToParamMap({ id: '1' })),
    };

    await TestBed.configureTestingModule({
      // Standalone component goes into imports
      imports: [OrderDetailComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Arrange
    const mockOrder: Order = {
      id: 1,
      code: 'ORD-1',
      status: 'NEW',
      customerName: 'Alice',
      total: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orderServiceSpy.getById.and.returnValue(of(mockOrder));

    // Act: triggers ngOnInit (which subscribes to paramMap and loads order)
    fixture.detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should load order on init when id is valid', () => {
    const mockOrder: Order = {
      id: 1,
      code: 'ORD-1',
      status: 'NEW',
      customerName: 'Alice',
      total: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orderServiceSpy.getById.and.returnValue(of(mockOrder));

    // ngOnInit + subscribe to paramMap + call getById
    fixture.detectChanges();

    expect(orderServiceSpy.getById).toHaveBeenCalledWith(1);
    expect(component.order).toEqual(mockOrder);
    expect(component.error).toBeNull();
    expect(component.loading).toBeFalse();
  });

  it('should set error when backend call fails', () => {
    orderServiceSpy.getById.and.returnValue(
      throwError(() => new Error('Boom')),
    );

    fixture.detectChanges();

    expect(orderServiceSpy.getById).toHaveBeenCalledWith(1);
    expect(component.order).toBeNull();
    expect(component.error).toBeTruthy();
    expect(component.loading).toBeFalse();
  });
});