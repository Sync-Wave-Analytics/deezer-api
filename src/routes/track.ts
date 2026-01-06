/**
 * Track Routes
 *
 * Endpoints for fetching track information.
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import { IdParamSchema, TrackSchema, ErrorSchema } from '../lib/schemas'

const track = new OpenAPIHono()

// =============================================================================
// Route Definitions
// =============================================================================

const getTrackRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Track'],
  summary: 'Get track by ID',
  description: 'Retrieve detailed information about a specific track',
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: TrackSchema } },
      description: 'Track details',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    404: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Track not found',
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

track.openapi(getTrackRoute, async (c) => {
  const { id } = c.req.valid('param')

  const { data, error, status } = await fetchDeezer(`/track/${id}`)

  if (error) {
    const errorType = status === 404 ? 'Not Found' : 'Upstream Error'
    return c.json({ error: errorType, message: error }, status as 404)
  }

  return c.json(data, 200)
})

export default track
