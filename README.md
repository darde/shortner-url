# Taller URL Shortener

A full-stack URL shortener built with **Node.js + Express**, **PostgreSQL + Prisma**, and a **React + Tailwind CSS** frontend. Deployable to Vercel with a single configuration file.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 3 |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL 16 (via Prisma ORM) |
| Local DB | Docker Compose |
| Deployment | Vercel (serverless functions) |

## Project Structure

```
taller-url-shortner/
├── backend/
│   ├── api/
│   │   └── index.js          # Express app — Vercel serverless handler
│   ├── src/
│   │   ├── db.js             # Prisma client singleton (serverless-safe)
│   │   └── routes/
│   │       └── urls.js       # API routes
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ShortenForm.jsx
│   │   │   └── UrlTable.jsx
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml        # PostgreSQL + backend + frontend
├── vercel.json               # Vercel build & routing config
└── .env.example
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/shorten` | Create a short URL — body: `{ originalUrl }` |
| `GET` | `/api/urls` | List all short URLs |
| `DELETE` | `/api/urls/:alias` | Delete a short URL |
| `GET` | `/:alias` | Redirect to the original URL (increments click count) |

## Running Locally

### Option A — Docker (recommended, one command)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
docker compose up --build
```

This starts three containers in the correct order:

1. **postgres** — PostgreSQL 16 on port `5432`
2. **backend** — runs `prisma db push` then starts Express on port `3001`
3. **frontend** — Vite dev server on port `3000`

Open **http://localhost:3000**.

To stop: `docker compose down`  
To stop and wipe the database: `docker compose down -v`

### Option B — Manual (two terminals)

**Prerequisites:** Node.js 20+, a running PostgreSQL instance (local or [Neon](https://neon.tech)).

```bash
# 1. Install backend dependencies
cd backend && npm install

# 2. Set up environment variables
cp .env.example backend/.env
# Edit backend/.env and set DATABASE_URL

# 3. Push schema to the database
npm run db:push

# Terminal 1 — backend
npm run dev:backend   # http://localhost:3001

# Terminal 2 — frontend
cd frontend && npm install && npm run dev   # http://localhost:3000
```

## Environment Variables

Create `backend/.env` (see `.env.example` for reference):

```env
# Local Docker
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/urlshortener

# Neon (production / cloud dev)
# DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
```

## Deploying to Vercel

1. Push this repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the `DATABASE_URL` environment variable pointing to a managed PostgreSQL provider (e.g. [Neon](https://neon.tech))
4. Deploy — Vercel reads `vercel.json` automatically

The `vercel.json` configuration:
- Builds the React app from `frontend/`
- Serves the static output from `frontend/dist/`
- Routes `/api/*` and `/:alias` to the Express serverless function in `backend/api/`

## Useful Scripts

From the project root:

```bash
npm run dev:backend     # Start Express server
npm run dev:frontend    # Start Vite dev server
npm run db:up           # docker compose up -d (start DB only)
npm run db:down         # docker compose down
npm run db:push         # prisma db push (sync schema)
npm run db:studio       # Open Prisma Studio
```
