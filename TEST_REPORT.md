# Test Report — HireTrail

## Tooling

| Layer | Stack |
|---|---|
| Frontend unit/component | Vitest · React Testing Library · jsdom · MSW |
| Backend | Vitest · Supertest |
| E2E | Playwright (desktop + mobile) |

## How to run

```bash
bun run test            # client + server unit tests
bun run test:coverage   # client coverage (text + html + lcov)
cd client && bun run test:e2e
```

## Tests added

### Frontend
- `config/greetings.test.ts` — B13 time-window boundaries (04:59, 05:00, 08:59, 09:00, 11:59, 12:00, 16:59, 17:00, 20:59, 21:00, 23:59, 00:00); variant count per window.
- `features/dashboard/hooks/use-greeting.test.ts` — name usage; `"there"` fallback; never renders `undefined`; updates across a boundary with fake timers.
- `config/greetings-component.test.tsx` — WelcomeCard skeleton while loading; greeting render; dismiss writes the per-user session flag.
- `components/shared/not-found.test.tsx` — 404 copy + both CTAs.
- `features/applications/schemas/application-form.schema.test.ts` — required company/role; applied-date required only when submitted; optional fields blank-ok; salary min/max; URL validation.

### Backend
- `src/__tests__/health.test.ts` — `GET /api/health` returns 200 `{status, time}` with DB stubbed.

### E2E (Playwright)
- `e2e/smoke.spec.ts` — sign in → welcome card appears → dismiss → stays hidden across navigation → add job → ⌘K search → log out. Runs on desktop and a mobile viewport. Skips automatically without Clerk test credentials.

## Coverage

Run `bun run test:coverage` to generate `client/coverage/` (text summary + HTML + lcov).

Target: **≥ 80% on critical logic** (greetings, form schema, API client error paths, auth bridge). The harness and the mandated B13 suite are complete; broadening to every screen is in progress — see gaps below.

## Known gaps / remaining

- **Coverage breadth** — representative suites are in place; the full Add-Job UI form test, auth-flow component tests, and per-screen Section-D state tests still need authoring against the running harness.
- **E2E auth** — requires Clerk Testing Tokens and a seeded test user (env-driven); specs skip when absent.
- **Iconoir migration** — app-level/layout UI migrated; shadcn `components/ui/*` primitives still import Lucide in places (tracked as a chore).