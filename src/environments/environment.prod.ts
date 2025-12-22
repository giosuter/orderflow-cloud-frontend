/**
 * Production environment configuration.
 *
 * The WAR is deployed under Tomcat context path /orderflow-api on Hostpoint.
 * OrderService appends `/orders`, so apiBaseUrl must already include `/api`.
 *
 * Final resolved URL example:
 *   `${environment.apiBaseUrl}/orders`
 * becomes:
 *   https://devprojects.ch/orderflow-api/api/orders
 */
export const environment = {
  production: true,
  apiBaseUrl: '/orderflow-api',
};