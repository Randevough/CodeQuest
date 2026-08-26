# CodeQuest Current State & Roadmap

## 🟢 Completed & Functional
- **Database Schema**: Fully defined Prisma schema for Users, Quests, Snatches, Penalties, Squads, Badges, and Notifications.
- **Authentication**: NextAuth v5 configured with Credentials provider and bcrypt password hashing.
- **Rate Limiting**: Upstash Redis implemented for `/login` and `/signup` endpoints to prevent brute-force attacks.
- **Error Boundaries**: Custom `error.tsx` and `global-error.tsx` UIs designed to cleanly handle fatal crashes without exposing stack traces, utilizing the UKM Coding official Instagram link for support.
- **Design System**: Core Tailwind configuration, theme tokens, and "gamified" UI elements are established (excluding over-the-top AI slop visuals).

## 🟡 Currently Blocked / In Progress

### 1. Database Connectivity (Supabase IPv4 Deprecation)
**Issue:** Prisma queries currently fail with `PrismaClientInitializationError: Can't reach database server at db.[ref].supabase.co:5432`.
**Cause:** Supabase disabled direct IPv4 connections on port `5432` for free tier projects. Our `.env` currently uses this deprecated port.
**Resolution Needed:** 
- Obtain the Transaction Pooler string from the Supabase Dashboard (Settings -> Database).
- Update `.env`: `DATABASE_URL` and `DIRECT_URL` must point to the IPv4 connection pooler on port `6543` (usually a `pooler.supabase.com` URL).

### 2. Email Verification (Resend API)
**Issue:** New user signups require email verification before they can log in (enforced in `src/auth.ts`). However, emails are not actually being sent because the `RESEND_API_KEY` is missing (falling back to a dummy key).
**Resolution Needed:**
- Because the architecture must remain Zero-Cost, we will use Resend's free tier.
- Since a custom subdomain is available, we need to add the subdomain to Resend, configure its DNS records, and generate a valid `RESEND_API_KEY`.
- Update `src/lib/email.ts` to send *from* the new verified subdomain instead of the placeholder `noreply@cyber-univ.ac.id`.

## 🔴 Upcoming Features (Roadmap)
Once the blockers above are resolved, development will proceed to:
1. **Public Quest Board**: The main UI for users to browse, filter, and view `Active` quests.
2. **Snatch Mechanism**: The UI and Server Action for a user to "Snatch" a quest and view their ongoing tasks.
3. **Admin Dashboard Enhancements**: Interfaces for admins to create new Quests, review Snatches, and issue verdicts (Approve/Reject).
4. **Gamification UI**: Displaying user Points, Leaderboards, and earned Badges on the user profile.
