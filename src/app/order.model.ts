/**
 *
 * This file defines the Order model used by the Angular frontend.
 * IMPORTANT:
 *  - The frontend model MUST match the backend DTO fields.
 *  - The backend is the "source of truth" for allowed statuses.
 *
 * If the backend later adds more fields, we update this file accordingly.
 */

/**
 * Allowed order statuses.
 *
 * These values MUST match EXACTLY the Java enum:
 *   NEW, PROCESSING, PAID, SHIPPED, CANCELLED
 *
 * If they differ even by one character, PUT/POST requests will fail.
 */
export type OrderStatus =
  | 'NEW'
  | 'PROCESSING'
  | 'PAID'
  | 'SHIPPED'
  | 'CANCELLED';

/**
 * Representation of an Order returned by the backend.
 *
 * NOTES:
 *  - `id` and `code` are required.
 *  - We mark some fields optional (`?`) because the backend may or may not
 *    include them in all responses.
 *  - `total` is a number so Angular pipes can format it.
 */
export interface Order {
  /** Technical database ID */
  id: number;

  /** Business order code (e.g., "ORD-2025-001") */
  code: string;

  /** Processing status of the order */
  status: OrderStatus;

  /** Optional customer name */
  customerName?: string;

  /** Total monetary amount of the order */
  total: number;

  /** Optional audit fields */
  createdAt?: string;
  updatedAt?: string;
}