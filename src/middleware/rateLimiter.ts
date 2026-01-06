/**
 * Rate Limiter Middleware
 *
 * Implements a sliding window rate limiter using in-memory storage.
 * Limits requests per IP address to prevent abuse.
 *
 * Note: In-memory storage resets when the function cold starts.
 * For persistent rate limiting, consider using Appwrite Database or Redis.
 */

import type { Context, Next } from 'hono'

// =============================================================================
// Configuration
// =============================================================================

const CONFIG = {
  /** Maximum requests allowed per window */
  limit: 100,
  /** Time window in milliseconds (1 minute) */
  windowMs: 60 * 1000,
  /** Cleanup interval in milliseconds (5 minutes) */
  cleanupIntervalMs: 5 * 60 * 1000,
  /** Headers to check for client IP (in priority order) */
  ipHeaders: [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'x-client-ip',
    'x-appwrite-client-ip'
  ] as const
}

// =============================================================================
// Types
// =============================================================================

interface RateLimitEntry {
  /** Number of requests in current window */
  count: number
  /** Timestamp when the window resets */
  resetTime: number
}

// =============================================================================
// Storage
// =============================================================================

const store = new Map<string, RateLimitEntry>()

// Cleanup expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [ip, entry] of store.entries()) {
      if (now > entry.resetTime) {
        store.delete(ip)
      }
    }
  }, CONFIG.cleanupIntervalMs)
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extracts the client IP address from request headers
 */
function getClientIp(c: Context): string {
  for (const header of CONFIG.ipHeaders) {
    const value = c.req.header(header)
    if (value) {
      // x-forwarded-for may contain multiple IPs; take the first one
      const ip = value.split(',')[0]?.trim()
      if (ip) return ip
    }
  }
  return 'unknown'
}

/**
 * Sets rate limit headers on the response
 */
function setRateLimitHeaders(c: Context, entry: RateLimitEntry): void {
  const remaining = Math.max(0, CONFIG.limit - entry.count)
  c.header('X-RateLimit-Limit', CONFIG.limit.toString())
  c.header('X-RateLimit-Remaining', remaining.toString())
  c.header('X-RateLimit-Reset', entry.resetTime.toString())
}

// =============================================================================
// Middleware
// =============================================================================

/**
 * Rate limiter middleware
 *
 * Tracks requests per IP and returns 429 Too Many Requests when limit exceeded.
 */
export async function rateLimiter(c: Context, next: Next): Promise<Response | void> {
  const ip = getClientIp(c)
  const now = Date.now()

  // Get or create entry for this IP
  let entry = store.get(ip)

  if (!entry || now > entry.resetTime) {
    // First request or window expired - start fresh
    entry = {
      count: 1,
      resetTime: now + CONFIG.windowMs
    }
    store.set(ip, entry)
  } else {
    // Increment counter
    entry.count++
  }

  // Set rate limit headers
  setRateLimitHeaders(c, entry)

  // Check if limit exceeded
  if (entry.count > CONFIG.limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    c.header('Retry-After', retryAfter.toString())

    return c.json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      retryAfter,
      limit: CONFIG.limit,
      window: '1 minute'
    }, 429)
  }

  await next()
}

// =============================================================================
// Exports
// =============================================================================

export { CONFIG as rateLimitConfig }
