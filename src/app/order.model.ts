/**
 * Frontend Order model.
 *
 * IMPORTANT:
 * - Must match backend JSON fields.
 * - Backend uses "description" (not "comment") since your Flyway rename.
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
   * Optional free-text description.
   * Backend field name: description
   */
  description?: string;

  createdAt?: string;
  updatedAt?: string;
}