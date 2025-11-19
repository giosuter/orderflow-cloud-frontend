/**
 * Production environment configuration.
 *
 * The WAR is deployed under Tomcat context path /orderflow-api on Hostpoint.
 * All REST endpoints are under /api, so:
 *   `${environment.apiBaseUrl}/orders`
 * becomes:
 *   https://devprojects.ch/orderflow-api/api/orders
 */
export const environment = {
  production: true,
  apiBaseUrl: 'https://devprojects.ch/orderflow-api/api',
};