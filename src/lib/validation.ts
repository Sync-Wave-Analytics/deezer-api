/**
 * Validation Schemas
 *
 * Zod schemas for validating request parameters with OpenAPI support.
 */

import { z } from '@hono/zod-openapi'

// =============================================================================
// Common Schemas
// =============================================================================

/**
 * Non-negative integer ID (for track, album, artist, editorial IDs)
 * Note: Some Deezer endpoints use ID 0 (e.g., editorial "All")
 */
export const IdParamSchema = z
  .string()
  .regex(/^\d+$/, 'ID must be a non-negative integer')
  .openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: '3135556',
    description: 'Resource ID',
  })

/**
 * Pagination query parameters
 */
export const PaginationQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'limit',
        in: 'query',
      },
      example: '25',
      description: 'Number of results (1-100)',
    }),
  index: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'index',
        in: 'query',
      },
      example: '0',
      description: 'Starting offset for pagination',
    }),
})

// =============================================================================
// Search Schemas
// =============================================================================

/**
 * Search query parameters
 */
export const SearchQuerySchema = z.object({
  q: z
    .string()
    .min(1)
    .max(500)
    .openapi({
      param: {
        name: 'q',
        in: 'query',
        required: true,
      },
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
      param: {
        name: 'order',
        in: 'query',
      },
      example: 'RANKING',
      description: 'Sort order for results',
    }),
  strict: z
    .enum(['on', 'off'])
    .optional()
    .openapi({
      param: {
        name: 'strict',
        in: 'query',
      },
      example: 'off',
      description: 'Enable strict search mode',
    }),
  limit: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'limit',
        in: 'query',
      },
      example: '25',
      description: 'Number of results (1-100)',
    }),
  index: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'index',
        in: 'query',
      },
      example: '0',
      description: 'Starting offset for pagination',
    }),
})

/**
 * Simple search query (for type-specific searches)
 */
export const SimpleSearchQuerySchema = z.object({
  q: z
    .string()
    .min(1)
    .max(500)
    .openapi({
      param: {
        name: 'q',
        in: 'query',
        required: true,
      },
      example: 'daft punk',
      description: 'Search query',
    }),
  limit: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'limit',
        in: 'query',
      },
      example: '25',
      description: 'Number of results (1-100)',
    }),
  index: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'index',
        in: 'query',
      },
      example: '0',
      description: 'Starting offset for pagination',
    }),
})

// =============================================================================
// Response Schemas
// =============================================================================

export const ErrorSchema = z
  .object({
    error: z.string().openapi({ example: 'Validation Error' }),
    message: z.string().openapi({ example: 'Query parameter "q" is required' }),
  })
  .openapi('Error')

export const TrackSchema = z
  .object({
    id: z.number().openapi({ example: 3135556 }),
    title: z.string().openapi({ example: 'Harder, Better, Faster, Stronger' }),
    duration: z.number().openapi({ example: 224 }),
    preview: z.string().openapi({ example: 'https://cdns-preview-d.dzcdn.net/...' }),
    artist: z.object({
      id: z.number(),
      name: z.string(),
    }),
    album: z.object({
      id: z.number(),
      title: z.string(),
      cover: z.string(),
    }),
  })
  .passthrough()
  .openapi('Track')

export const AlbumSchema = z
  .object({
    id: z.number().openapi({ example: 302127 }),
    title: z.string().openapi({ example: 'Discovery' }),
    cover: z.string().openapi({ example: 'https://api.deezer.com/album/302127/image' }),
    nb_tracks: z.number().openapi({ example: 14 }),
    artist: z.object({
      id: z.number(),
      name: z.string(),
    }),
  })
  .passthrough()
  .openapi('Album')

export const ArtistSchema = z
  .object({
    id: z.number().openapi({ example: 27 }),
    name: z.string().openapi({ example: 'Daft Punk' }),
    picture: z.string().openapi({ example: 'https://api.deezer.com/artist/27/image' }),
    nb_fan: z.number().openapi({ example: 4000000 }),
  })
  .passthrough()
  .openapi('Artist')

export const SearchResultSchema = z
  .object({
    data: z.array(z.any()),
    total: z.number().optional(),
    next: z.string().optional(),
  })
  .openapi('SearchResult')

export const PaginatedResultSchema = z
  .object({
    data: z.array(z.any()),
    total: z.number().optional(),
    next: z.string().optional(),
    prev: z.string().optional(),
  })
  .openapi('PaginatedResult')

// =============================================================================
// Legacy Support (for existing routes)
// =============================================================================

export const idSchema = z
  .string()
  .regex(/^\d+$/, 'ID must be a non-negative integer')
  .transform((val) => parseInt(val, 10))
  .refine((val) => val >= 0, 'ID must be 0 or greater')

export const paginationSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (val > 0 && val <= 100), {
      message: 'Limit must be between 1 and 100',
    }),
  index: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || val >= 0, {
      message: 'Index must be 0 or greater',
    }),
})

export const searchQuerySchema = z
  .object({
    q: z
      .string({ required_error: 'Query parameter "q" is required' })
      .min(1, 'Query cannot be empty')
      .max(500, 'Query too long (max 500 characters)'),
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
      .optional(),
    strict: z.enum(['on', 'off']).optional(),
  })
  .merge(paginationSchema)

export const searchTypeQuerySchema = z
  .object({
    q: z
      .string({ required_error: 'Query parameter "q" is required' })
      .min(1, 'Query cannot be empty')
      .max(500, 'Query too long (max 500 characters)'),
  })
  .merge(paginationSchema)

export const trackParamsSchema = z.object({
  id: idSchema,
})

export const albumParamsSchema = z.object({
  id: idSchema,
})

export const artistParamsSchema = z.object({
  id: idSchema,
})

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Formats Zod errors into a user-friendly message
 */
export function formatZodError(error: z.ZodError): string {
  return error.errors
    .map((e) => {
      const path = e.path.join('.')
      return path ? `${path}: ${e.message}` : e.message
    })
    .join('; ')
}

/**
 * Validates data against a schema and returns a result object
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, error: formatZodError(result.error) }
}
