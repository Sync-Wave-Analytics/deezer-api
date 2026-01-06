/**
 * Chart Routes
 *
 * Endpoints for fetching Deezer charts (top tracks, albums, artists, playlists).
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import { PaginationQuerySchema, DeezerDataSchema, ErrorSchema } from '../lib/schemas'

const chart = new OpenAPIHono()

// =============================================================================
// Route Definitions
// =============================================================================

const getChartRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Chart'],
  summary: 'Get all charts',
  description: 'Retrieve overall charts including top tracks, albums, artists, and playlists',
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Chart data',
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

const getChartTracksRoute = createRoute({
  method: 'get',
  path: '/tracks',
  tags: ['Chart'],
  summary: 'Get top tracks',
  description: 'Retrieve the current top tracks chart',
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Top tracks',
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

const getChartAlbumsRoute = createRoute({
  method: 'get',
  path: '/albums',
  tags: ['Chart'],
  summary: 'Get top albums',
  description: 'Retrieve the current top albums chart',
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Top albums',
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

const getChartArtistsRoute = createRoute({
  method: 'get',
  path: '/artists',
  tags: ['Chart'],
  summary: 'Get top artists',
  description: 'Retrieve the current top artists chart',
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Top artists',
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

const getChartPlaylistsRoute = createRoute({
  method: 'get',
  path: '/playlists',
  tags: ['Chart'],
  summary: 'Get top playlists',
  description: 'Retrieve the current top playlists chart',
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Top playlists',
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

const getChartPodcastsRoute = createRoute({
  method: 'get',
  path: '/podcasts',
  tags: ['Chart'],
  summary: 'Get top podcasts',
  description: 'Retrieve the current top podcasts chart',
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Top podcasts',
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

chart.openapi(getChartRoute, async (c) => {
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/chart', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

chart.openapi(getChartTracksRoute, async (c) => {
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/chart/0/tracks', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

chart.openapi(getChartAlbumsRoute, async (c) => {
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/chart/0/albums', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

chart.openapi(getChartArtistsRoute, async (c) => {
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/chart/0/artists', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

chart.openapi(getChartPlaylistsRoute, async (c) => {
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/chart/0/playlists', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

chart.openapi(getChartPodcastsRoute, async (c) => {
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/chart/0/podcasts', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

export default chart
