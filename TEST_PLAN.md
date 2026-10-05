# Automated Test Plan - CodeQuest

This document defines the comprehensive automated test suite for CodeQuest, covering all user-facing and business-logic features across Server Actions, domain logic, utilities, and UI components.

---

## Feature Area 1: Quest Lifecycle & Workspace (Priority: P0 - Critical)
Core player mechanics for managing claimed quests and submitting work.

- [x] **1.1 Quest Submission (`submitQuest`)**
  - **What it does:** Allows a user with an `ACTIVE` or `REVISION_NEEDED` snatch to submit a URL (GitHub repo, live preview) for review. Updates status to `SUBMITTED`.
  - **Test Type:** Integration / Unit
  - **Key Scenarios:**
    - Happy path: User submits valid URL for active snatch -> status changes to `SUBMITTED`, `submissionUrl` updated, `updatedAt` refreshed.
    - Resubmission: User resubmits for `REVISION_NEEDED` snatch -> status changes back to `SUBMITTED`.
    - Validation error: Invalid URL string format -> returns error, does not mutate DB.
    - Auth / Permission: Unauthenticated caller -> rejects with error.
    - State violation: Submitting a quest that is already `ACCEPTED` or not snatched -> rejects with error.
- [x] **1.2 Dropping Quests (`dropQuest`)**
  - **What it does:** Allows a user to forfeit an active quest snatch, marking it `DROPPED` and freeing snatch capacity.
  - **Test Type:** Integration / Unit
  - **Key Scenarios:**
    - Happy path: Active snatch is marked `DROPPED`, capacity is restored.
    - State violation: Cannot drop a quest that is already `ACCEPTED` or `SUBMITTED` without admin review.
    - Auth check: Cannot drop another user's snatch.
- [x] **1.3 Archiving Quests (`archiveQuest`)**
  - **What it does:** Allows users to archive completed quests from their active workspace view.
  - **Test Type:** Integration / Unit
  - **Key Scenarios:**
    - Happy path: Snatch status updated to `ARCHIVED`.
    - Permission: Caller must own the snatch.
- [x] **1.4 Workspace Querying (`getWorkspaceQuests`, `getQuestUserStatus`)**
  - **What it does:** Retrieves categorized snatches (Active, In Review, Completed) and single quest relationship state for the current session.
  - **Test Type:** Integration / Unit
  - **Key Scenarios:**
    - Categorization: Returns distinct groups for ACTIVE, SUBMITTED, REVISION_NEEDED, and ACCEPTED.
    - Unauthenticated: Returns empty or redirect state cleanly.

---

## Feature Area 2: Admin Quest Management & CRUD (Priority: P0 - Critical)
Administrative control for quest creation, modification, status toggling, and lifecycle.

- [ ] **2.1 Quest Creation (`createQuest`)**
  - **What it does:** Validates and creates a new quest with title, description, category, difficulty, points, deadline, and requirements.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Happy path: Valid FormData creates Quest record with defaults (status Draft or Active).
    - Validation: Missing title or points < 0 returns structured field errors.
    - Permission: Rejects non-Admin users.
- [ ] **2.2 Quest Update & Status (`updateQuest`, `updateQuestStatus`)**
  - **What it does:** Modifies quest metadata and switches state between Draft, Active, and Closed.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Happy path: Updating difficulty/points preserves existing snatches.
    - Status toggle: Closing a quest prevents future snatches.
    - Non-existent ID: Returns 404/not found error.
- [ ] **2.3 Quest Deletion & Duplication (`deleteQuest`, `duplicateQuest`)**
  - **What it does:** Deletes quests without active dependencies or clones an existing quest structure.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Duplicate: Clones title as "Copy of ...", sets status to Draft, resets snatches.
    - Delete: Cascades or safely deletes unattached quest; handles attached snatches according to business rules.
- [ ] **2.4 Quest Filtering & Sorting Query (`getQuests`)**
  - **What it does:** Server-side search, category filter, difficulty filter, status filter, and pagination.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Filters: Category filter returns only matching categories.
    - Search: Title/description substring search.
    - Pagination: `page` and `pageSize` limit correctly.

---

## Feature Area 3: Squad & Collaboration System (Priority: P1 - High)
Multiplayer collaboration feature allowing players to form teams around quests.

- [ ] **3.1 Squad Creation (`createSquad`)**
  - **What it does:** Allows a user with an active quest to initiate a squad and become the leader.
  - **Test Type:** Integration / Unit
  - **Key Scenarios:**
    - Happy path: User creates squad -> Squad record created, user's snatch linked to `squadId`.
    - Validation: Squad name length check, max squads per quest check.
    - Pre-condition: User must have snatched or be eligible to snatch the quest.
- [ ] **3.2 Joining a Squad (`joinSquad`)**
  - **What it does:** Allows another player to join an existing squad for a quest if capacity allows.
  - **Test Type:** Integration / Unit
  - **Key Scenarios:**
    - Happy path: Snatches the quest (if not already) and sets `squadId`.
    - Capacity limit: Rejects join if squad is full.
    - Conflict check: Cannot join multiple squads for the same quest.
- [ ] **3.3 Leaving a Squad (`leaveSquad`)**
  - **What it does:** Removes member from squad; if creator leaves, handles squad disband or leadership transfer.
  - **Test Type:** Integration / Unit
  - **Key Scenarios:**
    - Member leaves: `squadId` cleared on snatch.
    - Leader leaves: Squad deleted or disbanded cleanly.

---

## Feature Area 4: Notification System (Priority: P1 - High)
In-app notifications for quest submissions, badge unlocks, and admin reviews.

- [ ] **4.1 Notification Dispatch & Retrieval (`createNotification`, `getNotifications`)**
  - **What it does:** Creates structured alerts (type, message, link) and lists notifications for the current user.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Dispatch: Inserts notification with `read: false`.
    - Ordering: Returns recent notifications first with pagination/limit.
- [ ] **4.2 Read Status Management (`markNotificationRead`, `markAllNotificationsRead`, `getUnreadNotificationCount`)**
  - **What it does:** Tracks unread counter and marks single or bulk notifications as read.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Mark single: Specific notification marked `read: true`.
    - Mark all: All user notifications set to `read: true`.
    - Counter: `getUnreadNotificationCount` accurately reflects unread records.

---

## Feature Area 5: User Profile & Badges (Priority: P1 - High)
Player identity, avatar uploads, biographical details, and showcased badges.

- [ ] **5.1 Profile Update (`updateProfile`)**
  - **What it does:** Modifies name, bio, handle, GitHub URL, and LinkedIn URL.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Happy path: Valid handles and URLs updated successfully.
    - Validation: Unique handle constraint, invalid URL schemas.
    - Security: Cannot modify another user's profile.
- [ ] **5.2 Featured Badges (`updateFeaturedBadges`)**
  - **What it does:** Allows users to pick up to 3 earned badges to display on their public card.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Happy path: Up to 3 badges set with `isFeatured: true`.
    - Validation: Cannot feature unearned badges or exceed max limit (e.g. 3).
- [ ] **5.3 Profile Image Upload (`uploadProfileImage`)**
  - **What it does:** Validates file size, MIME type, and uploads to blob storage.
  - **Test Type:** Unit
  - **Key Scenarios:**
    - Size limit: Rejects files > 2MB.
    - Type check: Rejects non-image files (e.g. .pdf or .exe).

---

## Feature Area 6: Admin Member Management & Assignment (Priority: P1 - High)
Staff oversight: direct quest assignments, roles, suspensions, and manual resets.

- [ ] **6.1 Direct Quest Assignment (`assignQuest`)**
  - **What it does:** Admin forces assignment of a quest to a specific user.
  - **Test Type:** Integration / Unit
  - **Key Scenarios:**
    - Happy path: User receives snatch with `assignedById`.
    - Force flag: Bypasses max capacity only if `force = true`.
    - Penalty guard: Blocked if user has an active penalty.
- [ ] **6.2 Member Role & Account Actions (`updateUserRole`, `deactivateUser`, `deleteUser`, `manualReset`)**
  - **What it does:** Grants/revokes Admin role, suspends accounts, resets points/stats.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Role switch: Member <-> Admin updates DB role.
    - Self-demotion guard: Admin cannot remove their own admin role or delete themselves.
    - Reset stats: `manualReset` zeroes out points and completedQuests.

---

## Feature Area 7: Auth, Guards & Security Infrastructure (Priority: P0 - Critical)
Authentication credentials, role guards, and rate limiting.

- [x] **7.1 Authorization Guards (`requireAuth`, `requireAdmin`)**
  - **What it does:** Enforces authenticated session and Admin role on server actions and route handlers.
  - **Test Type:** Unit
  - **Key Scenarios:**
    - requireAuth: Throws Unauthorized when session is missing.
    - requireAdmin: Throws Forbidden when user role is "Member".
- [x] **7.2 Rate Limiting (`rateLimit`)**
  - **What it does:** Throttles abusive requests via Upstash Redis or memory fallback.
  - **Test Type:** Unit
  - **Key Scenarios:**
    - Normal usage: Allows requests within quota.
    - Spike abuse: Blocks requests when limit exceeded.
- [x] **7.3 Signup & Auth Logic (`signup`, `authenticate`)**
  - **What it does:** Validates password complexity, checks duplicate email, hashes password, creates verification token.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Weak password rejection.
    - Duplicate email conflict handling.

---

## Feature Area 8: Leaderboard, Activity Feed & Analytics (Priority: P2 - Normal)
Community engagement feeds and metrics computation.

- [ ] **8.1 Leaderboard Ranking (`getLeaderboardUsers`, `getLeaderboardStanding`)**
  - **What it does:** Orders users by points descending, computes rank, pagination, and user's relative standing.
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Rank calculation: Ties, pagination offsets.
    - Standing: Accurate rank calculation for caller outside top 10.
- [ ] **8.2 Activity Feed & Dashboard Stats (`getActivityFeed`, `getAdminDashboardStats`)**
  - **What it does:** Computes recent system events and aggregate dashboard KPIs (active snatches, total users, pending reviews).
  - **Test Type:** Unit / Integration
  - **Key Scenarios:**
    - Stats aggregation: Correct counts for pending vs accepted snatches.
    - Feed parsing: Formats snatch/badge activities accurately.

---

## Feature Area 9: Core UI Components (Priority: P2 - Normal)
Render validation, accessibility, and interactive behaviors on client components.

- [ ] **9.1 QuestCard Component**
  - **What it does:** Displays quest badges, difficulty colors, points, snatch count, and action triggers.
  - **Test Type:** Component Unit (@testing-library/react)
  - **Key Scenarios:**
    - Renders points, difficulty badge, title.
    - Correct status indicator (Closed vs Open).
- [ ] **9.2 QuestTimer Component**
  - **What it does:** Shows countdown to quest deadline and indicates expired status.
  - **Test Type:** Component Unit (@testing-library/react)
  - **Key Scenarios:**
    - Displays remaining hours/days.
    - Renders 'Expired' when deadline is past.
- [ ] **9.3 Pagination Component**
  - **What it does:** Provides page numbers, prev/next buttons, and disabled states.
  - **Test Type:** Component Unit (@testing-library/react)
  - **Key Scenarios:**
    - Disables 'Previous' on page 1.
    - Emits page change event on click.
- [ ] **9.4 Header & Navigation Component**
  - **What it does:** Renders navigation links, unread notification counter, and login/profile buttons.
  - **Test Type:** Component Unit (@testing-library/react)
  - **Key Scenarios:**
    - Shows admin link only if user role is Admin.
    - Displays unread notification badge when count > 0.
