/**
 * BlackRoad API Gateway — Cloudflare Worker
 *
 * Routes requests to the appropriate backend origin and handles
 * CORS, rate-limiting headers, and health checks at the edge.
 *
 * Copyright (c) 2024-2026 BlackRoad OS, Inc. All rights reserved.
 * Proprietary and confidential. See LICENSE for details.
 */

const ORIGINS = {
  api: 'https://api.blackroad.io',
  prism: 'https://blackroad.io',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Edge health check
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return Response.json(
        {
          status: 'ok',
          service: 'blackroad-api-gateway',
          edge: request.cf?.colo || 'unknown',
          timestamp: new Date().toISOString(),
        },
        { headers: { ...CORS_HEADERS, ...SECURITY_HEADERS } }
      );
    }

    // Route /api/* to API origin
    if (url.pathname.startsWith('/api/')) {
      const origin = env.API_ORIGIN || ORIGINS.api;
      const upstream = new URL(url.pathname + url.search, origin);

      const response = await fetch(upstream.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD'
          ? request.body
          : undefined,
      });

      const headers = new Headers(response.headers);
      Object.entries({ ...CORS_HEADERS, ...SECURITY_HEADERS }).forEach(
        ([k, v]) => headers.set(k, v)
      );

      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }

    // All other requests go to static / Prism console
    const origin = env.PAGES_ORIGIN || ORIGINS.prism;
    const upstream = new URL(url.pathname + url.search, origin);

    const response = await fetch(upstream.toString(), {
      method: request.method,
      headers: request.headers,
    });

    const headers = new Headers(response.headers);
    Object.entries(SECURITY_HEADERS).forEach(([k, v]) => headers.set(k, v));

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
