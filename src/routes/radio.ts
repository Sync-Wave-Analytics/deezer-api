/**
 * Radio Routes
 *
 * Endpoints for fetching radio stations and mixes.
 */

import { Hono } from 'hono'
import { fetchDeezer } from '../lib/deezer'
import { idSchema, paginationSchema, validate } from '../lib/validation'
import { z } from 'zod'

const radioParamsSchema = z.object({
  id: idSchema,
})

const radio = new Hono()

/**
 * GET /radio
 * Get list of all radio stations
 */
radio.get('/', async (c) => {
  const { data, error, status } = await fetchDeezer('/radio')

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /radio/genres
 * Get radio stations by genre
 */
radio.get('/genres', async (c) => {
  const { data, error, status } = await fetchDeezer('/radio/genres')

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /radio/top
 * Get top radio stations
 */
radio.get('/top', async (c) => {
  const validation = validate(paginationSchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error
    }, 400)
  }

  const { limit, index } = validation.data

  const { data, error, status } = await fetchDeezer('/radio/top', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /radio/lists
 * Get all radio lists
 */
radio.get('/lists', async (c) => {
  const { data, error, status } = await fetchDeezer('/radio/lists')

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /radio/:id
 * Get radio station by ID
 */
radio.get('/:id', async (c) => {
  const validation = validate(radioParamsSchema, { id: c.req.param('id') })

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/radio/6'
    }, 400)
  }

  const { id } = validation.data

  const { data, error, status } = await fetchDeezer(`/radio/${id}`)

  if (error) {
    return c.json({
      error: status === 404 ? 'Not Found' : 'Upstream Error',
      message: error
    }, status)
  }

  return c.json(data)
})

/**
 * GET /radio/:id/tracks
 * Get tracks from a radio station
 */
radio.get('/:id/tracks', async (c) => {
  const paramsValidation = validate(radioParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error,
      example: '/radio/6/tracks'
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

  const { data, error, status } = await fetchDeezer(`/radio/${id}/tracks`, {
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

export default radio
