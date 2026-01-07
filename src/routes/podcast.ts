/**
 * Podcast Routes
 *
 * Endpoints for fetching podcast information.
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import {
  IdParamSchema,
  PaginationQuerySchema,
  DeezerDataSchema,
  ErrorSchema,
} from '../lib/schemas'
import { z } from '@hono/zod-openapi'

const podcast = new OpenAPIHono()

// =============================================================================
// Schemas
// =============================================================================

const PodcastSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    available: z.boolean().optional(),
    fans: z.number().optional(),
    link: z.string().optional(),
    share: z.string().optional(),
    picture: z.string().optional(),
    picture_small: z.string().optional(),
    picture_medium: z.string().optional(),
    picture_big: z.string().optional(),
    picture_xl: z.string().optional(),
  })
  .passthrough()
  .openapi('Podcast')

// =============================================================================
// Route Definitions
// =============================================================================

const getPodcastRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Podcast'],
  summary: 'Get podcast by ID',
  description: 'Retrieve detailed information about a specific podcast',
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: PodcastSchema } },
      description: 'Podcast details',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Podcast not found',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const getPodcastEpisodesRoute = createRoute({
  method: 'get',
  path: '/{id}/episodes',
  tags: ['Podcast'],
  summary: 'Get podcast episodes',
  description: 'Retrieve all episodes from a specific podcast',
  request: {
    params: IdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Podcast episodes',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Podcast not found',
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

podcast.openapi(getPodcastRoute, async (c) => {
  const { id } = c.req.valid('param')

  const { data, error, status } = await fetchDeezer(`/podcast/${id}`)

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

podcast.openapi(getPodcastEpisodesRoute, async (c) => {
  const { id } = c.req.valid('param')
  const { limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer(`/podcast/${id}/episodes`, {
    limit,
    index,
  })

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

export default podcast
