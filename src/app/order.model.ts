// src/app/order.model.ts
//
// Shared Order model for the Angular frontend.
// This should reflect (at least) the fields returned by the backend
// Order / OrderDto. Extra optional fields are safe: if the backend
// doesn’t send them, they’ll just be `undefined` in the UI.

/**
 * Allowed order statuses.
 * Adjust this union type if your backend uses slightly different values.
 */
export type OrderStatus =
  | 'NEW'
  | 'OPEN'
  | 'PAID'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DONE'
  | 'UNKNOWN';

/**
 * Order entity as used in the frontend.
 */
export interface Order {
  id: number;

  // Business code for the order, e.g. "ORD-2025-001"
  code: string;

  // Technical status of the order
  status?: OrderStatus;

  // Name of the customer (used in the orders-list.component.html template)
  customerName?: string;

  // Total amount of the order (number so we can use Angular number pipe)
  total?: number;

  // Optional audit fields (if your backend provides them)
  createdAt?: string;
  updatedAt?: string;
}