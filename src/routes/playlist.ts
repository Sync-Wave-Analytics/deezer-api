/**
 * Playlist Routes
 *
 * Endpoints for fetching playlist information.
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import {
  IdParamSchema,
  PaginationQuerySchema,
  PlaylistSchema,
  DeezerDataSchema,
  ErrorSchema,
} from '../lib/schemas'

const playlist = new OpenAPIHono()

// =============================================================================
// Route Definitions
// =============================================================================

const getPlaylistRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Playlist'],
  summary: 'Get playlist by ID',
  description: 'Retrieve detailed information about a specific playlist',
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: PlaylistSchema } },
      description: 'Playlist details',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Playlist not found',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getPlaylistTracksRoute = createRoute({
  method: 'get',
  path: '/{id}/tracks',
  tags: ['Playlist'],
  summary: 'Get playlist tracks',
  description: 'Retrieve all tracks from a specific playlist',
  request: {
    params: IdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Playlist tracks',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Playlist not found',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getPlaylistFansRoute = createRoute({
  method: 'get',
  path: '/{id}/fans',
  tags: ['Playlist'],
  summary: 'Get playlist fans',
  description: 'Retrieve fans of a specific playlist',
  request: {
    params: IdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Playlist fans',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Playlist not found',
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

playlist.openapi(getPlaylistRoute, async (c) => {
  const { id } = c.req.valid('param')

  const { data, error, status } = await fetchDeezer(`/playlist/${id}`)

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

playlist.openapi(getPlaylistTracksRoute, async (c) => {
  const { id } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/playlist/${id}/tracks`, {
    limit,
    index,
  })

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

playlist.openapi(getPlaylistFansRoute, async (c) => {
  const { id } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/playlist/${id}/fans`, {
    limit,
    index,
  })

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

export default playlist
