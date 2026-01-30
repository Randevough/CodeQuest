# CodeQuest: Project Documentation

## 📖 Introduction
Welcome to **CodeQuest**, a gamified collaboration platform designed to transform standard development tasks into engaging challenges. By reimagining a task board as a "Quest Board," CodeQuest turns issue tracking into a competitive and rewarding experience for developer communities and student clubs.

The platform is built with a focus on modern web standards, performance, and a premium user experience, ensuring that "work" feels a lot more like "play."

---

## 🛠️ Technology Stack
CodeQuest leverages a cutting-edge stack optimized for speed, type safety, and developer productivity:

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) - For server-side rendering, robust routing, and API handling.
- **Language:** TypeScript - Ensuring code reliability and maintainability across the full stack.
- **Database:** SQLite with [Prisma ORM](https://www.prisma.io/) - For a responsive, design-system-driven user interface.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) - For a responsive, design-system-driven user interface.
- **Authentication:** NextAuth.js (Beta) - Secure and flexible user authentication.
- **State Management:** Server Actions & React Hooks - Minimizing client-side complexity.

---

## 🏗️ Architecture & Core Concepts

### 1. The Quest Model
At the heart of the system is the **Quest**. Unlike a standard Jira ticket, a Quest is designed to be "snatched" by a brave developer.
- **Difficulty Levels:** Beginner, Intermediate, Advanced (each with corresponding point values).
- **Categories:** Web, AI, Mobile, Design.
- **Snatching:** A unique mechanism where a user claims a quest. The system enforces limits (e.g., `maxSnatchers`) to prevent over-assignment.

### 2. User Progression
Users aren't just assignees; they are players.
- **Profiles:** Track completed quests, total points, and current active snatches.
- **Roles:** The system distinguishes between standard **Members** and **Admins**. Admins hold the keys to manage quests and review submissions.
- **Penalties:** To ensure accountability, an admin can issue penalties offering a mechanism for moderation.

### 3. Submission Workflow
The workflow is designed to ensure quality:
1.  **Search**: Users filter the board to find a quest they like.
2.  **Snatch**: The user commits to the quest.
3.  **Submit**: Once done, work is submitted (via URL/Repo).
4.  **Review**: Admins or peers review the work and provide feedback.
5.  **Reward**: Points are awarded upon approval.

---

## 🚀 Getting Started

To get the application running locally:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Database Setup:**
    Ensure your `.env` file is configured, then run:
    ```bash
    npx prisma db push
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

## 🔮 Future Vision
While the core system is robust, CodeQuest is evolving. Future roadmap items include a deeper **Achievement System** to reward specific behaviors (like "Bug Hunter" badges) and **Squads** to allow team-based competitions.
