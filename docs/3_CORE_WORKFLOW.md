# CodeQuest: Core Workflow & Gamification System

This document explains the central "Questing" loop that drives user engagement in CodeQuest. The system is designed to simulate a gamified, RPG-like experience for UKM Coding members.

## The Questing Loop

### 1. Quest Creation (Admin)
- Admins create `Quest` records.
- **Properties**: 
  - `difficulty` (Beginner, Intermediate, Advanced)
  - `category` (Web, AI, Mobile)
  - `points` (Reward value)
  - `status` (Draft, Active, Closed)
  - `maxSnatchers` (Limit on how many students/squads can take this quest).

### 2. Snatching (User)
- A User browses Active quests on the Quest Board.
- When they find an appealing quest, they **"Snatch"** it. 
- This creates a `Snatch` record in the database connecting the `User` and the `Quest`.
- **Status Progression**: The initial status of a Snatch is `ACTIVE`.
- **Squads**: Users can also form a `Squad` (team) to snatch a quest together, linking multiple users to the same Snatch record via a `squadId`.

### 3. Submission (User)
- The User works on the quest requirements (e.g., building a landing page, solving an algorithm).
- They submit their work by providing a `submissionUrl` (e.g., a GitHub repo link or Vercel deployment).
- The Snatch status changes to `SUBMITTED`.

### 4. Review & Validation (Admin)
Admins review `SUBMITTED` snatches and provide one of three verdicts:
- **`ACCEPTED`**: The work meets all requirements.
- **`REVISION_NEEDED`**: The work is incomplete. Admin leaves `feedback`, and the user must update their submission.
- **`REJECTED`**: The work is invalid (e.g., plagiarism, completely off-topic). The quest is failed.

### 5. Rewards & Gamification (System)
When a Snatch is marked as `ACCEPTED`, the system triggers the reward cascade:
1. **Points Distribution**: The user's `points` and `completedQuests` counters are incremented.
2. **Badge Evaluation**: The system checks if the user qualifies for any new `Badge`s (e.g., "First Blood" for their first quest, or "Web Master" for completing 5 Web quests).
3. **Notification**: An in-app `Notification` is generated to alert the user of their success and newly earned rewards.

## Enforcement & Penalties
To maintain quality and discipline:
- Users who abandon a snatched quest past its `deadline` or submit plagiarized work can be issued a `Penalty` by admins.
- A penalty restricts the user from snatching new quests until the penalty `expiresAt` date passes.
