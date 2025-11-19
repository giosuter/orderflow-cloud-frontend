/**
 * Enum of all known OrderStatus values used by the backend.
 *
 * Keep this in sync with ch.devprojects.orderflow.domain.OrderStatus
 * and the JSON values you see in Swagger (NEW, PAID, SHIPPED, ...).
 */
export enum OrderStatus {
  NEW = 'NEW',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED', // included for completeness
}

/**
 * Frontend representation of an Order.
 *
 * This is aligned with OrderDto on the backend:
 *  - id:        technical identifier
 *  - code:      business identifier (ORD-123, etc.)
 *  - status:    one of the OrderStatus enum values
 *  - total:     total amount (numeric, in CHF or your chosen currency)
 *  - createdAt: ISO timestamp string from the backend
 *  - updatedAt: ISO timestamp string from the backend
 */
export interface Order {
  id?: number;                  // optional for newly-created orders
  code: string;
  status: OrderStatus;
  total: number;

  createdAt?: string;
  updatedAt?: string;
}