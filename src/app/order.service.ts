import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Order, OrderStatus } from './order.model';
import { OrdersPageResponse } from './orders-page-response.model';

export interface CreateOrderPayload {
  code: string;
  status?: OrderStatus;
  customerName: string;
  total: number;

  // Persisted text field
  comment?: string;
}

export interface UpdateOrderPayload {
  code: string;
  status?: OrderStatus;
  customerName: string;
  total: number;

  // Persisted text field
  comment?: string;
}

export interface OrderSearchParams {
  code?: string;
  status?: OrderStatus;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }

  search(params: OrderSearchParams): Observable<Order[]> {
    let httpParams = new HttpParams();

    if (params.code && params.code.trim() !== '') {
      httpParams = httpParams.set('code', params.code.trim());
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<Order[]>(`${this.baseUrl}/orders/search`, {
      params: httpParams,
    });
  }

  searchPaged(
    term: string | null,
    status: OrderStatus | null,
    page: number,
    size: number,
  ): Observable<OrdersPageResponse> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    if (term && term.trim() !== '') {
      params = params.set('customer', term.trim());
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<OrdersPageResponse>(`${this.baseUrl}/orders/search`, {
      params,
    });
  }

  findById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${id}`);
  }

  create(payload: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, payload);
  }

  update(id: number, payload: UpdateOrderPayload): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/orders/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orders/${id}`);
  }
}