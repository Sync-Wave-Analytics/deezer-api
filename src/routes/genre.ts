/**
 * Genre Routes
 *
 * Endpoints for fetching music genres.
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import {
  IdParamSchema,
  PaginationQuerySchema,
  DeezerDataSchema,
  ErrorSchema,
} from '../lib/schemas'

const genre = new OpenAPIHono()

// =============================================================================
// Route Definitions
// =============================================================================

const getGenresRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Genre'],
  summary: 'Get all genres',
  description: 'Retrieve a list of all available music genres',
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Music genres',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getGenreByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Genre'],
  summary: 'Get genre by ID',
  description: 'Retrieve information about a specific genre',
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Genre details',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Genre not found',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getGenreArtistsRoute = createRoute({
  method: 'get',
  path: '/{id}/artists',
  tags: ['Genre'],
  summary: 'Get genre artists',
  description: 'Retrieve artists associated with a specific genre',
  request: {
    params: IdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Genre artists',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Genre not found',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getGenreRadiosRoute = createRoute({
  method: 'get',
  path: '/{id}/radios',
  tags: ['Genre'],
  summary: 'Get genre radio stations',
  description: 'Retrieve radio stations associated with a specific genre',
  request: {
    params: IdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Genre radio stations',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Genre not found',
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

genre.openapi(getGenresRoute, async (c) => {
  const { data, error, status } = await fetchDeezer('/genre')

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

genre.openapi(getGenreByIdRoute, async (c) => {
  const { id } = c.req.valid('param')

  const { data, error, status } = await fetchDeezer(`/genre/${id}`)

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

genre.openapi(getGenreArtistsRoute, async (c) => {
  const { id } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/genre/${id}/artists`, {
    limit,
    index,
  })

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

genre.openapi(getGenreRadiosRoute, async (c) => {
  const { id } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/genre/${id}/radios`, {
    limit,
    index,
  })

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

export default genre
