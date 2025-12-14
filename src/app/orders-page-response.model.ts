// src/app/orders-page-response.model.ts

import { Order } from './order.model';

/**
 * Frontend representation of the backend OrdersPageResponse DTO.
 *
 * It wraps a page of orders together with pagination metadata.
 *
 * This MUST stay in sync with the Java class:
 *   ch.devprojects.orderflow.dto.OrdersPageResponse
 *
 * If you add fields on the backend, update this interface accordingly.
 */
export interface OrdersPageResponse {
  /**
   * Slice of orders for the current page.
   */
  content: Order[];

  /**
   * 0-based page index returned by the backend.
   */
  page: number;

  /**
   * Page size used for this query.
   */
  size: number;

  /**
   * Total number of matching elements across ALL pages.
   */
  totalElements: number;

  /**
   * Total number of pages available.
   */
  totalPages: number;
}