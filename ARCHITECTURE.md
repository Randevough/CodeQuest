# CodeQuest — Architecture Documentation

> **Last updated:** 2026-07-04  
> **Purpose:** Complete architectural reference for developers and AI agents. Every claim cites a real file path.  
> **Rule:** If something is unclear, it is marked `NEEDS CONFIRMATION` — never fabricated.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Getting Started](#2-getting-started)
3. [Repository Structure](#3-repository-structure)
4. [Tech Stack & Dependencies](#4-tech-stack--dependencies)
5. [Data Model & Schema](#5-data-model--schema)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Request Lifecycle](#7-request-lifecycle)
8. [Module Reference](#8-module-reference)
   - 8.1 [Server Actions (Business Logic)](#81-server-actions-business-logic)
   - 8.2 [App Router Pages & Layouts](#82-app-router-pages--layouts)
   - 8.3 [Components](#83-components)
   - 8.4 [Shared Utilities (lib/)](#84-shared-utilities-lib)
   - 8.5 [Type Definitions](#85-type-definitions)
9. [API Reference](#9-api-reference)
10. [Cross-Cutting Concerns](#10-cross-cutting-concerns)
11. [Glossary](#11-glossary)
12. [Open Questions & Recommendations](#12-open-questions--recommendations)

---

## 1. Overview

**CodeQuest** is a gamified collaboration platform that transforms development tasks into engaging challenges ("Quests") for developer communities and student clubs. Users browse a Quest Board, "snatch" quests they want to work on, submit their work, and receive admin review. Points and badges are awarded for completed quests.

### Architecture Style

- **Fullstack Next.js 16 (App Router)** — single project, NOT a monorepo
- **Server-first:** React Server Components for data fetching; Server Actions (`'use server'`) for all mutations
- **No REST API** (except NextAuth catch-all); all business logic lives in `src/actions/`
- **PostgreSQL** (Supabase) via **Prisma ORM** for data persistence
- **Credentials-only auth** (NextAuth v5 beta) — domain-restricted to `@cyber-univ.ac.id`

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│  React Client Components ←→ Server Components (RSC)     │
└──────────────┬──────────────────────────┬───────────────┘
               │ Page Request             │ Form Submit / Action
               ▼                          ▼
┌──────────────────────┐    ┌─────────────────────────────┐
│  Next.js Middleware   │    │    Server Actions            │
│  (auth.config.ts)     │    │    src/actions/*.ts          │
│  Route protection     │    │    'use server' functions    │
└──────────┬───────────┘    └──────────┬──────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────────────────────────────────────────────┐
│              Prisma ORM (src/lib/db.ts)                  │
│              $transaction, findMany, create, etc.        │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│          PostgreSQL (Supabase)                            │
│          6 tables: User, Quest, Snatch, Penalty,         │
│                    Account, Badge, UserBadge              │
└──────────────────────────────────────────────────────────┘

External Services:
  • Vercel Blob  — Avatar file storage (src/actions/profile.ts)
  • Dicebear API — Fallback avatar generation (src/actions/user.ts)
  • Google Fonts  — Plus Jakarta Sans, Inter, Material Symbols
```

---

## 2. Getting Started

### Prerequisites

- Node.js (compatible with Next.js 16)
- npm (lockfile: `package-lock.json`)
- PostgreSQL database (or Supabase project)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Copy/create .env with these variables:
#   DATABASE_URL     — Postgres connection string (PgBouncer transaction mode)
#   DIRECT_URL       — Postgres connection string (session mode, for migrations)
#   AUTH_SECRET       — NextAuth JWT signing secret (generate with `openssl rand -hex 16`)
#   BLOB_READ_WRITE_TOKEN — Vercel Blob token (optional, for avatar upload)

# 3. Push schema to database
npx prisma db push

# 4. Generate Prisma client
npx prisma generate

# 5. Seed admin user
npx tsx prisma/seed.ts

# 6. Seed badges
npx tsx prisma/seed_badges.ts

# 7. Run development server
npm run dev
# → http://localhost:3000
```

### Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start dev server |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Run ESLint |

> **Note:** No `test`, `seed`, or `prisma:generate` scripts are defined in `package.json`. Seeds are run manually with `npx tsx`.

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Supabase Postgres (PgBouncer transaction mode, port 6543) |
| `DIRECT_URL` | Yes | Supabase Postgres (session mode, port 5432 — for migrations) |
| `AUTH_SECRET` | Yes | NextAuth JWT signing secret |
| `BLOB_READ_WRITE_TOKEN` | Optional | Vercel Blob storage token for avatar uploads |

Validated at startup by Zod schema in `src/env.ts`.

---

## 3. Repository Structure

```
CodeQuest/
├── prisma/
│   ├── schema.prisma          # 6-model database schema (PostgreSQL)
│   ├── seed.ts                # Seeds admin user (codequest@cyber-univ.ac.id)
│   ├── seed_badges.ts         # Seeds 14 badge definitions
│   ├── cleanup.ts             # DB cleanup utility
│   └── dev.db                 # ⚠️ Legacy SQLite file (unused since Postgres migration)
│
├── public/
│   ├── badges/                # SVG badge assets referenced by Badge.imageUrl
│   ├── favicon.ico, icon.png  # App icons
│   └── *.svg                  # Static SVG assets
│
├── scripts/                   # Utility scripts (gitignored)
│   ├── check_quest_status.ts
│   ├── debug_snatches.ts
│   ├── debug_user_stats.ts
│   ├── delete_drafts.ts
│   ├── generate_badge_assets.js
│   └── migrate_quests_active.ts
│
├── src/
│   ├── app/                   # ── NEXT.JS APP ROUTER ──
│   │   ├── layout.tsx         # Root layout: Providers, fonts, Toaster, theme script
│   │   ├── page.tsx           # Home page: Quest Board + Active Missions
│   │   ├── globals.css        # Tailwind directives + custom CSS (crosshair, glass, scrollbar)
│   │   ├── custom-auth.css    # Auth page custom styles
│   │   │
│   │   ├── (auth)/            # Route group — shared auth layout (split-screen)
│   │   │   ├── layout.tsx     # Left: form area, Right: decorative terminal
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   │
│   │   ├── admin/             # Admin area (role-protected)
│   │   │   ├── layout.tsx     # Admin shell: sidebar + auth check
│   │   │   ├── page.tsx       # Dashboard: stats, charts, leaderboard
│   │   │   ├── manage-quests/
│   │   │   │   ├── page.tsx   # Quest list with filters, status toggles, delete
│   │   │   │   ├── create/page.tsx  # Quest creation form
│   │   │   │   ├── loading.tsx      # Skeleton loader (only loading.tsx in app)
│   │   │   │   └── QuestActions.tsx # Inline quest actions (duplicate, edit modal)
│   │   │   ├── members/page.tsx     # User management table
│   │   │   └── submissions/page.tsx # Submission review queue
│   │   │
│   │   ├── api/auth/[...nextauth]/route.ts  # NextAuth HTTP handler
│   │   │
│   │   ├── leaderboard/page.tsx    # Global leaderboard with pagination
│   │   ├── quests/[id]/page.tsx    # Quest detail page (24KB, complex)
│   │   ├── profile/
│   │   │   ├── page.tsx            # Own profile (protected)
│   │   │   └── [id]/page.tsx       # Public profile view
│   │   └── workspace/page.tsx      # My snatched quests (protected)
│   │
│   ├── actions/               # ── SERVER ACTIONS (BUSINESS LOGIC) ──
│   │   ├── quest.ts           # 692 lines — Quest CRUD + join/drop/submit/archive
│   │   ├── submission.ts      # Admin submission review
│   │   ├── admin.ts           # User management (role, delete, deactivate, penalty reset)
│   │   ├── admin-dashboard.ts # Dashboard stats aggregation (30-day trends, distribution)
│   │   ├── auth.ts            # Login & signup with rate limiting
│   │   ├── profile.ts         # Profile edit, avatar upload, featured badges
│   │   └── user.ts            # Leaderboard queries, seed users, user standing
│   │
│   ├── components/            # ── REACT COMPONENTS ──
│   │   ├── Header.tsx         # Global nav bar (13KB)
│   │   ├── QuestCard.tsx      # Quest card for board display
│   │   ├── QuestSearch.tsx    # Search + filter bar (client component)
│   │   ├── QuestAction.tsx    # Snatch/Drop/Submit buttons
│   │   ├── QuestTimer.tsx     # Deadline countdown
│   │   ├── Pagination.tsx     # URL-based pagination
│   │   ├── LoginToast.tsx     # Welcome toast on login redirect
│   │   ├── Providers.tsx      # SessionProvider + ThemeProvider wrapper
│   │   ├── ThemeProvider.tsx   # Custom dark mode (localStorage + class strategy)
│   │   ├── ThemeToggle.tsx    # Dark/light toggle button
│   │   ├── admin/             # Admin-specific components (see §8.3)
│   │   ├── leaderboard/       # Leaderboard UI components (see §8.3)
│   │   ├── profile/           # Profile UI components (see §8.3)
│   │   ├── workspace/         # Workspace UI components (see §8.3)
│   │   └── ui/                # Shared primitives (dropdown, datepicker, etc.)
│   │
│   ├── lib/                   # ── SHARED UTILITIES ──
│   │   ├── db.ts              # Prisma client singleton (dev: global cache)
│   │   ├── auth-guard.ts      # requireAuth() / requireAdmin()
│   │   ├── badges.ts          # Badge eligibility engine (checkBadges)
│   │   └── rate-limit.ts      # ⚠️ In-memory rate limiter (non-functional in serverless)
│   │
│   ├── types/
│   │   ├── next-auth.d.ts     # NextAuth Session/JWT type augmentation
│   │   └── user.ts            # LeaderboardUser interface
│   │
│   ├── auth.ts                # NextAuth config: Credentials provider + JWT callbacks
│   ├── auth.config.ts         # Edge-compatible route authorization rules
│   ├── middleware.ts           # Next.js middleware → NextAuth auth check
│   └── env.ts                 # Zod environment variable validation
│
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript config (path alias: @/* → ./src/*)
├── tailwind.config.ts         # Tailwind v3: dark mode, custom colors, fonts, animations
├── eslint.config.mjs          # ESLint: Next.js + Core Web Vitals + TypeScript rules
├── postcss.config.mjs         # PostCSS: Tailwind + Autoprefixer
├── next.config.ts             # Next.js: remote image patterns (Google, GitHub, Dicebear, Vercel)
├── handover.md                # Development roadmap (Phases 3-5 planned)
├── README.md                  # Project intro & quick start
└── ARCHITECTURE.md            # ← This file
```

---

## 4. Tech Stack & Dependencies

### Core

| Layer | Technology | Version | File |
|-------|-----------|---------|------|
| Framework | Next.js (App Router) | 16.1.4 | `package.json` |
| Language | TypeScript | ^5 | `package.json` |
| React | React + ReactDOM | 19.2.3 | `package.json` |
| Database | PostgreSQL (Supabase) | — | `.env`, `prisma/schema.prisma` |
| ORM | Prisma | 5.10.0 | `package.json` |
| Auth | NextAuth.js v5 (beta) | ^5.0.0-beta.30 | `package.json` |
| Styling | Tailwind CSS v3 | ^3.4.1 | `package.json`, `tailwind.config.ts` |

### UI & UX

| Library | Version | Purpose | Used In |
|---------|---------|---------|---------|
| Sonner | ^2.0.7 | Toast notifications | `src/app/layout.tsx` |
| Recharts | ^3.7.0 | Admin dashboard charts | `src/components/admin/AdminCharts.tsx` |
| react-day-picker | ^9.13.0 | Date picker for quest deadlines | `src/components/ui/DatePicker.tsx` |
| date-fns | ^4.1.0 | Date formatting/manipulation | `src/actions/admin-dashboard.ts` |
| use-debounce | ^10.1.0 | Search input debouncing | `src/components/QuestSearch.tsx` |

### Security & Validation

| Library | Version | Purpose | Used In |
|---------|---------|---------|---------|
| bcryptjs | ^3.0.3 | Password hashing | `src/auth.ts`, `src/actions/auth.ts` |
| Zod | ^4.3.6 | Schema validation | `src/env.ts`, `src/actions/quest.ts` |

### Storage

| Service | Purpose | Used In |
|---------|---------|---------|
| Vercel Blob (@vercel/blob ^2.2.0) | Avatar image storage | `src/actions/profile.ts` |
| Dicebear API | Fallback avatar generation | `src/actions/user.ts` |

### Fonts & Icons

- **Plus Jakarta Sans** — Primary font (body, headings)
- **Inter** — Secondary font (loaded but primarily Jakarta Sans is used)
- **Material Symbols Outlined** — Icon system (used throughout via `<span className="material-symbols-outlined">`)

### Design Tokens (Tailwind)

Defined in `tailwind.config.ts`:

| Token | Value | Purpose |
|-------|-------|---------|
| `primary.DEFAULT` | `#000000` | Primary action color |
| `primary.hover` | `#333333` | Primary hover state |
| `background-light` | `#ffffff` | Light mode background |
| `background-dark` | `#000000` | Dark mode background |
| `surface-light` | `#ffffff` | Light mode surface |
| `surface-dark` | `#111111` | Dark mode surface |
| `border-light` | `#eaeaea` | Light mode border |
| `border-dark` | `#333333` | Dark mode border |
| `text-subtle` | `#666666` | Muted text |
| `shadow-soft` | `0 2px 8px...` | Card shadows |
| `shadow-hover` | `0 8px 30px...` | Hover elevation |

---

## 5. Data Model & Schema

Source: `prisma/schema.prisma` — 6 models on PostgreSQL (Supabase).

### Entity Relationship Diagram

```
┌────────────────────┐          ┌────────────────────────┐
│       User         │          │        Quest           │
├────────────────────┤          ├────────────────────────┤
│ id       (PK,cuid) │◄────┐   │ id    (PK, CQ-YYMM-XXX│
│ email    (UNIQUE)  │     │   │ title                  │
│ name               │     │   │ description            │
│ avatar             │     │   │ maxSnatchers (def:1)   │
│ image              │     │   │ difficulty             │
│ bio                │     │   │ points (def:100)       │
│ githubUrl          │     │   │ category               │
│ linkedinUrl        │     │   │ status                 │
│ handle             │     │   │ deadline               │
│ role    (def:Member│     │   │ requirements  String[] │
│ password           │     │   │ resources     String[] │
│ points   (def:0)   │     │   │ createdAt, updatedAt   │
│ completedQuests    │     │   └───────────┬────────────┘
│ createdAt,updatedAt│     │               │
└──┬──┬──┬──┬────────┘     │               │
   │  │  │  │              │               │
   │  │  │  │    ┌─────────┴───────────────┴──┐
   │  │  │  └───►│          Snatch            │
   │  │  │       ├────────────────────────────┤
   │  │  │       │ id         (PK, cuid)      │
   │  │  │       │ userId     (FK → User)     │
   │  │  │       │ questId    (FK → Quest)    │
   │  │  │       │ status                     │
   │  │  │       │ submissionUrl              │
   │  │  │       │ feedback                   │
   │  │  │       │ approvedAt                 │
   │  │  │       │ createdAt, updatedAt       │
   │  │  │       │ @@unique(userId, questId)  │
   │  │  │       └────────────────────────────┘
   │  │  │
   │  │  └──►┌────────────────────┐
   │  │      │     Penalty        │
   │  │      ├────────────────────┤
   │  │      │ id, userId(FK)     │
   │  │      │ reason, expiresAt  │
   │  │      │ createdAt          │
   │  │      └────────────────────┘
   │  │
   │  └─────►┌────────────────────┐
   │         │     Account        │  (OAuth adapter — currently unused)
   │         ├────────────────────┤
   │         │ id, userId(FK)     │
   │         │ provider, type     │
   │         │ providerAccountId  │
   │         │ tokens...          │
   │         │ @@unique(provider, │
   │         │   providerAccountId│)
   │         └────────────────────┘
   │
   └────────►┌────────────────────┐     ┌────────────────────┐
             │    UserBadge       │     │      Badge         │
             ├────────────────────┤     ├────────────────────┤
             │ id, userId(FK)     │────►│ id (PK, cuid)      │
             │ badgeId(FK)        │     │ slug (UNIQUE)      │
             │ isFeatured (bool)  │     │ name               │
             │ earnedAt           │     │ description        │
             │ @@unique(userId,   │     │ imageUrl           │
             │   badgeId)         │     │ category           │
             └────────────────────┘     │ createdAt,updatedAt│
                                        └────────────────────┘
```

### Model Details

#### User
- **ID:** Auto-generated `cuid()`
- **Role:** String, defaults to `"Member"`. Admin role grants access to `/admin/*`
- **Points/CompletedQuests:** Denormalized counters, incremented on quest acceptance
- **Password:** bcrypt hash (nullable — Account model exists for potential OAuth)

#### Quest
- **Custom ID format:** `CQ-YYMM-XXX` (e.g., `CQ-2607-001`). Generated in `src/actions/quest.ts` createQuest/duplicateQuest.
- **Status enum (string):** `Draft` → `Active` → `Closed`
- **Difficulty enum (string):** `Beginner` | `Intermediate` | `Advanced`
- **Category enum (string):** `Web` | `AI` | `Mobile` (README also mentions `Design` — NEEDS CONFIRMATION)
- **requirements/resources:** Native PostgreSQL `String[]` arrays (previously JSON-parsed in SQLite era)

#### Snatch (Join Table — Quest Participation)
- **Core relationship:** Links a User to a Quest with a status lifecycle
- **Unique constraint:** `@@unique([userId, questId])` — a user can only have one snatch per quest
- **Status enum (string):** See state machine below

#### Snatch State Machine

```
                    ┌─────────────┐
   joinQuest()      │             │   dropQuest()
   ──────────────►  │   ACTIVE    │ ──────────────► DROPPED
                    │             │
                    └──────┬──────┘
                           │ submitQuest()
                           ▼
                    ┌─────────────┐
                    │  SUBMITTED  │◄──── resubmit (from REVISION_NEEDED)
                    └──────┬──────┘
                           │ reviewSubmission()
                    ┌──────┼──────┐
                    ▼      ▼      ▼
              ACCEPTED  REJECTED  REVISION_NEEDED
                 │                     │
                 │ archiveQuest()      │ submitQuest()
                 ▼                     └──► SUBMITTED
              ARCHIVED
```

**Valid statuses:** `ACTIVE`, `SUBMITTED`, `REVISION_NEEDED`, `ACCEPTED`, `REJECTED`, `ARCHIVED`, `DROPPED`

**Business rules enforced in `src/actions/quest.ts`:**
- Max 3 active quests per user (ACTIVE + SUBMITTED + REVISION_NEEDED)
- Quest capacity limited by `maxSnatchers`
- Dropped quests are excluded from board (unique constraint prevents re-snatch currently — see Open Questions)
- Only `ACCEPTED` snatches can be archived
- Accepted quests increment `User.points` and `User.completedQuests`, then trigger `checkBadges()`

#### Badge System

14 badges defined in `prisma/seed_badges.ts`, evaluated in `src/lib/badges.ts`:

| Category | Slug | Condition |
|----------|------|-----------|
| PROGRESSION | `novice` | 1 quest completed |
| PROGRESSION | `apprentice` | 5 quests |
| PROGRESSION | `journeyman` | 10 quests |
| PROGRESSION | `expert` | 25 quests |
| PROGRESSION | `master` | 50 quests |
| POINTS | `point-collector` | 100 points |
| POINTS | `high-scorer` | 500 points |
| POINTS | `score-leader` | 1,000 points |
| POINTS | `legend` | 5,000 points |
| CATEGORY | `web-weaver` | 5 Web quests |
| CATEGORY | `ai-architect` | 5 AI quests |
| CATEGORY | `mobile-maestro` | 5 Mobile quests |
| DIFFICULTY | `challenger` | 1 Intermediate quest |
| DIFFICULTY | `conqueror` | 1 Advanced quest |

Users can feature up to 3 badges on their profile (`UserBadge.isFeatured`).

#### Penalty
- Used for administrative moderation (deactivation = 10-year penalty)
- Can be manually reset by admins (`manualReset()`)
- **Note:** Penalty checking is not enforced at quest-snatch time — NEEDS CONFIRMATION if this is intentional

#### Account
- Standard NextAuth adapter model for OAuth providers
- Currently unused (only Credentials auth configured)
- Cascade delete on User deletion

---

## 6. Authentication & Authorization

### Architecture Layers

```
Layer 1: EDGE MIDDLEWARE (src/middleware.ts)
    │     Runs on every matched route via NextAuth(authConfig).auth
    │     Matcher: /((?!api|_next/static|_next/image|.*\.png$).*)
    ▼
Layer 2: AUTH CONFIG (src/auth.config.ts)
    │     Edge-compatible authorized() callback
    │     Route-level access control decisions
    ▼
Layer 3: AUTH CORE (src/auth.ts)
    │     Full NextAuth with Credentials provider
    │     JWT callback (5-min stale cache for DB refresh)
    │     Session callback (maps JWT claims to session)
    ▼
Layer 4: AUTH GUARD (src/lib/auth-guard.ts)
    │     requireAuth() — throws if no session
    │     requireAdmin() — throws if not Admin role
    │     Used inside Server Actions
    ▼
Layer 5: AUTH ACTIONS (src/actions/auth.ts)
    │     authenticate() — login with rate limiting
    │     signup() — registration with domain validation
    ▼
Layer 6: API HANDLER (src/app/api/auth/[...nextauth]/route.ts)
          Exports GET/POST from NextAuth handlers
```

### Credentials Provider

- **Domain restriction:** Only `@cyber-univ.ac.id` emails accepted
- **Password:** bcrypt hashed, min 6 characters (Zod validated)
- **Default admin:** `codequest@cyber-univ.ac.id` / `admin123` (seeded in `prisma/seed.ts`)

### Route Protection Matrix

| Route | Protection Level | Enforcement |
|-------|-----------------|-------------|
| `/login`, `/signup` | Redirect to `/` if logged in | `auth.config.ts` L14 |
| `/admin/*` | Admin role required | `auth.config.ts` L20 + `admin/layout.tsx` L15 |
| `/workspace` | Login required | `auth.config.ts` L29 |
| `/profile` | Login required | `auth.config.ts` L29 |
| `/profile/[id]` | Public (but auth checked for `isOwner`) | No middleware block |
| `/`, `/quests/*`, `/leaderboard` | Public | `auth.config.ts` L36 |

### JWT Token Structure

Populated in `src/auth.ts` JWT callback:

```typescript
{
  sub: string       // User ID
  name: string
  email: string
  role: string      // "Member" | "Admin"
  points: number
  avatar: string | null
  lastRefreshed: number  // Timestamp for 5-min stale cache
}
```

---

## 7. Request Lifecycle

### Page Load (Server Component)

```
Browser GET /quests/CQ-2607-001
    │
    ├── 1. Next.js Middleware (src/middleware.ts)
    │       → auth.config.ts authorized() → allow (public route)
    │
    ├── 2. App Router matches src/app/quests/[id]/page.tsx
    │
    ├── 3. Server Component executes:
    │       → prisma.quest.findUnique({ where: { id } })
    │       → prisma.snatch.findMany(...)
    │       → auth() for session check
    │
    └── 4. Returns rendered HTML + RSC payload
```

### Mutation (Server Action)

```
User clicks "Snatch Quest"
    │
    ├── 1. Client component calls joinQuest(questId)
    │
    ├── 2. Server Action executes (src/actions/quest.ts):
    │       → getCurrentUser() → prisma.user.findUnique
    │       → prisma.$transaction:
    │           → Check existing snatch (unique constraint)
    │           → Count active snatchers vs maxSnatchers
    │           → Count user's active quests (max 3)
    │           → Create Snatch record
    │       → revalidatePath('/')
    │
    └── 3. Returns { success: true, data: snatch }
           Client receives result, page revalidates
```

### Submission Review (Admin Flow)

```
Admin clicks "Accept" on submission
    │
    ├── 1. reviewSubmission(snatchId, 'ACCEPTED', feedback?)
    │
    ├── 2. Server Action (src/actions/submission.ts):
    │       → requireAdmin()
    │       → prisma.$transaction:
    │           → Update snatch status to ACCEPTED
    │           → Increment user.points by quest.points
    │           → Increment user.completedQuests
    │           → checkBadges(userId) — evaluate 14 badge conditions
    │       → revalidatePath('/admin', 'layout')
    │
    └── 3. Returns { success: true }
```

---

## 8. Module Reference

### 8.1 Server Actions (Business Logic)

All located in `src/actions/`. Every file uses `'use server'` directive.

---

#### `src/actions/quest.ts` (692 lines — largest file)

**Responsibility:** All quest-related operations — CRUD + user participation lifecycle.

| Export | Auth | Purpose | DB Tables |
|--------|------|---------|-----------|
| `joinQuest(questId)` | User (redirect) | Snatch a quest. Enforces max 3 active, capacity check. Uses `$transaction`. | Snatch, Quest |
| `getUserActiveSnatches()` | User (soft) | Get IDs of user's active quests | Snatch |
| `getAllUserQuestIds()` | User (soft) | Get all non-dropped quest IDs for a user | Snatch |
| `getWorkspaceQuests()` | User | Fetch user's snatches with quest details for workspace | Snatch, Quest |
| `archiveQuest(questId)` | User | Archive an ACCEPTED snatch | Snatch |
| `getQuestUserStatus(questId)` | User (soft) | Get user's snatch status for a specific quest | Snatch |
| `submitQuest(questId, url)` | User | Submit work URL. Validates URL with Zod, checks deadline, prevents double submission. | Snatch, Quest |
| `dropQuest(questId)` | User (redirect) | Drop an ACTIVE snatch | Snatch |
| `createQuest(prevState, formData)` | Admin | Create quest with custom ID (CQ-YYMM-XXX). Validates with QuestSchema. | Quest |
| `getQuests({page,limit,search,status,includeFull})` | None | Paginated quest listing with optional full-quest filtering | Quest, Snatch |
| `updateQuestStatus(questId, newStatus)` | Admin | Change quest status. Prevents Draft revert if active snatches exist. | Quest, Snatch |
| `deleteQuest(questId)` | Admin | Delete quest + related snatches. Blocks if active snatches. | Quest, Snatch |
| `duplicateQuest(questId)` | Admin | Clone quest as Draft with new ID | Quest |
| `getQuestById(id)` | None | Fetch single quest | Quest |
| `updateQuest(questId, prevState, formData)` | Admin | Update quest fields. Same validation as create. | Quest |

**QuestSchema (Zod):**
```typescript
{
  title: string (min 3),
  description: string (min 10),
  category: string,
  difficulty: string,
  points: number (min 1, coerced),
  maxSnatchers: number (min 1, optional, coerced),
  deadline: string (optional),
  requirements: string[] (optional),
  resources: string (optional)
}
```

**Known issues:**
- `import { z } from 'zod'` appears at line 337 (mid-file) instead of top
- `getCurrentUser()` re-fetches from DB even though session has user ID
- Raw SQL in home page `getQuests()` has stale SQLite comments
- `where: any` typing used instead of `Prisma.QuestWhereInput`

---

#### `src/actions/submission.ts` (149 lines)

**Responsibility:** Admin submission review queue.

| Export | Auth | Purpose | DB Tables |
|--------|------|---------|-----------|
| `getSubmissions({page,limit,status,query})` | Admin | Paginated submission list with user+quest includes | Snatch, User, Quest |
| `reviewSubmission(snatchId, status, feedback?)` | Admin | Accept/Reject/Revision. On ACCEPTED: awards points, increments count, triggers `checkBadges()`. | Snatch, User, Quest |

---

#### `src/actions/admin.ts` (72 lines)

**Responsibility:** User management operations.

| Export | Auth | Purpose | DB Tables |
|--------|------|---------|-----------|
| `manualReset(userId)` | Admin | Clear all penalties for a user | Penalty |
| `updateUserRole(userId, role)` | Admin | Change user role | User |
| `deactivateUser(userId)` | Admin | Create 10-year penalty | Penalty |
| `deleteUser(userId)` | Admin | Cascade delete: snatches, penalties, badges, accounts, user | All |

---

#### `src/actions/admin-dashboard.ts` (115 lines)

**Responsibility:** Aggregate statistics for admin dashboard.

| Export | Auth | Purpose | Data Returned |
|--------|------|---------|---------------|
| `getAdminDashboardStats()` | Admin | Fetch all dashboard data | `{ totalMembers, activeQuests, pendingReviews, totalPoints, activityTrend[], difficultyDistribution[], leaderboard[] }` |

**Implementation details:**
- Activity trend: Last 30 days, grouped by date in JS (not SQL)
- Difficulty distribution: `groupBy(['difficulty'])` on active quests
- Leaderboard: Top 5 members by points

---

#### `src/actions/auth.ts` (72 lines)

**Responsibility:** Login and signup flows.

| Export | Auth | Purpose |
|--------|------|---------|
| `authenticate(prevState, formData)` | None | Login via NextAuth signIn('credentials'). Rate limited: 5/min per IP. |
| `signup(prevState, formData)` | None | Create user. Domain-restricted to `@cyber-univ.ac.id`. Rate limited: 3/hour per IP. |

**Special behavior:** Admin email `codequest@cyber-univ.ac.id` redirects to `/admin/members` after login.

---

#### `src/actions/profile.ts` (122 lines)

**Responsibility:** User profile management.

| Export | Auth | Purpose |
|--------|------|---------|
| `uploadProfileImage(formData)` | User | Upload avatar to Vercel Blob. Max 2MB, JPEG/PNG/WebP only. |
| `updateProfile(data)` | User | Update name, bio, githubUrl, linkedinUrl |
| `updateFeaturedBadges(badgeIds)` | User | Set up to 3 featured badges |

**Known issue:** Multiple `@ts-ignore` comments suggesting Prisma client may be out of sync.

---

#### `src/actions/user.ts` (188 lines)

**Responsibility:** Leaderboard and user seeding.

| Export | Auth | Purpose |
|--------|------|---------|
| `seedUsers()` | ⚠️ None | Generate 20 fake users with random snatches. **No admin guard!** |
| `getLeaderboardUsers(page, pageSize)` | None | Paginated leaderboard. Counts ACCEPTED+ARCHIVED snatches. |
| `getLeaderboardStanding()` | User (soft) | Get current user's rank and points-to-next-rank |

---

### 8.2 App Router Pages & Layouts

#### Root Layout (`src/app/layout.tsx`)
- Wraps all pages in `<Providers>` (SessionProvider + ThemeProvider)
- Loads Google Fonts (Inter, Plus Jakarta Sans, Material Symbols)
- Includes `<Toaster>` from Sonner (top-center, richColors)
- Inline `<script>` for FOUC prevention (reads `cq-theme` from localStorage)

#### Home Page (`src/app/page.tsx`)
- **Public.** `export const dynamic = 'force-dynamic'`
- Sections: Active Missions (horizontal scroll) + Quest Board (3-col grid)
- Uses raw SQL (`prisma.$queryRaw`) for complex availability filtering
- Excludes user's already-snatched quests from the board
- Components: `Header`, `QuestCard`, `QuestSearch`, `Pagination`, `LoginToast`

#### Auth Route Group (`src/app/(auth)/`)
- **Shared layout:** Split screen — left (form), right (decorative terminal with code snippet)
- `login/page.tsx` — Email/password form, uses `authenticate()` action
- `signup/page.tsx` — Registration form, uses `signup()` action

#### Admin Area (`src/app/admin/`)
- **Layout:** Server-side auth check + sidebar with navigation counts
- **Dashboard (`page.tsx`):** Stats cards + Recharts + leaderboard widget
- **Manage Quests:** CRUD table with filters, status toggles, duplicate, delete modal
- **Members (`members/page.tsx`):** User table with action menus (role change, deactivate, delete)
- **Submissions (`submissions/page.tsx`):** Review queue with modal for Accept/Reject/Revision

#### Quest Detail (`src/app/quests/[id]/page.tsx`)
- **24KB — complex page** with requirements list, resources, snatcher list, action buttons
- Shows deadline countdown, difficulty badge, category tag
- QuestAction component handles snatch/drop/submit flows

#### Workspace (`src/app/workspace/page.tsx`)
- **Protected.** Shows user's snatched quests in grid + sidebar
- Client component `WorkspaceQuestGrid` fetches via `getWorkspaceQuests()`

#### Leaderboard (`src/app/leaderboard/page.tsx`)
- **Public.** `force-dynamic`. Paginated table + user standing sidebar
- Has a "Populate Leaderboard" button that calls `seedUsers()` (⚠️ no guard)

#### Profile (`src/app/profile/`)
- **Own profile (`page.tsx`):** Protected. Shows sidebar + tabs (active quests, portfolio, badges)
- **Public profile (`[id]/page.tsx`):** Public. Same layout, `isOwner` flag controls edit visibility

---

### 8.3 Components

#### Global Components (`src/components/`)

| Component | Size | Type | Purpose |
|-----------|------|------|---------|
| `Header.tsx` | 13KB | Client | Global navigation bar with auth-aware menu |
| `QuestCard.tsx` | 9KB | Client | Quest card for board/workspace display |
| `QuestSearch.tsx` | 8KB | Client | Search + difficulty filter + sort dropdown |
| `QuestAction.tsx` | 10KB | Client | Snatch/Drop/Submit action buttons + submission form |
| `QuestTimer.tsx` | 3KB | Client | Deadline countdown timer |
| `Pagination.tsx` | 5KB | Client | URL-based page navigation |
| `LoginToast.tsx` | 1KB | Client | Shows welcome toast on `?loggedIn=true` |
| `Providers.tsx` | <1KB | Client | Wraps SessionProvider + ThemeProvider |
| `ThemeProvider.tsx` | 2KB | Client | Custom dark mode context (localStorage + class) |
| `ThemeToggle.tsx` | 1KB | Client | Dark/light mode toggle button |

#### Admin Components (`src/components/admin/`)

| Component | Size | Purpose |
|-----------|------|---------|
| `AdminSidebar.tsx` | 9KB | Collapsible sidebar with nav links and counts |
| `AdminSidebarContext.tsx` | 1KB | React context for sidebar collapse state |
| `AdminStats.tsx` | 9KB | Dashboard stat cards |
| `AdminCharts.tsx` | 4KB | Recharts: area chart (activity) + bar chart (difficulty) |
| `QuestForm.tsx` | 20KB | Quest create/edit form with validation |
| `QuestFilters.tsx` | 3KB | Status/search filters for quest management |
| `DeleteQuestModal.tsx` | 3KB | Confirmation modal for quest deletion |
| `MemberActionMenu.tsx` | 13KB | User action dropdown (role, deactivate, delete) |
| `MobileSidebarTrigger.tsx` | 1KB | Mobile hamburger menu for sidebar |
| `submissions/SubmissionReviewModal.tsx` | 20KB | Full review modal with quest details + feedback form |

#### Leaderboard Components (`src/components/leaderboard/`)

| Component | Size | Purpose |
|-----------|------|---------|
| `LeaderboardTable.tsx` | 7KB | Ranked user table with avatars |
| `LeaderboardFilters.tsx` | 7KB | Timeframe filter (All/Weekly/Monthly) |
| `PaginationControls.tsx` | 5KB | Prev/Next pagination |
| `PointsInfoModal.tsx` | 7KB | Modal explaining point system |
| `UserStanding.tsx` | 6KB | Current user's rank card |

#### Profile Components (`src/components/profile/`)

| Component | Size | Purpose |
|-----------|------|---------|
| `ProfileSidebar.tsx` | 9KB | User info card with featured badges |
| `ProfileTabs.tsx` | 27KB | **Largest component.** Tabs: Active Quests, Portfolio, Badges |
| `EditProfileModal.tsx` | 15KB | Profile edit form modal |
| `AvatarUpload.tsx` | 4KB | Avatar upload with preview |

#### Workspace Components (`src/components/workspace/`)

| Component | Size | Purpose |
|-----------|------|---------|
| `WorkspaceQuestCard.tsx` | 13KB | Quest card with status, actions, submission URL |
| `WorkspaceQuestGrid.tsx` | 3KB | Grid layout, fetches via getWorkspaceQuests() |
| `WorkspaceHeader.tsx` | 1KB | "My Quests" heading |
| `WorkspaceSidebar.tsx` | 1KB | Workspace sidebar (minimal) |

#### UI Primitives (`src/components/ui/`)

| Component | Purpose |
|-----------|---------|
| `CustomDropdown.tsx` | Reusable dropdown select |
| `DatePicker.tsx` | Date picker (react-day-picker) |
| `PasswordInput.tsx` | Password field with show/hide toggle |
| `SubmitButton.tsx` | Form submit button with loading state |

---

### 8.4 Shared Utilities (lib/)

#### `src/lib/db.ts`
- Prisma client singleton with global cache in development
- Imports `src/env.ts` to validate env vars at startup

#### `src/lib/auth-guard.ts`
- `requireAuth()` — Returns `session.user` or throws `'Unauthorized'`
- `requireAdmin()` — Returns `session.user` if Admin, throws `'Unauthorized'` or `'Forbidden'`

#### `src/lib/badges.ts`
- `checkBadges(userId)` — Evaluates all 14 badge conditions against user's data
- Grants badges idempotently (checks existing badges before creating)
- Returns array of newly earned badge names
- **Performance note:** Makes N+1 queries (one per badge grant). Could be batched.

#### `src/lib/rate-limit.ts`
- In-memory `Map<string, { count, lastReset }>` rate limiter
- **⚠️ NON-FUNCTIONAL IN SERVERLESS:** Map resets on every cold start
- Used by: `authenticate()` (5/min) and `signup()` (3/hour)

---

### 8.5 Type Definitions

#### `src/types/next-auth.d.ts`
Augments NextAuth types to include custom fields:
- `Session.user` → adds `role`, `points`, `avatar`, `bio`, `githubUrl`, `linkedinUrl`
- `JWT` → adds same fields + `lastRefreshed` timestamp
- `User` → adds same fields

#### `src/types/user.ts`
```typescript
interface LeaderboardUser {
  id: string
  name: string | null
  avatar: string | null
  role: string
  handle: string
  points: number
  completedQuests: number
  email: string
}
```

---

## 9. API Reference

### HTTP Endpoints

The only HTTP API is the NextAuth catch-all:

| Method | Path | Purpose | File |
|--------|------|---------|------|
| GET/POST | `/api/auth/*` | NextAuth handlers (signin, signout, session, csrf) | `src/app/api/auth/[...nextauth]/route.ts` |

### Server Actions (Callable from Client)

All mutations and data fetches are Server Actions. Listed by domain:

#### Auth
| Action | Parameters | Returns | Guard |
|--------|-----------|---------|-------|
| `authenticate` | `(prevState, formData: {email, password})` | `string \| undefined` (error message) | Rate limit |
| `signup` | `(prevState, formData: {email, password, confirmPassword, name})` | `string \| undefined` | Rate limit |

#### Quest Operations
| Action | Parameters | Returns | Guard |
|--------|-----------|---------|-------|
| `joinQuest` | `(questId: string)` | `{ success, data? \| error? }` | User |
| `submitQuest` | `(questId: string, submissionUrl: string)` | `{ success, error? }` | User |
| `dropQuest` | `(questId: string)` | `{ success, error? }` | User |
| `archiveQuest` | `(questId: string)` | `{ success, error? }` | User |
| `getQuestUserStatus` | `(questId: string)` | `{ status, submissionUrl, feedback } \| null` | User (soft) |
| `getUserActiveSnatches` | `()` | `string[]` (quest IDs) | User (soft) |
| `getAllUserQuestIds` | `()` | `string[]` | User (soft) |
| `getWorkspaceQuests` | `()` | `{ success, data?: Snatch[] }` | User |

#### Quest CRUD (Admin)
| Action | Parameters | Returns | Guard |
|--------|-----------|---------|-------|
| `createQuest` | `(prevState, formData)` | `{ success, message, questId? }` | Admin |
| `updateQuest` | `(questId, prevState, formData)` | `{ success, message }` | Admin |
| `updateQuestStatus` | `(questId, newStatus)` | `{ success, error? }` | Admin |
| `deleteQuest` | `(questId)` | `{ success, error? }` | Admin |
| `duplicateQuest` | `(questId)` | `{ success, error? }` | Admin |
| `getQuests` | `({page, limit, search, status, includeFull})` | `{ success, data, pagination }` | None |
| `getQuestById` | `(id: string)` | `{ success, data? }` | None |

#### Submissions (Admin)
| Action | Parameters | Returns | Guard |
|--------|-----------|---------|-------|
| `getSubmissions` | `({page, limit, status, query})` | `{ success, data, pagination }` | Admin |
| `reviewSubmission` | `(snatchId, status, feedback?)` | `{ success, error? }` | Admin |

#### User Management (Admin)
| Action | Parameters | Returns | Guard |
|--------|-----------|---------|-------|
| `updateUserRole` | `(userId, role)` | `{ success, error? }` | Admin |
| `deactivateUser` | `(userId)` | `{ success, error? }` | Admin |
| `deleteUser` | `(userId)` | `{ success, error? }` | Admin |
| `manualReset` | `(userId)` | `{ success, error? }` | Admin |

#### Profile
| Action | Parameters | Returns | Guard |
|--------|-----------|---------|-------|
| `uploadProfileImage` | `(formData: {file})` | `{ success, url? }` | User |
| `updateProfile` | `({name?, bio?, githubUrl?, linkedinUrl?})` | `{ success, error? }` | User |
| `updateFeaturedBadges` | `(badgeIds: string[])` | `{ success, error? }` | User |

#### Leaderboard
| Action | Parameters | Returns | Guard |
|--------|-----------|---------|-------|
| `getLeaderboardUsers` | `(page, pageSize)` | `{ users, total }` | None |
| `getLeaderboardStanding` | `()` | `{ rank, pointsToNext, isTop, ... } \| null` | User (soft) |
| `seedUsers` | `()` | `{ success, message }` | ⚠️ None |

---

## 10. Cross-Cutting Concerns

### State Management
- **Server-side:** React Server Components for all data fetching. No client-side data cache (SWR/React Query).
- **Client-side:** `SessionProvider` (next-auth/react) for session state; custom `ThemeProvider` for dark mode.
- **URL state:** Search, filters, pagination stored in URL search params.
- **Mutations:** Server Actions with `revalidatePath()` to refresh affected pages.

### Error Handling
- **Pattern:** Every Server Action wraps logic in try/catch, returns `{ success: boolean, error?: string }`
- **No `error.tsx` boundaries** — only one `loading.tsx` exists (admin/manage-quests)
- **No `not-found.tsx`** — uses `notFound()` in profile/[id] but no custom 404 page
- **Console logging only** — no structured logging or error monitoring

### Validation
- **Zod** for: env vars (`src/env.ts`), quest create/update forms, submission URLs
- **Manual checks** for: domain restriction, file size/type, capacity limits
- **Missing:** No Zod validation on auth signup (manual string checks only)

### Dark Mode
- **Strategy:** `class` based (Tailwind `darkMode: ["class"]`)
- **Persistence:** `localStorage.getItem('cq-theme')`
- **FOUC prevention:** Inline script in `<head>` reads theme before React hydrates
- **Implementation:** Custom `ThemeProvider` context (not next-themes)

### File Upload
- **Provider:** Vercel Blob (`@vercel/blob`)
- **Constraints:** 2MB max, JPEG/PNG/WebP only
- **Path:** `avatars/{userId}-{timestamp}.{ext}`
- **Access:** Public URLs

### Caching
- **JWT cache:** User data refreshed from DB only every 5 minutes or on explicit trigger
- **Page caching:** Home page uses `force-dynamic`; leaderboard uses `force-dynamic`
- **Revalidation:** `revalidatePath()` after every mutation

---

## 11. Glossary

| Term | Meaning |
|------|---------|
| **Quest** | A development task/challenge with points, deadline, and difficulty |
| **Quest Board** | The public-facing listing of available quests (home page) |
| **Snatch** | The act of claiming a quest; also the DB record linking User↔Quest |
| **Snatchers** | Users who have snatched a quest |
| **maxSnatchers** | Maximum number of users who can simultaneously work on a quest |
| **Active Mission** | A quest the current user has snatched and is working on |
| **Submit** | Providing a URL (repo/deployment) as proof of quest completion |
| **Review** | Admin evaluation of a submission → Accept/Reject/Revision Needed |
| **Badge** | Achievement earned automatically when conditions are met |
| **Featured Badge** | Up to 3 badges a user can highlight on their profile |
| **Penalty** | Administrative moderation record with expiry date |
| **Workspace** | User's personal view of their snatched/active quests |
| **Portfolio** | Collection of user's ACCEPTED/ARCHIVED quests on their profile |
| **Squad** | Planned feature for team-based quest participation (not yet implemented) |

---

## 12. Open Questions & Recommendations

### Open Questions (NEEDS CONFIRMATION)

| # | Question | Context |
|---|----------|---------|
| 1 | Is `Design` a valid quest category? | README mentions it, schema comment doesn't |
| 2 | Can a user re-snatch a quest after dropping? | `@@unique(userId, questId)` prevents this. Is this intentional? |
| 3 | Should penalties block quest snatching? | Penalty model exists but isn't checked in `joinQuest()` |
| 4 | Is `seedUsers()` intentionally public? | No admin guard — any user can generate 20 fake users |
| 5 | Why does `Account` model exist? | Only Credentials auth is configured. Was OAuth planned? |
| 6 | Is `prisma/dev.db` intentionally kept? | 312KB SQLite file, unused since Postgres migration |
| 7 | What is `temp_app/` directory? | Exists in root, gitignored. Purpose unknown. |

### Recommendations (Prioritized)

#### HIGH Priority

| # | Issue | Impact | Recommendation |
|---|-------|--------|----------------|
| 1 | **In-memory rate limiter is non-functional** | Auth brute-force attacks unprotected | Replace with Upstash Redis or Vercel KV rate limiter |
| 2 | **`seedUsers()` has no auth guard** | Anyone can pollute the database | Add `requireAdmin()` guard |
| 3 | **No error/not-found boundaries** | Users see raw error dumps | Add `error.tsx`, `not-found.tsx` to `app/`, `app/admin/`, `app/quests/`, `app/workspace/` |
| 4 | **`quest.ts` is 692 lines** | Hard to maintain and test | Split into `quest-crud.ts`, `quest-participation.ts`, `quest-queries.ts` |
| 5 | **Raw SQL has stale SQLite comments** | Confusing for future developers | Update comments to reference PostgreSQL |

#### MEDIUM Priority

| # | Issue | Impact | Recommendation |
|---|-------|--------|----------------|
| 6 | **No test suite** | No regression protection | Set up Vitest + React Testing Library; prioritize badge logic and state machine |
| 7 | **`@ts-ignore` in profile actions** | Type safety gaps | Run `npx prisma generate` and remove suppressions |
| 8 | **`where: any` in Prisma queries** | Weak typing | Use `Prisma.SnatchWhereInput` / `Prisma.QuestWhereInput` |
| 9 | **Two auth patterns** (`getCurrentUser()` vs `auth()`) | Inconsistency, extra DB calls | Standardize on `requireAuth()` from `auth-guard.ts` |
| 10 | **No loading/skeleton states** | White screen during data fetch | Add `loading.tsx` to all route segments |
| 11 | **Delete `prisma/dev.db`** | Confusing artifact | Remove and add to `.gitignore` |
| 12 | **`checkBadges()` N+1 queries** | Performance on badge grant | Batch badge grants with `createMany()` |

#### LOW Priority

| # | Issue | Impact | Recommendation |
|---|-------|--------|----------------|
| 13 | **Mid-file import** in `quest.ts` L337 | Code style | Move `import { z }` to top of file |
| 14 | **`eslint-disable` for `any` types** | Type safety | Replace with proper Prisma types |
| 15 | **Duplicate Google Fonts link** | Redundant request | Material Symbols loaded in both root layout and admin layout |
| 16 | **Hardcoded admin email** | Inflexible | Move to env var or config |
| 17 | **Toast on drop says "penalized"** | Misleading (penalty removed) | Fix message in `dropQuest()` return |

---

## Development Phases (from `handover.md`)

| Phase | Status | Focus |
|-------|--------|-------|
| **Phase 1: Security & Auth** | ✅ Complete | Middleware, admin guards, JWT cache |
| **Phase 2: Database & State Machine** | ✅ Complete | Postgres migration, status standardization |
| **Phase 3: UX Completeness** | 🟡 Planned | Loading states, error boundaries, public profiles, toasts |
| **Phase 4: Features** | 🟠 Planned | Activity feed, notifications, squads, admin assign |
| **Phase 5: Quality & Testing** | 🔴 Planned | TypeScript audit, test suite, rate limiter, Lighthouse |

---

*This document was generated from actual source code analysis. For the latest state, re-run discovery against the current codebase.*
