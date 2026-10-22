

<div align="center">

# HireTrail

### Take control of your job search.

**A centralized workspace to track job applications, manage interviews and follow ups and measure your job search progress.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)

**[Live Application](https://hire-trail-jobs.vercel.app/)**

</div>

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Application Workflow](#application-workflow)
* [Technology Stack](#technology-stack)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Development Scripts](#development-scripts)
* [API Overview](#api-overview)
* [Deployment](#deployment)
* [Security](#security)
* [Future Improvements](#future-improvements)
* [Author](#author)

---

## Overview

Searching for a job involves managing multiple companies, application deadlines, interview schedules, resume versions and follow ups. Keeping track of everything across spreadsheets and different platforms can quickly become difficult.

**HireTrail** is a full stack job application tracker that brings these activities into one organized workspace.

It allows job seekers to maintain application records, monitor recruitment progress, schedule interviews, manage follow up tasks, organize resumes and compare offers. Its dashboard and analytics help users understand their job search activity and identify areas for improvement.

The objective is simple: **make every application easier to manage and every step of the job search easier to measure.**

## Features

| Area | Capabilities |
| :--- | :--- |
| **Application Tracking** | Centralized application records with status management and detailed job information |
| **Search and Organization** | Search, filtering, sorting and company based grouping |
| **Dashboard** | Application metrics, recruitment progress and job search activity |
| **Analytics** | Response rates, conversion metrics and breakdowns by role, platform and resume |
| **Interview Management** | Interview scheduling, calendar views and reminders |
| **Tasks and Follow Ups** | Due dates, upcoming tasks and overdue follow ups |
| **Resume Management** | Multiple resume versions with private document storage |
| **Offer Comparison** | Compensation tracking with currency and pay period details |
| **Company Management** | Company records and recruiter contact information |
| **Data Portability** | CSV import and export plus personal data export in JSON |
| **Responsive Interface** | Layouts and interaction states designed for different screen sizes |
| **Authentication** | Secure sign in and protected application data |

### Application Management

Keep important job details together in one place.

* Company name and job title
* Salary or compensation range
* Job location and work mode
* Technology stack and job platform
* Application date and current status
* Search, filtering and sorting for quick access

Application statuses cover the recruitment journey from saved opportunities to applications, interviews, offers and final outcomes.

### Dashboard and Analytics

Understand your progress without reviewing every application individually.

* Overview of submitted applications and active opportunities
* Interview and offer metrics
* Application activity over time
* Recruitment conversion rates
* Breakdowns by platform, resume version, role and technology stack

### Interviews and Follow Ups

Stay prepared throughout the recruitment process with interview scheduling, calendar views, reminders and follow up tasks.

### Resumes and Offers

Organize different resume versions and associate them with applications. Record compensation details and compare offers while accounting for differences in currency and pay period.

### Data Management

Import applications from CSV files with validation and duplicate detection. Export application records to CSV or export personal data in JSON format.

---

## Application Workflow

HireTrail organizes the job search around a simple process.

```text
Discover an Opportunity
          |
          v
    Save the Job
          |
          v
   Submit Application
          |
          v
   Track Application
          |
          v
   Manage Interviews
          |
          v
    Review the Offer
          |
          v
  Accept or Close
```

Applications can also be rejected, withdrawn or marked as no longer receiving a response. This makes it possible to maintain a more complete record of the job search.

---

## Technology Stack

### Frontend

| Technology | Purpose |
| :--- | :--- |
| React 19 | Component based user interface |
| TypeScript | Type safety |
| Vite | Development and production builds |
| TanStack Router | Client side routing |
| TanStack Query | Server state and API data fetching |
| Tailwind CSS | Styling and responsive layouts |
| shadcn/ui | Reusable interface components |
| React Hook Form | Form state management |
| Zod | Schema validation |
| Recharts | Charts and analytics |
| Motion | Interface animations |

### Backend and Database

| Technology | Purpose |
| :--- | :--- |
| Bun | Workspace scripts and dependency management |
| Express 5 | REST API |
| TypeScript | Backend implementation |
| PostgreSQL | Relational data storage |
| Drizzle ORM | Database access and schema management |
| Zod | Request and environment validation |
| Helmet | HTTP security headers |
| CORS | Cross origin request configuration |

### Authentication and Infrastructure

| Technology | Purpose |
| :--- | :--- |
| Clerk | Authentication and session verification |
| ImageKit | Private resume and document storage |
| Neon | Hosted PostgreSQL database |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| Docker | Local database environment |

### Testing and Quality

| Technology | Purpose |
| :--- | :--- |
| Vitest | Automated tests |
| React Testing Library | UI component tests |
| MSW | API request mocking |
| Playwright | Browser based end to end tests |
| ESLint | Code quality checks |
| GitHub Actions | Workflow automation |

---

## Architecture

HireTrail follows a monorepo architecture with separate frontend and backend workspaces.

The React application communicates with the Express REST API through versioned endpoints. Clerk provides authentication while the backend protects application routes. Drizzle ORM manages access to PostgreSQL and ImageKit provides private document storage.

```text
                    HireTrail
                        |
             +----------+----------+
             |                     |
             v                     v
        Web Client              REST API
      React + TypeScript    Express + TypeScript
             |                     |
             |              Clerk Middleware
             |                     |
             +----------+----------+
                        |
                        v
                   PostgreSQL
                  Drizzle ORM
                        |
              +---------+---------+
              |                   |
              v                   v
         Clerk Auth          ImageKit
                            File Storage
```

### Design Principles

* **Centralized application data:** Keep job search information organized in one workspace.
* **Separation of concerns:** Maintain independent frontend and backend workspaces.
* **Type safety:** Use TypeScript and Zod to improve consistency and validate data.
* **Protected access:** Authenticate users before allowing access to private application data.
* **Maintainability:** Use reusable components and modular backend routes.
* **Data portability:** Provide export options for personal application records.

---

## Project Structure

```text
hire-trail/
|
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- features/
|   |   |-- routes/
|   |   |-- lib/
|   |   `-- main.tsx
|   |-- package.json
|   `-- vercel.json
|
|-- server/
|   |-- src/
|   |   |-- common/
|   |   |-- modules/
|   |   |-- app.ts
|   |   `-- index.ts
|   |-- package.json
|   `-- drizzle.config.ts
|
|-- package.json
|-- bun.lock
`-- README.md
```

The `client` workspace contains the user interface and frontend application logic. The `server` workspace contains API routes, authentication middleware, database access and backend services.

---

## Getting Started

### Prerequisites

Install or configure the following before running the project locally.

* [Bun](https://bun.sh/)
* [Node.js](https://nodejs.org/) where required by your local tooling
* A PostgreSQL database through [Neon](https://neon.tech/) or a local installation
* A [Clerk](https://clerk.com/) application
* An [ImageKit](https://imagekit.io/) account

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd hire-trail
```

Replace the placeholder with your GitHub repository URL.

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment Variables

Create the required environment files for the client and server.

For the frontend create `client/.env.local`.

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

For the backend create `server/.env`.

```env
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173

DATABASE_URL=your_postgresql_connection_string

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Use the correct credentials from each provider. The Clerk keys must belong to the same Clerk instance.

Never commit environment files or expose server side secrets in the frontend.

### 4. Set Up the Database

Configure `DATABASE_URL` with your PostgreSQL connection string.

Generate migrations when required by schema changes.

```bash
bun run db:generate
```

Apply the migrations.

```bash
bun run db:migrate
```

### 5. Run the Application

Start both workspaces from the repository root.

```bash
bun run dev
```

To run them independently use:

```bash
bun run dev:client
```

```bash
bun run dev:server
```

### Local Development URLs

| Service | Address |
| :--- | :--- |
| Frontend | `http://localhost:5173` |
| Backend health check | `http://localhost:4000/health` |
| API base path | `http://localhost:4000/api/v1` |

---

## Environment Variables

| Variable | Workspace | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Client | Base URL for the versioned backend API |
| `VITE_CLERK_PUBLISHABLE_KEY` | Client | Public Clerk publishable key |
| `NODE_ENV` | Server | Runtime environment |
| `PORT` | Server | Backend listening port |
| `CLIENT_URL` | Server | Allowed frontend origin |
| `DATABASE_URL` | Server | PostgreSQL connection string |
| `CLERK_PUBLISHABLE_KEY` | Server | Clerk publishable key for server configuration |
| `CLERK_SECRET_KEY` | Server | Private Clerk server credential |
| `IMAGEKIT_PUBLIC_KEY` | Server | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | Server | Private ImageKit credential |
| `IMAGEKIT_URL_ENDPOINT` | Server | ImageKit URL endpoint |

The frontend API URL must end in `/api/v1`. The `CLIENT_URL` setting must match the deployed frontend origin without a trailing slash or additional path.

---

## Development Scripts

Run these commands from the repository root.

| Command | Description |
| :--- | :--- |
| `bun run dev` | Start client and server |
| `bun run dev:client` | Start the client |
| `bun run dev:server` | Start the server |
| `bun run build` | Build both workspaces |
| `bun run build:client` | Build the client |
| `bun run build:server` | Build the server |
| `bun run lint` | Run frontend lint checks |
| `bun run typecheck` | Run backend type checking |
| `bun run test` | Run client and server tests |
| `bun run test:coverage` | Run frontend tests with coverage |
| `bun run db:generate` | Generate database migrations |
| `bun run db:migrate` | Apply database migrations |
| `bun run db:studio` | Open the configured database studio |
| `bun run db:up` | Start the local database using Docker Compose |
| `bun run db:down` | Stop the local database |
| `bun run db:seed` | Run the database seed script |

---

## API Overview

The backend exposes REST endpoints under `/api/v1`.

| Endpoint | Responsibility |
| :--- | :--- |
| `/api/v1/applications` | Job application records |
| `/api/v1/analytics` | Job search metrics |
| `/api/v1/interviews` | Interview scheduling |
| `/api/v1/tasks` | Tasks and follow ups |
| `/api/v1/resumes` | Resume management |
| `/api/v1/offers` | Compensation and offers |
| `/api/v1/companies` | Company information |
| `/api/v1/platforms` | Job platform information |
| `/api/v1/me` | Current user operations |

Protected routes require authentication. The backend also provides `/health` and `/api/health` endpoints for health checks.

---

## Deployment

HireTrail uses separate deployments for the frontend and backend.

### Frontend

**Platform:** [Vercel](https://vercel.com/)

* Configure the client workspace as the project root.
* Set `VITE_API_BASE_URL` to the deployed backend URL ending in `/api/v1`.
* Set `VITE_CLERK_PUBLISHABLE_KEY` to the appropriate production key.
* Redeploy after changing frontend environment variables.

### Backend

**Platform:** [Render](https://render.com/)

* Configure the server workspace and its build and start commands.
* Set the required database, Clerk and ImageKit environment variables.
* Set `CLIENT_URL` to the deployed frontend origin.
* Apply database migrations and verify the health endpoint.

### Live Application

Access the deployed application at:

**[https://hire-trail-jobs.vercel.app/](https://hire-trail-jobs.vercel.app/)**

---

## Security

HireTrail incorporates several measures to protect application data.

* Clerk authentication and protected backend routes
* Environment validation using Zod
* HTTP security headers through Helmet
* Configured cross origin access controls
* API rate limiting
* Private document storage and signed download links
* Server side storage of private credentials

Do not publish secret keys, database credentials or private storage credentials in source code or public repository files.

---

## Future Improvements

Potential areas for further development include:

* Enhanced job discovery and application insights
* More detailed interview preparation tools
* Additional analytics and reporting options
* Expanded application reminders and workflow automation

These are possible future enhancements rather than a guarantee that they are currently implemented.

---

## Author

**Saurabh Ravte**

[GitHub](https://github.com/SaurabhRavte)

[LinkedIn](https://www.linkedin.com/in/saurabh-ravte/)

---

<div align="center">

**HireTrail**

*Organize your applications. Track your progress. Move forward with clarity.*

[Open HireTrail](https://hire-trail-jobs.vercel.app/)

</div>