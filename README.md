# Zariya — Wedding Planning Platform

A calm, connected planning workspace for **Indian destination weddings**. Enter information once —
guests, vendors, events, payments, budget — and Zariya keeps every page in sync automatically
(_"enter once, update everywhere"_).

Built end-to-end: a marketing site, real email/password accounts, a guided onboarding flow, and a full
planning workspace (Dashboard, Timeline, Events, Guests, Vendors, Budget, Payments, Master wedding-day
timeline, Settings).

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Prisma** ORM + **SQLite** (swap to Postgres for production by changing the datasource)
- **Auth.js (NextAuth v5)** — real email/password auth, hashed (bcrypt), JWT sessions
- **Framer Motion** (animation), **Recharts** (budget charts), **lucide-react** (icons)
- **Zustand** + React Context for the connected client data layer

## Getting started

```bash
npm install              # installs deps + generates the Prisma client
npm run db:migrate       # or: npx prisma db push   (creates prisma/dev.db)
npm run db:seed          # loads the Aisha & Rohan demo wedding
npm run dev              # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

### Demo login

```
email:    demo@zariya.app
password: demo1234
```

Or click **Sign up free** to create a new account and go through onboarding. The demo wedding's dates are
seeded relative to today, so the countdown and timeline always look alive.

## Architecture — "enter once, update everywhere"

The Prisma schema is **normalized** — one row per real fact (guest, vendor, payment, event…). Everything
derived (RSVP totals, per-event guest counts, budget health, vendor balances, dashboard attention items,
notifications, global search) is **computed** by pure selectors in [`lib/selectors.ts`](lib/selectors.ts),
never duplicated. The full wedding loads once via `/api/wedding`; after any mutation the client refreshes,
so a single edit propagates everywhere.

```
app/
  (marketing)/        Landing, Features, Pricing, Contact, Early access
  signin, signup      Auth (real email/password; social buttons decorative)
  onboarding/         4-step setup + "creating workspace" animation
  app/                The workspace (sidebar + wedding header on every page)
    page.tsx          Dashboard + first-time guided tour
    timeline/         Planning timeline + full calendar
    events/           Events, event detail, add/edit (timeline builder)
    schedule/         Master wedding-day timeline (calendar / list / print)
    guests/ vendors/ budget/ budget/categories/ payments/ settings/
  api/                CRUD route handlers (scoped to the logged-in user's wedding)
components/           ui primitives, marketing, auth, workspace, feature components
lib/                  prisma, auth, selectors, types, defaults, factory, store
prisma/               schema.prisma + seed.ts
design-reference/     All product reference images + the Functional Description PDF
```

## Key features

- **Dashboard** — countdown, planning progress, guest summary, attention items, itinerary, budget &
  vendor/payment summaries, plus a 7-step first-time guided tour (restartable from Settings).
- **Timeline** — phase-by-phase default checklists (12 months → wedding week), statuses, due dates,
  filters, and a full month/week calendar sharing the same task data.
- **Events** — editable cards with progress, ready-made checklists, run-of-show, live guest counts and
  linked vendors; add/edit with a sub-event timeline builder (overlaps allowed).
- **Guests** — RSVP tracking; invited events drive per-event counts everywhere.
- **Vendors** — full contact/contract/payment records; quick status changes; event links.
- **Budget** — estimated vs actual by category, health donut, over-budget alerts, and one-click
  "update budget to actual".
- **Payments** — upcoming/pending/paid; updates flow into budget and vendor status automatically.
- **Global search & notifications** in the header; **Settings** to manage events, categories,
  preferences, restart the guide, or reset the workspace.
