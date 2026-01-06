/**
 * Track Routes
 *
 * Endpoints for fetching track information.
 */

import { Hono } from 'hono'
import { fetchDeezer } from '../lib/deezer'
import { trackParamsSchema, validate } from '../lib/validation'

const track = new Hono()

/**
 * GET /track/:id
 * Get track details by ID
 */
track.get('/:id', async (c) => {
  const validation = validate(trackParamsSchema, { id: c.req.param('id') })

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/track/3135556'
    }, 400)
  }

  const { id } = validation.data

  const { data, error, status } = await fetchDeezer(`/track/${id}`)

  if (error) {
    return c.json({
      error: status === 404 ? 'Not Found' : 'Upstream Error',
      message: error
    }, status)
  }

  return c.json(data)
})

export default track
