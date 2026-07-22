# [404] Offline · Atlanta's Nerd Scene

> **Logged off. Went outside.**

404 Offline is a full-stack community platform for Atlanta's nerd, anime, and gaming community. It maps the local spots, events, and conventions that keep the scene alive between con seasons — because the main quest may be the convention, but the best adventures happen between them.

<img width="1896" height="951" alt="image" src="https://github.com/user-attachments/assets/ad8f7022-4c23-43df-8a2a-37970c8ab71f" />


---

## Problem Statement

Atlanta has a thriving nerd community spread across dozens of game bars, boba cafés, card shops, esports lounges, and kawaii boutiques — but there's no single place to find them all, discover what's happening at them, or stay connected between major conventions. Community members rely on scattered Discord servers, Instagram posts, and word of mouth to find events. 404 Offline solves this by centralizing Atlanta's nerd scene into one platform: a living map of spawn points, a calendar of side quests, and a countdown to the next con.

---

## Target User

- Atlanta-area anime fans, gamers, cosplayers, and tabletop players
- Convention attendees looking for community between con seasons
- New residents looking to break into Atlanta's nerd scene
- Local venue owners and event organizers wanting visibility
- Anyone who has ever googled "anime club Atlanta" and gotten nowhere

---

## Features

**Spawn Points**
- Browse and search Atlanta's nerd venues: game bars, boba cafés, card shops, kawaii boutiques, esports lounges, and more
- Filter by category, neighborhood, and MARTA accessibility
- Near me sorting using browser geolocation
- Open/closed status based on live hours
- Community star ratings and check-in counts (persisted via localStorage)
- Full detail pages with description, hours, map, and upcoming side quests
- Add a side quest directly from a spawn point's detail page
- Suggest an edit to any spawn point's info

**Side Quests**
- Browse and search local events: tournaments, meetups, language exchanges, cosplay hangouts, anime clubs, D&D sessions, and more
- Filter by category, cost (free only), skill level, and weekend dates
- Tag-based filtering with active tag indicator
- Going count toggle (persisted via localStorage)
- Add to calendar (.ics download)
- Share button (copies event info to clipboard)
- Related events at the same spawn point
- Threaded comments with inline editing and name-based ownership
- Featured event pinning (displayed on home page)

**Con Calendar**
- Track upcoming Atlanta conventions with countdown badges
- Filter by size (Massive, Large, Mid-size, Small) and type (Anime, Gaming, etc.)
- Search by name, venue, or neighborhood
- Direct ticket links
- Past cons archived separately

**Neighborhoods**
- Browse spawn points and side quests organized by Atlanta neighborhood
- Expandable accordion layout with image strips and activity rankings

**Home Page**
- Full-viewport editorial hero with dynamic featured spawn point
- Live map of all Atlanta spawn points
- Happening soon side quest cards
- Manifesto section
- Featured side quest banner (when pinned)

**Admin / Moderation**
- Suggestions page (accessible from footer) for reviewing community edits
- Mark suggestions as applied or dismissed
- Feature/unfeature side quests from the list page

**UI/UX**
- Dark mode with localStorage persistence and grain texture on dark surfaces
- Skeleton loading states on all async content
- Toast notifications for all user actions
- Modal confirmations with keyboard shortcuts (Enter / Esc)
- Scroll to top button
- Entrance animations on cards
- Full error boundary to prevent crashes from taking down the app
- Mobile responsive layout
- Dynamic page titles per route
- Proper meta and Open Graph tags

---

## Technology

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Styling | Custom CSS with CSS variables, no framework |
| Maps | Leaflet.js, react-leaflet |
| Backend | Node.js, Express |
| Database | PostgreSQL (via Docker) |
| ORM | Prisma 7 |
| Image hosting | Cloudinary |
| Dev tools | Thunder Client, Beekeeper Studio, Nodemon |

---

## Database Design

### Tables

**SpawnPoint**
The core venue table. Represents a physical location in Atlanta's nerd scene.

| Column | Type | Notes |
|---|---|---|
| id | Int | Primary key |
| name | String | Venue name |
| category | String | Gaming venue, Comics & cards, Boba & matcha, etc. |
| neighborhood | String | Atlanta neighborhood |
| address | String | Full street address |
| latitude | Float? | For map rendering |
| longitude | Float? | For map rendering |
| hours | String? | Formatted hours string |
| description | String? | About this place |
| image_url | String? | Cloudinary URL |
| rating_sum | Int | Sum of all star ratings |
| rating_count | Int | Number of ratings |
| checkin_count | Int | Number of check-ins |
| is_marta_accessible | Boolean | MARTA transit access |
| created_at | DateTime | Auto-set on creation |

**SideQuest**
An event hosted at a spawn point.

| Column | Type | Notes |
|---|---|---|
| id | Int | Primary key |
| spawn_point_id | Int | Foreign key → SpawnPoint |
| name | String | Event name |
| description | String | Full event description |
| date | String | Event date |
| time | String | Event time |
| cost | Float? | null if free |
| is_free | Boolean | |
| is_beginner_friendly | Boolean | |
| is_recurring | Boolean | |
| recurrence | String? | weekly, biweekly, monthly |
| category | String | Gaming, Social, Cosplay, Language, Tabletop |
| tags | String | Comma-separated lowercase tags |
| going_count | Int | Number of interested attendees |
| is_featured | Boolean | Pinned to home page |
| image_url | String? | Cloudinary URL |
| created_at | DateTime | Auto-set on creation |

**Con**
A convention entry for the con calendar.

| Column | Type | Notes |
|---|---|---|
| id | Int | Primary key |
| name | String | Convention name |
| start_date | String | |
| end_date | String | |
| venue | String | |
| neighborhood | String | |
| size | String | Small, Mid-size, Large, Massive |
| type | String | Anime, Gaming, etc. |
| ticket_url | String? | Link to tickets |
| created_at | DateTime | Auto-set on creation |

**Comment**
A threaded comment on a side quest.

| Column | Type | Notes |
|---|---|---|
| id | Int | Primary key |
| side_quest_id | Int | Foreign key → SideQuest |
| author_name | String | Display name |
| body | String | Comment text |
| parent_id | Int? | Self-referential FK for threading |
| created_at | DateTime | Auto-set on creation |

**Suggestion**
A community-submitted edit suggestion for a spawn point.

| Column | Type | Notes |
|---|---|---|
| id | Int | Primary key |
| spawn_point_id | Int | Foreign key → SpawnPoint |
| author_name | String | Submitter name |
| field | String | Which field to edit |
| current_value | String? | Existing value |
| suggested_value | String | Proposed new value |
| note | String? | Optional context |
| status | String | pending, applied, dismissed |
| created_at | DateTime | Auto-set on creation |

### Relationships

- `SpawnPoint` has many `SideQuests` (one-to-many)
- `SpawnPoint` has many `Suggestions` (one-to-many)
- `SideQuest` has many `Comments` (one-to-many)
- `Comment` optionally belongs to a parent `Comment` (self-referential, for threading)

---

## API Endpoints

### Spawn Points
| Method | Route | Description |
|---|---|---|
| GET | `/api/spawn-points` | Get all spawn points with side quests |
| GET | `/api/spawn-points/:id` | Get a single spawn point by ID |
| POST | `/api/spawn-points` | Create a new spawn point |
| PUT | `/api/spawn-points/:id` | Update a spawn point |
| DELETE | `/api/spawn-points/:id` | Delete a spawn point |
| PATCH | `/api/spawn-points/:id/rate` | Submit a star rating |
| PATCH | `/api/spawn-points/:id/checkin` | Increment check-in count |

### Side Quests
| Method | Route | Description |
|---|---|---|
| GET | `/api/side-quests` | Get all side quests (supports `?category=` and `?free=true`) |
| GET | `/api/side-quests/:id` | Get a single side quest with comments and spawn point |
| POST | `/api/side-quests` | Create a new side quest |
| PUT | `/api/side-quests/:id` | Update a side quest |
| DELETE | `/api/side-quests/:id` | Delete a side quest |
| PATCH | `/api/side-quests/:id/going` | Increment or decrement going count |
| PATCH | `/api/side-quests/:id/feature` | Toggle featured status |

### Cons
| Method | Route | Description |
|---|---|---|
| GET | `/api/cons` | Get all conventions |
| GET | `/api/cons/:id` | Get a single con |
| POST | `/api/cons` | Create a new con |
| PUT | `/api/cons/:id` | Update a con |
| DELETE | `/api/cons/:id` | Delete a con |

### Comments
| Method | Route | Description |
|---|---|---|
| GET | `/api/comments/:sideQuestId` | Get all comments for a side quest |
| POST | `/api/comments` | Create a new comment or reply |
| PUT | `/api/comments/:id` | Edit a comment |
| DELETE | `/api/comments/:id` | Delete a comment |

### Suggestions
| Method | Route | Description |
|---|---|---|
| GET | `/api/suggestions` | Get all suggestions |
| POST | `/api/suggestions` | Submit a new suggestion |
| PATCH | `/api/suggestions/:id/status` | Update suggestion status (applied/dismissed) |

---

## Installation Instructions

### Prerequisites
- Node.js v18+
- Docker Desktop (for PostgreSQL)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/linmicarm/404-offline.git
cd 404-offline
```

### 2. Install dependencies

Install backend dependencies:
```bash
cd apps/backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### 3. Set up environment variables

In `apps/backend`, create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/404_offline"
PORT=3001
```

In `apps/frontend`, create a `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

### 4. Start PostgreSQL with Docker

From the `apps/backend` directory:

```bash
docker compose up -d
```

This starts a PostgreSQL instance on port 5432. Verify it's running:

```bash
docker ps
```

### 5. Set up the database with Prisma

Generate the Prisma client:

```bash
npx prisma generate
```

Run migrations to create all tables:

```bash
npm run prisma:migrate -- --name init
```

Or if migrations already exist, just apply them:

```bash
npx prisma migrate deploy
```

### 6. Seed the database

```bash
npm run db:seed
```

This creates:
- 9 spawn points (Battle & Brew, Oxford Comics, Matcha Cafe Maiko, Fluffy Fluffy, Tokyo Kuma, Giga-Bites, Joystick Game Bar, My Parent's Basement, 404 Esports)
- 9 side quests (FNM, Pokemon League, Matcha Manga Morning, Cosplay Meetup, Tekken 8 Weekly, Japanese Language Exchange, D&D One Shot, Pokemon Go Community Day, Anime Club)
- 4 cons (MomoCon, DragonCon, AWA, HeroesCon)

### 7. Start the backend

From `apps/backend`:

```bash
npm run dev
```

The backend runs on `http://localhost:3001`.

### 8. Start the frontend

From `apps/frontend`:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

### 9. Open the app

Navigate to `http://localhost:5173` in your browser.

---

## Folder Structure

```
404-offline/
├── apps/
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma       ← Database schema
│   │   │   ├── seed.js             ← Seed data
│   │   │   └── migrations/         ← Prisma migration history
│   │   └── server/
│   │       ├── server.js           ← Express entry point
│   │       ├── db/
│   │       │   └── prisma.js       ← Prisma client instance
│   │       ├── routes/             ← Express route definitions
│   │       └── controllers/        ← Route handler logic
│   └── frontend/
│       ├── public/
│       │   └── robots.txt
│       └── src/
│           ├── api/
│           │   └── index.js        ← All API calls
│           ├── components/         ← All React components
│           ├── utils/
│           │   ├── formatDate.js   ← Date formatting helpers
│           │   └── highlight.jsx   ← Search result highlighting
│           ├── App.jsx             ← Root component and routing
│           ├── main.jsx            ← Entry point with ErrorBoundary
│           └── styles.css          ← Global design system
```

---

## Design System

404 Offline uses a custom CSS variable-based design system with no UI framework.

**Fonts**
- `Dela Gothic One` — display headlines
- `Outfit` — body text
- `Space Mono` — labels, tags, and metadata

**Color palette**
- `--bg: #FFFCF7` — warm off-white background
- `--peach: #FFAA7F` — primary accent
- `--sage: #85C9A0` — secondary accent (social/language)
- `--ink: #1C1008` — near-black text

**Dark mode** is toggled via `data-theme="dark"` on the document root and persisted in localStorage.

---

## Known Limitations

- Authentication is not implemented — all CRUD operations are open. This is intentional for the current scope (community platform prototype).
- Star ratings and check-ins are deduplicated via localStorage only, not server-side sessions.
- Going counts are persisted in localStorage per browser session.
- Image uploads use Cloudinary URLs pasted manually — no direct file upload flow.

---

## Future Roadmap

- User authentication (JWT or session-based)
- User profiles and event RSVPs
- Email notifications for upcoming side quests
- Admin dashboard for content moderation
- Mobile app (React Native)

---

## Author

Built by **Michelle** ([@linmicarm](https://github.com/linmicarm)) as a full-stack capstone project.  

---

*404 Offline · Logged on. Went outside.*
