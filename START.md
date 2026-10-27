# 🚀 LessGooo — Product & Technical Development Blueprint (START.md)

> **CONSTRUCT 2.0 — Ideathon & Build Track A**  
> **Team:** Trendly *(Daksh Singh, Tripti Kaushik, Anant Raj, Ananya Nandinii, Vinayak Agrawal)*  
> **Institution:** NST Rishihood University  
> **Platform Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Autonomous Intelligence Engine  
> **Target Pilot Destination:** Varanasi (Scalable Pan-India & Globally)

---

## 1. Executive Summary & Vision

**LessGooo** is an adaptive, spatial travel companion designed to bridge the chasm between static itinerary planning and unpredictable on-ground realities.

Most travellers juggle 4–6 disconnected apps (Maps, TripAdvisor, ride hailing, splitwise, notes) while fighting tourist fare scams, traffic bottlenecks, and rigid schedules. LessGooo turns the journey into a unified, tactile, real-time experience:
1. **Time & Traffic Dwell Engine**: If you linger longer at a spot or hit congestion, your itinerary automatically recalibrates downstream stops without stress.
2. **Transit Fare Shield & Budgeting**: Instant benchmark fare brackets for autos, e-rickshaws, and cabs, backed by real-time expense tracking.
3. **Inclusive Human Support**: Verified local guide hiring & allotment with an elegant, tactile Senior Companion mode.
4. **Clean Tiering**: Free exploration powered by lightweight autonomous models; Pro tier unlocking live autonomous replanning and fare benchmarks.

---

## 2. 🎨 Bespoke Design System: Non-SaaS, Spatial & Editorial

### 2.1. Strictly Prohibited Design Tropes (What We Will NEVER Do)
* 🚫 **NO generic B2B SaaS layouts**: No boring white/light-gray dashboard canvases with thin gray grid cards.
* 🚫 **NO fake AI badges**: Strictly prohibited: "AI Engine", "AI Powered", pulsing green status dots, or "✨ Powered by AI" labels. Intelligence must be seamless and invisible; the interface adapts naturally without bragging about algorithms.
* 🚫 **NO corporate metric boxes**: No generic SaaS cards like `+14% vs last month` or `Total Users Active`.
* 🚫 **NO sterile purple/indigo gradient buttons**: No cookie-cutter Web3/SaaS primary buttons.

### 2.2. The Design Philosophy: "Curated Spatial Wayfinder"
LessGooo adopts an **immersive, tactile, editorial travel aesthetic** inspired by luxury field journals, architectural transit maps, and physical boarding passes.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DESIGN AESTHETIC MATRIX                         │
├───────────────────┬────────────────────────────────────────────────────┤
│ Atmosphere        │ Nocturnal Obsidian & Warm Clay / Saffron Embers    │
│ Physicality       │ Layered floating glass cards, tactile ticket edge  │
│ Depth & Physics   │ Z-axis elevation, subtle 3D transforms, micro-glow │
│ Intelligence Tone │ Ambient & silent — zero gimmicky AI badges         │
│ Senior Experience │ High-contrast physical tactile switches & cards   │
└───────────────────┴────────────────────────────────────────────────────┘
```

### 2.3. Palette & Material Tokens
* **Base Surface Canvas**: Deep Nocturnal Obsidian (`#0A0D14`) with warm ambient undertones.
* **Elevated Surfaces**: Translucent smoky slate (`rgba(18, 24, 38, 0.72)`) with `backdrop-filter: blur(16px)` and ultra-thin luminous borders (`border-white/10`).
* **Accent & Wayfinding**:
  - **Saffron Ember** (`#FF5A26`): Hero action, active waypoints, and evening Aarti highlights.
  - **Kashi Ochre / Brass** (`#E5A93C`): Heritage monuments, verified guide seals, and fair fare bounds.
  - **River Mist Indigo** (`#4E7BFF`): Waterways, boat transitions, and nocturnal journey markers.
  - **Jade / Olive Rest** (`#2DD4BF`): Relaxed stops, ghat strolls, and budget runway indicators.
* **Typography**:
  - **Display / Headers**: Elegant, high-character serif or editorial sans (e.g., *Playfair Display* / *Syne*) to give destinations soul and gravitas.
  - **Data / Metrics**: Monospaced, tabular numerals (*JetBrains Mono* / *Space Mono*) for transit time-stamps, route distances, and Rupee price bounds.
  - **Interface / Reading**: Crisp, high-legibility geometric sans (*Plus Jakarta Sans*).

### 2.4. Tactile UI Components (Field-Tested for Travel)
1. **The Journey Waypoint Card**:
   - Styled as an architectural boarding pass with a perforated notch divider.
   - Shows time range in monospace, distance from previous stop, and category icon.
   - Smooth 3D tilt on hover (`transform: perspective(1000px) rotateX(2deg)`).
2. **Dynamic Live Time-Drift Bar**:
   - Instead of a green AI dot, a minimalist, warm timeline scrubber that indicates schedule health:  
     `09:30 AM ──●───[+25m Dwell Detected]───○ 11:45 AM`
   - Gently pulses with warm amber to indicate automatic downstream re-alignment.
3. **The Fare Negotiation Shield**:
   - A compact, brass-bordered tactile card with large readable fair fare numbers (`₹60 - ₹80`).
   - Local pronunciation pill (e.g., *"Assi Ghat bhaiya, 60 rupaye"*).
4. **Senior Companion Layout**:
   - Replaces multi-column complexity with a single tactile card deck.
   - High-contrast 20px typography, physical-feel push buttons (active depth `translate-y-1`), direct dial photo card of assigned guide, and emergency SOS button.

---

## 3. Product Architecture & Feature Breakdown

### 3.1. Autonomous Traffic & Dwell-Time Auto-Replanner
* **The Reality**: Travelers spend extra time getting lost in alleys, sipping chai, or waiting out temple queues.
* **Behavior**:
  - Monitors elapsed time against the active checkpoint.
  - When dwell exceeds the tolerance buffer ($> 20$ minutes) or local traffic delay triggers:
    1. **Free Tier**: Displays an ambient notice: *"Your schedule has drifted by 30 mins. Tap to recalculate manually."*
    2. **Pro Tier**: Automatically rebalances downstream timings, pushes flexible stops, prioritizes unmissable timed events (like the 6:30 PM Ganga Aarti or boat rides), and presents a one-tap undo option.

### 3.2. Auto & Cab Fare Predictor (Anti-Scam Shield)
* **The Reality**: Auto and rickshaw drivers in tourist hubs charge up to $4\times$ standard rates.
* **Behavior**:
  - Calculates point-to-point road distance and peak congestion hours.
  - Outputs transparent rate bands:
    - **E-Rickshaw (Shared)**: ₹15–₹25/seat
    - **E-Rickshaw (Full Reserved)**: ₹60–₹90
    - **Auto Rickshaw (CNG)**: ₹80–₹120
    - **App Cab / Taxi**: ₹180–₹240
  - Includes built-in quick negotiation tips in the local language (Hindi/Bengali/etc.).

### 3.3. Real-Time Trip Expense Tracker
* **Behavior**:
  - Minimalist tactile expense logger with quick tags: `Transit`, `Food`, `Guide`, `Tickets`, `Shopping`.
  - Visual budget progress bar that shifts from calm jade to warm saffron as the daily limit approaches.
  - Offline-first storage using `localStorage` with CSV/JSON trip summary export.

### 3.4. Senior Citizen Guide Allotment & Companion System
* **The Reality**: Seniors struggle with multi-step digital navigation, sudden route changes, and crowded pedestrian zones.
* **Behavior**:
  - **Verified Guide Marketplace**: Hand-picked, ID-verified local guides with specialization filters (Spiritual/Temple, History, Accessible/Slow Pace).
  - **One-Tap Guide Allotment**: Connect via call or WhatsApp; guide receives a shared view of the family's preferred stops.
  - **Senior Mode Toggle**: Instantly simplifies the UI into high-contrast tactile cards with audio readout for landmark history.

---

## 4. Freemium Model & Feature Gating

| Capability | Free Explorer Tier | Pro Tier (`LessGooo+`) |
| :--- | :--- | :--- |
| **Itinerary Generation** | Full personalized multi-day plan | Priority crowd-optimized sequencing |
| **Conversational Assistant** | **High-speed Engine** (super fast, low cost) | **Deep Reasoning Engine** (in-depth cultural deep-dives) |
| **Schedule Re-alignment** | Manual refresh button on delay | **Autonomous real-time auto-replanner** |
| **Transit Fare Shield** | Basic estimated transit distances | **Dynamic auto/cab price brackets + negotiation tips** |
| **Expense Tracker** | Standard spend logging & category split | Budget pacing insights & overspend alerts |
| **Guide Service** | Directory listing of local guides | **Direct guide allotment, vetting & priority support** |

---

## 5. Technical Specifications & Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Next.js 16 (App Router + React 19)                   │
├────────────────────────────────────────────────────────────────────────┤
│  UI Layer: Tailwind CSS v4 + Custom Spatial Transforms + Glass Filters  │
│  State: React Context & LocalStorage (Zero-latency offline reliability)│
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
     ┌────────────────────────────┐    ┌───────────────────────────┐
     │      Client Services       │    │     AI / Edge Engine      │
     ├────────────────────────────┤    ├───────────────────────────┤
     │ • Itinerary State Manager  │    │ • Autonomous Planning Engine│
     │ • Traffic / Dwell Monitor  │    │ • Dynamic Schedule Solver │
     │ • Fare Matrix Calculator   │    │ • Guide Allotment Matcher │
     │ • Expense Ledger Engine    │    │                           │
     └────────────────────────────┘    └───────────────────────────┘
```

### 5.1. Appwrite Database Architecture & Authentication Schema

We use **Appwrite Cloud** (`https://nyc.cloud.appwrite.io/v1`, Project: `6addf37400385e615d7d`) as the primary backend for identity, databases, and realtime updates.

#### A. Appwrite Auth (Security & Passwords)
* Appwrite handles password hashing and salt via internal Argon2/Bcrypt engines (`account.create`, `account.createEmailPasswordSession`). Passwords are never stored in plaintext database attributes.

#### B. Database Collections (`lessgooo_db`):

1. **`users` Collection** (Companion user profile document, document ID = `userId`):
   - `userId` (string, size 36, required): Appwrite Auth `$id`
   - `fullName` (string, size 128, required): Full name
   - `email` (string, size 255, required): User email
   - `phone` (string, size 20, required): Phone number with country code
   - `state` (string, size 100, required): State / Region of origin
   - `username` (string, size 64, required): Unique handle (e.g. `daksh_travels`)
   - `tier` (string, size 20, default: `"free"`): Subscription tier (`"free"` | `"pro"`)
   - `createdAt` (string, ISO format)

2. **`itineraries` Collection**:
   - `userId` (string, size 36, index)
   - `title` (string, size 128)
   - `status` (string, size 20: `"draft"` | `"active"` | `"completed"`)
   - `stopsJson` (string, size 100000: Serialized `ItineraryStop[]`)
   - `totalBudgetINR` (integer)
   - `spentINR` (integer)

3. **`expenses` Collection**:
   - `userId` (string, size 36, index)
   - `itineraryId` (string, size 36)
   - `title` (string, size 128)
   - `amountINR` (float)
   - `category` (string, size 30: `"transit"` | `"food"` | `"stay"` | `"guide"` | `"tickets"` | `"shopping"`)
   - `timestamp` (string, ISO)

4. **`guides` Collection**:
   - `name` (string, size 128)
   - `languages` (string[], array of strings)
   - `hourlyRateINR` (integer)
   - `dailyRateINR` (integer)
   - `phone` (string, size 20)
   - `isGovtVerified` (boolean)
   - `specialty` (string, size 60)

---

### TypeScript Data Contracts:

```typescript
// Itinerary Stop Contract
export interface ItineraryStop {
  id: string;
  title: string;
  description: string;
  category: 'sightseeing' | 'food' | 'culture' | 'transit' | 'relaxation';
  startTime: string; // e.g. "09:30 AM"
  endTime: string;   // e.g. "11:00 AM"
  durationMinutes: number;
  location: {
    name: string;
    landmark: string;
  };
  estimatedCostINR: number;
  isFixedSchedule: boolean; // true for Ganga Aarti, boat cruise
  transitToNext?: {
    mode: 'auto' | 'erickshaw' | 'walk' | 'boat';
    durationMinutes: number;
    fairFareMin: number;
    fairFareMax: number;
    distanceKm: number;
  };
}

// Local Guide Allotment Contract
export interface LocalGuide {
  id: string;
  name: string;
  photoUrl: string;
  badge: 'Senior Specialist' | 'Heritage Scholar' | 'Spiritual Walk Leader';
  rating: number;
  reviewsCount: number;
  languages: string[];
  hourlyRateINR: number;
  dailyRateINR: number;
  isGovtVerified: boolean;
  phone: string;
  experienceYears: number;
}

// Expense Ledger Contract
export interface ExpenseEntry {
  id: string;
  title: string;
  amountINR: number;
  category: 'transit' | 'food' | 'stay' | 'guide' | 'shopping' | 'tickets';
  timestamp: string;
}
```

---

## 6. Phased Implementation Roadmap

### Phase 1: Spatial Shell & Visual Experience (Current Step)
- [x] Next.js 16 + React 19 + Tailwind v4 workspace ready.
- [ ] Implement bespoke design system: Nocturnal Obsidian theme, glassmorphic cards, warm terracotta/saffron highlights, and custom boarding pass styled components.
- [ ] Create Tier Switcher (`Free` vs `Pro`) in header for live testing without paywalls.
- [ ] Build Senior Mode switcher with high-contrast tactile elements.

### Phase 2: Dynamic Itinerary & Dwell Engine
- [ ] Curate authentic Varanasi pilot dataset (Assi Ghat, Kashi Vishwanath, Dashashwamedh, Manikarnika, Sarnath, Blue Lassi, Godowlia Market).
- [ ] Build **Delay & Dwell Simulator** (allows user or judge to simulate a 30m / 60m delay).
- [ ] Implement **Auto-Replanner**: Free tier shows manual prompt; Pro tier smoothly adjusts downstream stop times without user intervention.

### Phase 3: Transit Fare Shield & Expense Ledger
- [ ] Build **Fare Calculator Component**: Select any two stops $\to$ view realistic price brackets for autos, e-rickshaws, and cabs + local negotiation scripts.
- [ ] Build **Interactive Expense Tracker**: Quick-add modal, spend breakdown, and daily budget indicator.

### Phase 4: Guide Allotment & Senior Companion View
- [ ] Build **Local Guide Marketplace**: Card layout with verified credentials, specialty badges, pricing, and 1-tap booking simulation.
- [ ] Build **Senior Mode Interface**: Focused, large-print, step-by-step waypoint view with direct guide calling button.

### Phase 5: Travel Concierge Engine & Pitch Polish
- [ ] Integrate lightweight AI conversational assistant for quick local questions.
- [ ] Rehearse judge demonstration flow (Scenario: Delay at Temple $\to$ Auto-replanning $\to$ Auto fare shield $\to$ Guide allotment).
