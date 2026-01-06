# Deezer API Proxy

A lightweight proxy service for the [Deezer API](https://developers.deezer.com/api) built with Hono and Bun, deployable to Appwrite Functions.

## Features

- **Full Deezer API Coverage** - Search, tracks, albums, artists, playlists, charts, radio, genres, and editorial content
- **Rate Limiting** - 100 requests per minute per IP address
- **Input Validation** - Zod schema validation on all endpoints
- **CORS Enabled** - Ready for browser-based applications
- **Serverless Ready** - Designed for Appwrite Functions with a custom adapter

## Tech Stack

- [Hono](https://hono.dev) - Lightweight web framework
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

**Query Parameters:** `q` (required), `order`, `limit`, `index`, `strict`

### Track

| Endpoint | Description |
|----------|-------------|
| `GET /track/:id` | Get track by ID |

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

The server runs at `http://localhost:3000` by default.

### Example Requests

```bash
# Search for an artist
curl "http://localhost:3000/search?q=daft+punk&limit=5"

# Get a specific track
curl "http://localhost:3000/track/3135556"

# Get top charts
curl "http://localhost:3000/chart/tracks?limit=10"
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

Your function will be available at:
```
https://<deployment-id>.<region>.appwrite.run
```

## Rate Limiting

- **Limit:** 100 requests per minute per IP
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Exceeded:** Returns `429 Too Many Requests` with `Retry-After` header

## Project Structure

```
src/
├── index.ts              # Entry point (Appwrite handler)
├── app.ts                # Hono application
├── adapters/
│   └── appwrite.ts       # Appwrite-to-Hono bridge
├── lib/
│   ├── deezer.ts         # Deezer API client
│   └── validation.ts     # Zod schemas
├── middleware/
│   └── rateLimiter.ts    # Rate limiting
└── routes/
    ├── search.ts
    ├── track.ts
    ├── album.ts
    ├── artist.ts
    ├── playlist.ts
    ├── chart.ts
    ├── radio.ts
    ├── genre.ts
    └── editorial.ts
```

## License

MIT
