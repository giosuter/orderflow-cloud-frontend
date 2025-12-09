// Central service for talking to the OrderFlow backend.
//
// Responsibilities:
//  - Provide methods for CRUD operations on orders
//  - Hide the exact HTTP URLs from components
//  - Return strongly-typed Observables so components stay clean

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  /**
   * Base URL for all order-related HTTP calls.
   *
   * environment.apiBaseUrl is expected to be something like:
   *  - http://localhost:8080/orderflow-api/api    (dev)
   *  - https://devprojects.ch/orderflow-api/api   (prod)
   *
   * We then append "/orders" for the resource path.
   */
  private readonly baseUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Load all orders from the backend.
   * GET /api/orders
   */
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  /**
   * Load a single order by its ID.
   * GET /api/orders/{id}
   */
  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new order.
   *
   * The payload is a Partial<Order> without the technical fields (id, timestamps).
   * POST /api/orders
   */
  create(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  /**
   * Update an existing order.
   *
   * We pass the ID separately (from the route) and a Partial<Order> payload
   * with only the fields that are editable in the UI.
   * PUT /api/orders/{id}
   */
  update(id: number, order: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, order);
  }

  /**
   * Delete an order by ID.
   *
   * DELETE /api/orders/{id}
   *
   * We return Observable<void> because the backend usually responds
   * with 204 No Content (empty body). If your backend returns the deleted
   * entity, you could change the type accordingly.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}