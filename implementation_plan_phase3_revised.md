# Phase 3: UX Completeness — Implementation Plan (Revised)

> **Goal:** Transform CodeQuest from a functional MVP into a polished, production-ready application with proper loading states, error boundaries, a real public profile, comprehensive toast feedback, and the security holes closed before shipping any of it.
>
> **What changed vs v1:** (1) Added the missing **Public Profile Page** task, (2) expanded **toast coverage** to snatch/drop/delete/status-change/review, (3) **pulled security fixes forward** from Phase 5 (rate limiter + `seedUsers()` guard), (4) added technical fixes (`global-error.tsx`, `generateMetadata`, skeleton a11y).

---

## User Review Required

> **Scope Confirmation:** This revised plan covers **all 4 handover.md Phase 3 tasks** (Loading/Error, Public Profile, Quest Detail Polish, Toasts) PLUS two security fixes promoted from Phase 5. Work is grouped into 6 components in dependency order.

> **Design Language:** Strictly match the existing aesthetic — Tailwind v3, Plus Jakarta Sans, `slate-*` neutrals, `orange-500/600` accent, dot-matrix background, `+` crosshair corner markers, glassmorphism. No purple. Gamified copy tone ("Quest Snatched!", "Return to Base").

---

## Resolved Decisions (confirmed by maintainer)

1. **Public Profile Page** was missing from v1 → **now included in Phase 3** (Component 3).
2. **Toast coverage** → **full**: snatch, drop, quest delete, quest status change, and submission review — in addition to the archive/role/deactivate/reset already listed.
3. **Security fixes** (rate limiter + `seedUsers()` guard) → **pulled into Phase 3** as Component 6 (do first if any public exposure exists).
4. **Technical nits** → include all: `global-error.tsx`, async `generateMetadata`, skeleton accessibility.
5. **404 style** → premium text-based "Mission Not Found" with existing icon system (no generated illustration).

---

## Recommended Execution Order

1. **Component 6 — Security fixes** (do FIRST — close active holes before shipping polish)
2. **Component 1 — Skeleton loading states**
3. **Component 2 — Error boundaries & not-found pages**
4. **Component 3 — Public Profile Page**
5. **Component 4 — Quest detail polish**
6. **Component 5 — Toast notifications (full coverage)**

---

## Proposed Changes

### Component 6 (DO FIRST): Security Fixes — promoted from Phase 5

**Problem:** Two active security gaps should not survive into a "production-ready" release.
- `src/lib/rate-limit.ts` is an in-memory `Map` → resets on every serverless cold start, so login/signup brute-force protection is effectively absent.
- `seedUsers()` in `src/actions/user.ts` has **no admin guard** and may still be reachable via the leaderboard "Populate Leaderboard" button → anyone can inject 20 fake users.

#### [MODIFY] `src/actions/user.ts`
- Add `await requireAdmin()` at the top of `seedUsers()` (import from `src/lib/auth-guard.ts`).
- Return `{ success: false, error: 'Forbidden' }` on guard failure (match existing action shape).

#### [MODIFY] `src/app/leaderboard/page.tsx` (+ leaderboard components)
- Hide/remove the "Populate Leaderboard" trigger for non-admin sessions (defense in depth; guard is the real fix).

#### [MODIFY] `src/lib/rate-limit.ts` + `src/actions/auth.ts`
- Replace the in-memory limiter with a durable store. Recommended: **Upstash Redis** (`@upstash/ratelimit` + `@upstash/redis`) — serverless-friendly, free tier.
- New env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` → add to `src/env.ts` Zod schema.
- Preserve existing limits: `authenticate()` 5/min per IP, `signup()` 3/hour per IP.
- If Upstash is not desired yet, fall back to a documented no-op with a `// TODO` and keep the abstraction so swap-in is trivial.

---

### Component 1: Skeleton Loading States

**Problem:** Only `admin/manage-quests/loading.tsx` exists; every other route white-screens during SSR data fetch.

**Approach:** Add `loading.tsx` for 6 route segments, mirroring each page layout with `animate-pulse` blocks, following the existing loader pattern. **Accessibility:** wrap each skeleton root in `<div role="status" aria-busy="true" aria-label="Loading">` with an `sr-only` "Loading…" text.

| File | Skeleton content |
|------|------------------|
| [NEW] `src/app/loading.tsx` | Header + "Active Missions" horizontal scroll + 3-col quest grid (6 cards) |
| [NEW] `src/app/admin/loading.tsx` | Stats grid (4 cards) + chart areas + leaderboard table |
| [NEW] `src/app/workspace/loading.tsx` | Header + 3-col quest grid + sidebar |
| [NEW] `src/app/quests/[id]/loading.tsx` | Back nav + title + description + sidebar (timer + squad) |
| [NEW] `src/app/leaderboard/loading.tsx` | Title + filters bar + 10 table rows + standing sidebar |
| [NEW] `src/app/profile/loading.tsx` | Sidebar (avatar + badges) + tabs area |

---

### Component 2: Error Boundaries & Not-Found Pages

**Problem:** No `error.tsx`/`not-found.tsx`; users see raw Next.js error dumps. `notFound()` in profile `[id]` renders nothing custom.

**Approach:** Global boundaries + a root-level `global-error.tsx` (catches errors in the root layout, which `app/error.tsx` cannot) + segment-specific variants.

| File | Purpose |
|------|---------|
| [NEW] `src/app/error.tsx` | `'use client'` — message + retry (`reset()`) + "Back to Home"; dot-matrix + glass styling |
| [NEW] `src/app/global-error.tsx` | `'use client'` — catches root-layout errors; must render its own `<html><body>` |
| [NEW] `src/app/not-found.tsx` | "Mission Not Found" (text-based), "Return to Base" link, gamified tone |
| [NEW] `src/app/admin/error.tsx` | Admin-specific boundary with "Return to Dashboard" |
| [NEW] `src/app/quests/[id]/not-found.tsx` | "Quest Not Found" for invalid quest IDs |

---

### Component 3: Public Profile Page (`/profile/[id]`) — RESTORED from handover

**Problem:** Leaderboard links to users, but the public profile view lacks social depth. This handover Phase 3 task was omitted from plan v1.

**Approach:** Build out the public-facing profile using existing profile components where possible (`ProfileSidebar`, `ProfileTabs`), driven by the `isOwner` flag so edit controls stay hidden for visitors.

#### [MODIFY] `src/app/profile/[id]/page.tsx`
- Fetch target user + their `ACCEPTED`/`ARCHIVED` snatches (public portfolio) + earned badges + featured badges + stats (points, completedQuests, rank).
- Use `notFound()` when the user id doesn't exist (now backed by Component 2's not-found page).
- Pass `isOwner={session?.user?.id === targetId}` to hide edit affordances for visitors.
- Add async `generateMetadata({ params })` for SEO (dynamic title/description from the user's name/handle).

#### [MODIFY] `src/components/profile/ProfileTabs.tsx` / `ProfileSidebar.tsx` (as needed)
- Ensure a read-only mode: when `!isOwner`, hide "Edit Profile", avatar upload, and featured-badge editing; show only public tabs (Portfolio, Badges).
- Reuse the same layout as the owner profile for visual consistency.

---

### Component 4: Quest Detail Page Polishing

**Problem:** `/quests/[id]` is functional but polish gaps remain: resources render as joined strings; mobile spacing is loose.

#### [MODIFY] `src/app/quests/[id]/page.tsx`
- Resources: render each entry as its own item with individual link detection (URL vs plain text).
- Mobile spacing: `p-8` → `p-4 sm:p-6 lg:p-8`; ensure difficulty/category badges wrap on small screens.
- Add async `generateMetadata({ params })` (dynamic title/description from the quest) — NOTE: use `generateMetadata`, not `export const metadata`, because the route is dynamic.
- Verify dark mode + 320/375/768px viewports.

---

### Component 5: Global Toast Notifications (FULL coverage)

**Problem:** Many actions happen silently. v1 only covered a subset; this covers all user + admin mutations.

| Component / File | Action | v1 status | Needed |
|------------------|--------|-----------|--------|
| `components/QuestAction.tsx` | **Snatch** quest | verify exists | `"Quest Snatched!"` success / error |
| `components/QuestAction.tsx` | **Drop** quest | verify exists (fix "penalized" copy) | drop success / error |
| `components/QuestAction.tsx` | **Submit** quest | verify | `"Submission received!"` / error |
| `components/workspace/WorkspaceQuestCard.tsx` | **Archive** quest | console.error only | success `"Quest archived! Slot freed up."` / error |
| `components/admin/MemberActionMenu.tsx` | Role change | silent | `"Role updated to {role}"` |
| `components/admin/MemberActionMenu.tsx` | Deactivate user | silent | `"User deactivated"` |
| `components/admin/MemberActionMenu.tsx` | Reset penalties | silent | `"Penalties cleared for {user}"` |
| `components/admin/DeleteQuestModal.tsx` / `manage-quests/QuestActions.tsx` | **Delete quest** | silent | `"Quest deleted"` / error |
| `manage-quests/QuestActions.tsx` (or QuestForm) | **Quest status change** | silent | `"Quest set to {status}"` / error |
| `components/admin/submissions/SubmissionReviewModal.tsx` | **Review** (Accept/Reject/Revision) | silent | `"Submission {accepted/rejected/sent back}"` / error |

**Approach:** For each handler, `import { toast } from 'sonner'`, then call `toast.success()`/`toast.error()` based on the `{ success, error }` returned by the server action. Do **not** change server-action return shapes.

---

## Verification Plan

### Automated
- `npm run build` — no TypeScript errors from new/modified files.
- `npm run lint` — ESLint passes.

### Manual
- **Security:** Confirm non-admin can no longer call `seedUsers()` (button hidden + action rejects). Verify rate limiter blocks after limit and persists across a simulated cold start (or Upstash dashboard shows counts).
- **Loading:** Navigate each route; skeleton appears during fetch; screen readers announce "Loading".
- **Errors:** Force an error (throw) → `error.tsx` retry works; break root layout → `global-error.tsx` renders; hit invalid quest id → quest not-found; invalid profile id → not-found.
- **Public profile:** View another user's profile → portfolio + badges + stats show, no edit controls; own profile still editable.
- **Quest detail:** Resources render individually; mobile 320/375/768 clean; dynamic title in tab.
- **Toasts:** Every action in the table above fires the correct success/error toast; dark mode verified.

---

## Out of Scope (stays in later phases)
- Activity Feed, Notification model, Squad system, Admin "Assign Quest" → **Phase 4**.
- Full `any`-type audit, test suite, Lighthouse pass, strict URL/XSS validation → **Phase 5** (note: the rate limiter, previously Phase 5, has been pulled into this phase).
