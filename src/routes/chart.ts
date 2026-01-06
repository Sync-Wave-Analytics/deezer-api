/**
 * Chart Routes
 *
 * Endpoints for fetching Deezer charts (top tracks, albums, artists, playlists).
 */

import { Hono } from 'hono'
import { fetchDeezer } from '../lib/deezer'
import { paginationSchema, validate } from '../lib/validation'

const chart = new Hono()

/**
 * GET /chart
 * Get overall charts (top tracks, albums, artists, playlists, podcasts)
 */
chart.get('/', async (c) => {
  const validation = validate(paginationSchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error
    }, 400)
  }

  const { limit, index } = validation.data

  const { data, error, status } = await fetchDeezer('/chart', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /chart/tracks
 * Get top tracks chart
 */
chart.get('/tracks', async (c) => {
  const validation = validate(paginationSchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error
    }, 400)
  }

  const { limit, index } = validation.data

  const { data, error, status } = await fetchDeezer('/chart/0/tracks', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /chart/albums
 * Get top albums chart
 */
chart.get('/albums', async (c) => {
  const validation = validate(paginationSchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error
    }, 400)
  }

  const { limit, index } = validation.data

  const { data, error, status } = await fetchDeezer('/chart/0/albums', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /chart/artists
 * Get top artists chart
 */
chart.get('/artists', async (c) => {
  const validation = validate(paginationSchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error
    }, 400)
  }

  const { limit, index } = validation.data

  const { data, error, status } = await fetchDeezer('/chart/0/artists', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /chart/playlists
 * Get top playlists chart
 */
chart.get('/playlists', async (c) => {
  const validation = validate(paginationSchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error
    }, 400)
  }

  const { limit, index } = validation.data

  const { data, error, status } = await fetchDeezer('/chart/0/playlists', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /chart/podcasts
 * Get top podcasts chart
 */
chart.get('/podcasts', async (c) => {
  const validation = validate(paginationSchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error
    }, 400)
  }

  const { limit, index } = validation.data

  const { data, error, status } = await fetchDeezer('/chart/0/podcasts', { limit, index })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

export default chart
