/**
 * Album Routes
 *
 * Endpoints for fetching album information.
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import {
  IdParamSchema,
  PaginationQuerySchema,
  AlbumSchema,
  DeezerDataSchema,
  ErrorSchema,
} from '../lib/schemas'

const album = new OpenAPIHono()

// =============================================================================
// Route Definitions
// =============================================================================

const getAlbumRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Album'],
  summary: 'Get album by ID',
  description: 'Retrieve detailed information about a specific album',
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: AlbumSchema } },
      description: 'Album details',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Album not found',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getAlbumTracksRoute = createRoute({
  method: 'get',
  path: '/{id}/tracks',
  tags: ['Album'],
  summary: 'Get album tracks',
  description: 'Retrieve all tracks from a specific album',
  request: {
    params: IdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Album tracks',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Album not found',
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

album.openapi(getAlbumRoute, async (c) => {
  const { id } = c.req.valid('param')

  const { data, error, status } = await fetchDeezer(`/album/${id}`)

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

album.openapi(getAlbumTracksRoute, async (c) => {
  const { id } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/album/${id}/tracks`, {
    limit,
    index,
  })

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

export default album
