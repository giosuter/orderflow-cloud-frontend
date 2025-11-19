// Default environment: used for `ng serve` and `ng build` (development).
// This is your LOCAL backend on localhost:8080 with context path /orderflow-api.

export const environment = {
  production: false,
  /**
   * Base URL for the OrderFlow API (dev).
   *
   * All frontend HTTP calls should be based on this value, e.g.:
   *   `${environment.apiBaseUrl}/api/orders`
   */
  apiBaseUrl: 'http://localhost:8080/orderflow-api',
};