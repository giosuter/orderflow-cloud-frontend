/**
 * Production environment configuration.
 *
 * The WAR is deployed under Tomcat context path /orderflow-api on Hostpoint.
 * Angular services append `/api/...`, so the base must be WITHOUT /api.
 *
 * Final resolved URL example:
 *   `${environment.apiBaseUrl}/api/orders`
 * becomes:
 *   https://devprojects.ch/orderflow-api/api/orders
 */
export const environment = {
  production: true,
  apiBaseUrl: 'https://devprojects.ch/orderflow-api',
};