/**
 * Editorial Routes
 *
 * Endpoints for fetching Deezer editorial content (curated selections).
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import {
  IdParamSchema,
  PaginationQuerySchema,
  DeezerDataSchema,
  ErrorSchema,
} from '../lib/schemas'

const editorial = new OpenAPIHono()

// =============================================================================
// Route Definitions
// =============================================================================

const getEditorialsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Editorial'],
  summary: 'Get all editorial content',
  description: 'Retrieve a list of all editorial selections',
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Editorial content',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getEditorialByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Editorial'],
  summary: 'Get editorial by ID',
  description: 'Retrieve information about a specific editorial selection',
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Editorial details',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Editorial not found',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getEditorialSelectionRoute = createRoute({
  method: 'get',
  path: '/{id}/selection',
  tags: ['Editorial'],
  summary: 'Get editorial selection',
  description: 'Retrieve curated selection for a specific editorial',
  request: {
    params: IdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Editorial selection',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Editorial not found',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getEditorialChartsRoute = createRoute({
  method: 'get',
  path: '/{id}/charts',
  tags: ['Editorial'],
  summary: 'Get editorial charts',
  description: 'Retrieve charts for a specific editorial (top tracks, albums, artists)',
  request: {
    params: IdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Editorial charts',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Editorial not found',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getEditorialReleasesRoute = createRoute({
  method: 'get',
  path: '/{id}/releases',
  tags: ['Editorial'],
  summary: 'Get editorial releases',
  description: 'Retrieve new releases for a specific editorial',
  request: {
    params: IdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Editorial releases',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Editorial not found',
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

editorial.openapi(getEditorialsRoute, async (c) => {
  const { data, error, status } = await fetchDeezer('/editorial')

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

editorial.openapi(getEditorialByIdRoute, async (c) => {
  const { id } = c.req.valid('param')

  const { data, error, status } = await fetchDeezer(`/editorial/${id}`)

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

editorial.openapi(getEditorialSelectionRoute, async (c) => {
  const { id } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/editorial/${id}/selection`, {
    limit,
    index,
  })

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

editorial.openapi(getEditorialChartsRoute, async (c) => {
  const { id } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/editorial/${id}/charts`, {
    limit,
    index,
  })

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

editorial.openapi(getEditorialReleasesRoute, async (c) => {
  const { id } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/editorial/${id}/releases`, {
    limit,
    index,
  })

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

export default editorial
