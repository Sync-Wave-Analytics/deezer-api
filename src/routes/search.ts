/**
 * Search Routes
 *
 * Endpoints for searching Deezer's catalog.
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import {
  SearchQuerySchema,
  SimpleSearchQuerySchema,
  DeezerDataSchema,
  ErrorSchema,
} from '../lib/schemas'

const search = new OpenAPIHono()

// =============================================================================
// Route Definitions
// =============================================================================

const searchRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Search'],
  summary: 'Search all content',
  description: 'Search for tracks, albums, artists, and more',
  request: {
    query: SearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const searchTrackRoute = createRoute({
  method: 'get',
  path: '/track',
  tags: ['Search'],
  summary: 'Search tracks',
  description: 'Search specifically for tracks',
  request: {
    query: SimpleSearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Track search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const searchAlbumRoute = createRoute({
  method: 'get',
  path: '/album',
  tags: ['Search'],
  summary: 'Search albums',
  description: 'Search specifically for albums',
  request: {
    query: SimpleSearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Album search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const searchArtistRoute = createRoute({
  method: 'get',
  path: '/artist',
  tags: ['Search'],
  summary: 'Search artists',
  description: 'Search specifically for artists',
  request: {
    query: SimpleSearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Artist search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

// =============================================================================
// Route Handlers
// =============================================================================

search.openapi(searchRoute, async (c) => {
  const { q, order, limit, index, strict } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search', {
    q,
    order,
    limit,
    index,
    strict,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

search.openapi(searchTrackRoute, async (c) => {
  const { q, limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search/track', {
    q,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

search.openapi(searchAlbumRoute, async (c) => {
  const { q, limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search/album', {
    q,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

search.openapi(searchArtistRoute, async (c) => {
  const { q, limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search/artist', {
    q,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

export default search
