/**
 * Deezer API Client
 *
 * Shared utilities for making requests to the Deezer API.
 */

// =============================================================================
// Configuration
// =============================================================================

export const DEEZER_API_BASE = 'https://api.deezer.com'

// =============================================================================
// Types
// =============================================================================

export interface DeezerError {
  error: {
    type: string
    message: string
    code: number
  }
}

export interface DeezerResponse<T = unknown> {
  data?: T[]
  total?: number
  next?: string
  error?: DeezerError['error']
}

// =============================================================================
// API Client
// =============================================================================

/**
 * Makes a request to the Deezer API
 */
export async function fetchDeezer<T = unknown>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    // Build URL with query params
    const url = new URL(endpoint, DEEZER_API_BASE)

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value))
        }
      }
    }

    // Make request
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    })

    // Parse response
    const data = await response.json() as T & { error?: DeezerError['error'] }

    // Check for Deezer API error
    if (data && typeof data === 'object' && 'error' in data && data.error) {
      return {
        data: null,
        error: data.error.message || 'Deezer API error',
        status: 404, // Deezer returns errors for not found items
      }
    }

    return { data, error: null, status: 200 }
  } catch (err) {
    console.error('[Deezer API Error]', err)
    return {
      data: null,
      error: 'Failed to fetch from Deezer API',
      status: 502,
    }
  }
}

/**
 * Validates that an ID is a positive integer
 */
export function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && parseInt(id, 10) > 0
}
