/**
 * Appwrite Adapter for Hono
 *
 * Bridges Appwrite Functions context to Hono's Fetch API interface.
 * This allows using Hono's routing and middleware with Appwrite Functions.
 */

import type { Hono } from 'hono'

// Appwrite Function Context Types
export interface AppwriteRequest {
  method: string
  path: string
  headers: Record<string, string>
  query: Record<string, string>
  body: string | Record<string, unknown>
  bodyRaw: string
  scheme: string
  host: string
  port: number
  url: string
  queryString: string
}

export interface AppwriteResponse {
  json: (body: unknown, statusCode?: number, headers?: Record<string, string>) => void
  text: (body: string, statusCode?: number, headers?: Record<string, string>) => void
  binary: (body: Buffer, statusCode?: number, headers?: Record<string, string>) => void
  redirect: (url: string, statusCode?: number, headers?: Record<string, string>) => void
  empty: () => void
}

export interface AppwriteContext {
  req: AppwriteRequest
  res: AppwriteResponse
  log: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}

/**
 * Creates an Appwrite Function handler from a Hono app
 */
export function createAppwriteHandler(app: Hono) {
  return async function handler(context: AppwriteContext) {
    const { req, res, log, error } = context

    try {
      // Build URL from Appwrite request
      const url = buildUrl(req)

      log(`[Hono] ${req.method} ${url.pathname}${url.search}`)

      // Create Fetch API Request
      const request = createFetchRequest(req, url)

      // Call Hono's fetch handler
      const response = await app.fetch(request)

      // Convert Hono response to Appwrite response
      return await sendAppwriteResponse(res, response)
    } catch (err) {
      error('[Hono] Unhandled error:', err)
      return res.json(
        { error: 'Internal Server Error', message: 'An unexpected error occurred' },
        500,
        { 'Content-Type': 'application/json' }
      )
    }
  }
}

/**
 * Builds a URL from Appwrite request
 */
function buildUrl(req: AppwriteRequest): URL {
  let path = req.path || '/'
  let queryString = ''

  // Handle query string in path (some Appwrite versions include it)
  const queryIndex = path.indexOf('?')
  if (queryIndex !== -1) {
    queryString = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  // Use provided URL info or fallback
  const scheme = req.scheme || 'https'
  const host = req.host || 'localhost'
  const baseUrl = `${scheme}://${host}`

  const url = new URL(path, baseUrl)

  // Add query params from path's query string
  if (queryString) {
    const params = new URLSearchParams(queryString)
    params.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
  }

  // Add query params from req.query (Appwrite's parsed query)
  if (req.query && typeof req.query === 'object') {
    for (const [key, value] of Object.entries(req.query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  // Also check queryString property
  if (req.queryString && !queryString) {
    const params = new URLSearchParams(req.queryString)
    params.forEach((value, key) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value)
      }
    })
  }

  return url
}

/**
 * Creates a Fetch API Request from Appwrite request
 */
function createFetchRequest(req: AppwriteRequest, url: URL): Request {
  const headers = new Headers()

  // Copy headers, normalizing keys to lowercase
  if (req.headers && typeof req.headers === 'object') {
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined && value !== null) {
        headers.set(key.toLowerCase(), String(value))
      }
    }
  }

  // Determine body
  let body: string | undefined
  const method = req.method?.toUpperCase() || 'GET'

  if (method !== 'GET' && method !== 'HEAD') {
    if (req.bodyRaw) {
      body = req.bodyRaw
    } else if (req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    }
  }

  return new Request(url.toString(), {
    method,
    headers,
    body,
  })
}

/**
 * Converts Hono response to Appwrite response
 */
async function sendAppwriteResponse(
  res: AppwriteResponse,
  response: Response
): Promise<void> {
  // Extract headers
  const headers: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    headers[key] = value
  })

  const contentType = response.headers.get('content-type') || ''
  const status = response.status

  // Handle different content types
  if (contentType.includes('application/json')) {
    try {
      const json = await response.json()
      return res.json(json, status, headers)
    } catch {
      // If JSON parsing fails, fall through to text
    }
  }

  // Default to text response
  const text = await response.text()

  // Try to parse as JSON if it looks like JSON
  if (text.startsWith('{') || text.startsWith('[')) {
    try {
      const json = JSON.parse(text)
      return res.json(json, status, headers)
    } catch {
      // Not valid JSON, return as text
    }
  }

  return res.text(text, status, headers)
}
