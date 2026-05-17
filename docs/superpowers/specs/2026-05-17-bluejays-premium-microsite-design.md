# Blue Jays Premium — Microsite Design Spec

**Author:** Matt Vinall
**Date:** 2026-05-17
**Status:** Approved for implementation planning
**Context:** Portfolio piece for Channel 1 Media (post-interview follow-up). Built in Vue 3 / Nuxt 3 to demonstrate full-stack Vue capability against a brief representative of Channel 1's actual client work (premium-seating sales microsites, stadium launch sites).

---

## 1. Purpose & Goals

A multi-page Nuxt 3 microsite that showcases the renovated Rogers Centre's premium venues for the Toronto Blue Jays. Modeled after Cleveland Guardians' premium storefront (`premium.cleguardians.com`) for information architecture and conversion intent, and Tampa Bay Rays' new ballpark site (`newballpark.raysbaseball.com`) for storytelling tone — built with original visual identity working within the Blue Jays brand.

**Primary success criteria:**

1. Demonstrates idiomatic Vue 3 + Nuxt 3 across the full surface area a hiring engineer cares about: file-based routing, dynamic routes, Pinia state, composables, TypeScript, form validation, animation, image optimization, server route handlers, and a baseline test suite.
2. Reads as Channel 1 Media-adjacent work — premium-seating sales-tool flavor, not a generic fan-engagement app.
3. Ships polished enough to open in a 30-second skim and look like a real product.
4. Author learns Vue along the way (separate learning report documents the journey).

**Explicit non-goals:**

- Real e-commerce / payment processing.
- Real Blue Jays back-office integration (Tickets.com, Salesforce, etc.).
- Authentication / user accounts.
- 3D stadium walkthroughs (Three.js / TresJS). Considered and cut for scope.
- Internationalization (French-language support). Easy to add later, skipped for now.
- Real-time availability / live game data feeds.
- CMS integration. Content lives in flat JSON files in `data/`.

---

## 2. Audience

**Primary reviewer:** Channel 1 Media hiring panel — senior frontend / full-stack engineers and a product lead. They will look at: code quality (TypeScript, component design, state separation, accessibility), feature completeness, and whether the project shows credible understanding of premium-seating sales workflows.

**Implicit secondary audience:** the imagined site visitor — a Toronto-area corporate event planner, group organizer, or affluent fan researching premium experiences at Rogers Centre. The UX should make sense to that persona even though the goal is portfolio impact.

---

## 3. Information Architecture

Five top-level routes. All client-rendered with SSG-friendly data (no SSR-only features).

| Route | Purpose | Key components |
|---|---|---|
| `/` | Landing. Hero, renovation intro, venue grid, upcoming-games strip, primary CTA. | `HomeHero`, `HomeRenovationStory`, `HomeVenueGrid`, `HomeGameStrip`, `HomeCta` |
| `/venues` | Filterable index of all premium venues. URL-synced filters for capacity range and venue type. | `VenueFilterBar`, `VenueCard` (grid) |
| `/venues/[slug]` | Per-venue detail page. Hero, amenities, capacity, gallery, prefilled inquiry CTA. | `VenueDetailHero`, `VenueAmenities`, `VenueCapacity`, `VenueGallery`, `VenueInquireCta` |
| `/compare` | Side-by-side comparison of venues saved via the "compare" Pinia store. | `CompareTable`, `CompareEmptyState` |
| `/inquire` | Multi-step inquiry form: venue → date → group size → contact. Submits to a server route. | `InquireProgress`, `InquireStepVenue`, `InquireStepDate`, `InquireStepGroup`, `InquireStepContact`, `InquireSuccess` |

**Cross-route navigation behavior:**

- Persistent header on all routes: logo, primary nav (Home / Venues / Compare with count badge / Inquire), CTA button.
- Persistent footer: brand mark, "Unofficial concept" disclaimer, social icons (non-functional), credit line.
- View Transitions API used between `/venues` and `/venues/[slug]` for a shared-element transition on the venue card hero image.
- All routes are deep-linkable. `/venues?capacity=20-50&type=club` is shareable. `/inquire?venue=td-clubhouse&date=2026-07-04` is shareable.

---

## 4. Data Model

Three TypeScript types in `types/`. All data lives in flat JSON files in `data/` and is loaded via composables. No runtime API.

### 4.1 Venue

```ts
// types/venue.ts
export type VenueType = 'suite' | 'club' | 'group-space' | 'patio'

export interface VenueCapacity {
  min: number
  max: number
  recommended: number
}

export interface VenueAmenity {
  icon: string                  // Heroicons or lucide name
  label: string
}

export interface VenueImage {
  src: string                   // /images/venues/td-clubhouse/hero.jpg
  alt: string
  width: number
  height: number
  caption?: string
}

export interface Venue {
  slug: string                  // 'td-clubhouse', 'westjet-flight-deck'
  name: string                  // 'TD Clubhouse'
  type: VenueType
  tagline: string               // One-line marketing description
  description: string           // 2-3 paragraph long form
  capacity: VenueCapacity
  amenities: VenueAmenity[]
  images: {
    hero: VenueImage
    gallery: VenueImage[]
  }
  pricing: {
    perGameFrom: number         // CAD, lowest game-day rate
    perGameTo: number           // highest
    note?: string               // "Pricing varies by opponent and date"
  }
  location: {
    level: string               // '100', '200', '500', 'Field'
    section: string             // 'Behind home plate'
    coords: { x: number; y: number }   // For stadium SVG hotspot
  }
  bestFor: string[]             // ['Corporate hospitality', 'VIP guests']
}
```

### 4.2 Game

```ts
// types/game.ts
export interface Game {
  id: string                    // '2026-04-15-tor-bos'
  date: string                  // ISO 8601 date
  opponent: string              // 'Boston Red Sox'
  opponentLogo: string          // /images/teams/bos.svg
  isHome: boolean               // Always true in fixture; field included for honesty
  firstPitch: string            // '19:07'
  promotion?: string            // 'Bobblehead Night'
  tier: 'marquee' | 'premium' | 'standard'   // Affects premium-venue pricing
}
```

### 4.3 Inquiry

```ts
// types/inquiry.ts
export interface Inquiry {
  venueSlug: string
  preferredDate: string         // ISO date or 'flexible'
  groupSize: number
  occasion?: string             // 'corporate' | 'birthday' | 'wedding' | 'other'
  contact: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company?: string
  }
  notes?: string
  consent: boolean              // GDPR-flavored marketing-comms consent
  submittedAt: string           // Set server-side
}
```

### 4.4 Source files

| File | Shape | Size |
|---|---|---|
| `data/venues.json` | `Venue[]` | 5 venues: TD Clubhouse, WestJet Flight Deck, Park Social, The Catch Bar, TD Executive Suites |
| `data/schedule-2026.json` | `Game[]` | ~30 home games sampled across the 2026 season |

Both files are committed to the repo, hand-curated for plausibility (real opponents, real dates from MLB's 2026 schedule).

---

## 5. Component Architecture

Component grouping follows feature/role separation, not type. The `base/` folder holds presentational primitives reused everywhere; feature folders hold components specific to one page or flow.

### 5.1 Base primitives (`components/base/`)

| Component | Props | Notes |
|---|---|---|
| `BaseButton` | `variant: 'primary' \| 'ghost' \| 'link'`, `size: 'sm' \| 'md' \| 'lg'`, `as?: 'button' \| 'a' \| 'NuxtLink'` | Polymorphic via `as`. Slot for content. |
| `BaseCard` | `padding`, `interactive` | Wraps any card-shaped block. Hover lift when `interactive`. |
| `BaseBadge` | `tone: 'neutral' \| 'success' \| 'warning'` | Used for venue type pills. |
| `BaseInput` | `modelValue`, `label`, `error`, `type`, `name` | Used by every form field. Single-source-of-truth for input styling. |
| `BaseSelect` | `modelValue`, `options`, `label`, `error` | Pairs with `BaseInput`. |
| `BaseIcon` | `name` | Renders a single SVG sprite by name. |

### 5.2 Layout (`components/layout/`)

`TheHeader`, `TheFooter`, `TheNav`. "The" prefix per Vue style guide for single-instance components.

### 5.3 Feature folders

- `components/home/` — `HomeHero`, `HomeRenovationStory`, `HomeVenueGrid`, `HomeGameStrip`, `HomeCta`.
- `components/venue/` — `VenueCard`, `VenueDetailHero`, `VenueAmenities`, `VenueCapacity`, `VenueGallery`, `VenueInquireCta`, `StadiumMap` (SVG with hotspot per venue).
- `components/compare/` — `CompareTable`, `CompareEmptyState`.
- `components/inquire/` — `InquireProgress`, `InquireStepVenue`, `InquireStepDate`, `InquireStepGroup`, `InquireStepContact`, `InquireSuccess`.

**Total components:** ~25. Most are small (<100 lines). `StadiumMap` and `CompareTable` are the largest at ~150-200 lines each.

### 5.4 Composables (`composables/`)

| Composable | Returns | Used by |
|---|---|---|
| `useSchedule()` | `{ games, upcomingGames, gamesByMonth, getGameById }` | `HomeGameStrip`, `InquireStepDate` |
| `useVenueFilter()` | `{ filtered, capacityRange, type, setCapacityRange, setType }` | `/venues` page (URL-synced) |
| `useVenues()` | `{ venues, getVenueBySlug }` | Multiple |
| `useReducedMotion()` | `Ref<boolean>` | Animation components |
| `useStadiumMap()` | `{ hotspots, activeHotspot, focusHotspot }` | `StadiumMap` |

Composables are pure logic; they never render. This separation is one of the "tells" of pro Vue code.

---

## 6. State Management (Pinia)

Two stores. Both small. Pinia is overkill for two stores, but using it here is a deliberate portfolio signal that the author knows when and how to reach for it.

### 6.1 `stores/compare.ts`

```ts
export const useCompareStore = defineStore('compare', () => {
  const slugs = ref<string[]>([])
  const MAX = 4

  const add = (slug: string) => {
    if (slugs.value.length >= MAX) return false
    if (slugs.value.includes(slug)) return false
    slugs.value.push(slug)
    return true
  }
  const remove = (slug: string) => {
    slugs.value = slugs.value.filter(s => s !== slug)
  }
  const toggle = (slug: string) => slugs.value.includes(slug) ? remove(slug) : add(slug)
  const has = (slug: string) => computed(() => slugs.value.includes(slug))
  const count = computed(() => slugs.value.length)

  return { slugs, add, remove, toggle, has, count, MAX }
}, {
  persist: true   // localStorage via @pinia-plugin-persistedstate/nuxt
})
```

Persisted to localStorage so the compare list survives reloads — a small detail that makes the demo feel real.

### 6.2 `stores/ui.ts`

Holds mobile-nav-open state and any other ephemeral UI flags shared across components. Not persisted.

---

## 7. Forms & Validation

Single multi-step form on `/inquire`. VeeValidate + Zod.

### 7.1 Zod schema (single source of truth)

```ts
// schemas/inquiry.ts
import { z } from 'zod'

export const inquirySchema = z.object({
  venueSlug: z.string().min(1, 'Please pick a venue'),
  preferredDate: z.string().min(1, 'Choose a date or "flexible"'),
  groupSize: z.number().int().min(2, 'Minimum 2 guests').max(300, 'Max 300 guests'),
  occasion: z.enum(['corporate', 'birthday', 'wedding', 'other']).optional(),
  contact: z.object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().regex(/^[+\d\s()-]{10,}$/, 'Enter a valid phone'),
    company: z.string().optional()
  }),
  notes: z.string().max(1000).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Required to submit' }) })
})

export type InquiryInput = z.infer<typeof inquirySchema>
```

### 7.2 Step strategy

Each step validates only its own subset of fields. The user can move forward only when the current step's slice is valid. State is held in a `reactive` object scoped to the `inquire.vue` page and prefilled via query params on mount.

Server route `server/api/inquire.post.ts` re-validates with the same Zod schema, logs the inquiry, and returns `{ ok: true, id: <uuid> }`. This shared-schema-server-and-client pattern is another "pro Vue" tell.

---

## 8. Animation & Motion

**Library choices:**
- **Motion One** — reveal-on-scroll, card hovers, generic transitions. Tiny (~3KB), Web Animations API wrapper.
- **GSAP** — used once, for the homepage hero's pinned scroll sequence revealing the stadium. Overkill elsewhere.
- **View Transitions API** — route-level transitions. Falls back gracefully where unsupported.

**Patterns:**
- Every animation is wrapped in `useReducedMotion()` and goes inert when `prefers-reduced-motion: reduce`.
- Reveal-on-scroll uses `IntersectionObserver` via a `v-reveal` directive (`directives/reveal.ts`).
- Hover micro-interactions live in Tailwind utilities + `transition-*` classes; no JS for these.

---

## 9. Image & Media Strategy

**Source images:** Real Blue Jays / Rogers Centre press photography where available, supplemented with Unsplash and original SVG illustrations for stadium-map vector art. Stored in `public/images/venues/<slug>/` with descriptive filenames.

**Delivery:** `<NuxtImg>` component everywhere instead of raw `<img>`. Configured to:
- Output AVIF with WebP fallback.
- Generate responsive `srcset` at 480/768/1280/1920 widths.
- Lazy-load below the fold.
- Use `loading="eager"` + `fetchpriority="high"` for the LCP image on each page.

**Image budget:** Hero images target <120KB at 1920w AVIF. Gallery thumbnails target <40KB.

**Stadium map:** Hand-authored SVG, ~30KB, inlined at build time. Hotspots are `<g>` elements with `data-venue-slug` attributes; `StadiumMap.vue` attaches click + keyboard handlers.

---

## 10. Accessibility

Targets WCAG 2.2 AA. Non-negotiable for portfolio code.

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>` with `aria-labelledby`.
- All interactive elements keyboard-operable. Focus-visible styles distinct from hover.
- `StadiumMap` hotspots: `<button>` elements inside the SVG with `aria-label`. Map itself has a text-list fallback for screen readers.
- Forms: every input has a `<label>`. Errors associated via `aria-describedby` and announced via `role="status"` live region on validation.
- Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI components.
- `prefers-reduced-motion` honored across all animations.
- Page titles set per route via `useHead({ title })`.

---

## 11. Performance Budget

Cloudflare Pages, SSG output, no client-side data fetching at runtime.

| Metric | Budget |
|---|---|
| LCP | < 2.0s on 4G |
| CLS | < 0.05 |
| INP | < 200ms |
| Total JS (gzip) | < 150KB |
| Total CSS (gzip) | < 25KB |
| Home page LCP image | < 120KB |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | 100 |

Achieved via: SSG, route-level code splitting (free with Nuxt), Tailwind v4 purging, AVIF imagery, font subsetting + `font-display: swap`.

---

## 12. Testing

Minimum-viable portfolio test bar — enough to signal discipline without ballooning scope.

**Vitest (unit):**
- `useSchedule` composable — filtering and grouping logic.
- `useCompareStore` — add/remove/toggle/MAX cap behavior.
- `useVenueFilter` — URL-sync round-trip.
- Zod inquiry schema — happy path + a few representative failure cases.

**Playwright (E2E):**
- Test 1: Homepage loads, hero is visible, venue grid renders 5 cards, primary CTA navigates to `/inquire`.
- Test 2: Full inquiry happy path — start at `/venues/td-clubhouse`, click "Inquire about this venue", complete all four steps, see success state.

That's the floor. No coverage thresholds, no visual regression tests.

---

## 13. Deployment

**Target:** Cloudflare Pages. SSG build via `nuxt generate`. Custom domain optional (e.g., `bluejays-premium.vercel.app` or similar).

**Build command:** `npm run generate`
**Output directory:** `.output/public`
**Node version:** 22 LTS (pinned in `.nvmrc` and `package.json` `engines`).

**Branching:** single `main` branch. Preview deploys on PRs (Cloudflare default).

---

## 14. Project Structure

```
toronto-bluejays-premium/
├─ app.vue
├─ nuxt.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
├─ package.json
├─ .nvmrc
├─ README.md
├─ docs/
│  ├─ superpowers/specs/        # This document
│  └─ learning/                 # Vue learning report
├─ assets/
│  ├─ css/                      # Tailwind entry, fonts
│  └─ icons/                    # SVG sprite source
├─ public/
│  ├─ images/venues/<slug>/
│  └─ images/teams/
├─ components/
│  ├─ base/
│  ├─ layout/
│  ├─ home/
│  ├─ venue/
│  ├─ compare/
│  └─ inquire/
├─ composables/
├─ stores/
├─ schemas/
├─ directives/
├─ server/api/
├─ data/
├─ types/
├─ pages/
└─ tests/
   ├─ unit/
   └─ e2e/
```

---

## 15. Open Questions / Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Author is new to Vue; idiomatic patterns drift toward React habits. | High | Vue learning report doubles as a style reference. Lean on Composition API + `<script setup>` from day one. Read the official style guide before starting. |
| `StadiumMap` SVG authoring is more time-consuming than expected. | Medium | Use an existing Rogers Centre seating-chart vector as a base, or simplify to a rectangle-with-labeled-zones if pressed for time. |
| Real Blue Jays photography is hard to source at consistent quality. | Medium | Mix press photos, Unsplash ballpark generics, and original SVG illustrations. Caption-credit anything not original. |
| Scope creep into 3D walkthroughs or video. | High | Spec explicitly forbids both. Re-read this section before adding "just one" feature. |
| Multi-step form state management gets gnarly. | Low | `reactive()` object on the page component is sufficient. Don't over-Pinia it. |

---

## 16. What This Project Deliberately Avoids

- **No Options API.** Everything is Composition API + `<script setup>`.
- **No Vuex.** Pinia only.
- **No component library** (PrimeVue, Vuetify, Quasar). Custom components or shadcn-vue at the author's option, leaning custom.
- **No CSS-in-JS, no scoped styles by default.** Tailwind v4 utilities in markup. Rare exception: `<style>` block for one-off keyframe definitions if Motion One won't do.
- **No global event bus.** Pinia for shared state, props/emits for parent-child, `provide/inject` for deep trees.
- **No `any`.** TypeScript strict mode on. `unknown` is acceptable at trust boundaries (server route handler).
- **No render functions or JSX.** Templates everywhere.
- **No client-side data fetching for static content.** Venues and schedule are imported at build time.

---

## 17. Definition of Done

The project is "done" when all of the following are true:

1. All five routes render correctly on desktop (1440w) and mobile (375w).
2. Compare-store persistence works across reloads.
3. Inquire form submits successfully to the server route with all four steps validated, and a real success screen renders.
4. URL-synced filtering on `/venues` works for direct deep links.
5. Lighthouse scores meet the Section 11 budget on a Cloudflare Pages deploy.
6. Zero TypeScript errors. Zero `any`. Zero ESLint warnings.
7. Vitest suite green (4 tests). Playwright suite green (2 tests).
8. README explains how to run, build, test, and deploy.
9. Vue learning report (`docs/learning/`) is written.
10. Deployed publicly at a shareable URL.
