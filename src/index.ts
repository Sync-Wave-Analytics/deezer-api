/**
 * Deezer API Proxy - Entry Point
 *
 * This file exports the Appwrite Function handler.
 * The handler bridges Appwrite's context to Hono's Fetch API.
 */

import app from './app'
import { createAppwriteHandler } from './adapters/appwrite'

// Create and export the Appwrite Function handler
export default createAppwriteHandler(app)

// Export app for testing purposes
export { app }
