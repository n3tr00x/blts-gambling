# BLTS Gambling

A modern web application for tracking statistics and managing betting picks in a bookmaking venture. Built with Next.js, React, and Supabase.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database](#database)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Development Guidelines](#development-guidelines)
- [License](#license)

## ✨ Features

- **User Authentication**: Passwordless OTP (One-Time Password) authentication via email with Supabase
- **Betting Rounds Management**: Create, view, and manage betting rounds with multiple picks
- **Leaderboards**: Track player performance across different time periods (season, monthly)
- **Analytics Dashboard**:
  - League effectiveness charts
  - Player effectiveness progress tracking
  - Betting odds by round analysis
  - Risk index visualization
  - Bets per league distribution
- **Professional UI**: Built with Radix UI components and Tailwind CSS
- **Dark Mode Support**: Theme switcher with next-themes
- **Responsive Design**: Mobile-friendly interface with adaptive navigation
- **Real-time Data**: Integration with Supabase for data synchronization

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15.4
- **Runtime**: React 19.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **UI Components**: Radix UI
- **Form Management**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Theming**: next-themes

### Backend & Database

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with OTP (One-Time Password via email)
- **ORM/Query**: Supabase JavaScript client

### Development

- **Package Manager**: npm/yarn
- **Linting**: ESLint
- **CSS Processing**: PostCSS
- **Build Tool**: Next.js with Turbopack

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ (LTS recommended)
- npm or yarn
- Docker (for local Supabase development)
- Git

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd blts-gambling
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Supabase CLI**
   ```bash
   # Use the project-local CLI (installed via devDependencies)
   npx supabase --version
   ```

## 🔐 Environment Setup

Create the following environment files in the root directory:

### Required Variables

**Core Supabase (OTP Authentication):**

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (used for OTP authentication and database)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (required for OTP sign-in and public API access)

**Email Service (Resend):**

- `RESEND_API_KEY`: API key from Resend for sending OTP emails
- `RESEND_ADMIN_EMAIL`: Admin email address for Resend
- `RESEND_SENDER_NAME`: Display name for emails sent via Resend

**Application URLs:**

- `BASE_URL`: Base URL of the application (used for redirects after OTP verification)
- `ADDITIONAL_REDIRECT_URLS`: Additional allowed redirect URLs (comma-separated)

**Note**: Supabase URL and anonymous keys are public by design and should be included in the client-side code. Resend API key must be kept secret and only used server-side.

### `.env.development`

```env
NODE_ENV=development

BASE_URL=http://localhost:3000
ADDITIONAL_REDIRECT_URLS=https://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>

RESEND_API_KEY=<your-resend-api-key>
RESEND_ADMIN_EMAIL=<your-admin-email@example.com>
RESEND_SENDER_NAME=Your App Name (development)
```

**Local Setup**:

- Run `npm run db:start` to start Supabase locally
- Get the anon key from Supabase dashboard output or `supabase/.env.local`
- Sign up for free Resend account at https://resend.com and get your API key

### `.env.staging`

```env
NODE_ENV=staging

BASE_URL=https://staging.example.com
ADDITIONAL_REDIRECT_URLS=https://staging.example.com

NEXT_PUBLIC_SUPABASE_URL=<staging-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<staging-supabase-key>

RESEND_API_KEY=<staging-resend-api-key>
RESEND_ADMIN_EMAIL=<staging-admin-email@example.com>
RESEND_SENDER_NAME=Your App Name (staging)
```

**Configuration**:

- Ensure OTP email provider is configured in Supabase staging project
- Use separate Resend workspace/API key for staging

**Configuration**:

- Ensure OTP email provider is configured in Supabase production project
- Verify Resend email templates and sender details
- Use production Resend API key with verified domain for better deliverability

## 🗄️ Database

### Local Development with Supabase

1. **Start Supabase locally**

   ```bash
   npm run db:start
   ```

   This starts the local Supabase instance with PostgreSQL.

2. **Reset database** (apply all migrations)

   ```bash
   npm run db:reset
   ```

3. **Generate TypeScript types** from database schema

   ```bash
   npm run db:types
   ```

   This creates `lib/supabase/database/database.generated.ts` with auto-generated types.

4. **Stop Supabase**
   ```bash
   npm run db:stop
   ```

### Database Structure

Migrations are stored in `supabase/migrations/` and applied automatically when resetting or running in production.

## ▶️ Running the Application

### Development

**Development Environment** (local Supabase)

```bash
npm run dev
```

- Runs on `http://localhost:3000`
- Hot reload enabled
- Uses `.env.development`

**Staging Environment**

```bash
npm run dev:staging
```

- Uses `.env.staging` configuration
- For testing changes before production

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
blts-gambling/
├── app/                          # Next.js App Router
│   ├── (charts)/                 # Charts dashboard layout with parallel routes
│   ├── @auth/                    # Auth slot (intercepted routes for modal login)
│   │   ├── default.tsx           # Default layout
│   │   └── (.)sign-in/           # Intercepted sign-in modal
│   ├── leaderboard/              # Leaderboard pages
│   ├── rounds/                   # Rounds management pages
│   │   ├── page.tsx              # Rounds list
│   │   ├── [id]/                 # Round details
│   │   └── new/                  # Create new round
│   ├── sign-in/                  # Sign in page (full page)
│   ├── layout.tsx                # Root layout
│   ├── error.tsx                 # Error boundary
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── auth/                     # Authentication components (OTP flow)
│   │   ├── email-form.tsx        # Email input form (step 1)
│   │   ├── otp-form.tsx          # OTP verification form (step 2)
│   │   └── otp-resend-feedback.tsx # Resend OTP feedback
│   ├── charts/                   # Data visualization components
│   │   ├── bets-per-league-chart.tsx
│   │   ├── league-effectiveness.tsx
│   │   ├── players-effectiveness-progress.tsx
│   │   ├── players-odds-by-round.tsx
│   │   ├── risk-index.tsx
│   │   └── ...
│   ├── leaderboard/              # Leaderboard components
│   │   ├── all-season.tsx
│   │   ├── data-table.tsx
│   │   ├── columns.tsx
│   │   └── ...
│   ├── navigation/               # Navigation components
│   │   ├── main-navigation.tsx
│   │   ├── mobile-navigation.tsx
│   │   └── navigation.tsx
│   ├── round-details/            # Round details UI
│   │   ├── round-details-card.tsx
│   │   ├── round-picks-info.tsx
│   │   ├── round-votes-table.tsx
│   │   └── ...
│   ├── round-form/               # Round creation/editing form
│   │   ├── add-picks-form.tsx
│   │   ├── remove-round-button.tsx
│   │   ├── remove-round-dialog.tsx
│   │   └── ...
│   ├── tables/                   # Data table components
│   ├── ui/                       # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   └── ... (shadcn/ui components)
│   ├── alert-dialog.tsx
│   └── theme-provider.tsx
│
├── constants/                    # Application constants
│   └── navigation.tsx
│
├── hooks/                        # Custom React hooks
│   ├── use-round-filter-form.ts
│   ├── use-round-filters.ts
│   ├── use-round-form.ts
│   ├── use-send-otp.ts          # Hook for sending OTP
│   └── use-verify-otp.ts        # Hook for OTP verification
│
├── lib/                          # Utility functions and libraries
│   ├── auth/                     # Authentication actions
│   │   ├── index.ts              # sendOtpAction, verifyOtpAction, signOutAction
│   ├── supabase/                 # Supabase client and utilities
│   └── utilities/                # Helper functions
│
├── schemas/                      # Zod validation schemas
│   ├── index.ts
│   ├── new-round.schema.ts
│   ├── pick-form.schema.ts
│   ├── round-primary.schema.ts
│   └── votes-form.schema.ts
│
├── supabase/                     # Supabase configuration
│   ├── config.toml               # Local development config
│   ├── migrations/               # Database migrations
│   ├── schemas/                  # Database schemas
│   ├── seeds/                    # Seed data
│   └── snippets/                 # SQL snippets
│
├── types/                        # TypeScript type definitions
│   ├── actions.types.ts
│   ├── filters.types.ts
│   ├── index.ts
│   └── utils.types.ts
│
├── middleware.ts                 # Next.js middleware
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
├── components.json               # shadcn/ui components config
└── package.json                  # Project dependencies
```

## 📜 Available Scripts

| Script                | Purpose                                                 |
| --------------------- | ------------------------------------------------------- |
| `npm run dev`         | Start dev server with local Supabase (.env.development) |
| `npm run dev:staging` | Start dev server with staging (.env.staging)            |
| `npm run build`       | Build for production                                    |
| `npm start`           | Start production server                                 |
| `npm run lint`        | Run ESLint                                              |
| `npm run db:start`    | Start local Supabase instance                           |
| `npm run db:stop`     | Stop local Supabase instance                            |
| `npm run db:reset`    | Reset database and apply all migrations                 |
| `npm run db:types`    | Generate TypeScript types from database schema          |

## 💡 Development Guidelines

### Code Style

- Follow ESLint configuration
- Use TypeScript for type safety
- Use Zod for schema validation
- Follow component naming conventions (PascalCase for components)

### Form Validation

- Use Zod schemas defined in `schemas/` directory
- Use React Hook Form for form state management
- Apply schema validation in form components

### Components

- Create reusable UI components in `components/ui/`
- Keep components focused and single-responsibility
- Use Radix UI primitives as a base
- Apply Tailwind CSS for styling

### Database

#### Type Generation

- Generate types after adding migrations: `npm run db:types`
- Types are auto-generated in `lib/supabase/database/database.generated.ts`
- Import and use generated types for type-safe database operations:

  ```typescript
  import type { Database } from '@/lib/supabase/database/database.generated';

  type Round = Database['public']['Tables']['rounds']['Row'];
  type NewRound = Database['public']['Tables']['rounds']['Insert'];
  ```

- **Always regenerate types** after creating new migrations to keep schema in sync

#### Database Migrations

- Keep all migrations in `supabase/migrations/`
- Create new migration: `supabase migration new migration_name`
- Apply migrations locally: `npm run db:reset` (dev only)
- For production, apply migrations with Supabase (e.g. `npx supabase db push` / CI) and then regenerate types: `npm run db:types`

### Server Actions

- Server actions are used for server-side mutations and data fetching
- Define server actions in files with `'use server'` directive
- Location: `app/actions/` or co-located with components
- Use Supabase client for database operations:
- Always validate input with Zod schemas before database operations
- Use type-safe database types from `database.generated.ts`
- Return only serializable data (no functions, dates must be strings)

### Authentication (OTP via Email)

The application uses a passwordless authentication system with OTP (One-Time Password) sent via email:

**Flow:**

1. User enters their email address
2. `sendOtpAction()` sends a 6-digit OTP to the user's email
3. User receives the code and enters it in the verification form
4. `verifyOtpAction()` validates the OTP with Supabase
5. On successful verification, user is authenticated and redirected to the dashboard

**Implementation:**

- Auth actions are defined in `lib/auth/index.ts`
- Email form component: `components/auth/email-form.tsx`
- OTP form component: `components/auth/otp-form.tsx`
- Sign-in page: `app/sign-in/page.tsx`
- Auth routing uses intercepted routes via `@auth/` slot for modal display

**Important Notes:**

- OTP tokens expire after 15 minutes
- Only registered users can receive OTP codes
- The `shouldCreateUser: false` option prevents auto-registration

### Styling

- Use Tailwind CSS utilities
- Follow the design system defined in components
- Support dark mode with next-themes

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit with clear messages
4. Push to your branch
5. Create a Pull Request

## 📄 License

This project is private and proprietary.

---

**Last Updated**: March 2026
**Version**: 0.1.0
