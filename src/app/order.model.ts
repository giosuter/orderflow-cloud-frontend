/**
 * Frontend Order model.
 *
 * IMPORTANT:
 * - Must match backend DTO fields.
 * - Backend currently uses "comment" as the description-like text.
 */

export type OrderStatus =
  | 'NEW'
  | 'PROCESSING'
  | 'PAID'
  | 'SHIPPED'
  | 'CANCELLED';

export interface Order {
  id: number;
  code: string;
  status: OrderStatus;
  customerName?: string;
  total: number;

  /**
   * Optional free-text comment/description.
   * Persisted by backend as Order.comment.
   */
  comment?: string;

  createdAt?: string;
  updatedAt?: string;
}