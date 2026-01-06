/**
 * Album Routes
 *
 * Endpoints for fetching album information.
 */

import { Hono } from 'hono'
import { fetchDeezer } from '../lib/deezer'
import { albumParamsSchema, paginationSchema, validate } from '../lib/validation'

const album = new Hono()

/**
 * GET /album/:id
 * Get album details by ID
 */
album.get('/:id', async (c) => {
  const validation = validate(albumParamsSchema, { id: c.req.param('id') })

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/album/302127'
    }, 400)
  }

  const { id } = validation.data

  const { data, error, status } = await fetchDeezer(`/album/${id}`)

  if (error) {
    return c.json({
      error: status === 404 ? 'Not Found' : 'Upstream Error',
      message: error
    }, status)
  }

  return c.json(data)
})

/**
 * GET /album/:id/tracks
 * Get tracks from an album
 */
album.get('/:id/tracks', async (c) => {
  const paramsValidation = validate(albumParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error,
      example: '/album/302127/tracks'
    }, 400)
  }

  const queryValidation = validate(paginationSchema, c.req.query())

  if (!queryValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: queryValidation.error
    }, 400)
  }

  const { id } = paramsValidation.data
  const { limit, index } = queryValidation.data

  const { data, error, status } = await fetchDeezer(`/album/${id}/tracks`, {
    limit,
    index,
  })

  if (error) {
    return c.json({
      error: status === 404 ? 'Not Found' : 'Upstream Error',
      message: error
    }, status)
  }

  return c.json(data)
})

export default album
