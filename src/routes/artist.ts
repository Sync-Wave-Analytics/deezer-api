/**
 * Artist Routes
 *
 * Endpoints for fetching artist information.
 */

import { Hono } from 'hono'
import { fetchDeezer } from '../lib/deezer'
import { artistParamsSchema, paginationSchema, validate } from '../lib/validation'

const artist = new Hono()

/**
 * GET /artist/:id
 * Get artist details by ID
 */
artist.get('/:id', async (c) => {
  const validation = validate(artistParamsSchema, { id: c.req.param('id') })

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/artist/27'
    }, 400)
  }

  const { id } = validation.data

  const { data, error, status } = await fetchDeezer(`/artist/${id}`)

  if (error) {
    return c.json({
      error: status === 404 ? 'Not Found' : 'Upstream Error',
      message: error
    }, status)
  }

  return c.json(data)
})

/**
 * GET /artist/:id/top
 * Get artist's top tracks
 */
artist.get('/:id/top', async (c) => {
  const paramsValidation = validate(artistParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error,
      example: '/artist/27/top'
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

  const { data, error, status } = await fetchDeezer(`/artist/${id}/top`, {
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
 * GET /artist/:id/albums
 * Get artist's albums
 */
artist.get('/:id/albums', async (c) => {
  const paramsValidation = validate(artistParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error,
      example: '/artist/27/albums'
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

  const { data, error, status } = await fetchDeezer(`/artist/${id}/albums`, {
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

export default artist
