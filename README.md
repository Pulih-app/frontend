# Pulih Frontend

Next.js PWA for Pulih, a recovery support platform with psychologist consultation booking. It provides patient and psychologist screens for auth, onboarding, recovery tracking, education, community, AI coach, emergency support, profile, psychologist sessions, and consultation booking flows.

## Table of Contents

- [Overview](#overview)
- [Platform Context](#platform-context)
- [Service Boundary](#service-boundary)
- [Screens](#screens)
- [API Integration](#api-integration)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment](#environment)
- [Scripts](#scripts)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Demo Flow](#demo-flow)
- [Deployment](#deployment)
- [Security](#security)
- [Contribution](#contribution)

## Overview

Pulih Frontend renders mobile-first PWA experiences for patients and psychologists. It stores access tokens in browser storage, calls Pulih API REST endpoints, and keeps provider-specific work behind the backend.

Core capabilities:

- Patient login and registration.
- Psychologist login, registration, and onboarding.
- Patient onboarding and recovery goal setup.
- Daily check-in, relapse support, emergency guidance, and statistics.
- Education and help center surfaces.
- AI coach chat.
- Community post browsing, detail, and creation.
- Psychologist directory, consultation detail, and booking screens.
- Patient profile management.
- Psychologist home, profile, session, pricing, schedule, and chat screens.
- PWA manifest and install-friendly metadata.

## Platform Context

| Component         | Responsibility                                                         |
| ----------------- | ---------------------------------------------------------------------- |
| Pulih Frontend    | Patient/psychologist UI, browser navigation, client-side state         |
| Pulih API         | Auth, validation, workflows, persistence, integrations, REST contracts |
| Supabase Postgres | Durable relational data store, accessed only through Pulih API         |
| Pakasir           | Payment simulation/status, accessed only through Pulih API             |
| Resend            | Transactional emails, accessed only through Pulih API                  |
| SumoPod AI        | AI coach responses, accessed only through Pulih API                    |
| Cloudflare R2     | Credential files, accessed only through Pulih API                      |

Frontend should call Pulih API only. It should not call DB, payment, email, AI, or storage providers directly.

## Service Boundary

Pulih Frontend owns:

- Page rendering and navigation.
- Form input collection and basic client-side validation.
- Browser session token storage.
- Mobile-first layout and PWA metadata.
- Calling Pulih API endpoints and showing API messages.

Pulih Frontend does not own:

- Auth verification, roles, or ownership rules.
- Payment provider verification.
- Email delivery.
- AI safety policy enforcement.
- Database access.
- Credential storage access.
- Admin UI/API for MVP.

## Screens

| Area         | Routes                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------ |
| Auth         | `/`, `/register`, `/login/psikolog`, `/register/psikolog`                                  |
| Patient      | `/home`, `/profile`, `/daily-checkin`, `/relapse`, `/stats`, `/education`, `/emergency`    |
| Onboarding   | `/onboarding/*`                                                                            |
| Help         | `/help`, `/help/coach`, `/help/community`, `/help/consultation`                            |
| Consultation | `/help/consultation/[id]`, `/help/consultation/bookings`                                   |
| Community    | `/help/community`, `/help/community/[id]`, `/help/community/create`                        |
| Psychologist | `/psikolog/home`, `/psikolog/profile`, `/psikolog/sessions`, `/psikolog/practice-schedule` |
| Psychologist | `/psikolog/setup-pricing`, `/psikolog/session-detail`, `/psikolog/chat`                    |
| Legal        | `/privacy`                                                                                 |

## API Integration

Default local API base URL:

```text
http://localhost:3002
```

Default API prefix:

```text
/api/v1
```

Expected response envelope:

```json
{
  "success": true,
  "message": "Request processed successfully",
  "data": {},
  "meta": null
}
```

Auth token storage key:

```text
auth_token
```

## Tech Stack

| Area            | Choice              |
| --------------- | ------------------- |
| Framework       | Next.js 16          |
| Language        | TypeScript          |
| UI runtime      | React 19            |
| Styling         | Tailwind CSS 4      |
| Icons           | Lucide React        |
| PWA             | Next PWA + manifest |
| Package manager | npm                 |
| Linting         | ESLint 9            |

## Getting Started

Install deps:

```bash
npm install
```

Create local env:

```bash
cp .env.example .env.local
```

If `.env.example` does not exist yet, create `.env.local` manually using variables from [Environment](#environment).

Start dev server:

```bash
npm run dev
```

Open app:

```text
http://localhost:3000
```

Run Pulih API separately, usually on:

```text
http://localhost:3002
```

## Environment

Important files:

| File           | Purpose                        |
| -------------- | ------------------------------ |
| `.env.local`   | Local frontend env, gitignored |
| `.env.example` | Safe template when available   |

Variables:

| Variable                   | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Pulih API base URL, for example `http://localhost:3002` |
| `NEXT_PUBLIC_API_TOKEN`    | Optional local fallback token for development only      |

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
# NEXT_PUBLIC_API_TOKEN=
```

Never commit real tokens or private credentials. `NEXT_PUBLIC_*` variables are exposed to browsers.

## Scripts

| Script          | Purpose                 |
| --------------- | ----------------------- |
| `npm run dev`   | Start Next dev server   |
| `npm run build` | Build production app    |
| `npm run start` | Start production server |
| `npm run lint`  | Run ESLint              |

## Testing

Fast local verification:

```bash
npm run lint
npm run build
```

Manual smoke checks:

1. Login/register patient.
2. Complete onboarding path.
3. Open home, check-in, relapse, stats, education, emergency.
4. Open AI coach and community screens.
5. Browse consultation/psychologist screens.
6. Login/register psychologist.
7. Open psychologist home, profile, schedule, pricing, sessions, chat.

## Project Structure

```text
.
|-- app/                         # Next App Router pages, layout, manifest, global CSS
|   |-- help/                    # Help, AI coach, community, consultation screens
|   |-- onboarding/              # Patient onboarding flow
|   |-- psikolog/                # Psychologist workspace screens
|   `-- ...
|-- components/                  # Shared UI components
|-- lib/                         # Client-side stores/helpers
|-- public/                      # Static assets and icons
|-- eslint.config.mjs
|-- next.config.ts
|-- package.json
|-- package-lock.json
|-- postcss.config.mjs
`-- tsconfig.json
```

UI conventions:

| Area       | Convention                                  |
| ---------- | ------------------------------------------- |
| Layout     | Mobile-first, centered max-width shell      |
| Routes     | App Router directories under `app/`         |
| Components | Shared reusable UI under `components/`      |
| Assets     | Static images under `public/assets/`        |
| API calls  | Browser `fetch` to Pulih API                |
| Auth       | Bearer token from `localStorage.auth_token` |

## Demo Flow

1. Patient registers/logs in.
2. Patient completes onboarding.
3. Patient opens recovery home.
4. Patient records check-in or relapse.
5. Patient opens education, stats, emergency support, AI coach, or community.
6. Patient browses consultation/psychologist screens.
7. Patient creates or views bookings where available.
8. Psychologist registers/logs in.
9. Psychologist completes onboarding/profile flow.
10. Psychologist manages schedule/pricing/sessions.
11. Psychologist opens chat/session detail screens.

## Deployment

Build:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

Deployment expectations:

- Build from committed source and `package-lock.json`.
- Provide `NEXT_PUBLIC_API_BASE_URL` through deployment env.
- Keep staging/prod API URLs separate.
- Do not expose private API keys through `NEXT_PUBLIC_*` variables.
- Confirm PWA manifest assets exist under `public/assets/`.

## Security

Pulih handles sensitive mental-health and consultation data.

Rules:

- Never commit `.env.local`, real tokens, API keys, or private credentials.
- Treat `NEXT_PUBLIC_*` values as public browser-visible config.
- Do not log passwords, tokens, raw journals, relapse triggers, sensitive AI prompts, credential content, or meet links.
- Do not call DB, payment, email, AI, or storage providers directly from frontend.
- Preserve backend auth/ownership checks; frontend checks are UX only.
- Keep patient and psychologist flows separated by role-aware navigation.
- Use HTTPS in deployed environments.

## Contribution

Before changing behavior:

- Read relevant Pulih API docs/contracts for touched flow.
- Inspect existing route/component patterns.
- Keep changes small and scoped.
- Preserve English user-facing API error messages from backend where shown.
- Add/update docs when env vars, setup, routes, or workflows change.
- Avoid unrelated formatting or cleanup.

Before handoff:

```bash
npm run lint
npm run build
```

Run narrower checks for small changes, but document skipped verification.
