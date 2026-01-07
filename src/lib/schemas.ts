/**
 * OpenAPI Schemas
 *
 * Zod schemas with OpenAPI metadata for request/response validation.
 */

import { z } from '@hono/zod-openapi'

// =============================================================================
// Parameter Schemas
// =============================================================================

export const IdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a non-negative integer')
    .openapi({
      param: { name: 'id', in: 'path' },
      example: '3135556',
      description: 'Resource ID',
    }),
})

export const IsrcParamSchema = z.object({
  isrc: z
    .string()
    .regex(/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/, 'Invalid ISRC format')
    .openapi({
      param: { name: 'isrc', in: 'path' },
      example: 'USUM71703861',
      description: 'International Standard Recording Code (12 characters)',
    }),
})

export const PaginationQuerySchema = z.object({
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().min(1).max(100))
    .optional()
    .openapi({
      param: { name: 'limit', in: 'query' },
      example: '25',
      description: 'Number of results (1-100)',
    }),
  index: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().min(0))
    .optional()
    .openapi({
      param: { name: 'index', in: 'query' },
      example: '0',
      description: 'Starting offset for pagination',
    }),
})

export const SearchQuerySchema = z.object({
  q: z
    .string()
    .min(1)
    .max(500)
    .openapi({
      param: { name: 'q', in: 'query', required: true },
      example: 'daft punk',
      description: 'Search query',
    }),
  order: z
    .enum([
      'RANKING',
      'TRACK_ASC',
      'TRACK_DESC',
      'ARTIST_ASC',
      'ARTIST_DESC',
      'ALBUM_ASC',
      'ALBUM_DESC',
      'RATING_ASC',
      'RATING_DESC',
      'DURATION_ASC',
      'DURATION_DESC',
    ])
    .optional()
    .openapi({
      param: { name: 'order', in: 'query' },
      example: 'RANKING',
      description: 'Sort order for results',
    }),
  strict: z
    .enum(['on', 'off'])
    .optional()
    .openapi({
      param: { name: 'strict', in: 'query' },
      example: 'off',
      description: 'Enable strict search mode',
    }),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().min(1).max(100))
    .optional()
    .openapi({
      param: { name: 'limit', in: 'query' },
      example: '25',
      description: 'Number of results (1-100)',
    }),
  index: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().min(0))
    .optional()
    .openapi({
      param: { name: 'index', in: 'query' },
      example: '0',
      description: 'Starting offset',
    }),
})

export const SimpleSearchQuerySchema = z.object({
  q: z
    .string()
    .min(1)
    .max(500)
    .openapi({
      param: { name: 'q', in: 'query', required: true },
      example: 'daft punk',
      description: 'Search query',
    }),
  order: z
    .enum([
      'RANKING',
      'TRACK_ASC',
      'TRACK_DESC',
      'ARTIST_ASC',
      'ARTIST_DESC',
      'ALBUM_ASC',
      'ALBUM_DESC',
      'RATING_ASC',
      'RATING_DESC',
      'DURATION_ASC',
      'DURATION_DESC',
    ])
    .optional()
    .openapi({
      param: { name: 'order', in: 'query' },
      example: 'RANKING',
      description: 'Sort order for results',
    }),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().min(1).max(100))
    .optional()
    .openapi({
      param: { name: 'limit', in: 'query' },
      example: '25',
    }),
  index: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().min(0))
    .optional()
    .openapi({
      param: { name: 'index', in: 'query' },
      example: '0',
    }),
})

// =============================================================================
// Response Schemas
// =============================================================================

export const ErrorSchema = z
  .object({
    error: z.string(),
    message: z.string(),
  })
  .openapi('Error')

export const DeezerDataSchema = z
  .object({
    data: z.array(z.any()).optional(),
    total: z.number().optional(),
    next: z.string().optional(),
    prev: z.string().optional(),
  })
  .passthrough()
  .openapi('DeezerResponse')

export const TrackSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    duration: z.number(),
    preview: z.string(),
    artist: z.object({
      id: z.number(),
      name: z.string(),
    }).passthrough(),
    album: z.object({
      id: z.number(),
      title: z.string(),
      cover: z.string(),
    }).passthrough(),
  })
  .passthrough()
  .openapi('Track')

export const AlbumSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    cover: z.string(),
    nb_tracks: z.number().optional(),
    artist: z.object({
      id: z.number(),
      name: z.string(),
    }).passthrough(),
  })
  .passthrough()
  .openapi('Album')

export const ArtistSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    picture: z.string(),
    nb_fan: z.number().optional(),
  })
  .passthrough()
  .openapi('Artist')

export const PlaylistSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    nb_tracks: z.number(),
    fans: z.number().optional(),
  })
  .passthrough()
  .openapi('Playlist')
