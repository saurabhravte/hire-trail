# HireTrail

A web app to track job applications, with custom features.

> **Status: under development.** Features, structure, and APIs may change.

## Tech Stack

**Client**
- React 19 + TypeScript v4
- Vite
- Tailwind CSS + ShandCN
- shadcn/ui (Radix UI + Base UI)
- Lucide icons
- Recharts / ECharts for charts
- Shiki for code highlighting

**Server**
- Node.js / Bun + TypeScript
- Express 5
- PostgreSQL 16 (via Docker)
- Drizzle ORM
- Zod for env/validation
- Clerk (authentication)

**Tooling**
- Bun workspaces (single install and scripts from the root)
- concurrently (run client and server together)

## Folder Structure

```
hire-trail/
├── client/                 # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── providers/  # Theme provider
│       │   └── ui/         # shadcn/ui components
│       ├── hooks/
│       ├── lib/
│       ├── App.tsx
│       ├── index.css
│       └── main.tsx
├── server/                 # Express backend
│   ├── src/
│   │   ├── common/
│   │   │   ├── config/     # Env validation
│   │   │   ├── db/         # Drizzle + Postgres connection
│   │   │   ├── middleware/ # Error handling
│   │   │   └── utils/      # ApiError and helpers
│   │   ├── modules/        # Feature modules (coming soon)
│   │   └── app.ts          # Express app setup
│   ├── docker-compose.yml  # Local Postgres
│   ├── drizzle.config.ts
│   └── server.ts           # Server entry point
├── package.json            # Root workspace and scripts
└── README.md
```

## Getting Started

### Prerequisites
- [Bun](https://bun.sh)
- [Docker](https://www.docker.com) (for the local database)

### Setup

1. Install dependencies from the root:
   ```bash
   bun install
   ```

2. Create `server/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/hiretrail
   ```

3. Start the database:
   ```bash
   bun run db:up
   ```

4. Start the client and server together:
   ```bash
   bun run dev
   ```

- Client: http://localhost:5173
- Server: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Scripts (run from the root)

| Command | Description |
|---|---|
| `bun run dev` | Run client and server together |
| `bun run dev:client` | Run client only |
| `bun run dev:server` | Run server only |
| `bun run build` | Build server and client |
| `bun run lint` | Lint the client |
| `bun run typecheck` | Type-check the server |
| `bun run db:up` / `db:down` | Start / stop Postgres in Docker |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply Drizzle migrations |
| `bun run db:studio` | Open Drizzle Studio |

