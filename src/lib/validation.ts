/**
 * Validation Schemas
 *
 * Zod schemas for validating request parameters.
 */

import { z } from 'zod'

// =============================================================================
// Common Schemas
// =============================================================================

/**
 * Non-negative integer ID (for track, album, artist, editorial IDs)
 * Note: Some Deezer endpoints use ID 0 (e.g., editorial "All")
 */
export const idSchema = z
  .string()
  .regex(/^\d+$/, 'ID must be a non-negative integer')
  .transform((val) => parseInt(val, 10))
  .refine((val) => val >= 0, 'ID must be 0 or greater')

/**
 * Pagination parameters
 */
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

// =============================================================================
// Search Schemas
// =============================================================================

/**
 * Search query parameters
 */
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
    strict: z
      .enum(['on', 'off'])
      .optional(),
  })
  .merge(paginationSchema)

/**
 * Search type-specific query (track, album, artist)
 */
export const searchTypeQuerySchema = z
  .object({
    q: z
      .string({ required_error: 'Query parameter "q" is required' })
      .min(1, 'Query cannot be empty')
      .max(500, 'Query too long (max 500 characters)'),
  })
  .merge(paginationSchema)

// =============================================================================
// Route Parameter Schemas
// =============================================================================

/**
 * Track route parameters
 */
export const trackParamsSchema = z.object({
  id: idSchema,
})

/**
 * Album route parameters
 */
export const albumParamsSchema = z.object({
  id: idSchema,
})

/**
 * Artist route parameters
 */
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
