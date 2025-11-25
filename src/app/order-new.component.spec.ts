import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { OrderNewComponent } from './order-new.component';
import { OrderService } from './order.service';
import { OrderStatus } from './order.model';

describe('OrderNewComponent', () => {
  let fixture: ComponentFixture<OrderNewComponent>;
  let component: OrderNewComponent;

  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [OrderNewComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderNewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if required fields are missing', () => {
    component.draft.code = '';
    component.draft.customerName = '';

    component.onSubmit();

    expect(orderServiceSpy.create).not.toHaveBeenCalled();
    expect(component.error).toBeTruthy();
  });

  it('should call service.create and navigate on success', () => {
    // Arrange: fill the form model
    component.draft.code = 'ORD-NEW';
    component.draft.status = 'NEW' as OrderStatus;
    component.draft.customerName = 'Alice';
    component.draft.total = 50;

    const expectedPayload = {
      code: 'ORD-NEW',
      status: 'NEW' as OrderStatus,
      customerName: 'Alice',
      total: 50,
    };

    orderServiceSpy.create.and.returnValue(
      of({
        id: 1,
        ...expectedPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );

    // Act
    component.onSubmit();

    // Assert
    expect(orderServiceSpy.create).toHaveBeenCalledWith(expectedPayload);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/orders']);
  });

  it('should set error when service.create fails', () => {
    component.draft.code = 'ORD-FAIL';
    component.draft.customerName = 'Bob';
    component.draft.status = '' as '' | OrderStatus;
    component.draft.total = 10;

    orderServiceSpy.create.and.returnValue(
      throwError(() => new Error('Boom')),
    );

    component.onSubmit();

    expect(orderServiceSpy.create).toHaveBeenCalled();
    expect(component.error).toBeTruthy();
    expect(component.saving).toBeFalse();
  });
});