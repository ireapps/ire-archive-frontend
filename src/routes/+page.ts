/**
 * Homepage rendering configuration
 * Disabled to ensure consistent CSR behavior across all routes
 * This prevents browser navigation issues between prerendered and SPA pages
 */
export const prerender = false;
export const ssr = false;
