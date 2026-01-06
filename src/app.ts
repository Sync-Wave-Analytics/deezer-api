/**
 * Deezer API Proxy - Hono Application
 *
 * A proxy service for the Deezer API with rate limiting and CORS support.
 * OpenAPI documentation is auto-generated from route definitions.
 */

import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { rateLimiter } from './middleware/rateLimiter'

// Route imports
import search from './routes/search'
import track from './routes/track'
import album from './routes/album'
import artist from './routes/artist'
import playlist from './routes/playlist'
import chart from './routes/chart'
import radio from './routes/radio'
import genre from './routes/genre'
import editorial from './routes/editorial'

// Create OpenAPIHono app for auto-generated documentation
const app = new OpenAPIHono()

// =============================================================================
// Middleware
// =============================================================================

// Request logging
app.use('*', logger())

// CORS - Allow all origins (adjust for production if needed)
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'Retry-After'
  ],
  maxAge: 86400, // 24 hours
}))

// Rate limiting - 100 requests per minute per IP
app.use('*', rateLimiter)

// =============================================================================
// OpenAPI Documentation (Auto-generated from route definitions)
// =============================================================================

// Determine servers based on environment
const isDev = process.env.NODE_ENV === 'development'
const servers = isDev
  ? [{ url: 'http://localhost:8787', description: 'Local development' }]
  : [{ url: 'https://deezer.songster.cloud', description: 'Production' }]

// Serve auto-generated OpenAPI JSON spec
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'Deezer API Proxy',
    version: '1.0.0',
    description: 'A proxy service for the Deezer API with rate limiting, CORS support, and OpenAPI documentation.',
    contact: {
      name: 'API Support',
      url: 'https://github.com/mnestel/deezer-api',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers,
  externalDocs: {
    description: 'Deezer API Documentation',
    url: 'https://developers.deezer.com/api',
  },
})

// Serve Swagger UI
app.get('/ui', swaggerUI({ url: '/doc' }))

// =============================================================================
// Routes
// =============================================================================

// Health check / API info
app.get('/', (c) => {
  return c.json({
    name: 'Deezer API Proxy',
    version: '1.0.0',
    status: 'healthy',
    documentation: {
      openapi: '/doc',
      swagger: '/ui',
      deezer: 'https://developers.deezer.com/api',
    },
    endpoints: {
      search: {
        path: '/search',
        params: ['q (required)', 'order', 'limit', 'index', 'strict'],
        subRoutes: ['/search/track', '/search/album', '/search/artist'],
        example: '/search?q=daft+punk&limit=10'
      },
      track: {
        path: '/track/:id',
        example: '/track/3135556'
      },
      album: {
        path: '/album/:id',
        subRoutes: ['/album/:id/tracks'],
        example: '/album/302127'
      },
      artist: {
        path: '/artist/:id',
        subRoutes: ['/artist/:id/top', '/artist/:id/albums'],
        example: '/artist/27'
      },
      playlist: {
        path: '/playlist/:id',
        subRoutes: ['/playlist/:id/tracks', '/playlist/:id/fans'],
        example: '/playlist/3155776842'
      },
      chart: {
        path: '/chart',
        subRoutes: ['/chart/tracks', '/chart/albums', '/chart/artists', '/chart/playlists', '/chart/podcasts'],
        example: '/chart/tracks?limit=10'
      },
      radio: {
        path: '/radio',
        subRoutes: ['/radio/genres', '/radio/top', '/radio/lists', '/radio/:id', '/radio/:id/tracks'],
        example: '/radio/top'
      },
      genre: {
        path: '/genre',
        subRoutes: ['/genre/:id', '/genre/:id/artists', '/genre/:id/radios'],
        example: '/genre/132'
      },
      editorial: {
        path: '/editorial',
        subRoutes: ['/editorial/:id', '/editorial/:id/selection', '/editorial/:id/charts', '/editorial/:id/releases'],
        example: '/editorial/0/charts'
      }
    },
    rateLimit: {
      limit: 100,
      window: '1 minute',
      headers: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
    }
  })
})

// Mount API routes
app.route('/search', search)
app.route('/track', track)
app.route('/album', album)
app.route('/artist', artist)
app.route('/playlist', playlist)
app.route('/chart', chart)
app.route('/radio', radio)
app.route('/genre', genre)
app.route('/editorial', editorial)

// =============================================================================
// Error Handling
// =============================================================================

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    documentation: '/ui',
    availableEndpoints: [
      'GET /',
      'GET /doc',
      'GET /ui',
      'GET /search?q=query',
      'GET /search/track?q=query',
      'GET /search/album?q=query',
      'GET /search/artist?q=query',
      'GET /track/:id',
      'GET /album/:id',
      'GET /album/:id/tracks',
      'GET /artist/:id',
      'GET /artist/:id/top',
      'GET /artist/:id/albums',
      'GET /playlist/:id',
      'GET /playlist/:id/tracks',
      'GET /playlist/:id/fans',
      'GET /chart',
      'GET /chart/tracks',
      'GET /chart/albums',
      'GET /chart/artists',
      'GET /chart/playlists',
      'GET /chart/podcasts',
      'GET /radio',
      'GET /radio/genres',
      'GET /radio/top',
      'GET /radio/lists',
      'GET /radio/:id',
      'GET /radio/:id/tracks',
      'GET /genre',
      'GET /genre/:id',
      'GET /genre/:id/artists',
      'GET /genre/:id/radios',
      'GET /editorial',
      'GET /editorial/:id',
      'GET /editorial/:id/selection',
      'GET /editorial/:id/charts',
      'GET /editorial/:id/releases'
    ]
  }, 404)
})

// Global error handler
app.onError((err, c) => {
  console.error('[App Error]', err)
  return c.json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  }, 500)
})

export default app
