/**
 * Local Development Server
 *
 * Runs the Hono app directly with Bun for local testing.
 * Use: bun run dev
 */

import app from './app'

const port = parseInt(process.env.PORT || '8787', 10)

console.log(`Starting development server on http://localhost:${port}`)
console.log(`OpenAPI spec: http://localhost:${port}/doc`)
console.log(`Swagger UI: http://localhost:${port}/ui`)

export default {
  port,
  fetch: app.fetch,
}
