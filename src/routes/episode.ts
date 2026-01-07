/**
 * Episode Routes
 *
 * Endpoints for fetching podcast episode information.
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import { IdParamSchema, ErrorSchema } from '../lib/schemas'
import { z } from '@hono/zod-openapi'

const episode = new OpenAPIHono()

// =============================================================================
// Schemas
// =============================================================================

const EpisodeSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    available: z.boolean().optional(),
    duration: z.number().optional(),
    release_date: z.string().optional(),
    link: z.string().optional(),
    share: z.string().optional(),
    picture: z.string().optional(),
    picture_small: z.string().optional(),
    picture_medium: z.string().optional(),
    picture_big: z.string().optional(),
    picture_xl: z.string().optional(),
    podcast: z
      .object({
        id: z.number(),
        title: z.string(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .openapi('Episode')

// =============================================================================
// Route Definitions
// =============================================================================

const getEpisodeRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Episode'],
  summary: 'Get episode by ID',
  description: 'Retrieve detailed information about a specific podcast episode',
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: EpisodeSchema } },
      description: 'Episode details',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Episode not found',
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

episode.openapi(getEpisodeRoute, async (c) => {
  const { id } = c.req.valid('param')

  const { data, error, status } = await fetchDeezer(`/episode/${id}`)

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

export default episode
