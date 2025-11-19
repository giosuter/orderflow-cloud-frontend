// File: src/environments/environment.prod.ts

// Production environment: used for `ng build --configuration production`.
// This points to your Hostpoint deployment.

export const environment = {
  production: true,
  /**
   * Base URL for the OrderFlow API (prod).
   *
   * Hostpoint Tomcat context path: /orderflow-api
   * Canonical base URL: https://devprojects.ch/orderflow-api
   */
  apiBaseUrl: 'https://devprojects.ch/orderflow-api',
};