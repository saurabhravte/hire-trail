# HireTrail

A job-application tracker for job seekers. Capture every opportunity, track applications through interviews to offers, manage follow-ups and resume versions, compare offers side by side, and see what's actually working — all in one focused workspace.

> **Status:** active development.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [Running the app](#running-the-app)
- [Scripts](#scripts)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Keep-alive job](#keep-alive-job)
- [Security](#security)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **Applications workspace** — fast, server-backed table with debounced search (company, role, status), stacked filters, column sorting, bulk archive/delete, grouping by company, and a card layout on mobile.
- **Dashboard** — KPI cards (submitted, active, interviews, offers), an Applied → Interview → Offer → Accepted funnel, weekly goal progress, upcoming interviews, and a time-aware welcome greeting.
- **Interviews & calendar** — schedule rounds against any application in the correct timezone; month, week and agenda views; in-app reminders.
- **Tasks & reminders** — follow-up tasks with due dates, upcoming/overdue views, de-duplicated notifications.
- **Resumes** — multiple resume versions with private storage and short-lived signed download links.
- **Offers** — record compensation with its own currency and pay period; compare offers side by side with clear warnings when currencies or periods differ.
- **Companies & contacts** — company records with recruiter contacts, created automatically as you add applications.
- **Analytics** — response/interview/offer/acceptance rates (saved jobs excluded, sample sizes shown), an activity graph by day/week/month, and breakdowns by platform, resume version, role and tech stack.
- **Import / export** — validated CSV import with a preview and duplicate detection; CSV export; full personal-data JSON export; account deletion.
- **Resilient UX** — empty, loading (skeletons), error (retry), offline, slow-network, no-results, 403, and 401 (session-expired) states; a global error boundary; a branded 404 and loading screen.

---

## Tech stack

**Frontend**
- React 19 + TypeScript, Vite
- TanStack Router (file-based) + TanStack Query
- Tailwind CSS v4 + shadcn/ui
- Iconoir icons, Motion (animations)
- React Hook Form + Zod
- Recharts

**Backend**
- Bun + Express 5 (TypeScript)
- PostgreSQL 16 + Drizzle ORM
- Zod validation, Helmet, CORS, rate limiting
- ImageKit (private file storage)

**Auth**
- Clerk (frontend components + backend verification)

**Tooling**
- Bun workspaces, Docker (local Postgres)
- Vitest + React Testing Library + MSW, Playwright
- GitHub Actions (CI, deploy, keep-alive)

---

## Architecture

A Bun monorepo with two workspaces: