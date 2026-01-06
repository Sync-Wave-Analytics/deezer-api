/**
 * Search Routes
 *
 * Endpoints for searching Deezer's catalog.
 */

import { Hono } from 'hono'
import { fetchDeezer } from '../lib/deezer'
import { searchQuerySchema, searchTypeQuerySchema, validate } from '../lib/validation'

const search = new Hono()

/**
 * GET /search
 * Search for tracks, albums, artists, etc.
 *
 * Query params:
 * - q (required): Search query
 * - order: Sort order (RANKING, TRACK_ASC, TRACK_DESC, ARTIST_ASC, etc.)
 * - limit: Number of results (default 25, max 100)
 * - index: Result offset for pagination
 * - strict: Strict mode (on/off)
 */
search.get('/', async (c) => {
  const validation = validate(searchQuerySchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/search?q=daft+punk&limit=10'
    }, 400)
  }

  const { q, order, limit, index, strict } = validation.data

  const { data, error, status } = await fetchDeezer('/search', {
    q,
    order,
    limit,
    index,
    strict,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /search/track
 * Search specifically for tracks
 */
search.get('/track', async (c) => {
  const validation = validate(searchTypeQuerySchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/search/track?q=one+more+time'
    }, 400)
  }

  const { q, limit, index } = validation.data

  const { data, error, status } = await fetchDeezer('/search/track', {
    q,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /search/album
 * Search specifically for albums
 */
search.get('/album', async (c) => {
  const validation = validate(searchTypeQuerySchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/search/album?q=discovery'
    }, 400)
  }

  const { q, limit, index } = validation.data

  const { data, error, status } = await fetchDeezer('/search/album', {
    q,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

/**
 * GET /search/artist
 * Search specifically for artists
 */
search.get('/artist', async (c) => {
  const validation = validate(searchTypeQuerySchema, c.req.query())

  if (!validation.success) {
    return c.json({
      error: 'Validation Error',
      message: validation.error,
      example: '/search/artist?q=daft+punk'
    }, 400)
  }

  const { q, limit, index } = validation.data

  const { data, error, status } = await fetchDeezer('/search/artist', {
    q,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status)
  }

  return c.json(data)
})

export default search
