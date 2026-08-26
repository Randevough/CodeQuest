# CodeQuest Tech Stack

This document outlines the detailed technology stack used in CodeQuest. The choices reflect a priority on developer experience (DX), performance, and leveraging modern serverless/edge paradigms while keeping hosting costs near zero.

## 1. Core Framework & UI
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | `16.1.4` | Core React framework. Uses the App Router (`/src/app`) for routing, Server Components (RSC) for optimized rendering, and Server Actions for data mutation. |
| **React** | `19.2.3` | UI Library. |
| **Tailwind CSS** | `3.4.1` | Utility-first CSS framework for rapid styling. |
| **Lucide / Material Symbols** | N/A | Iconography (using standard spans or libraries). |

## 2. Database & ORM
| Technology | Version | Purpose |
|------------|---------|---------|
| **Prisma** | `5.10.0` | Next-generation Node.js and TypeScript ORM. Provides a type-safe database client (`@prisma/client`) and schema migrations. |
| **Supabase** | N/A | Serverless PostgreSQL provider. Holds the core operational data (Users, Quests, Badges). |

## 3. Authentication & Security
| Technology | Version | Purpose |
|------------|---------|---------|
| **Auth.js (NextAuth)** | `5.0.0-beta.30` | Authentication library. Configured to use Credentials with bcrypt for password hashing. JWT strategy is employed. |
| **bcryptjs** | `3.0.3` | Hashing user passwords before storing them in the database. |
| **Zod** | `4.3.6` | TypeScript-first schema declaration and validation library. Used to validate Server Actions inputs and login/signup forms. |
| **Upstash Redis** | `1.38.0` | Edge Redis database used exclusively for Rate Limiting. |
| **Upstash Ratelimit** | `2.0.8` | Protects auth endpoints from brute-force and spam attacks. |

## 4. UI Components & Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| **Sonner** | `2.0.7` | An opinionated toast component for React, used for elegant, non-intrusive notifications (success/error states). |
| **Recharts** | `3.7.0` | Composable charting library built on React components. Used in the Admin Dashboard to visualize user engagement and quest completion rates. |
| **React Day Picker** | `9.13.0` | Flexible date picker component for React, used for setting Quest deadlines. |
| **Date-fns** | `4.1.0` | Modern JavaScript date utility library. Used for formatting timestamps and deadlines. |
| **use-debounce** | `10.1.0` | React hook for debouncing fast-changing values (e.g., search inputs in the dashboard). |

## 5. Third-Party Integrations
| Technology | Version | Purpose |
|------------|---------|---------|
| **Vercel Blob** | `2.2.0` | Serverless storage solution built on Cloudflare R2 / AWS S3. Used for storing user avatars and file uploads (quest submissions). |
| **Resend** | `6.17.1` | Email API for developers. Used to send verification emails and notifications (requires a verified custom domain). |

## 6. Development & Testing
| Technology | Version | Purpose |
|------------|---------|---------|
| **TypeScript** | `5.x` | Strongly typed programming language that builds on JavaScript. |
| **ESLint** | `9.x` | Linter tool for identifying and reporting on patterns in JavaScript/TypeScript. |
| **Vitest** | `4.1.9` | Blazing fast unit test framework powered by Vite. Used for testing internal logic and utilities. |
| **Testing Library** | `16.3.2` | Simple and complete React DOM testing utilities that encourage good testing practices. |
