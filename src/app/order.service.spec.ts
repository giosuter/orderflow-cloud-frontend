import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.model';
import { environment } from '../environments/environment';

/**
 * Pure unit tests for OrderService.
 *
 * We verify that:
 *  - the service is created
 *  - each method calls the correct URL and HTTP verb
 *  - request bodies and responses are handled as expected
 *
 * We DO NOT talk to a real backend here; HttpTestingController
 * intercepts the calls so tests are fast and deterministic.
 */
describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  /**
   * Build the expected base URL exactly as the service does.
   * This makes tests robust against small refactorings of the service.
   */
  const baseUrl = `${environment.apiBaseUrl}/orders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure that there are no outstanding HTTP requests after each test.
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should issue GET to /orders and return an array of orders', () => {
    const mockOrders: Order[] = [
      { id: 1, code: 'A1', status: OrderStatus.NEW, total: 10.5 },
      { id: 2, code: 'B2', status: OrderStatus.PAID, total: 20.0 },
    ];

    service.getAll().subscribe((orders) => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('getById() should issue GET to /orders/{id}', () => {
    const mockOrder: Order = {
      id: 42,
      code: 'ORD-42',
      status: OrderStatus.NEW,
      total: 99.99,
    };

    service.getById(42).subscribe((order) => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(`${baseUrl}/42`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('create() should issue POST to /orders with the order payload', () => {
    const requestBody = {
      code: 'ORD-NEW',
      status: OrderStatus.NEW,
      total: 50,
    };

    const responseBody: Order = {
      id: 10,
      ...requestBody,
    };

    service.create(requestBody).subscribe((order) => {
      expect(order.id).toBe(10);
      expect(order.code).toBe('ORD-NEW');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestBody);
    req.flush(responseBody);
  });

  it('update() should issue PUT to /orders/{id}', () => {
    const requestBody = {
      code: 'ORD-UPD',
      status: OrderStatus.PAID,
      total: 123.45,
    };

    const responseBody: Order = {
      id: 5,
      ...requestBody,
    };

    service.update(5, requestBody).subscribe((order) => {
      expect(order.id).toBe(5);
      expect(order.code).toBe('ORD-UPD');
      expect(order.status).toBe(OrderStatus.PAID);
    });

    const req = httpMock.expectOne(`${baseUrl}/5`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(requestBody);
    req.flush(responseBody);
  });

  it('delete() should issue DELETE to /orders/{id}', () => {
    service.delete(7).subscribe({
      next: (result) => {
        // HttpClient emits `null` for an empty (204) response body,
        // so we assert null here instead of undefined.
        expect(result).toBeNull();
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/7`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // no body for 204 No Content
  });

  it('search() should issue GET /orders/search with code and status params when provided', () => {
    const mockOrders: Order[] = [
      { id: 1, code: 'ORD-ABC', status: OrderStatus.NEW, total: 10 },
    ];

    service.search('ORD', OrderStatus.NEW).subscribe((orders) => {
      expect(orders.length).toBe(1);
      expect(orders[0].code).toBe('ORD-ABC');
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${baseUrl}/search` &&
        request.params.get('code') === 'ORD' &&
        request.params.get('status') === 'NEW',
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });
});