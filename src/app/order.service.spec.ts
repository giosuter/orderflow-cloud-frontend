// src/app/order.service.spec.ts
//
// Unit tests for OrderService using HttpClientTestingModule.
//
// These tests verify:
//  - correct HTTP method + URL for each service call
//  - correct handling of request/response bodies
//
// Statuses are used as string literals (e.g. 'NEW', 'PAID') to match
// the OrderStatus union type defined in order.model.ts.

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.model';
import { environment } from '../environments/environment';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiBaseUrl}/orders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should call GET /orders and return a list of orders', () => {
    const mockOrders: Order[] = [
      { id: 1, code: 'A1', status: 'NEW', total: 10.5 },
      { id: 2, code: 'B2', status: 'PAID', total: 20.0 },
    ];

    let result: Order[] | undefined;

    service.getAll().subscribe((orders) => {
      result = orders;
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockOrders);

    expect(result).toEqual(mockOrders);
  });

  it('getById should call GET /orders/{id} and return a single order', () => {
    const id = 42;
    const mockOrder: Order = {
      id,
      code: 'ORD-42',
      status: 'NEW',
      total: 99.9,
    };

    let result: Order | undefined;

    service.getById(id).subscribe((order) => {
      result = order;
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockOrder);

    expect(result).toEqual(mockOrder);
  });

  it('search should call GET /orders/search with query params', () => {
    const code = 'ORD';
    const status: OrderStatus = 'NEW';

    const mockOrders: Order[] = [
      { id: 1, code: 'ORD-ABC', status: 'NEW', total: 10 },
    ];

    let result: Order[] | undefined;

    service.search(code, status).subscribe((orders) => {
      result = orders;
    });

    const req = httpMock.expectOne((request) => {
      return (
        request.url === `${baseUrl}/search` &&
        request.params.get('code') === code &&
        request.params.get('status') === status
      );
    });

    expect(req.request.method).toBe('GET');

    req.flush(mockOrders);

    expect(result).toEqual(mockOrders);
  });

  it('create should call POST /orders with the new order data', () => {
    const newOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      code: 'NEW-001',
      status: 'NEW',
      customerName: 'Alice',
      total: 50,
    };

    const createdOrder: Order = {
      id: 100,
      ...newOrder,
    };

    let result: Order | undefined;

    service.create(newOrder).subscribe((order) => {
      result = order;
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOrder);

    req.flush(createdOrder);

    expect(result).toEqual(createdOrder);
  });

  it('update should call PUT /orders/{id} with the updated order data', () => {
    const id = 10;
    const updateData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      code: 'UPD-010',
      status: 'PAID',
      customerName: 'Bob',
      total: 75,
    };

    const updatedOrder: Order = {
      id,
      ...updateData,
    };

    let result: Order | undefined;

    service.update(id, updateData).subscribe((order) => {
      result = order;
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);

    req.flush(updatedOrder);

    expect(result).toEqual(updatedOrder);
  });

  it('delete should call DELETE /orders/{id}', () => {
    const id = 5;
    let completed = false;

    service.delete(id).subscribe(() => {
      completed = true;
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null); // or {} / 204 No Content

    expect(completed).toBeTrue();
  });
});