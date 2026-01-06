/**
 * Playlist Routes
 *
 * Endpoints for fetching playlist information.
 */

import { Hono } from 'hono'
import { fetchDeezer } from '../lib/deezer'
import { idSchema, paginationSchema, validate } from '../lib/validation'
import { z } from 'zod'

const playlistParamsSchema = z.object({
  id: idSchema,
})

const playlist = new Hono()

/**
 * GET /playlist/:id
 * Get playlist details by ID
 */
playlist.get('/:id', async (c) => {
  const validation = validate(playlistParamsSchema, { id: c.req.param('id') })

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/playlist/3155776842'
    }, 400)
  }

  const { id } = validation.data

  const { data, error, status } = await fetchDeezer(`/playlist/${id}`)

  if (error) {
    return c.json({
      error: status === 404 ? 'Not Found' : 'Upstream Error',
      message: error
    }, status)
  }

  return c.json(data)
})

/**
 * GET /playlist/:id/tracks
 * Get tracks from a playlist
 */
playlist.get('/:id/tracks', async (c) => {
  const paramsValidation = validate(playlistParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error,
      example: '/playlist/3155776842/tracks'
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

  const { data, error, status } = await fetchDeezer(`/playlist/${id}/tracks`, {
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

/**
 * GET /playlist/:id/fans
 * Get fans of a playlist
 */
playlist.get('/:id/fans', async (c) => {
  const paramsValidation = validate(playlistParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error
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

  const { data, error, status } = await fetchDeezer(`/playlist/${id}/fans`, {
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

export default playlist
