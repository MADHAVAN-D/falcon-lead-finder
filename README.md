# Falcon Lead Finder 🦅

An internal lead discovery tool for **Falcon Sector 1**, a digital marketing and website-creation agency. Falcon Lead Finder helps your team find local business clients who don't yet have a website — the perfect prospects for your services.

---

## What It Does

Falcon Lead Finder searches local business directories by **category** and **location**, then checks whether each business has a website listed. Businesses with no website are flagged as **potential leads** with transparent lead scores. Your team can save leads, track their pipeline status, and leave notes for each other.

### Core Flow

1. **Search** — Enter a business category (e.g., "Salon") and location (e.g., "Bengaluru")
2. **Discover** — The app queries business data sources and checks for website listings
3. **Score** — Each result receives a transparent "Potential Lead Score" based on multiple signals
4. **Save** — Bookmark promising leads, add team notes, and track them through your outreach pipeline

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend/Database | Convex (serverless) |
| Auth | Convex Auth (email OTP + anonymous) |
| UI Components | shadcn/ui, Lucide icons, Framer Motion |
| Business API | Google Places API (New) with demo mode fallback |

---

## Installation

### Prerequisites

- [Bun](https://bun.sh/) (recommended package manager)
- A [Convex](https://convex.dev/) project (set up automatically by Freebuff)

### Setup

```bash
# Install dependencies
bun install

# Start the development server (Freebuff manages this automatically)
# For local development outside Freebuff:
bun run dev
```

---

## Environment Variables

### Client-Side (Vite)

| Variable | Description |
|----------|-------------|
| `VITE_CONVEX_URL` | Your Convex deployment URL (managed by Freebuff) |

### Server-Side (Convex)

Set these via the Convex dashboard or CLI:

```bash
# Set Google Places API key
npx convex env set GOOGLE_PLACES_API_KEY=your_key_here
```

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_PLACES_API_KEY` | Google Cloud API key with Places API enabled | No (demo mode if absent) |

---

## Google Places API Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API** (New) under "APIs & Services"
4. Create an API key under "Credentials"
5. Set the key in your Convex environment:
   ```bash
   npx convex env set GOOGLE_PLACES_API_KEY=your_key_here
   ```

**Important:** The API key is kept server-side in a Convex action and never exposed to the browser.

---

## How Demo Mode Works

When `GOOGLE_PLACES_API_KEY` is not configured, the app automatically enters **demo mode**:

- Returns a set of fictional salon businesses in Bengaluru
- All demo data is clearly labeled with a **Demo Mode** banner
- Demo data is always distinguishable from real production results
- No fake API calls are made — the data comes from a local mock dataset

To switch to real data, simply configure the API key above.

---

## Running Locally

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# The app will be available at http://localhost:5173
```

For Freebuff projects, the dev server and Convex backend run automatically.

---

## Deployment

### Freebuff (Recommended)

Freebuff handles deployment automatically. Push your changes and the platform updates the preview.

### Manual Deployment

```bash
# Build for production
bun run build

# Preview the production build
bun run preview

# Deploy Convex functions
npx convex deploy
```

---

## Security Considerations

- **API keys** are never exposed to the client. All Google Places API calls happen server-side in Convex actions.
- **Lead scores** are calculated server-side — client-provided scores are never trusted.
- **Search inputs** are validated and length-limited on the server.
- **User data** is isolated per user — each user can only access their own saved leads and comments.
- **Auth** uses Convex Auth with email OTP and anonymous sign-in options.

---

## Current Limitations (Phase 1)

- **No automated outreach** — This is a discovery tool only. Outreach functionality will be added in later phases.
- **Google Places API only** — Other business data sources are not yet supported.
- **Single-page search** — No search history or saved searches yet.
- **No AI qualification** — Lead scoring uses deterministic rules, not AI.
- **No export** — Leads cannot be exported to CSV or other formats yet.

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── SearchPanel.tsx
│   │   ├── ResultsGrid.tsx
│   │   ├── FilterBar.tsx
│   │   ├── LeadDetailsModal.tsx
│   │   ├── DemoBanner.tsx
│   │   └── SavedLeadsView.tsx
│   ├── ui/                 # shadcn/ui components
│   └── RequireAuth.tsx     # Auth guard
├── convex/
│   ├── schema.ts           # Database schema (leads, comments, searchHistory)
│   ├── leads.ts            # Lead CRUD + comments mutations/queries
│   ├── searchBusinesses.ts # Server-side business search action
│   ├── searchHistory.ts    # Search history tracking
│   └── users.ts            # User queries
├── lib/
│   ├── scoring.ts          # Lead scoring utility
│   └── business-api/
│       └── places.ts       # Google Places API adapter
├── pages/
│   ├── Landing.tsx         # Public landing page
│   ├── Dashboard.tsx       # Main authenticated dashboard
│   ├── Auth.tsx            # Authentication page
│   └── NotFound.tsx        # 404 page
└── types/
    └── leads.ts            # TypeScript types and demo data
```

---

## Database Schema

### `leads` table

| Field | Type | Description |
|-------|------|-------------|
| userId | string | Owner's user ID |
| businessName | string | Business name |
| category | string? | Business category |
| location | string? | City/area |
| address | string? | Full address |
| phone | string? | Phone number |
| website | string? | Website URL |
| websiteStatus | string | "no_website" or "website_found" |
| rating | number? | Google rating |
| reviewCount | number? | Number of reviews |
| leadScore | number | Calculated lead score (0-100) |
| scoreBreakdown | string[] | Score explanation items |
| placeId | string? | Google Places ID |
| status | enum | Lead pipeline status |
| searchSource | string? | "google_places" or "demo" |
| createdAt | number | Timestamp |
| updatedAt | number | Timestamp |

### `comments` table

| Field | Type | Description |
|-------|------|-------------|
| userId | string | Comment author's user ID |
| leadId | Id<"leads"> | The lead being commented on |
| authorName | string | Display name of the author |
| text | string | Comment body |
| createdAt | number | Timestamp |

### Lead Statuses

`new` → `researching` → `contacted` → `responded` → `interested` → `client`

Also: `not_interested`

---

## Roadmap

### Phase 2 — AI Lead Qualification
AI-powered analysis of business profiles to predict likelihood of needing a website.

### Phase 3 — AI Outreach Drafts
Generate personalized outreach messages based on business profile and needs.

### Phase 4 — User-Approved Outreach
Send outreach through WhatsApp, email, or other official channels with user approval.

### Phase 5 — CRM Pipeline
Full pipeline management with analytics, reporting, and team collaboration.

### Phase 6 — Advanced Research
Deeper business intelligence, competitive analysis, and lead prioritization.

---

## License

Internal tool for Falcon Sector 1. Not for public distribution.
