/**
 * Chart Routes
 *
 * Endpoints for fetching Deezer charts (top tracks, albums, artists, playlists).
 */

import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import { PaginationQuerySchema, DeezerDataSchema, ErrorSchema } from '../lib/schemas'

const chart = new OpenAPIHono()

// =============================================================================
// Shared Schemas
// =============================================================================

const GenreIdParamSchema = z.object({
  genreId: z.string().regex(/^\d+$/).openapi({
    param: { name: 'genreId', in: 'path' },
    description: 'Genre ID (use 0 for all genres)',
    example: '0',
  }),
})

// =============================================================================
// Route Definitions
// =============================================================================

const getChartRoute = createRoute({
  method: 'get',
  path: '/{genreId}',
  tags: ['Chart'],
  summary: 'Get charts by genre',
  description: 'Retrieve charts including top tracks, albums, artists, and playlists for a specific genre (use 0 for all genres)',
  request: {
    params: GenreIdParamSchema,
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
  path: '/{genreId}/tracks',
  tags: ['Chart'],
  summary: 'Get top tracks by genre',
  description: 'Retrieve the top tracks chart for a specific genre (use 0 for all genres)',
  request: {
    params: GenreIdParamSchema,
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
  path: '/{genreId}/albums',
  tags: ['Chart'],
  summary: 'Get top albums by genre',
  description: 'Retrieve the top albums chart for a specific genre (use 0 for all genres)',
  request: {
    params: GenreIdParamSchema,
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
  path: '/{genreId}/artists',
  tags: ['Chart'],
  summary: 'Get top artists by genre',
  description: 'Retrieve the top artists chart for a specific genre (use 0 for all genres)',
  request: {
    params: GenreIdParamSchema,
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
  path: '/{genreId}/playlists',
  tags: ['Chart'],
  summary: 'Get top playlists by genre',
  description: 'Retrieve the top playlists chart for a specific genre (use 0 for all genres)',
  request: {
    params: GenreIdParamSchema,
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
  path: '/{genreId}/podcasts',
  tags: ['Chart'],
  summary: 'Get top podcasts by genre',
  description: 'Retrieve the top podcasts chart for a specific genre (use 0 for all genres)',
  request: {
    params: GenreIdParamSchema,
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
  const { genreId } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/chart/${genreId}`, { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

chart.openapi(getChartTracksRoute, async (c) => {
  const { genreId } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/chart/${genreId}/tracks`, { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

chart.openapi(getChartAlbumsRoute, async (c) => {
  const { genreId } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/chart/${genreId}/albums`, { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

chart.openapi(getChartArtistsRoute, async (c) => {
  const { genreId } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/chart/${genreId}/artists`, { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

chart.openapi(getChartPlaylistsRoute, async (c) => {
  const { genreId } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/chart/${genreId}/playlists`, { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

chart.openapi(getChartPodcastsRoute, async (c) => {
  const { genreId } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/chart/${genreId}/podcasts`, { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

export default chart
