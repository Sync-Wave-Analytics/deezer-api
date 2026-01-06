/**
 * Editorial Routes
 *
 * Endpoints for fetching Deezer editorial content (curated selections).
 */

import { Hono } from 'hono'
import { fetchDeezer } from '../lib/deezer'
import { idSchema, paginationSchema, validate } from '../lib/validation'
import { z } from 'zod'

const editorialParamsSchema = z.object({
  id: idSchema,
})

const editorial = new Hono()

/**
 * GET /editorial
 * Get list of all editorial selections
 */
editorial.get('/', async (c) => {
  const { data, error, status } = await fetchDeezer('/editorial')

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /editorial/:id
 * Get editorial selection by ID
 */
editorial.get('/:id', async (c) => {
  const validation = validate(editorialParamsSchema, { id: c.req.param('id') })

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/editorial/0'
    }, 400)
  }

  const { id } = validation.data

  const { data, error, status } = await fetchDeezer(`/editorial/${id}`)

  if (error) {
    return c.json({
      error: status === 404 ? 'Not Found' : 'Upstream Error',
      message: error
    }, status)
  }

  return c.json(data)
})

/**
 * GET /editorial/:id/selection
 * Get curated selection for an editorial
 */
editorial.get('/:id/selection', async (c) => {
  const paramsValidation = validate(editorialParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error,
      example: '/editorial/0/selection'
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

  const { data, error, status } = await fetchDeezer(`/editorial/${id}/selection`, {
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
 * GET /editorial/:id/charts
 * Get charts for an editorial (top tracks, albums, artists)
 */
editorial.get('/:id/charts', async (c) => {
  const paramsValidation = validate(editorialParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error,
      example: '/editorial/0/charts'
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

  const { data, error, status } = await fetchDeezer(`/editorial/${id}/charts`, {
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
 * GET /editorial/:id/releases
 * Get new releases for an editorial
 */
editorial.get('/:id/releases', async (c) => {
  const paramsValidation = validate(editorialParamsSchema, { id: c.req.param('id') })

  if (!paramsValidation.success) {
    return c.json({
      error: 'Validation Error',
      message: paramsValidation.error,
      example: '/editorial/0/releases'
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

  const { data, error, status } = await fetchDeezer(`/editorial/${id}/releases`, {
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

export default editorial
