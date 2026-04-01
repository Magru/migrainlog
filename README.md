# MigrainLog

Mobile-first PWA for tracking migraine episodes. Log attacks via 3-step quick flow (head pain map → intensity → triggers), view calendar heatmap, analyze patterns.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** shadcn/ui + Tailwind CSS
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Backend:** Supabase (PostgreSQL + Auth)
- **PWA:** @ducanh2912/next-pwa + IndexedDB offline queue

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key

# Run database migration
# Copy supabase/migrations/001-initial-schema.sql to Supabase SQL editor

# Start dev server
npm run dev
```

## Design Decisions

- **Dark mode default** — optimized for photosensitive users
- **Max 3 taps** to quick-log an episode
- **Violet/teal palette** — calming, migraine awareness colors
- **Offline-first** — IndexedDB queue syncs when back online
- **Reduced motion** — all animations respect `prefers-reduced-motion`

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/        # Auth pages
│   ├── (app)/               # Authenticated pages
│   │   ├── dashboard/       # Stats, charts, insights
│   │   ├── calendar/        # Monthly heatmap
│   │   ├── log/             # Episode logging
│   │   ├── analytics/       # Trends & patterns
│   │   └── profile/         # Settings
│   └── api/episodes/        # API route
├── components/
│   ├── ui/                  # shadcn components
│   ├── layout/              # Nav, shell, transitions
│   ├── log/                 # Head map, slider, grid
│   ├── dashboard/           # Stats, charts
│   ├── calendar/            # Heatmap, detail sheet
│   ├── analytics/           # Frequency, donut, bars
│   └── profile/             # Header, settings
├── lib/
│   ├── supabase/            # Client, server, middleware
│   ├── actions/             # Server actions
│   ├── queries/             # Data fetching
│   ├── types/               # TypeScript types
│   ├── utils/               # Date helpers
│   └── pwa/                 # Offline queue, sync
└── hooks/                   # Custom hooks
```
