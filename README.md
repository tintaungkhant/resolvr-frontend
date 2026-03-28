# Resolvr Frontend

SvelteKit frontend for the Resolvr support ticket portal. Consumes the Laravel API over HTTP.

## Tech Stack

- **Framework:** SvelteKit (Svelte 5 with runes)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Auth:** Cookie-based (httpOnly cookies storing Sanctum tokens)

## Setup

```bash
npm install

# Configure the API URL
cp .env.example .env
# Edit .env and set API_URL to your Laravel backend (e.g. http://resolvr-api.test)

npm run dev
```

## Features

### Client Panel (`/client/*`)

- **Login** — Email/password authentication
- **Dashboard** — Welcome page with link to tickets
- **Ticket List** — View own or organisation-wide tickets with filters (search, priority, status, SLA status, date ranges)
- **Create Ticket** — Form with title, description, and priority selection
- **Ticket Detail** — View ticket info (priority, status, SLA status, assignee, countdown timer to deadline), read-only
- **Messages** — Chat-style conversation thread with "load older messages" pagination, send new messages
- **SLA Countdown** — Live countdown timer on ticket detail, pauses and shows notice when ticket is on hold

### Agent Panel (`/agent/*`)

- **Login** — Email/password authentication
- **Dashboard** — Welcome page with link to tickets
- **Ticket List** — View assigned or all tickets with columns for organisation, assignee, priority, status, SLA status. Advanced filters including organisation filter
- **Ticket Detail** — View and manage tickets:
  - Change priority, status, and assignee via inline dropdowns (auto-submit on change)
  - View organisation name and issuer name
  - Live SLA countdown timer with on-hold pause
- **Messages** — Full conversation including internal notes (highlighted in yellow). Send public replies or internal notes via checkbox toggle
- **Load More** — Paginated message loading (older messages at top)

### Shared

- Persistent nav bar with Dashboard/Tickets links and sign-out
- SLA status badges (on-track / due-soon / overdue) in both list and detail views
- Responsive table layouts
- Progressive enhancement via SvelteKit form actions with `use:enhance`

## Project Structure

```
src/
├── lib/
│   └── server/api.ts          # Server-side API client (fetch wrapper with auth)
├── routes/
│   ├── +page.svelte            # Landing page (portal selection)
│   ├── client/
│   │   ├── login/              # Client login
│   │   ├── logout/             # Client logout (clears cookie)
│   │   └── (authed)/           # Auth-guarded routes
│   │       ├── +layout.server.ts   # Verifies token, loads profile
│   │       ├── +layout.svelte      # Nav bar
│   │       ├── +page.svelte        # Dashboard
│   │       └── tickets/            # List, create, detail pages
│   └── agent/
│       ├── login/              # Agent login
│       ├── logout/             # Agent logout
│       └── (authed)/           # Auth-guarded routes
│           ├── +layout.server.ts
│           ├── +layout.svelte
│           ├── +page.svelte
│           └── tickets/        # List, detail pages
└── app.d.ts                    # Type definitions
```
