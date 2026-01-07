# Deezer API Proxy

A lightweight proxy service for the [Deezer API](https://developers.deezer.com/api) built with Hono and Bun, deployable to Appwrite Functions.

## Features

- **Full Deezer API Coverage** - Search, tracks, albums, artists, playlists, podcasts, charts, radio, genres, and editorial content
- **ISRC Lookup** - Find tracks by International Standard Recording Code
- **Auto-Generated OpenAPI Docs** - Interactive Swagger UI with spec generated from code
- **Rate Limiting** - 100 requests per minute per IP address
- **Type-Safe Validation** - Zod schemas with automatic OpenAPI metadata
- **CORS Enabled** - Ready for browser-based applications
- **Serverless Ready** - Designed for Appwrite Functions with a custom adapter

## API Documentation

Interactive API documentation is available via Swagger UI:

| Endpoint | Description |
|----------|-------------|
| `GET /ui` | Swagger UI - Interactive API explorer |
| `GET /doc` | OpenAPI 3.0 JSON specification |

Visit `/ui` in your browser to explore and test all endpoints interactively.

## Tech Stack

- [Hono](https://hono.dev) - Lightweight web framework
- [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) - OpenAPI integration with Zod
- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Zod](https://zod.dev) - TypeScript-first schema validation
- [Appwrite Functions](https://appwrite.io/docs/products/functions) - Serverless deployment

## API Endpoints

### Search

| Endpoint | Description |
|----------|-------------|
| `GET /search?q=query` | Search all content |
| `GET /search/track?q=query` | Search tracks |
| `GET /search/album?q=query` | Search albums |
| `GET /search/artist?q=query` | Search artists |
| `GET /search/playlist?q=query` | Search playlists |
| `GET /search/podcast?q=query` | Search podcasts |
| `GET /search/radio?q=query` | Search radio stations |
| `GET /search/user?q=query` | Search users |

**Query Parameters:**
- `q` (required) - Search query
- `order` - Sort: `RANKING`, `TRACK_ASC`, `TRACK_DESC`, `ARTIST_ASC`, `ARTIST_DESC`, `ALBUM_ASC`, `ALBUM_DESC`, `RATING_ASC`, `RATING_DESC`, `DURATION_ASC`, `DURATION_DESC`
- `limit` - Number of results (1-100)
- `index` - Starting offset for pagination
- `strict` - Strict mode (`on`/`off`) - main search only

### Track

| Endpoint | Description |
|----------|-------------|
| `GET /track/:id` | Get track by ID |
| `GET /track/isrc/:isrc` | Get track by ISRC code |

### Album

| Endpoint | Description |
|----------|-------------|
| `GET /album/:id` | Get album by ID |
| `GET /album/:id/tracks` | Get album tracks |

### Artist

| Endpoint | Description |
|----------|-------------|
| `GET /artist/:id` | Get artist by ID |
| `GET /artist/:id/top` | Get artist's top tracks |
| `GET /artist/:id/albums` | Get artist's albums |
| `GET /artist/:id/related` | Get related artists |
| `GET /artist/:id/radio` | Get artist radio mix |

### Playlist

| Endpoint | Description |
|----------|-------------|
| `GET /playlist/:id` | Get playlist by ID |
| `GET /playlist/:id/tracks` | Get playlist tracks |
| `GET /playlist/:id/fans` | Get playlist fans |

### Chart

| Endpoint | Description |
|----------|-------------|
| `GET /chart` | Get all charts |
| `GET /chart/tracks` | Get top tracks |
| `GET /chart/albums` | Get top albums |
| `GET /chart/artists` | Get top artists |
| `GET /chart/playlists` | Get top playlists |
| `GET /chart/podcasts` | Get top podcasts |

### Radio

| Endpoint | Description |
|----------|-------------|
| `GET /radio` | Get all radio stations |
| `GET /radio/genres` | Get radio by genre |
| `GET /radio/top` | Get top radio stations |
| `GET /radio/lists` | Get radio lists |
| `GET /radio/:id` | Get radio by ID |
| `GET /radio/:id/tracks` | Get radio tracks |

### Genre

| Endpoint | Description |
|----------|-------------|
| `GET /genre` | Get all genres |
| `GET /genre/:id` | Get genre by ID |
| `GET /genre/:id/artists` | Get genre artists |
| `GET /genre/:id/radios` | Get genre radio stations |

### Editorial

| Endpoint | Description |
|----------|-------------|
| `GET /editorial` | Get all editorial content |
| `GET /editorial/:id` | Get editorial by ID |
| `GET /editorial/:id/selection` | Get curated selection |
| `GET /editorial/:id/charts` | Get editorial charts |
| `GET /editorial/:id/releases` | Get new releases |

### Podcast

| Endpoint | Description |
|----------|-------------|
| `GET /podcast/:id` | Get podcast by ID |
| `GET /podcast/:id/episodes` | Get podcast episodes |

### Episode

| Endpoint | Description |
|----------|-------------|
| `GET /episode/:id` | Get episode by ID |

### Pagination

Most list endpoints support pagination:
- `limit` - Number of results (1-100)
- `index` - Starting offset

## Local Development

### Prerequisites

- [Bun](https://bun.sh) v1.0+

### Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

The server runs at `http://localhost:8787` by default.

### Example Requests

```bash
# Search for an artist
curl "http://localhost:8787/search?q=daft+punk&limit=5"

# Search with sorting
curl "http://localhost:8787/search/track?q=love&order=DURATION_DESC&limit=10"

# Get a specific track
curl "http://localhost:8787/track/3135556"

# Get track by ISRC
curl "http://localhost:8787/track/isrc/USUM71703861"

# Get top charts
curl "http://localhost:8787/chart/tracks?limit=10"

# Get podcast episodes
curl "http://localhost:8787/podcast/699612/episodes?limit=5"

# Get artist radio (tracks inspired by the artist)
curl "http://localhost:8787/artist/27/radio?limit=10"

# Get related artists
curl "http://localhost:8787/artist/27/related?limit=5"
```

## Deployment to Appwrite

### Prerequisites

- [Appwrite CLI](https://appwrite.io/docs/tooling/command-line/installation)
- Appwrite Cloud or self-hosted instance

### Deploy

1. Login to Appwrite CLI:
   ```bash
   appwrite login
   ```

2. Create `appwrite.json` in project root:
   ```json
   {
     "projectId": "your-project-id",
     "functions": [
       {
         "$id": "deezer-api-proxy",
         "name": "Deezer API Proxy",
         "runtime": "bun-1.0",
         "entrypoint": "src/index.ts",
         "commands": "bun install",
         "timeout": 30,
         "scopes": [],
         "events": [],
         "schedule": "",
         "execute": ["any"]
       }
     ]
   }
   ```

3. Push to Appwrite:
   ```bash
   appwrite push functions
   ```

Your function will be available at your configured domain or Appwrite's default URL.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port for local development | `8787` |
| `API_URL` | Production URL shown in OpenAPI spec | _(none)_ |

## Rate Limiting

- **Limit:** 100 requests per minute per IP
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Exceeded:** Returns `429 Too Many Requests` with `Retry-After` header

## Project Structure

```
src/
├── index.ts              # Entry point (Appwrite handler)
├── dev.ts                # Local development server
├── app.ts                # Hono application with OpenAPI
├── adapters/
│   └── appwrite.ts       # Appwrite-to-Hono bridge
├── lib/
│   ├── deezer.ts         # Deezer API client
│   ├── schemas.ts        # Zod schemas with OpenAPI metadata
│   └── validation.ts     # Legacy validation schemas
├── middleware/
│   └── rateLimiter.ts    # Rate limiting
└── routes/               # OpenAPIHono route handlers
    ├── search.ts
    ├── track.ts
    ├── album.ts
    ├── artist.ts
    ├── playlist.ts
    ├── chart.ts
    ├── radio.ts
    ├── genre.ts
    ├── editorial.ts
    ├── podcast.ts
    └── episode.ts
```

## License

MIT
