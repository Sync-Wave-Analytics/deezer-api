/**
 * Genre Routes
 *
 * Endpoints for fetching music genres.
 */

import { Hono } from 'hono'
import { fetchDeezer } from '../lib/deezer'
import { idSchema, paginationSchema, validate } from '../lib/validation'
import { z } from 'zod'

const genreParamsSchema = z.object({
  id: idSchema,
})

const genre = new Hono()

/**
 * GET /genre
 * Get list of all genres
 */
genre.get('/', async (c) => {
  const { data, error, status } = await fetchDeezer('/genre')

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /genre/:id
 * Get genre by ID
 */
genre.get('/:id', async (c) => {
  const validation = validate(genreParamsSchema, { id: c.req.param('id') })

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/genre/132'
    }, 400)
  }

  const { id } = validation.data

  const { data, error, status } = await fetchDeezer(`/genre/${id}`)

  if (error) {
    return c.json({
      error: status === 404 ? 'Not Found' : 'Upstream Error',
      message: error
    }, status)
  }

  return c.json(data)
})

/**
 * GET /genre/:id/artists
 * Get artists for a genre
 */
genre.get('/:id/artists', async (c) => {
  const paramsValidation = validate(genreParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error,
      example: '/genre/132/artists'
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

  const { data, error, status } = await fetchDeezer(`/genre/${id}/artists`, {
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
 * GET /genre/:id/radios
 * Get radio stations for a genre
 */
genre.get('/:id/radios', async (c) => {
  const paramsValidation = validate(genreParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error,
      example: '/genre/132/radios'
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

  const { data, error, status } = await fetchDeezer(`/genre/${id}/radios`, {
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

export default genre
