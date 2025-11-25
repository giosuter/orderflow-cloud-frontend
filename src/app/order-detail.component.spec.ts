import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { OrderDetailComponent } from './order-detail.component';
import { OrderService } from './order.service';
import { Router } from '@angular/router';

describe('OrderDetailComponent', () => {
  let fixture: ComponentFixture<OrderDetailComponent>;
  let component: OrderDetailComponent;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['getById']);

    await TestBed.configureTestingModule({
      imports: [OrderDetailComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
        { provide: Router, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
  });

  it('should load order on init', () => {
    orderServiceSpy.getById.and.returnValue(
      of({
        id: 1,
        code: 'ORD-1',
        status: 'NEW',
        customerName: 'Alice',
        total: 10,
        createdAt: '',
        updatedAt: '',
      }),
    );

    fixture.detectChanges();

    expect(orderServiceSpy.getById).toHaveBeenCalledWith(1);
    expect(component.order?.code).toBe('ORD-1');
  });

  it('should show error when service fails', () => {
    orderServiceSpy.getById.and.returnValue(
      throwError(() => new Error('Boom')),
    );

    fixture.detectChanges();

    expect(component.error).toBeTruthy();
  });
});