# RA Diaeta — Full Project Audit Report

**Date:** 2026-07-24  
**Auditor:** AI (automated codebase scan)  
**Purpose:** External review of the full application state — what exists, what works, what doesn't.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Data Layer](#2-data-layer)
3. [Routes/Pages Inventory](#3-routespages-inventory)
4. [API Endpoints](#4-api-endpoints)
5. [Auth & Security](#5-auth--security)
6. [Features — Implemented vs. Partial vs. Missing](#6-features)
7. [UI/UX and Visual Design](#7-uiux-and-visual-design)
8. [Performance & Loading States](#8-performance--loading-states)
9. [Known Bugs and TODOs](#9-known-bugs-and-todos)
10. [Translations](#10-translations)
11. [Testing & Deployment](#11-testing--deployment)

---

## 1. Project Structure

### Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (Turbopack) | 16.2.11 |
| React | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS (CSS-first, v4) | ^4 |
| UI Components | shadcn v4 (base-nova style) + @base-ui/react + Radix | — |
| Animation | Framer Motion | ^12.42.2 |
| Database | MongoDB Atlas (cloud) | — |
| ODM | Mongoose | ^9.8.0 |
| Auth | NextAuth v5 (beta) | ^5.0.0-beta.32 |
| i18n | next-intl | ^4.13.3 |
| Forms | React Hook Form + Zod | ^7.82.0 / ^4.4.3 |
| Charts | Recharts | ^3.10.0 |
| Icons | Lucide React | ^1.25.0 |
| Hosting | Vercel (frontend) + Vercel (backend, separate repo) | — |
| Testing | Playwright (E2E only) | ^1.61.1 |

### Full File Tree (excluding node_modules, .git, .next, build artifacts)

```
RA dietation/fittracker/
├── CLAUDE.md
├── AGENTS.md
├── AUDIT.md
├── README.md
├── .gitignore
├── .env                          ← live secrets (NOT in git)
├── .env.example                  ← placeholder template
├── .env.production               ← live production secrets (NOT in git)
├── components.json               ← shadcn config
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── playwright.config.ts
├── postcss.config.mjs
├── skills-lock.json              ← legacy Prisma skill refs (unused)
├── tsconfig.json
│
├── prisma/
│   └── fittracker.db             ← legacy SQLite (unused)
│
├── public/
│   ├── file.svg                  ← default Next.js scaffold
│   ├── globe.svg                 ← default Next.js scaffold
│   ├── next.svg                  ← default Next.js scaffold
│   ├── vercel.svg                ← default Next.js scaffold
│   └── window.svg                ← default Next.js scaffold
│
├── scripts/
│   ├── seed-mongo.ts
│   ├── seed-recipes.ts
│   ├── seed-foods-expanded.ts
│   ├── seed-medical.ts
│   └── seed-medical-expanded.ts
│
├── e2e/
│   ├── app.spec.ts               ← ~70 Playwright tests
│   ├── auth.setup.ts
│   ├── generate-tests.js
│   └── .auth/user.json
│
├── test-results/
│   └── .last-run.json            ← status: passed
│
└── src/
    ├── proxy.ts
    │
    ├── app/
    │   ├── favicon.ico
    │   ├── globals.css            ← Tailwind v4 theme (oklch colors)
    │   ├── layout.tsx             ← root (passthrough)
    │   ├── page.tsx               ← redirects to /en
    │   ├── not-found.tsx
    │   │
    │   ├── [locale]/
    │   │   ├── layout.tsx         ← main shell (font, providers, i18n, metadata)
    │   │   ├── page.tsx           ← redirects to /dashboard
    │   │   │
    │   │   ├── (auth)/
    │   │   │   ├── error.tsx
    │   │   │   ├── login/page.tsx
    │   │   │   ├── register/page.tsx
    │   │   │   └── onboarding/page.tsx
    │   │   │
    │   │   └── (dashboard)/
    │   │       ├── layout.tsx     ← auth guard + sidebar + bottom nav
    │   │       ├── loading.tsx
    │   │       ├── error.tsx
    │   │       ├── dashboard/page.tsx
    │   │       ├── meals/page.tsx
    │   │       ├── training/page.tsx
    │   │       ├── body/page.tsx
    │   │       ├── fasting/page.tsx
    │   │       ├── recipes/page.tsx
    │   │       ├── medical/page.tsx
    │   │       ├── analytics/page.tsx
    │   │       ├── water/page.tsx
    │   │       ├── notifications/page.tsx
    │   │       └── settings/page.tsx
    │   │
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts
    │       ├── auth/register/route.ts
    │       ├── dashboard/route.ts
    │       ├── meals/route.ts
    │       ├── foods/route.ts
    │       ├── exercises/route.ts
    │       ├── workouts/route.ts
    │       ├── water/route.ts
    │       ├── fasting/route.ts
    │       ├── recipes/route.ts
    │       ├── medical/route.ts
    │       ├── body-measurements/route.ts
    │       ├── notifications/route.ts
    │       ├── onboarding/route.ts
    │       └── user/profile/route.ts
    │
    ├── components/
    │   ├── providers.tsx
    │   ├── brand/
    │   │   ├── Logo.tsx           ← UNUSED (never imported)
    │   │   └── LogoIcon.tsx
    │   ├── body/
    │   │   ├── BodyVisualization.tsx
    │   │   └── MeasurementTutorial.tsx  ← UNUSED (never imported)
    │   ├── layout/
    │   │   ├── navigation.tsx     ← MainNav + DesktopSidebar
    │   │   └── ThemeToggle.tsx
    │   └── ui/                    ← shadcn v4 primitives (17 files)
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── dialog.tsx
    │       ├── dropdown-menu.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── switch.tsx
    │       ├── tabs.tsx
    │       └── tooltip.tsx
    │
    ├── lib/
    │   ├── utils.ts
    │   ├── mongodb.ts
    │   ├── auth.ts
    │   └── i18n/
    │       ├── config.ts
    │       ├── request.ts
    │       └── routing.ts
    │
    ├── models/                    ← 13 model files, 17 exported models
    │   ├── index.ts
    │   ├── Auth.ts
    │   ├── User.ts
    │   ├── Food.ts
    │   ├── MealLog.ts
    │   ├── Recipe.ts
    │   ├── Exercise.ts
    │   ├── WorkoutSession.ts
    │   ├── BodyMeasurement.ts
    │   ├── FastingLog.ts
    │   ├── FastingPreference.ts
    │   ├── WaterLog.ts
    │   ├── MedicalKnowledge.ts
    │   └── NotificationPreference.ts
    │
    └── messages/
        ├── en.json                ← 741 lines, English
        └── ar.json                ← 741 lines, Arabic
```

### Dependency Audit

#### Production Dependencies (37)

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| `next` | 16.2.11 | Framework | ✅ Used |
| `react` / `react-dom` | 19.2.4 | UI library | ✅ Used |
| `mongoose` | ^9.8.0 | MongoDB ODM | ✅ Used |
| `next-auth` | ^5.0.0-beta.32 | Authentication | ⚠️ Beta version — risky for production |
| `next-intl` | ^4.13.3 | i18n (EN/AR) | ✅ Used |
| `next-themes` | ^0.4.6 | Dark/light toggle | ✅ Used |
| `@tanstack/react-query` | ^5.101.4 | Server-state caching | ⚠️ Installed but NOT actively used — all fetch is manual `useEffect`+`fetch` |
| `react-hook-form` | ^7.82.0 | Form management | ✅ Used |
| `@hookform/resolvers` | ^5.4.0 | Zod resolver for RHF | ✅ Used |
| `zod` | ^4.4.3 | Schema validation | ✅ Used (in forms, not API routes) |
| `zustand` | ^5.0.14 | Client state management | ⚠️ Installed but NOT actively used — no stores defined |
| `framer-motion` | ^12.42.2 | Animations | ✅ Used (BodyVisualization) |
| `recharts` | ^3.10.0 | Charts/analytics | ✅ Used (analytics page) |
| `date-fns` | ^4.4.0 | Date utilities | ✅ Used |
| `lucide-react` | ^1.25.0 | Icons | ✅ Used |
| `class-variance-authority` | ^0.7.1 | Variant utility (shadcn) | ✅ Used |
| `clsx` | ^2.1.1 | Conditional classes | ✅ Used |
| `tailwind-merge` | ^3.6.0 | Tailwind class merging | ✅ Used |
| `tw-animate-css` | ^1.4.0 | Tailwind animations | ✅ Used |
| `bcryptjs` | ^3.0.3 | Password hashing | ✅ Used |
| `dotenv` | ^17.4.2 | Env variable loading | ❌ REDUNDANT — Next.js auto-loads `.env` files |
| `@base-ui/react` | ^1.6.0 | MUI headless components | ❌ UNUSED — shadcn/Radix is the UI layer |
| `shadcn` | ^4.14.0 | CLI tool | ⚠️ Should be in devDependencies |
| `@radix-ui/react-avatar` | ^1.2.3 | Avatar (shadcn) | ✅ Used |
| `@radix-ui/react-dialog` | ^1.1.20 | Dialog (shadcn) | ✅ Used |
| `@radix-ui/react-dropdown-menu` | ^2.1.21 | Dropdown (shadcn) | ✅ Used |
| `@radix-ui/react-label` | ^2.1.12 | Label (shadcn) | ✅ Used |
| `@radix-ui/react-popover` | ^1.1.20 | Popover (shadcn) | ✅ Used |
| `@radix-ui/react-progress` | ^1.1.13 | Progress bar (shadcn) | ✅ Used |
| `@radix-ui/react-scroll-area` | ^1.2.15 | Scroll area (shadcn) | ✅ Used |
| `@radix-ui/react-select` | ^2.3.4 | Select (shadcn) | ✅ Used |
| `@radix-ui/react-separator` | ^1.1.12 | Separator (shadcn) | ✅ Used |
| `@radix-ui/react-slot` | ^1.3.0 | Slot (shadcn) | ✅ Used |
| `@radix-ui/react-switch` | ^1.3.4 | Switch (shadcn) | ✅ Used |
| `@radix-ui/react-tabs` | ^1.1.18 | Tabs (shadcn) | ✅ Used |
| `@radix-ui/react-tooltip` | ^1.2.13 | Tooltip (shadcn) | ✅ Used |

**Flagged packages to remove:**
- `@base-ui/react` — leftover, not used with shadcn
- `dotenv` — redundant with Next.js

**Flagged packages to move to devDependencies:**
- `shadcn` (CLI tool)

**Flagged packages to evaluate:**
- `@tanstack/react-query` — installed but unused
- `zustand` — installed but unused
- `next-auth` — production auth on beta package

#### Legacy Artifacts to Delete

| File | Issue |
|------|-------|
| `prisma/fittracker.db` | Legacy SQLite — project uses MongoDB |
| `skills-lock.json` | 9 Prisma skill references — entirely legacy |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Default Next.js scaffold — unused |

---

## 2. Data Layer

### Collections/Schemas Defined

| # | Model | Collection | Fields Count | Timestamps | Indexes |
|---|-------|-----------|-------------|------------|---------|
| 1 | **User** | `users` | 16 | yes | — |
| 2 | **Food** | `foods` | 14 | yes | text(name), barcode, category |
| 3 | **MealLog** | `meal_logs` | 10 | yes | userId+date, unique(userId+date+mealType) |
| 4 | **MealLogItem** | `meal_log_items` | 13 | createdAt | mealLogId |
| 5 | **BodyMeasurement** | `body_measurements` | 15 | createdAt | userId+date |
| 6 | **Recipe** | `recipes` | 18 | yes | category, userId |
| 7 | **RecipeItem** | `recipe_items` | 5 | no | recipeId |
| 8 | **MedicalKnowledge** | `medical_knowledge` | 12 | yes | — |
| 9 | **NotificationPreference** | `notification_preferences` | 21 | updatedAt | unique(userId) |
| 10 | **FastingPreference** | `fasting_preferences` | 17 | updatedAt | unique(userId) |
| 11 | **FastingLog** | `fasting_logs` | 17 | createdAt | userId+date |
| 12 | **Exercise** | `exercises` | 9 | yes | text(name), category, muscleGroup, userId |
| 13 | **WorkoutSession** | `workout_sessions` | 11 | yes | userId+date(desc), userId |
| 14 | **WorkoutSet** | `workout_sets` | 12 | no | — |
| 15 | **WaterLog** | `water_logs` | 5 | yes | userId+date(desc) |
| 16 | **Account** | `accounts` | 11 | no | unique(provider+providerAccountId) |
| 17 | **Session** | `sessions` | 4 | no | sessionToken(unique) |
| 18 | **VerificationToken** | `verification_tokens` | 4 | no | unique(identifier+token) |

### Detailed Field Definitions

#### User
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `email` | String | yes | — | `unique: true` |
| `name` | String | yes | — | |
| `passwordHash` | String | no | — | Not set for OAuth users |
| `image` | String | no | — | Profile image |
| `emailVerified` | Date | no | — | |
| `isOnboarded` | Boolean | no | `false` | Gates dashboard access |
| `sex` | String | no | `"male"` | enum: male, female, other |
| `dateOfBirth` | Date | no | — | |
| `heightCm` | Number | no | — | |
| `weightKg` | Number | no | — | |
| `activityLevel` | Number | no | — | 1-5 scale |
| `goal` | String | no | `"maintain"` | enum: maintain, lose, gain |
| `targetWeightKg` | Number | no | — | |
| `locale` | String | no | `"ar"` | |
| `units` | String | no | `"metric"` | enum: metric, imperial |

#### Food
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `source` | String | no | `"user"` | user / usda |
| `sourceId` | String | no | — | External API ID |
| `name` | String | yes | — | Indexed text search |
| `nameAr` | String | no | — | Arabic name |
| `brand` | String | no | — | |
| `category` | String | yes | — | Indexed |
| `servingSize` | Number | no | `100` | |
| `servingUnit` | String | no | `"g"` | |
| `servingDescription` | String | no | — | |
| `imageUrl` | String | no | — | |
| `barcode` | String | no | — | Indexed |
| `nutrientProfile` | Object | no | `{}` | calories, protein, carbs, fat, fiber (all Number, default 0) |
| `dataQuality` | String | no | `"user-entered"` | |
| `region` | String | no | — | |

#### MealLog
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `userId` | String | yes | — | |
| `date` | Date | no | `Date.now` | |
| `mealType` | String | yes | — | enum: breakfast, lunch, dinner, snack |
| `totalCalories` | Number | no | `0` | |
| `totalProtein` | Number | no | `0` | |
| `totalCarbs` | Number | no | `0` | |
| `totalFat` | Number | no | `0` | |
| `totalFiber` | Number | no | `0` | |
| `notes` | String | no | — | |

#### MealLogItem
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `mealLogId` | String | yes | — | FK → MealLog (string, not ref) |
| `refType` | String | yes | — | |
| `refId` | String | yes | — | |
| `foodId` | String | no | — | |
| `quantity` | Number | yes | — | |
| `unit` | String | no | `"g"` | |
| `servingWeight` | Number | no | — | |
| `calories` | Number | no | `0` | |
| `protein` | Number | no | `0` | |
| `carbs` | Number | no | `0` | |
| `fat` | Number | no | `0` | |
| `fiber` | Number | no | `0` | |

#### BodyMeasurement
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `userId` | String | yes | — | |
| `date` | Date | no | `Date.now` | |
| `weightKg` | Number | no | — | |
| `bodyFatPercent` | Number | no | — | |
| `waistCm` | Number | no | — | |
| `hipCm` | Number | no | — | |
| `bicepCm` | Number | no | — | |
| `chestCm` | Number | no | — | |
| `thighCm` | Number | no | — | |
| `neckCm` | Number | no | — | |
| `bmi` | Number | no | — | Auto-calculated |
| `waistToHipRatio` | Number | no | — | Auto-calculated |
| `notes` | String | no | — | |
| `photoUrl` | String | no | — | Field exists but no upload implemented |

#### Recipe
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `userId` | String | no | — | Optional for presets |
| `name` | String | yes | — | |
| `nameAr` | String | no | — | |
| `description` | String | no | — | |
| `category` | String | no | — | |
| `cuisineStyle` | String | no | — | |
| `cookingMethod` | String | no | — | |
| `instructions` | [String] | no | — | |
| `instructionsAr` | [String] | no | — | |
| `tips` | [String] | no | — | |
| `tipsAr` | [String] | no | — | |
| `prepTimeMinutes` | Number | no | — | |
| `cookTimeMinutes` | Number | no | — | |
| `difficulty` | String | no | — | enum: easy, medium, hard |
| `nutritionPerServing` | Object | no | `{}` | calories, protein, carbs, fat |
| `servingsCount` | Number | no | `1` | |
| `occasions` | [String] | no | — | |

#### MedicalKnowledge
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `foodId` | String | yes | — | unique |
| `foodCategory` | String | yes | — | |
| `micronutrients` | [Mixed] | no | — | |
| `vitamins` | [Mixed] | no | — | |
| `pros` | [Mixed] | no | — | |
| `cons` | [Mixed] | no | — | |
| `conditions` | [Mixed] | no | — | |
| `drugInteractions` | [Mixed] | no | — | |
| `disclaimer` | String | no | — | |
| `disclaimerAr` | String | no | — | |
| `lastReviewed` | Date | no | — | |
| `reviewedBy` | String | no | — | |

#### NotificationPreference
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `userId` | String | — | unique |
| `mealRemindersEnabled` | Boolean | `true` | |
| `mealReminderTimes` | [{hour, minute}] | — | |
| `waterRemindersEnabled` | Boolean | `true` | |
| `waterIntervalMinutes` | Number | `60` | |
| `waterStartTime` | {hour, minute} | — | |
| `waterEndTime` | {hour, minute} | — | |
| `exerciseRemindersEnabled` | Boolean | `true` | |
| `exercisePreferredTime` | {hour, minute} | — | |
| `exerciseDaysOfWeek` | [Number] | — | |
| `weightRemindersEnabled` | Boolean | `true` | |
| `weightPreferredTime` | {hour, minute} | — | |
| `weightFrequency` | String | `"weekly"` | |
| `fastingRemindersEnabled` | Boolean | `true` | |
| `suhoorReminderOffset` | Number | `30` | |
| `iftarReminderOffset` | Number | `15` | |
| `milestoneCelebrations` | Boolean | `true` | |
| `prAlerts` | Boolean | `true` | |
| `measurementRemindersEnabled` | Boolean | `true` | |
| `measurementFrequency` | String | `"monthly"` | |
| `measurementPreferredDay` | Number | `0` | |
| `quietHoursStart` | {hour, minute} | — | |
| `quietHoursEnd` | {hour, minute} | — | |
| `pushToken` | String | — | |
| `pushPlatform` | String | — | |

#### FastingPreference
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `userId` | String | — | unique |
| `ramadanEnabled` | Boolean | `false` | |
| `ramadanAutoDetect` | Boolean | `true` | |
| `ramadanTheme` | Boolean | `false` | |
| `sunnahMondayThursday` | Boolean | `false` | |
| `sunnahAyyamAlBeed` | Boolean | `false` | |
| `sunnahSixDaysShawwal` | Boolean | `false` | |
| `sunnahDayOfArafah` | Boolean | `false` | |
| `sunnahDayOfAshura` | Boolean | `false` | |
| `city` | String | `"Cairo"` | |
| `country` | String | `"Egypt"` | |
| `latitude` | Number | — | |
| `longitude` | Number | — | |
| `calcMethod` | Number | `5` | |
| `hijriAdjustment` | Number | `0` | |
| `suhoorTime` | String | `"03:30"` | |
| `iftarTime` | String | `"19:00"` | |

#### FastingLog
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `userId` | String | — | |
| `date` | Date | `Date.now` | |
| `hijriYear` | Number | — | |
| `hijriMonth` | Number | — | |
| `hijriDay` | Number | — | |
| `fastingType` | String | — | enum: ramadan, sunnah, voluntary |
| `suhoorTime` | String | — | |
| `iftarTime` | String | — | |
| `fajrTime` | String | — | |
| `maghribTime` | String | — | |
| `completed` | Boolean | `false` | |
| `loggedSuhoor` | Boolean | `false` | |
| `suhoorCalories` | Number | — | |
| `suhoorFoods` | [Mixed] | — | |
| `loggedIftar` | Boolean | `false` | |
| `iftarCalories` | Number | — | |
| `iftarFoods` | [Mixed] | — | |
| `fastingDurationHours` | Number | — | |
| `notes` | String | — | |

#### Exercise
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `name` | String | — | text search |
| `nameAr` | String | — | |
| `category` | String | — | |
| `muscleGroup` | String | — | |
| `equipment` | String | `"none"` | |
| `difficulty` | String | `"beginner"` | enum: beginner, intermediate, advanced |
| `isPreset` | Boolean | `false` | |
| `userId` | String | — | |

#### WorkoutSession
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `userId` | String | — | |
| `name` | String | — | |
| `date` | Date | `Date.now` | |
| `duration` | Number | — | minutes |
| `totalVolume` | Number | `0` | auto-calculated |
| `totalSets` | Number | `0` | auto-calculated |
| `totalReps` | Number | `0` | auto-calculated |
| `notes` | String | — | |
| `feeling` | String | `"good"` | enum: great, good, okay, bad |
| `sets` | [WorkoutSetSchema] | — | embedded subdocuments |

#### WaterLog
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `userId` | String | — | |
| `date` | Date | `Date.now` | |
| `amountMl` | Number | — | |
| `note` | String | — | |

### Relationship Map

```
User (_id)
├── MealLog.userId          (1:N)
│   └── MealLogItem.mealLogId  (1:N)
├── WaterLog.userId         (1:N)
├── BodyMeasurement.userId  (1:N)
├── FastingLog.userId       (1:N)
├── FastingPreference.userId (1:1, unique)
├── NotificationPreference.userId (1:1, unique)
├── WorkoutSession.userId   (1:N)
│   └── WorkoutSet embedded in .sets[]  (embedded subdocs)
├── Recipe.userId           (1:N, optional — presets have no userId)
│   └── RecipeItem.recipeId (1:N — defined but NEVER USED)
├── Exercise.userId         (1:N, optional — presets have no userId)
├── Account.userId          (NextAuth — defined but UNUSED)
├── Session.userId          (NextAuth — defined but UNUSED)
└── VerificationToken       (NextAuth — defined but UNUSED)

Food (_id)
├── MedicalKnowledge.foodId (1:1)
├── MealLogItem.foodId      (1:N)
└── RecipeItem.foodId       (1:N — defined but NEVER USED)

Exercise._id ← WorkoutSession.sets[].exerciseId (string match, no ref)
```

**Key observations:**
- **Zero `ref` declarations** — all relationships are plain String fields with manual lookups
- **Zero `populate()` calls** — all joins done in application code
- **Zero cascade deletes** — orphaned records possible
- **Zero pre/post hooks** — no automatic calculations at schema level
- **Zero static methods or virtuals**

### Model Usage Status

| Model | Wired to UI? | Notes |
|-------|-------------|-------|
| User | ✅ Yes | Auth, onboarding, profile, dashboard |
| Food | ✅ Yes | Food search, meals |
| MealLog | ✅ Yes | Meals page, dashboard, analytics |
| MealLogItem | ✅ Yes | Meals page, dashboard |
| BodyMeasurement | ✅ Yes | Body page, dashboard |
| Recipe | ✅ Yes | Recipes page |
| RecipeItem | ❌ Defined but unused | Never imported by any route |
| MedicalKnowledge | ✅ Yes | Medical page |
| NotificationPreference | ✅ Yes | Notifications page |
| FastingPreference | ✅ Yes | Fasting page |
| FastingLog | ✅ Yes | Fasting page |
| Exercise | ✅ Yes | Training page |
| WorkoutSession | ✅ Yes | Training page |
| WorkoutSet | ❌ Defined but unused standalone | Only used as embedded subdoc in WorkoutSession |
| WaterLog | ✅ Yes | Water page, dashboard |
| Account | ❌ Defined but unused | JWT strategy used, not adapter |
| Session | ❌ Defined but unused | JWT strategy used, not adapter |
| VerificationToken | ❌ Defined but unused | JWT strategy used, not adapter |

### Data Validation

| Area | Status |
|------|--------|
| Mongoose schema validation | Minimal — mostly type checks, few `required`, no min/max on numbers |
| API input validation | Inconsistent — some routes validate thoroughly (meals, recipes), others don't (onboarding accepts empty body) |
| Zod schemas | Only used in frontend forms (react-hook-form), NOT in API routes |
| Numeric bounds | Not enforced — weight could be -500kg, age could be 200 |
| Email format | Validated in registration with regex |

---

## 3. Routes/Pages Inventory

### Page Routes

| # | Route | File | Client? | Renders | API Calls |
|---|-------|------|---------|---------|-----------|
| 1 | `/` | `app/page.tsx` | Server | Redirect → `/en` | None |
| 2 | `/{locale}` | `app/[locale]/page.tsx` | Server | Redirect → `/dashboard` | None |
| 3 | `/{locale}/login` | `(auth)/login/page.tsx` | Client | Email/password form + Google OAuth | `signIn("credentials")`, `signIn("google")` |
| 4 | `/{locale}/register` | `(auth)/register/page.tsx` | Client | Registration form + Google OAuth | `POST /api/auth/register`, `signIn("google")` |
| 5 | `/{locale}/onboarding` | `(auth)/onboarding/page.tsx` | Client | 4-step wizard (gender/age → height/weight → activity → goal) | `POST /api/onboarding` |
| 6 | `/{locale}/dashboard` | `(dashboard)/dashboard/page.tsx` | Client | Body viz, calorie/macro cards, water summary, quick actions, today's meals | `GET /api/dashboard` |
| 7 | `/{locale}/meals` | `(dashboard)/meals/page.tsx` | Client | Food search + category filter + recent/favorites + meal builder + history | `GET /api/foods`, `GET /api/meals`, `POST /api/meals` |
| 8 | `/{locale}/training` | `(dashboard)/training/page.tsx` | Client | Exercise search, active workout builder, workout history | `GET /api/exercises`, `GET /api/workouts`, `POST /api/workouts`, `DELETE /api/workouts` |
| 9 | `/{locale}/body` | `(dashboard)/body/page.tsx` | Client | Add measurement form, body visualization, measurement history | `GET /api/body-measurements`, `POST /api/body-measurements`, `GET /api/dashboard` |
| 10 | `/{locale}/fasting` | `(dashboard)/fasting/page.tsx` | Client | Fasting timer, preferences, log, stats, history | `GET /api/fasting`, `POST /api/fasting` |
| 11 | `/{locale}/recipes` | `(dashboard)/recipes/page.tsx` | Client | Create/edit recipe form, search + categories, recipe cards with expand/collapse | `GET /api/recipes`, `POST /api/recipes`, `PUT /api/recipes`, `DELETE /api/recipes` |
| 12 | `/{locale}/medical` | `(dashboard)/medical/page.tsx` | Client | Food search, medical entries with nutrient/benefit/condition tabs | `GET /api/medical` |
| 13 | `/{locale}/analytics` | `(dashboard)/analytics/page.tsx` | Client | Adherence score, calorie/weight/macro charts | `GET /api/dashboard`, `GET /api/meals`, `GET /api/body-measurements` |
| 14 | `/{locale}/water` | `(dashboard)/water/page.tsx` | Client | Progress bar, quick-add buttons, custom input, log history | `GET /api/water`, `POST /api/water`, `DELETE /api/water` |
| 15 | `/{locale}/notifications` | `(dashboard)/notifications/page.tsx` | Client | Master toggle, permission check, 7 toggle cards | `GET /api/notifications`, `PUT /api/notifications` |
| 16 | `/{locale}/settings` | `(dashboard)/settings/page.tsx` | Client | Language toggle, profile edit, data export | `GET /api/user/profile`, `PUT /api/user/profile`, `GET /api/meals`, `GET /api/body-measurements`, `GET /api/water`, `GET /api/workouts` |

### Layout Files

| File | Role |
|------|------|
| `app/layout.tsx` | Root — passthrough, renders `{children}` only |
| `app/[locale]/layout.tsx` | Main shell — loads Cairo font, wraps in Providers + TooltipProvider + i18n provider, sets `<html lang dir>` |
| `app/[locale]/(dashboard)/layout.tsx` | Auth guard (calls `auth()`, redirects if no session or not onboarded) + DesktopSidebar + MainNav |

### Companion Files

| Type | Location | Description |
|------|----------|-------------|
| `loading.tsx` | `(dashboard)/loading.tsx` | Pulsing "Loading..." text — only loading boundary in the app |
| `error.tsx` | `(auth)/error.tsx` | Error boundary for auth pages — message + retry button |
| `error.tsx` | `(dashboard)/error.tsx` | Error boundary for dashboard pages — message + retry button |

### Pages That Are UI-Only / Placeholder

**None.** All pages have backend-connected API calls. However, some pages have very thin functionality:
- **Medical page** — read-only, no CRUD operations, just displays seeded data
- **Analytics page** — read-only, displays charts from existing data

---

## 4. API Endpoints

### Complete Endpoint Inventory

| # | Route | Methods | Auth | Collections | Validation | Notes |
|---|-------|---------|------|-------------|-----------|-------|
| 1 | `/api/auth/[...nextauth]` | GET, POST | N/A | NextAuth internal | NextAuth handles | Session management |
| 2 | `/api/auth/register` | POST | No | User | name, email, password required; email regex; pw≥8 chars; duplicate check | bcrypt hash (salt 12) |
| 3 | `/api/onboarding` | POST | Yes | User | age 10-120 only | ⚠️ No required fields — can submit empty body |
| 4 | `/api/user/profile` | GET, PUT | Yes | User | PUT: whitelist of 8 fields | GET excludes passwordHash |
| 5 | `/api/dashboard` | GET | Yes | User, BodyMeasurement, MealLog, WaterLog | None | Calculates BMR/TDEE/macros |
| 6 | `/api/foods` | GET, POST | GET: No, POST: Yes | Food | GET: regex-safe q, category, limit≤200; POST: name+category required | GET is public |
| 7 | `/api/meals` | GET, POST, DELETE | Yes | MealLog, MealLogItem | mealType enum, items validated, upsert pattern | DELETE cleans up items |
| 8 | `/api/water` | GET, POST, DELETE | Yes | WaterLog | POST: amountMl>0 | ⚠️ goal hardcoded 2500 |
| 9 | `/api/fasting` | GET, POST | Yes | FastingPreference, FastingLog | POST: type field dispatches, whitelisted keys | Upsert pattern |
| 10 | `/api/body-measurements` | GET, POST | Yes | BodyMeasurement, User | POST: at least one measurement | Auto-calculates BMI, waist-to-hip ratio |
| 11 | `/api/recipes` | GET, POST, PUT, DELETE | GET: Partial, others: Yes | Recipe | POST: name required; category/difficulty enums | GET: public for presets, auth for user recipes |
| 12 | `/api/exercises` | GET, POST | GET: Partial, POST: Yes | Exercise | POST: name+category+muscleGroup required | Seeds 36 presets on GET |
| 13 | `/api/workouts` | GET, POST, DELETE | Yes | WorkoutSession | POST: sets.length>0 | Auto-calculates volume/sets/reps |
| 14 | `/api/notifications` | GET, PUT | Yes | NotificationPreference | PUT: whitelist pattern | Auto-creates defaults |
| 15 | `/api/medical` | GET | No | MedicalKnowledge | foodId lookup, regex-safe q | Public read-only |

### Endpoints Not Called from Frontend

**None.** All API endpoints are called from at least one page. However:
- `RecipeItem` model is defined and exported but its collection has no dedicated API route
- `WorkoutSet` standalone model is defined but never directly used

### Frontend Actions Without Working Endpoints

| Issue | Description |
|-------|-------------|
| Body photo upload | `BodyMeasurement.photoUrl` field exists but no upload endpoint |
| Push notifications | `NotificationPreference.pushToken`/`pushPlatform` fields exist but no push service |
| Recipe food linking | `RecipeItem` model exists but recipes don't link to actual food items |
| Fasting geolocation | Lat/long fields exist but no API call to get prayer times |

### Validation Gaps

| Gap | Location | Risk |
|-----|----------|------|
| Onboarding accepts empty body | `api/onboarding/route.ts` | User can complete onboarding without any data |
| No numeric bounds on measurements | `api/body-measurements` | Could store negative weights, absurd body fat % |
| Date query params not NaN-checked | `workouts GET`, `water GET`, `meals GET (endDate)` | Malformed date silently ignored |
| DELETE endpoints don't verify document existed | `workouts`, `water`, `recipes` DELETE | Returns success even if nothing deleted |
| No rate limiting | All endpoints | Registration brute-force possible |
| Onboarding has no required fields | `api/onboarding/route.ts` | Empty submission sets `isOnboarded: true` |

---

## 5. Auth & Security

### Authentication Flow

1. **Providers:** Google OAuth + Email/Password (Credentials)
2. **Strategy:** JWT (not database sessions)
3. **Token storage:** HTTP-only cookie managed by NextAuth
4. **Password hashing:** bcrypt with salt rounds 12
5. **Session shape:** `{ user: { id, email, name, image, isOnboarded } }`

### Auth Callbacks

| Callback | Behavior |
|----------|----------|
| `jwt` | Sets `token.id = user.id` on initial sign-in. For Google users, queries MongoDB for `isOnboarded` on **every request**. |
| `session` | Copies `token.id` → `session.user.id`, `token.isOnboarded` → `session.user.isOnboarded` (via `as any` cast) |
| `signIn` | For Google: finds or creates user in MongoDB |

### Route Protection

| Mechanism | How |
|-----------|-----|
| Dashboard pages | Server-side `auth()` call in `(dashboard)/layout.tsx` — redirects to `/login` if no session |
| Onboarding gate | Same layout checks `user.isOnboarded` — redirects to `/onboarding` if false |
| API routes | Each route individually calls `auth()` and returns 401 |
| Middleware | **NONE** — no `middleware.ts` exists |

### Security Concerns

| Severity | Issue |
|----------|-------|
| 🔴 **CRITICAL** | Live secrets in `.env` and `.env.production` (MongoDB URI, OAuth secrets, USDA API key, NEXTAUTH_SECRET) — confirmed NOT in git, but could be accidentally committed |
| 🔴 **CRITICAL** | No rate limiting on auth endpoints (`/api/auth/register`, `/api/auth/[...nextauth]`) |
| 🟡 **HIGH** | `next-auth` on beta (`^5.0.0-beta.32`) — auth is security-critical |
| 🟡 **HIGH** | Auth `signIn` page hardcoded to `/en/login` — Arabic users get English login page on error |
| 🟡 **HIGH** | `isOnboarded` DB query runs on **every JWT decode** for Google users — performance and security concern |
| 🟡 **MEDIUM** | No CSRF protection beyond NextAuth's built-in for its own routes |
| 🟡 **MEDIUM** | No input sanitization (XSS risk with recipe names, notes, etc.) |
| 🟡 **MEDIUM** | `as any` type cast in auth callbacks — bypasses type safety |
| 🟢 **LOW** | No Content Security Policy headers configured |

### Environment Variables Used

| Variable | Where Used |
|----------|-----------|
| `MONGODB_URI` | `src/lib/mongodb.ts` |
| `NEXTAUTH_URL` | NextAuth config |
| `NEXTAUTH_SECRET` | NextAuth JWT signing |
| `GOOGLE_CLIENT_ID` | `src/lib/auth.ts` (Google provider) |
| `GOOGLE_CLIENT_SECRET` | `src/lib/auth.ts` (Google provider) |
| `FACEBOOK_CLIENT_ID` | Not used in code — leftover |
| `FACEBOOK_CLIENT_SECRET` | Not used in code — leftover |
| `USDA_API_KEY` | `src/app/api/foods/route.ts` (potential future use) |

---

## 6. Features

### Onboarding

**Status: ✅ Fully working end-to-end**

- 4-step wizard: gender/age → height/weight → activity level (5 options) → goal + target weight
- Saves to User model, sets `isOnboarded: true`
- Dashboard layout gates on `isOnboarded` — redirects to onboarding if false
- Supports Arabic/English
- ⚠️ No required fields validation — empty submission sets `isOnboarded: true`

### Meal Logging

**Status: ✅ Fully working end-to-end**

- Food search with 300ms debounce + category filter (14 categories)
- Recent foods (localStorage) + favorites (localStorage)
- Inline portion picker (50/100/150/200g badges + custom input)
- Auto-calculates calorie/macro totals based on quantity
- Saves to MealLog + MealLogItem collections
- Today's meal history display
- Meal type tabs (breakfast/lunch/dinner/snack)
- ⚠️ Food database is public (no auth for GET) — intentional for food search

### Recipes

**Status: ✅ Fully working end-to-end**

- Full CRUD (create, read, update, delete)
- Create/edit form with: name, nameAr, category, cookingMethod, prep/cook times, servings, difficulty, nutrition, instructions (one per line), tips (one per line)
- Search + category tabs
- Recipe cards with expandable instructions/tips display
- Edit button with pre-filled form
- Ownership enforcement (can only edit/delete own recipes)
- Global recipes visible to all users
- ⚠️ No image upload for recipes
- ⚠️ `RecipeItem` model exists but recipe ingredients are not linked to Food items

### Body/Measurements

**Status: ✅ Fully working end-to-end**

- Add measurement: weight, body fat %, waist, hip, bicep, chest, thigh, neck
- Auto-calculates BMI and waist-to-hip ratio
- Parametric body visualization (SVG computed from actual measurements)
- Measurement history with dates
- ⚠️ `photoUrl` field exists but no photo upload feature
- ⚠️ No DELETE endpoint for measurements

### Training/Workouts

**Status: ✅ Fully working end-to-end**

- Exercise search (36+ preset exercises with EN/AR names + user-created custom exercises)
- Active workout builder: search exercises → add sets (weight, reps, RPE, warmup/dropset flags)
- Auto-calculates total volume, sets, reps
- Save workout session
- Workout history with expand/collapse + delete
- Stats row: total workouts, total volume, total sets
- ⚠️ No exercise images/diagrams
- ⚠️ No rest timer between sets

### Water

**Status: ✅ Fully working end-to-end**

- Quick-add buttons: +250ml, +500ml, +750ml, +1000ml
- Custom amount input
- Progress bar toward 2500ml goal
- Today's log with per-entry delete
- Dashboard integration (water summary card)
- ⚠️ Goal is hardcoded to 2500ml — not user-configurable
- ⚠️ Optimistic local state update doesn't check server response

### Fasting

**Status: ✅ Fully working end-to-end**

- Fasting timer with animated circle (fasting/eating status)
- Suhoor/Iftar time pickers
- Sunnah fasting toggles: Ramadan, Monday/Thursday, Ayyam Al-Beed, 6 days Shawwal, Day of Arafah, Day of Ashura
- Log completed/missed buttons
- Fasting stats (streak, total days, completed)
- History list
- Generic labels when Ramadan mode OFF; Ramadan-only labels (Suhoor/Iftar) when ON
- ⚠️ Default times hardcoded for Cairo (03:30/19:00)
- ⚠️ No actual prayer time API integration
- ⚠️ No Hijri date calculation

### Analytics

**Status: ⚠️ Partially working**

- Adherence score circle
- Calorie trend line chart (7d/30d toggle)
- Weight trend line chart
- Macro distribution pie chart
- ⚠️ No loading state — shows 0% and empty charts during fetch
- ⚠️ Date range is cosmetic only — queries always fetch full range
- ⚠️ No weekly/monthly summaries
- ⚠️ No goal progress over time

### Medical Knowledge

**Status: ✅ Fully working (read-only)**

- Food search
- Medical entries with nutrient, benefit, consideration tabs
- Disclaimer card
- ⚠️ Read-only — no user contributions
- ⚠️ Data is seeded (42 entries) — not from USDA API
- ⚠️ No loading state

### Notifications

**Status: ⚠️ Partially working**

- Browser notification permission check + request
- 7 toggle cards for different reminder types
- Master toggle (all on/off)
- Saves preferences to NotificationPreference model
- ⚠️ Preferences save only — **no actual push notification delivery**
- ⚠️ No debounce on toggle saves — rapid toggling creates race conditions
- ⚠️ No loading state — shows defaults before server data loads

### Settings

**Status: ✅ Fully working**

- Language toggle (Arabic/English) with full RTL support
- Profile edit form (name, sex, height, goal, target weight, activity level, units)
- Data export (JSON download of all user data)
- ⚠️ No account deletion option
- ⚠️ No password change option

---

## 7. UI/UX and Visual Design

### Reusable Components

| Component | File | Where Used |
|-----------|------|-----------|
| `Button` | `ui/button.tsx` | Every page — 6 variants, 8 sizes |
| `Card` | `ui/card.tsx` | Every page — primary container pattern |
| `Input` | `ui/input.tsx` | Forms across meals, recipes, body, settings, auth |
| `Badge` | `ui/badge.tsx` | Meals categories, recipe categories, training stats |
| `Tabs` | `ui/tabs.tsx` | Meals (meal types), recipes (categories), analytics (charts), medical (sections) |
| `Progress` | `ui/progress.tsx` | Dashboard (calories/macros), water (daily goal) |
| `Switch` | `ui/switch.tsx` | Notifications (toggles), settings |
| `Select` | `ui/select.tsx` | Onboarding (activity level), settings, fasting |
| `Dialog` | `ui/dialog.tsx` | Available but not actively used in pages |
| `Sheet` | `ui/sheet.tsx` | Available but not actively used in pages |
| `DropdownMenu` | `ui/dropdown-menu.tsx` | Available but not actively used in pages |
| `Avatar` | `ui/avatar.tsx` | Available but not actively used in pages |
| `Popover` | `ui/popover.tsx` | Available but not actively used in pages |
| `Tooltip` | `ui/tooltip.tsx` | Available, wrapped around app |
| `ScrollArea` | `ui/scroll-area.tsx` | Available but not actively used |
| `Separator` | `ui/separator.tsx` | Available but not actively used |
| `Label` | `ui/label.tsx` | Auth forms, onboarding |
| `LogoIcon` | `brand/LogoIcon.tsx` | Sidebar logo |
| `Logo` | `brand/Logo.tsx` | ❌ NEVER IMPORTED — dead code |
| `BodyVisualization` | `body/BodyVisualization.tsx` | Dashboard + body page |
| `MeasurementTutorial` | `body/MeasurementTutorial.tsx` | ❌ NEVER IMPORTED — dead code |
| `MainNav` | `layout/navigation.tsx` | Dashboard layout (mobile bottom nav) |
| `DesktopSidebar` | `layout/navigation.tsx` | Dashboard layout (desktop sidebar) |
| `ThemeToggle` | `layout/ThemeToggle.tsx` | Sidebar footer |
| `Providers` | `providers.tsx` | Root locale layout |

### Color Palette

Defined in `src/app/globals.css` using oklch:

#### Light Mode ("Papyrus & Gold")

| Token | oklch Value | Hex Approx | Usage |
|-------|------------|-----------|-------|
| `--primary` | `oklch(0.65 0.12 78)` | `#C8923C` | Gold — main brand |
| `--accent` | `oklch(0.30 0.10 15)` | `#5C1A1A` | Burgundy — seal/secondary |
| `--sidebar` | `oklch(0.13 0.02 60)` | `#231E16` | Dark sidebar (even in light mode) |
| `--background` | `oklch(0.97 0.008 78)` | `#F8F3EB` | Warm cream |
| `--card` | `oklch(0.99 0.003 78)` | `#FDF9F3` | Slightly warmer white |

#### Dark Mode ("Obsidian & Gold")

| Token | oklch Value | Hex Approx | Usage |
|-------|------------|-----------|-------|
| `--primary` | `oklch(0.82 0.10 78)` | `#D4A24A` | Brighter gold |
| `--accent` | `oklch(0.40 0.12 15)` | `#7A2626` | Lighter burgundy |
| `--sidebar` | `oklch(0.09 0.02 60)` | `#18140F` | Darker sidebar |
| `--background` | `oklch(0.15 0.008 78)` | `#28221B` | Warm dark |

#### Typography

| Token | Value |
|-------|-------|
| `--font-sans` | `var(--font-cairo)` — Google Font: Cairo |
| `--font-display` | `Georgia, 'Times New Roman', serif` |
| `--font-heading` | Same as sans (Cairo) |
| `--font-mono` | `var(--font-geist-mono)` |

#### Border Radius

| Token | Value |
|-------|-------|
| `--radius` | `0.75rem` (12px) |
| `--radius-sm` | `0.45rem` |
| `--radius-lg` | `0.75rem` |
| `--radius-xl` | `1.05rem` |
| `--radius-2xl` | `1.35rem` |

### Hardcoded Colors in Source

| File | Values | Purpose |
|------|--------|---------|
| `BodyVisualization.tsx` | `#F5D0A9`, `#E8C49A`, `#D4A574`, `#C4956A`, `#333`, `#666`, `rgba(0,0,0,0.1)` | Skin tone gradient, outline, eyes/mouth, measurement labels |
| `login/page.tsx`, `register/page.tsx` | `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335` | Google brand logo SVG |
| Layout `metadata.viewport` | `#EBE2D0` (light), `#1D1712` (dark) | Theme color meta tags |

### Responsive/Mobile Handling

| Breakpoint | Behavior |
|-----------|----------|
| `< 768px` (mobile) | Bottom navigation bar (MainNav), single-column layout, full-width cards |
| `≥ 768px` (desktop) | Left sidebar (DesktopSidebar, 64px width), main content offset with `md:ms-64` |
| `≥ 1024px` (large) | Same sidebar, slightly more padding |

- **Mobile bottom nav** shows 5 items: Dashboard, Meals, Body, Training, Fasting
- **Desktop sidebar** shows all 10 nav items + Settings + Theme toggle
- All pages use `container mx-auto p-4` pattern for centering
- **No dedicated mobile breakpoint utilities** beyond standard Tailwind

### Accessibility

| Area | Status |
|------|--------|
| `aria-label` | ✅ Present on 13 interactive elements (nav, buttons, icons) |
| `aria-hidden` | ✅ On decorative SVGs (LogoIcon, Logo) |
| `aria-current="page"` | ✅ On active nav links |
| `aria-invalid` | ✅ On form fields (via shadcn class strings) |
| `sr-only` text | ✅ On icon-only buttons (dialog close, sheet close) |
| `focus-visible` rings | ✅ All interactive elements have visible focus |
| `alt` text on images | N/A — no `<img>` tags (all SVG/CSS) |
| Skip-to-content link | ❌ Not implemented |
| `aria-live` regions | ❌ Not implemented — dynamic content updates not announced |
| Keyboard navigation | ✅ All native elements (buttons, links) — inherently accessible |
| Color contrast | ⚠️ Not formally tested — gold on cream may have low contrast |
| Hardcoded English a11y text | ⚠️ `"aria-label="Unfavorite"` in meals page is not i18n'd |

### Hardcoded/Placeholder Text

| Location | Text | Issue |
|----------|------|-------|
| `fasting/page.tsx:42-44` | `city: "Cairo"`, `suhoorTime: "03:30"`, `iftarTime: "19:00"` | Default values, should be user-configurable |
| `api/dashboard/route.ts:25-28` | `dailyCalorieTarget: 2000`, etc. | Fallback values before BMR calculation |
| `api/dashboard/route.ts:140` | `goalMl: 2500` | Hardcoded water goal |
| `api/water/route.ts:31` | `goalMl: 2500` | Hardcoded water goal (duplicate) |
| `meals/page.tsx` | `aria-label="Unfavorite"` | Not i18n'd |

---

## 8. Performance & Loading States

### Loading/Skeleton States

| Page | Has Loading UI? | Behavior |
|------|----------------|----------|
| Dashboard | ⚠️ Partial | Has `loading` state but only shows pulsing text via `loading.tsx` route boundary |
| Meals | ❌ No | Shows empty meal builder immediately, populates on fetch |
| Training | ❌ No | Shows 0 stats and "No workouts" while data loads |
| Body | ❌ No | Shows "No measurements" while data loads |
| Fasting | ❌ No | Shows default prefs (Cairo, 03:30/19:00) and 0/0/0 stats |
| Recipes | ❌ No | Shows "No recipes" while data loads |
| Medical | ❌ No | Shows empty state briefly |
| Analytics | ❌ No | Shows 0% adherence and empty charts |
| Water | ⚠️ Partial | Has `loading` state but still shows tracker UI during load |
| Notifications | ❌ No | Shows default prefs before server data loads |
| Settings | ❌ No | Shows null profile briefly |

**Zero skeleton components exist.** Zero `Suspense` boundaries. One `loading.tsx` route boundary (dashboard only, minimal).

### Race Conditions / Data Races

| Issue | Location | Description |
|-------|----------|-------------|
| Water optimistic update | `water/page.tsx:50-53` | Updates local state before server confirms success |
| Notification rapid toggle | `notifications/page.tsx` | No debounce — multiple concurrent PUT requests |
| Fasting rapid clicks | `fasting/page.tsx:280-314` | Log buttons fire POST then immediately GET — stale data possible |
| Default values displayed | 6+ pages | Pages show default/zero values while data is still loading |

### Performance Concerns

| Issue | Severity | Location |
|-------|----------|----------|
| No pagination on food search | Medium | `api/foods` returns up to 200 results |
| No pagination on recipes | Medium | `api/recipes` returns up to 200 results |
| `seedExercises()` called on every `/api/workouts` GET | Medium | Runs database query on every page load |
| `isOnboarded` DB query on every JWT decode | Medium | `auth.ts` jwt callback |
| No image optimization | Low | No images used (all SVG/CSS) |
| No data caching | Low | All fetch is manual useEffect — no SWR/React Query |

---

## 9. Known Bugs and TODOs

### TODO/FIXME/HACK Comments

**Zero.** The codebase has no TODO, FIXME, HACK, or XXX comments.

### `as any` Type Casts

| File | Line | Code |
|------|------|------|
| `src/lib/auth.ts` | 70 | `(session.user as any).isOnboarded = token.isOnboarded` |
| `src/lib/auth.ts` | 86 | `(user as Record<string, unknown>).id = dbUser._id.toString()` |

### Console Statements

- **29 `console.error` calls** across 15 API route files — all in catch blocks (acceptable for server-side error logging)
- **Zero `console.log`** or `console.warn` debug statements

### Known Bugs / Broken Flows

| # | Bug | Severity | Location |
|---|-----|----------|----------|
| 1 | **Onboarding accepts empty body** — user can complete onboarding without providing any data | High | `api/onboarding/route.ts` |
| 2 | **Auth signIn hardcoded to `/en`** — Arabic users may see English login on error redirect | High | `src/lib/auth.ts:41` |
| 3 | **Water optimistic update doesn't check response** — state is mutated even if POST fails | Medium | `water/page.tsx:50-53` |
| 4 | **DELETE endpoints return success even if nothing deleted** — workouts, water, recipes | Medium | `api/workouts`, `api/water`, `api/recipes` |
| 5 | **Notification toggle has no debounce** — rapid toggling creates race conditions | Medium | `notifications/page.tsx` |
| 6 | **6+ pages show default/zero values during loading** — confusing UX | Medium | analytics, fasting, training, recipes, medical, notifications |
| 7 | **Hardcoded English aria-label** `"Unfavorite"` in meals page | Low | `meals/page.tsx:223` |
| 8 | **Unused `TrendingUp` import** in training page | Low | `training/page.tsx:10` |
| 9 | **Facebook OAuth env vars set but unused** — `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` | Low | `.env` |

### Unused Code

| Item | Location |
|------|----------|
| `Logo` component | `components/brand/Logo.tsx` — exported, never imported |
| `MeasurementTutorial` component | `components/body/MeasurementTutorial.tsx` — exported, never imported |
| `RecipeItem` model | `models/Recipe.ts` — exported, never used in any route |
| `WorkoutSet` standalone model | `models/WorkoutSession.ts` — exported but only used as embedded subdoc |
| `Account`, `Session`, `VerificationToken` models | `models/Auth.ts` — JWT strategy used, not adapter |
| `@base-ui/react` package | `package.json` — installed but not used |
| `@tanstack/react-query` | `package.json` — installed but not used |
| `zustand` | `package.json` — installed but not used |
| `dotenv` | `package.json` — redundant |
| `prisma/fittracker.db` | Legacy SQLite database |
| `skills-lock.json` | Legacy Prisma skill references |
| 5 SVG files in `public/` | Default Next.js scaffold |

---

## 10. Translations

### Languages Supported

| Language | File | Lines | Keys |
|----------|------|-------|------|
| English | `src/messages/en.json` | 741 | Full |
| Arabic | `src/messages/ar.json` | 741 | Full |

### Key Parity

**All keys are 1:1 matched** between EN and AR. Both files have identical structure with the same nesting depth.

### Sections (18 total)

`common`, `nav`, `auth`, `dashboard`, `meals`, `food`, `medical`, `body`, `analytics`, `recipes`, `fasting`, `notifications`, `settings`, `onboarding`, `validation`, `time`, `units`, `days`, `mealTypes`, `brand`, `training`, `water`

### i18n Coverage

| Area | Status |
|------|--------|
| Navigation labels | ✅ All i18n'd |
| Page headings | ✅ All i18n'd |
| Form labels/placeholders | ✅ All i18n'd |
| Error messages | ✅ All i18n'd |
| Button text | ✅ All i18n'd |
| Meal types | ✅ All i18n'd |
| Food categories | ✅ All i18n'd |
| Training exercises | ⚠️ 36+ presets have EN+AR names, but exercise search UI uses `nameAr` fallback |
| Body measurements | ✅ All i18n'd, including tutorial steps/tips/mistakes |
| Hardcoded English | ⚠️ `aria-label="Unfavorite"` in meals page |

### Known Issues

| Issue | Location |
|-------|----------|
| `auth.emailPlaceholder` in AR is `"you@example.com"` (English) | `ar.json` — intentional (email format is universal) |
| `aria-label="Unfavorite"` not i18n'd | `meals/page.tsx:223` |

---

## 11. Testing & Deployment

### Automated Tests

| Type | Count | Status |
|------|-------|--------|
| Unit tests | **0** | ❌ None exist |
| Integration tests | **0** | ❌ None exist |
| E2E tests (Playwright) | **~70 tests across 16 suites** | ✅ `e2e/app.spec.ts` — comprehensive coverage |

#### E2E Test Coverage

| Suite | What's Tested |
|-------|--------------|
| Root redirect | `/` → `/en` |
| Auth flow | Register, login, unauthenticated access |
| Dashboard | Rendering, data display |
| Navigation | All 9 nav destinations |
| Meals | Food search, meal tabs, save |
| Body | Measurement form, save |
| Recipes | Create, category tabs |
| Analytics | Rendering, chart tabs |
| Fasting | Toggles, log completed/missed |
| Notifications | Toggle cards |
| Medical | Search, tabs |
| Settings | Edit profile, save, language toggle |
| Theme | Dark/light toggle |
| Arabic | Full Arabic locale test |
| API smoke | Foods, medical, recipes, register endpoints |
| 404 | Not found page |

#### Test Infrastructure

- `@playwright/test` in devDependencies
- `playwright.config.ts` exists
- `e2e/auth.setup.ts` — auth setup helper
- `e2e/.auth/user.json` — stored auth state
- `test-results/.last-run.json` — last run: passed
- **No `test` script in `package.json`** — must run with `npx playwright test`

### Deployment Setup

| Aspect | Details |
|--------|---------|
| **Platform** | Vercel (frontend + backend separate repos) |
| **Frontend URL** | `https://ra-dietatian.vercel.app` |
| **Backend URL** | `https://ra-dietation-backend.vercel.app` |
| **Vercel project** | `radietation-9451` |
| **CI/CD** | None — no GitHub Actions, no CI config files |
| **Build command** | `next build` (default Vercel) |
| **Environment** | `.env.production` has `NEXTAUTH_URL=https://ra-dietatian.vercel.app` |
| **No `vercel.json`** | All config is default |
| **No middleware** | No edge middleware for locale detection or auth |

### Recent Git History (all 19 commits)

```
6ac2a78 feat: parametric body viz, food logging redesign, training & water pages, i18n fixes
b71b455 feat: add 4-step onboarding wizard + fix corrupted Arabic translations
8b64e12 fix: explicitly pass Google OAuth credentials to provider
f861405 feat: add Google sign-in button to login and register pages
c96cd38 feat: i18n, a11y, RTL fixes + Google OAuth + Vercel env setup
03a80d4 fix: comprehensive audit - theme colors, i18n, security, performance, models
ac321b9 feat: premium Ra theme - Egyptian sun-god branding with light/dark toggle
508a425 fix: comprehensive quality pass - RTL, schemas, security, UX, i18n
5c4d5ab Deep audit: fix critical + high issues across all layers
794092a Complete fasting + notifications pages
1944313 Expand food DB to 115 foods + fix RTL edge cases
3eda509 Fix phantom data + expand medical DB to 42 entries
91e0100 Seed 29 Egyptian/Mediterranean recipes across 8 categories
dd11c8e Fix structural + i18n issues from quality sweep
214ff61 Complete i18n sweep: 50+ hardcoded strings replaced with t() calls
ce1173f Food DB 55 dishes, medical knowledge 22 entries, female body, configurable fasting
6b73604 Stage 1-3 fixes: i18n, RTL, auth, wiring, real backends
ed29788 Initial commit: FitTracker with MongoDB Atlas
c1e16ea Initial commit from Create Next App
```

**Pattern:** Heavy iterative AI-assisted development — many "comprehensive audit" + "fix" commits followed by feature additions.

---

## Summary Scorecard

| Area | Status | Score |
|------|--------|-------|
| Core features (meals, body, recipes) | Working | 8/10 |
| Training/Workouts | Working | 7/10 |
| Water tracking | Working | 7/10 |
| Fasting | Working | 7/10 |
| Auth (Google + email) | Working | 6/10 (beta, hardcoded locale) |
| Onboarding | Working | 7/10 (no validation) |
| Analytics | Partial | 4/10 (no loading, basic charts) |
| Notifications | Partial | 3/10 (preferences only, no delivery) |
| i18n (EN/AR) | Complete | 9/10 (1 hardcoded string) |
| Accessibility | Basic | 5/10 (aria labels, focus rings, but no skip-nav, no live regions) |
| Loading states | Poor | 2/10 (almost none) |
| Error handling (API) | Good | 8/10 (all routes have try/catch) |
| Input validation | Inconsistent | 5/10 (some routes thorough, onboarding empty) |
| Security | Needs work | 4/10 (no rate limiting, beta auth, hardcoded locale) |
| Testing | E2E only | 6/10 (70 E2E tests, 0 unit tests) |
| Code quality | Good | 7/10 (clean code, some unused deps/code) |
| Deployment | Basic | 5/10 (works but no CI, no infra-as-code) |
