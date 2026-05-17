# Blue Jays Premium

Concept microsite for the renovated Rogers Centre's premium venues, built in Nuxt 4.
Portfolio piece — **not affiliated with the Toronto Blue Jays or MLB.**

## Stack

Nuxt 4, Vue 3 Composition API, TypeScript (strict), Tailwind v4, Pinia (with
localStorage persistence), VeeValidate + Zod, Motion One, GSAP, Nuxt Image,
Vitest, Playwright. Static export, deploy to Cloudflare Pages.

## What's in here

- 5 routes: home, filterable venues index, dynamic venue detail, compare (Pinia), multi-step inquiry form
- 1 server route: `POST /api/inquire` with Zod re-validation
- 21 unit tests + 3 E2E tests
- Real Rogers Centre press photography
- View Transitions API between routes
- Reveal-on-scroll directive + GSAP hero stagger
- Reduced-motion respected throughout

## Run

```bash
nvm use     # use Node 22+ (project tested with v24)
npm install
npm run dev          # http://localhost:3000
npm run generate     # produce .output/public for static deploy
npm run test:unit    # vitest
npm run test:e2e     # playwright (boots dev server)
npm run typecheck    # vue-tsc strict
```

## Deploy (Cloudflare Pages)

Connect this repo to Cloudflare Pages with:
- Build command: `npm run generate`
- Build output directory: `.output/public`
- Node version environment variable: `NODE_VERSION=22`

## Project Layout

```
app/
├─ app.vue                   # Root shell
├─ assets/css/main.css       # Tailwind entry + reveal CSS
├─ components/
│  ├─ base/                  # BaseButton, BaseCard, BaseBadge, BaseInput, BaseSelect
│  ├─ layout/                # TheHeader, TheNav, TheFooter
│  ├─ home/                  # HomeHero, HomeRenovationStory, HomeVenueGrid, HomeGameStrip
│  ├─ venue/                 # VenueCard, VenueDetailHero, VenueAmenities, VenueCapacity, VenueGallery, VenueInquireCta, VenueFilterBar
│  ├─ compare/               # CompareTable, CompareEmptyState
│  └─ inquire/               # InquireProgress, InquireStepVenue, InquireStepDate, InquireStepGroup, InquireStepContact, InquireSuccess
├─ composables/              # useVenues, useSchedule, useVenueFilter, useReducedMotion
├─ data/                     # venues.json, schedule-2026.json
├─ directives/reveal.ts
├─ pages/                    # index, venues/index, venues/[slug], compare, inquire
├─ plugins/                  # directives, persistedstate.client
├─ schemas/inquiry.ts        # Zod (shared client + server)
├─ stores/compare.ts         # Pinia
└─ types/                    # venue, game, inquiry
server/api/inquire.post.ts   # Server route handler
public/images/               # Real Rogers Centre press photography
docs/                        # Spec, plan, Vue learning report
tests/                       # unit + e2e
```

## Disclaimer

Unofficial concept piece. Not affiliated with the Toronto Blue Jays, Rogers
Communications, or Major League Baseball. Built solo by Matt Vinall as a
portfolio project. All venue branding, imagery, and references are used for
non-commercial editorial / portfolio purposes.
