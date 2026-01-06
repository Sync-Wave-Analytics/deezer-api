/**
 * Radio Routes
 *
 * Endpoints for fetching radio stations and mixes.
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import {
  IdParamSchema,
  PaginationQuerySchema,
  DeezerDataSchema,
  ErrorSchema,
} from '../lib/schemas'

const radio = new OpenAPIHono()

// =============================================================================
// Route Definitions
// =============================================================================

const getRadioRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Radio'],
  summary: 'Get all radio stations',
  description: 'Retrieve a list of all available radio stations',
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Radio stations',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getRadioGenresRoute = createRoute({
  method: 'get',
  path: '/genres',
  tags: ['Radio'],
  summary: 'Get radio by genre',
  description: 'Retrieve radio stations organized by genre',
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Radio genres',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getRadioTopRoute = createRoute({
  method: 'get',
  path: '/top',
  tags: ['Radio'],
  summary: 'Get top radio stations',
  description: 'Retrieve the most popular radio stations',
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Top radio stations',
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

const getRadioListsRoute = createRoute({
  method: 'get',
  path: '/lists',
  tags: ['Radio'],
  summary: 'Get radio lists',
  description: 'Retrieve all available radio lists',
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Radio lists',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getRadioByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Radio'],
  summary: 'Get radio station by ID',
  description: 'Retrieve information about a specific radio station',
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Radio station details',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Radio station not found',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getRadioTracksRoute = createRoute({
  method: 'get',
  path: '/{id}/tracks',
  tags: ['Radio'],
  summary: 'Get radio station tracks',
  description: 'Retrieve tracks from a specific radio station',
  request: {
    params: IdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Radio station tracks',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Radio station not found',
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

radio.openapi(getRadioRoute, async (c) => {
  const { data, error, status } = await fetchDeezer('/radio')

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

radio.openapi(getRadioGenresRoute, async (c) => {
  const { data, error, status } = await fetchDeezer('/radio/genres')

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

radio.openapi(getRadioTopRoute, async (c) => {
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/radio/top', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

radio.openapi(getRadioListsRoute, async (c) => {
  const { data, error, status } = await fetchDeezer('/radio/lists')

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

radio.openapi(getRadioByIdRoute, async (c) => {
  const { id } = c.req.valid('param')

  const { data, error, status } = await fetchDeezer(`/radio/${id}`)

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

radio.openapi(getRadioTracksRoute, async (c) => {
  const { id } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/radio/${id}/tracks`, {
    limit,
    index,
  })

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

export default radio
