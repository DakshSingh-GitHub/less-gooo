# LessGooo — FastAPI Backend Architecture & Implementation Plan (`BACKEND.md`)

> **Frontend Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Leaflet  
> **Backend Stack:** FastAPI (Python 3.11+), SQLAlchemy 2.0 (Async), Pydantic v2, Alembic, PostgreSQL (or SQLite for local dev), `google-genai`  
> **Target Pilot:** Varanasi (Scalable Pan-India & Globally)

---

## 1. Overview & Motivation

Currently, **LessGooo** relies on:
- **Client-side Appwrite SDK** (`lib/appwrite.ts`) for authentication, `users`, `trips`, `itineraries`, `expenses`, `guides`, and `posts`, with `localStorage` fallback caching.
- **A single Next.js API Route** (`app/api/trips/generate-plan/route.ts`) that computes transit & ticket estimates (`lib/transitEngine.ts`) and calls Gemini (`gemini-2.5-flash-lite`) with a Varanasi expert fallback (`DESTINATION_KNOWLEDGE`).
- **Direct browser requests** to Nominatim (geocoding/reverse geocoding) and OSRM (driving routes) in `components/dashboard/trip/LiveNavigationMap.tsx` and `components/dashboard/TripCreateForm.tsx`.

Migrating to a dedicated **FastAPI** backend provides:
1. **Transactional integrity** for business rules (single active trip enforcement, atomic post likes, idempotent transit expense syncing).
2. **Server-side secret protection** (`GEMINI_API_KEY`, JWT signing secrets, DB credentials).
3. **Centralized validation & tier gating** (`free` vs `pro` capabilities from `START.md`).
4. **Rate-limit-safe geo proxy** with caching for Nominatim and OSRM.

---

## 2. Recommended Backend Directory Structure

Create a `backend/` folder at the repository root:

```text
backend/
├── app/
│   ├── main.py                  # FastAPI app, CORS, lifespan, global exception handlers
│   ├── core/
│   │   ├── config.py            # Pydantic BaseSettings (.env config)
│   │   ├── security.py          # Argon2/bcrypt password hashing & JWT tokens
│   │   └── deps.py              # get_db, get_current_user, require_pro_tier
│   ├── db/
│   │   ├── session.py           # Async SQLAlchemy engine & async_sessionmaker
│   │   └── base.py              # Declarative Base
│   ├── models/                  # SQLAlchemy 2.0 ORM models
│   │   ├── user.py
│   │   ├── trip.py
│   │   ├── expense.py
│   │   ├── post.py
│   │   └── guide.py
│   ├── schemas/                 # Pydantic v2 schemas (matching TS contracts in lib/appwrite.ts)
│   │   ├── auth.py
│   │   ├── trip.py
│   │   ├── plan.py
│   │   ├── expense.py
│   │   ├── post.py
│   │   └── guide.py
│   ├── services/                # Pure business logic & external integrations
│   │   ├── transit_engine.py    # Port of lib/transitEngine.ts + local fare brackets
│   │   ├── plan_generator.py    # google-genai (gemini-2.5-flash-lite) + fallback
│   │   ├── trip_reconciler.py   # Port of lib/tripDateUtils.ts
│   │   └── geo_proxy.py         # Cached Nominatim & OSRM client (httpx)
│   └── api/
│       └── v1/
│           ├── router.py        # Aggregates all v1 routers under /api/v1
│           ├── auth.py          # /auth/register, /auth/login, /auth/me, /auth/profile
│           ├── trips.py         # /trips CRUD, /activate, /complete, /reconcile
│           ├── plans.py         # /trips/generate-plan, /trips/{id}/replan
│           ├── expenses.py      # /expenses CRUD, /expenses/sync-transit
│           ├── posts.py         # /posts CRUD, /posts/{id}/like
│           ├── guides.py        # /guides list/filter, /guides/{id}/allot
│           └── maps.py          # /maps/geocode, /maps/reverse, /maps/route
├── alembic/                     # Database migrations
├── alembic.ini
├── pyproject.toml               # Dependencies & tooling config
└── .env.example
```

### Core Python Dependencies
- `fastapi`, `uvicorn[standard]`
- `sqlalchemy[asyncio]`, `asyncpg` (PostgreSQL) / `aiosqlite` (local SQLite), `alembic`
- `pydantic-settings`, `email-validator`
- `passlib[argon2]`, `pyjwt`
- `google-genai`
- `httpx` (async HTTP client for Nominatim/OSRM)

---

## 3. Database Schema & Models

> **Note:** If you prefer keeping Appwrite Cloud as the datastore, FastAPI can wrap the `appwrite` Python Server SDK using `APPWRITE_API_KEY`. However, PostgreSQL + SQLAlchemy is recommended for ACID transactions, relational joins, and clean array/JSONB querying.

### 3.1. `users`
| Column | Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key |
| `full_name` | `VARCHAR(128)` | Required |
| `email` | `VARCHAR(255)` | Unique, indexed, lowercase |
| `username` | `VARCHAR(64)` | Unique, indexed, lowercase, immutable |
| `password_hash` | `VARCHAR(255)` | Argon2 hash (never returned in API responses) |
| `phone` | `VARCHAR(20)` | Required |
| `state` | `VARCHAR(100)` | Required |
| `tier` | `VARCHAR(20)` | `"free"` \| `"pro"`, default `"free"` |
| `created_at` | `TIMESTAMPTZ` | Server default `now()` |

### 3.2. `trips`
Mirrors `Trip` in `lib/appwrite.ts`:
| Column | Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key |
| `user_id` | `UUID` | FK -> `users.id` (indexed) |
| `title` | `VARCHAR(255)` | Required |
| `from_city` | `VARCHAR(255)` | Optional origin city |
| `destination` | `VARCHAR(255)` | Required |
| `start_date` | `DATE` | Required (`YYYY-MM-DD`) |
| `end_date` | `DATE` | Required (`YYYY-MM-DD`) |
| `category` | `VARCHAR(50)` | `"Solo"`, `"Family"`, `"Business"`, `"Vacation"`, `"Spiritual"`, `"Adventure"` |
| `budget` | `FLOAT` | Default `0` |
| `currency` | `VARCHAR(10)` | Default `"INR"` |
| `status` | `VARCHAR(20)` | `"draft"` \| `"upcoming"` \| `"active"` \| `"completed"` (indexed) |
| `notes` | `TEXT` | Optional |
| `specifications` | `JSONB` | `PlanSpecifications` contract |
| `proposed_plan` | `JSONB` | `ProposedPlanDay[]` contract |
| `estimated_ticket_cost` | `FLOAT` | Optional |
| `estimated_transit_cost` | `JSONB` | `TransitCostBreakdown` contract |
| `approaching_transit_cost` | `JSONB` | `SingleLegTransitCost` contract |
| `departure_transit_cost` | `JSONB` | `SingleLegTransitCost` contract |
| `created_at` | `TIMESTAMPTZ` | Server default `now()` |
| `updated_at` | `TIMESTAMPTZ` | Auto-updated |

**Constraint:** Only one trip per `user_id` may have `status = 'active'` at any time (enforced via partial unique index `UNIQUE (user_id) WHERE status = 'active'` in PostgreSQL + transactional demotion in the service layer).

### 3.3. `expenses`
Mirrors `ExpenseItem` in `lib/appwrite.ts`:
| Column | Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key |
| `user_id` | `UUID` | FK -> `users.id` (indexed) |
| `trip_id` | `UUID` | FK -> `trips.id` (nullable, indexed) |
| `itinerary_id` | `UUID` | Nullable |
| `title` | `VARCHAR(255)` | Required |
| `amount_inr` | `FLOAT` | Required |
| `category` | `VARCHAR(30)` | `"transit"` \| `"food"` \| `"temple"` \| `"guide"` \| `"shopping"` \| `"stay"` |
| `timestamp` | `VARCHAR(50)` | Display/ISO timestamp |
| `created_at` | `TIMESTAMPTZ` | Server default `now()` |

### 3.4. `posts` & `post_likes`
Mirrors `Post` in `lib/appwrite.ts`, normalized for atomic likes:
- **`posts`**: `id` (UUID PK), `user_id` (FK -> `users.id`), `author_name`, `author_username`, `title`, `content`, `category`, `tags` (`JSONB` array of strings), `likes_count` (int, default `0`), `created_at` (`TIMESTAMPTZ`).
- **`post_likes`**: `post_id` (FK -> `posts.id` ON DELETE CASCADE), `user_id` (FK -> `users.id` ON DELETE CASCADE), composite PK `(post_id, user_id)`.

### 3.5. `guides`
Mirrors `GuideItem` in `lib/appwrite.ts`:
| Column | Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key |
| `name` | `VARCHAR(128)` | Required |
| `phone` | `VARCHAR(20)` | Required |
| `specialty` | `VARCHAR(60)` | e.g. `"Senior Specialist"`, `"Heritage Scholar"`, `"Spiritual Walk Leader"` |
| `languages` | `JSONB` | Array of strings |
| `hourly_rate_inr` | `INTEGER` | Required |
| `daily_rate_inr` | `INTEGER` | Required |
| `is_govt_verified` | `BOOLEAN` | Default `false` |
| `city` | `VARCHAR(100)` | Indexed (e.g. `"Varanasi"`) |

---

## 4. API Endpoints Specification (`/api/v1`)

### 4.1. Auth & User Profile (`/auth`)
- **`POST /auth/register`**
  - Validates unique `email` and cleaned `username` (lowercase, stripped `@` and whitespace).
  - Hashes password with Argon2, creates user with `tier="free"`, returns JWT access token + `UserProfile`.
- **`POST /auth/login`**
  - Verifies email/password, returns JWT access token + `UserProfile`.
- **`GET /auth/me`**
  - Requires Bearer token; returns current `UserProfile`.
- **`PATCH /auth/profile`**
  - Updates `fullName`, `phone`, `state` only. `email` and `username` are strictly immutable (matching `app/account-info/page.tsx`).

### 4.2. Trips & Lifecycle (`/trips`)
- **`GET /trips`**
  - Fetches all trips for `current_user`.
  - Runs `reconcile_trips_with_current_date` (ported from `lib/tripDateUtils.ts`) using the client's local date header or `today` query param (`YYYY-MM-DD`) so expired trips transition to `completed` and matching upcoming trips promote to `active`.
- **`POST /trips`**
  - Creates a trip. If `status == "active"`, transactionally demotes any other `"active"` trip for that user to `"upcoming"`.
- **`PATCH /trips/{trip_id}`**
  - Updates `title`, `destination`, `from`, `startDate`, `endDate`, `budget`, `currency`, `status`, `notes`, `specifications`, `proposedPlan`, or cost breakdowns.
- **`POST /trips/{trip_id}/activate`**
  - Atomically demotes any currently active trip for `current_user` to `"upcoming"` and sets `trip_id` to `"active"`.
- **`POST /trips/{trip_id}/complete`**
  - Sets `status = "completed"` and optionally updates `endDate` (when completing early).

### 4.3. Plan Generation, Transit Engine & Replanner (`/trips`, `/transit`)
- **`POST /trips/generate-plan`**
  - Direct replacement for `app/api/trips/generate-plan/route.ts`.
  - Computes `approachingTransitCost`, `departureTransitCost`, `estimatedTransitCost`, and `estimatedTicketCost` via `services/transit_engine.py` (ported from `lib/transitEngine.ts`).
  - Calls `google-genai` (`gemini-2.5-flash-lite`) with `response_mime_type="application/json"` and validates output against Pydantic `list[ProposedPlanDay]`.
  - Falls back to deterministic `generate_fallback_plan` + `DESTINATION_KNOWLEDGE` if `GEMINI_API_KEY` is missing or the LLM call/JSON parse fails.
- **`POST /trips/{trip_id}/replan`** *(Dwell-Time Auto-Replanner from `START.md`)*
  - Accepts `current_stop_index` and `delay_minutes`.
  - Shifts downstream non-fixed stops (`isFixed == False`), preserves fixed timed events (e.g. Ganga Aarti), and returns updated `ProposedPlanDay[]`.
  - **Tier behavior:** `free` returns a suggested diff for manual confirmation; `pro` (`require_pro_tier` or tier check) auto-persists and returns an undo snapshot.
- **`GET /transit/fare-shield`** *(From `START.md`)*
  - Query params: `origin`, `destination`, `city`.
  - Returns benchmark fare brackets for `e_rickshaw_shared`, `e_rickshaw_reserved`, `auto_cng`, and `app_cab`, plus local negotiation phrases.

### 4.4. Expenses (`/expenses`)
- **`GET /expenses`**
  - Lists user expenses ordered by newest first; optional filters `trip_id`, `category`.
- **`POST /expenses`**
  - Logs a new expense entry (`title`, `amountINR`, `category`, `tripId`, `timestamp`).
- **`PUT /expenses/sync-transit`**
  - Port of `syncTransitExpensesInDb` from `lib/appwrite.ts`.
  - Within a single DB transaction: deletes existing `category == "transit"` expenses for `(user_id, trip_id)` and inserts the new `approaching` and `departure` expense items so regenerating plans never duplicates transit costs.

### 4.5. Community Feed (`/posts`)
- **`GET /posts`**
  - Query params: `sub_filter` (`latest` | `hot` | `growing` | `mine`), `category`, `tag`, `q` (search across title, content, author, tags).
  - Returns `Post[]` including whether `current_user` has liked each post (`likedBy` or `isLikedByMe`).
- **`POST /posts`**
  - Creates a post using `current_user.full_name` and `current_user.username`.
- **`POST /posts/{post_id}/like`**
  - Atomically inserts or deletes `(post_id, current_user.id)` in `post_likes` and updates `posts.likes_count`, returning `{ likesCount, likedBy }`.
- **`DELETE /posts/{post_id}`**
  - Owner-only deletion (`403 Forbidden` if `post.user_id != current_user.id`).

### 4.6. Local Guides (`/guides`)
- **`GET /guides`**
  - Lists verified guides; optional filters `city`, `specialty`, `language`, `verified_only`.
- **`POST /guides/{guide_id}/allot`**
  - Allots a guide to an active trip (priority/full allotment for `pro` tier).

### 4.7. Maps & Routing Proxy (`/maps`)
- **`GET /maps/geocode?q=...`** — Proxies Nominatim search with a descriptive `User-Agent` and in-memory/Redis TTL cache (24h).
- **`GET /maps/reverse?lat=...&lon=...`** — Proxies Nominatim reverse geocode (used in `TripCreateForm.tsx`).
- **`GET /maps/route?orig_lat=...&orig_lng=...&dest_lat=...&dest_lng=...`** — Proxies OSRM driving route with short TTL cache (used in `LiveNavigationMap.tsx`).

---

## 5. Frontend Integration Strategy

1. **API Client (`lib/api.ts`)**:
   - Point `NEXT_PUBLIC_API_URL` to `http://localhost:8000/api/v1` (or proxy via `next.config.ts` `rewrites` under `/api/v1/*` to avoid CORS issues in production).
   - Attach `Authorization: Bearer <token>` on authenticated requests.
2. **Keep Offline-First Stale-While-Revalidate**:
   - Preserve the existing `localStorage` cache keys (`lessgooo_verified_user`, `lessgooo_trips_<userId>`, `lessgooo_expenses_<userId>`, `lessgooo_feed_posts`) in `app/dashboard/page.tsx` for zero-latency initial renders, while replacing `lib/appwrite.ts` network calls with `lib/api.ts`.
3. **CORS Configuration**:
   - Enable `CORSMiddleware` in `backend/app/main.py` for `http://localhost:3000` and your deployed frontend origin.

---

## 6. Phased Rollout Plan

1. **Phase 1 — Core Setup & Auth**
   - Initialize `backend/` with `pyproject.toml`, `config.py`, async SQLAlchemy + Alembic, `User` model, and `/auth/*` endpoints.
2. **Phase 2 — Trips & Date Reconciliation**
   - Implement `Trip` model, `/trips/*` CRUD, transactional `/activate`, and port `lib/tripDateUtils.ts` to `trip_reconciler.py`.
3. **Phase 3 — Plan Generator & Transit Engine**
   - Port `lib/transitEngine.ts` to `transit_engine.py` and `app/api/trips/generate-plan/route.ts` to `plan_generator.py` using `google-genai`.
4. **Phase 4 — Expenses & Community Feed**
   - Implement `Expense` + `/expenses/sync-transit` and `Post` / `PostLike` + `/posts/*`.
5. **Phase 5 — Geo Proxy, Guides & Pro Features**
   - Add cached Nominatim/OSRM proxy (`/maps/*`), `/guides/*`, dwell-time `/replan`, and `/transit/fare-shield`.
6. **Phase 6 — Frontend Cutover**
   - Swap `lib/appwrite.ts` calls in `app/dashboard/page.tsx`, `app/login/page.tsx`, `app/account-info/page.tsx`, and dashboard components to `lib/api.ts`.
