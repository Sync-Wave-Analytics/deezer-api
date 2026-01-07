/**
 * Search Routes
 *
 * Endpoints for searching Deezer's catalog.
 */

import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { fetchDeezer } from '../lib/deezer'
import {
  SearchQuerySchema,
  SimpleSearchQuerySchema,
  DeezerDataSchema,
  ErrorSchema,
} from '../lib/schemas'

const search = new OpenAPIHono()

// =============================================================================
// Route Definitions
// =============================================================================

const searchRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Search'],
  summary: 'Search all content',
  description: 'Search for tracks, albums, artists, and more',
  request: {
    query: SearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const searchTrackRoute = createRoute({
  method: 'get',
  path: '/track',
  tags: ['Search'],
  summary: 'Search tracks',
  description: 'Search specifically for tracks',
  request: {
    query: SimpleSearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Track search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const searchAlbumRoute = createRoute({
  method: 'get',
  path: '/album',
  tags: ['Search'],
  summary: 'Search albums',
  description: 'Search specifically for albums',
  request: {
    query: SimpleSearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Album search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const searchArtistRoute = createRoute({
  method: 'get',
  path: '/artist',
  tags: ['Search'],
  summary: 'Search artists',
  description: 'Search specifically for artists',
  request: {
    query: SimpleSearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Artist search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const searchPlaylistRoute = createRoute({
  method: 'get',
  path: '/playlist',
  tags: ['Search'],
  summary: 'Search playlists',
  description: 'Search specifically for playlists',
  request: {
    query: SimpleSearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Playlist search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const searchPodcastRoute = createRoute({
  method: 'get',
  path: '/podcast',
  tags: ['Search'],
  summary: 'Search podcasts',
  description: 'Search specifically for podcasts',
  request: {
    query: SimpleSearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Podcast search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const searchRadioRoute = createRoute({
  method: 'get',
  path: '/radio',
  tags: ['Search'],
  summary: 'Search radio stations',
  description: 'Search specifically for radio stations',
  request: {
    query: SimpleSearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'Radio search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
    502: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Upstream error from Deezer API',
    },
  },
})

const searchUserRoute = createRoute({
  method: 'get',
  path: '/user',
  tags: ['Search'],
  summary: 'Search users',
  description: 'Search for public user profiles',
  request: {
    query: SimpleSearchQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: DeezerDataSchema } },
      description: 'User search results',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
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

search.openapi(searchRoute, async (c) => {
  const { q, order, limit, index, strict } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search', {
    q,
    order,
    limit,
    index,
    strict,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

search.openapi(searchTrackRoute, async (c) => {
  const { q, order, limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search/track', {
    q,
    order,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

search.openapi(searchAlbumRoute, async (c) => {
  const { q, order, limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search/album', {
    q,
    order,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

search.openapi(searchArtistRoute, async (c) => {
  const { q, order, limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search/artist', {
    q,
    order,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

search.openapi(searchPlaylistRoute, async (c) => {
  const { q, order, limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search/playlist', {
    q,
    order,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

search.openapi(searchPodcastRoute, async (c) => {
  const { q, order, limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search/podcast', {
    q,
    order,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

search.openapi(searchRadioRoute, async (c) => {
  const { q, order, limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search/radio', {
    q,
    order,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

search.openapi(searchUserRoute, async (c) => {
  const { q, order, limit, index } = c.req.valid('query')

  const { data, error, status } = await fetchDeezer('/search/user', {
    q,
    order,
    limit,
    index,
  })

  if (error) {
    return c.json({ error: 'Upstream Error', message: error }, status as 502)
  }

  return c.json(data, 200)
})

export default search
