// Default environment: used for `ng serve` (development).
// This points to your LOCAL backend on localhost:8080 with context path /orderflow-api
// and all REST endpoints under /api.

/**
 * Development environment configuration.
 *
 * All frontend HTTP calls are based on `apiBaseUrl`, for example:
 *   `${environment.apiBaseUrl}/orders`
 * which resolves to:
 *   http://localhost:8080/orderflow-api/api/orders
 */
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/orderflow-api',
};