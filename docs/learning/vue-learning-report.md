# Vue Learning Report — Blue Jays Premium

**For:** Matt
**Date:** 2026-05-17
**Purpose:** A pragmatic, opinionated companion to the spec and implementation plan. Read this *while* you build, not before. Each section maps to something you will actually do in the project, with the *why* behind every decision in the plan so the patterns stick.

---

## 0. Read this first — how to use this document

Building a project to learn a framework is excellent. Building one to learn a framework *and* shipping a portfolio piece at the same time is a tightrope: the temptation is to over-engineer for portfolio impact, or under-engineer to "just learn."

This project is calibrated so every line of code teaches a Vue concept worth knowing. The plan tells you *what* to type; this report tells you *why* and *what good means*. When you hit a step in the plan that confuses you, find the matching section here.

The report has 11 sections:

1. Why Vue 3 / Nuxt 3 in 2026
2. The mental model — Vue's three big ideas
3. Composition API and `<script setup>` — what you're actually doing
4. Refs, computed, watch — the reactivity API
5. Components, props, emits — communication patterns
6. Composables — Vue's killer feature
7. Pinia — when global state is justified
8. Forms and validation with VeeValidate + Zod
9. Routing in Nuxt and the file-system convention
10. Tells of beginner vs professional Vue code
11. What to read after this project

---

## 1. Why Vue 3 / Nuxt 3 in 2026

**The honest answer: this project chose Vue because Channel 1 Media might not care about React vs Vue and learning Vue diversifies your portfolio.** A senior Vue dev and a senior React dev write conceptually identical code. The framework chosen for a portfolio piece signals "I can hold component state, plan a route tree, and handle async" — not allegiance.

That said, Vue in 2026 has a coherent character worth knowing:

- **It's batteries-included by default.** Nuxt 3 ships with file-based routing, server route handlers, image optimization, head management, SSR/SSG, and module system — *out of the box*. The decision-fatigue overhead of React (Next vs Remix vs Vite, Tanstack Router vs React Router, etc.) is mostly absent.
- **The Composition API + `<script setup>` syntax is the official default.** If you read tutorials older than 2023, they may show the Options API (`data() { return {} }`, `methods: {}`). Ignore those. Composition API is what you'll write.
- **Reactivity is automatic and granular.** You wrap a value in `ref()`, and Vue automatically tracks every place it's read; when it changes, only those places re-render. No `useState` + dependency arrays. No memoization rituals.
- **The single-file component (`.vue` file)** is the unit of work. Template + script + scoped styles in one file. This is the single biggest difference from React.

---

## 2. The mental model — Vue's three big ideas

Internalize these three and Vue becomes legible.

### Idea 1: **Reactivity is a graph, not a render loop.**

In React, a re-render is the unit of computation. You write `useState` and `useEffect` and reason in terms of "when does this component re-render and what runs again."

In Vue, you write `ref(0)` and the runtime tracks: every time something *reads* this ref, that reader becomes a dependent. When the ref changes, only those dependents recompute. You almost never think about "did this component re-render?" — you think about "is this value derived correctly from those inputs?"

```ts
const count = ref(0)
const doubled = computed(() => count.value * 2)
// reading doubled.value never recomputes unless count.value changes
```

There's no dependency array. The system observes what `computed` accessed and registers exactly those dependencies. This is the reactivity graph.

### Idea 2: **The template is HTML with superpowers, not a language.**

JSX is JavaScript that produces a tree. Vue templates are HTML with directives (`v-if`, `v-for`, `v-bind`, `v-on`) and interpolation (`{{ }}`). They get compiled, but you write them as HTML.

```vue
<template>
  <button v-if="canSubmit" :disabled="submitting" @click="submit">
    {{ submitting ? 'Submitting…' : 'Submit' }}
  </button>
</template>
```

`v-if` is conditional rendering. `:disabled` is dynamic attribute binding. `@click` is event binding. `{{ }}` is interpolation. That's most of the template syntax.

### Idea 3: **One file per concern.**

A `.vue` file is `<script setup>`, `<template>`, and optionally `<style scoped>`. The component's logic, view, and styles live together. This is sometimes derided as "putting too much in one file" by people used to splitting JSX/CSS/logic — but in practice it keeps a focused unit cohesive. We don't use `<style scoped>` in this project because Tailwind utilities live in the template; you'll mostly see two-section files.

---

## 3. Composition API and `<script setup>` — what you're actually doing

Every component in the project will start with:

```vue
<script setup lang="ts">
// imports
// props/emits declarations
// reactive state
// computed values
// methods
// lifecycle hooks
</script>

<template>
  <!-- the view -->
</template>
```

`<script setup>` is a compile-time syntactic transform. Everything you declare at the top level — variables, functions, imports — is automatically available in the template. No more `return { ... }` from `setup()`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
const increment = () => count.value++
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

Note: in `<script>`, you write `count.value` because `ref` wraps the value in an object with a `.value` getter/setter (so the reactivity system can intercept reads and writes). In `<template>`, Vue automatically unwraps refs, so you write `{{ count }}`, not `{{ count.value }}`. This is the single most common point of confusion. Internalize it: `.value` in script, no `.value` in template.

---

## 4. Refs, computed, watch — the reactivity API

The three primitives you'll use 90% of the time.

### `ref(initial)` — single reactive value

```ts
const count = ref(0)
count.value++        // triggers updates
```

Use for: primitives, objects you'll reassign whole, anything you might want to swap atomically.

### `reactive(obj)` — reactive object

```ts
const form = reactive({ name: '', email: '' })
form.name = 'Matt'    // triggers updates
```

Use for: objects you'll mutate in place. Less common; `ref` is the modern default. We use `reactive` exactly once in this project, for the multi-step form state on `/inquire`.

### `computed(getter)` — derived value

```ts
const fullName = computed(() => `${form.firstName} ${form.lastName}`)
```

Reads its dependencies, cached until any dependency changes. **Crucial:** never write a function that returns derived state — use `computed`. Computed is memoized; a function recomputes every time it's called.

### `watch(source, callback)` and `watchEffect(callback)`

```ts
watch(count, (newVal, oldVal) => console.log('count changed', newVal))
watchEffect(() => console.log('count is', count.value))   // tracks deps automatically
```

Use sparingly. The first instinct is reach for `watch` to "do something when X changes" — but most of the time `computed` is the right tool. If you find yourself writing a watcher to recompute state, use `computed`. Reserve watch for genuine side effects (firing API calls, syncing to localStorage, integrating non-reactive libraries).

---

## 5. Components, props, emits — communication patterns

### Props in — `defineProps`

```ts
const props = defineProps<{
  venue: Venue
  highlighted?: boolean
}>()
```

That's the modern TypeScript form. Vue infers prop types from the generic. Required by default; mark optional with `?`.

For defaults, use `withDefaults`:

```ts
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}>(), {
  variant: 'primary',
  size: 'md'
})
```

### Events out — `defineEmits`

```ts
const emit = defineEmits<{
  (e: 'select', slug: string): void
  (e: 'clear'): void
}>()

emit('select', 'td-clubhouse')
```

Parent listens with `@select="handler"`.

### Two-way binding — `v-model`

A child component that supports `v-model` declares `modelValue` prop and emits `update:modelValue`:

```vue
<!-- child -->
<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>
<template>
  <input :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
</template>

<!-- parent -->
<MyInput v-model="form.email" />
```

This pattern shows up everywhere in this project: `BaseInput`, `BaseSelect`, every form step.

### Slots — content injection

Slots are Vue's named-children mechanism, equivalent to React `children`:

```vue
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>

<!-- consumer -->
<BaseCard>
  <h2>Anything in here is rendered inside the card.</h2>
</BaseCard>
```

Named slots:

```vue
<template>
  <div>
    <slot name="header" />
    <slot />            <!-- default slot -->
    <slot name="footer" />
  </div>
</template>
```

We use slots in `BaseButton` and `BaseCard` for content injection.

---

## 6. Composables — Vue's killer feature

A composable is a function that uses Vue's reactivity primitives and returns reactive state plus methods. Conventionally named `useXxx`.

```ts
// composables/useSchedule.ts
export function useSchedule() {
  const games = ref<Game[]>(scheduleData)

  const upcomingGames = computed(() =>
    games.value.filter(g => new Date(g.date) >= new Date()).sort(...)
  )

  const getGameById = (id: string) => games.value.find(g => g.id === id)

  return { games, upcomingGames, getGameById }
}
```

Why composables are a big deal:

1. **They make logic testable in isolation.** No component to mount, no DOM. Just call the function and assert on its returns. This is why the plan has Vitest tests for `useVenues`, `useSchedule`, `useVenueFilter`, and `useCompareStore`.
2. **They are the reusable unit of logic in Vue.** Instead of higher-order components (HOCs) or render props (React-era patterns), Vue uses functions that compose. Want to share schedule logic between five components? Each calls `useSchedule()`.
3. **They explicit about what state they own.** A composable's signature and return value tell you exactly what it does.

**Anti-pattern:** putting rendering inside a composable. A composable returns reactive state + methods. It never returns JSX/templates. If you need to share view logic, use a component or a slot.

**Nuxt auto-import note:** anything in `composables/` is auto-imported. You don't need `import { useSchedule } from '~/composables/useSchedule'` — just call `useSchedule()` in your component. This is convenience; if you'd rather be explicit, import as usual.

---

## 7. Pinia — when global state is justified

Pinia is Vue's official state management library. It's Vuex's successor and lives at a similar level of indirection to React's Zustand: a global store you can read and write from anywhere.

**When to reach for it:**

- State must be readable from many components that are not in the same parent-child path. (Our compare-list is shared across `VenueCard`, `TheNav`, and `pages/compare.vue`.)
- State must persist across route changes.
- State must persist across page reloads (localStorage / sessionStorage).

**When NOT to reach for it:**

- A piece of state is local to one component or one route. Use `ref` or `reactive` directly. Pinia adds indirection — don't pay that cost without a reason.
- A parent and one child need to coordinate. Use props down + events up.

In this project, Pinia is used for:

- `stores/compare.ts` — saved venues for the compare feature (persisted to localStorage).
- `stores/ui.ts` — mobile-nav-open state.

Two stores is genuinely overkill for a project this small. The reason both exist is portfolio signaling: showing that you know *how* to scope, persist, and unit-test a Pinia store is part of the demonstration.

A modern Pinia store looks like a composable:

```ts
import { defineStore } from 'pinia'

export const useCompareStore = defineStore('compare', () => {
  const slugs = ref<string[]>([])
  const count = computed(() => slugs.value.length)
  const add = (slug: string) => { /* ... */ }
  return { slugs, count, add }
}, {
  persist: true   // via @pinia-plugin-persistedstate/nuxt
})
```

The first argument is the store ID (must be unique app-wide). The second is the setup function — identical in shape to a composable. The third is options, where we enable persistence.

---

## 8. Forms and validation with VeeValidate + Zod

Forms are where most Vue beginners write the most painful code. The pattern this project uses:

1. **Define a Zod schema** as the single source of truth.
2. **Use VeeValidate** for binding + error display.
3. **Re-validate server-side** with the same schema, on the Nuxt server route.

```ts
// schemas/inquiry.ts
import { z } from 'zod'

export const inquirySchema = z.object({
  contact: z.object({
    email: z.string().email('Enter a valid email')
  }),
  consent: z.literal(true)
})
export type InquiryInput = z.infer<typeof inquirySchema>
```

Zod gives you both runtime validation and a TypeScript type via `z.infer`. One schema, two consumers.

The multi-step form in `/inquire` is simpler than VeeValidate's typical usage because we do step-wise validation ourselves: each step validates a slice of the schema, the final step validates the whole thing. This is intentional — it teaches you how Zod's `safeParse` returns rich error objects you can map back to UI.

**Tell:** seeing the same Zod schema imported on the client and server is a hallmark of a well-architected modern app. The schema is the contract.

---

## 9. Routing in Nuxt and the file-system convention

Nuxt routes are files. No router config. The path of the file determines the URL.

```
pages/
├─ index.vue              → /
├─ venues/
│  ├─ index.vue           → /venues
│  └─ [slug].vue          → /venues/:slug    (dynamic)
├─ compare.vue            → /compare
└─ inquire.vue            → /inquire
```

`[slug]` is the dynamic segment syntax. Inside `[slug].vue`:

```ts
const route = useRoute()
const slug = route.params.slug   // string
```

For 404 behavior, `throw createError({ statusCode: 404, fatal: true })` from your `<script setup>` will render Nuxt's error page.

Internal links: use `<NuxtLink to="/venues">` (not `<a href>`). NuxtLink performs client-side navigation, prefetches the route's chunk on hover, and integrates with the View Transitions API.

`<NuxtPage />` is what renders the matched route inside `app.vue` — equivalent to React Router's `<Outlet />` or Next's `{children}`.

`useHead({ title: '...' })` sets per-page meta. It's reactive: if you pass a function or computed, the title updates as data loads.

---

## 10. Tells of beginner vs professional Vue code

Reviewers skim. Within 30 seconds, these signals tell them whether you've shipped real Vue or copy-pasted from a tutorial.

### Beginner tells (avoid)

| Beginner | Professional |
|---|---|
| Options API (`data()`, `methods:`) | Composition API + `<script setup>` |
| `data()` returning everything | `ref`/`reactive` declared locally, `computed` for derivations |
| Logic inline in `<template>` | Logic in `<script>` or composables |
| Single component for whole page | Decomposed into base/feature components |
| `import Header from './Header.vue'`, file named `Header.vue` | Single-word components only for library primitives. `TheHeader.vue` for single-instance. Multi-word for everything else (`VenueCard`, `HomeHero`). |
| `:key="index"` in `v-for` | `:key="item.id"` — a stable identifier |
| `props: ['foo', 'bar']` | TypeScript-typed `defineProps<{ foo: string; bar: number }>()` with required-vs-optional explicit |
| Direct prop mutation inside child | Emit an event, parent updates |
| `watch` to recompute state | `computed` |
| `v-if` and `v-for` on the same element | Wrap with a `<template v-for>` or move `v-if` to parent |
| No `:key` on `<NuxtLink>` lists | Keys on every list item |
| Untyped event handlers (`$event.target.value`) | Cast: `($event.target as HTMLInputElement).value` |
| One giant `.vue` file | Files < 200 lines, single responsibility |

### Style guide quick rules (memorize)

- Multi-word component names always. `Header` is a bad name; `TheHeader` is good.
- Base/primitive components prefixed `Base*` (or use shadcn-vue convention if you prefer).
- Single-instance components prefixed `The*`.
- Tightly coupled components share a prefix: `VenueCard`, `VenueDetailHero`, `VenueAmenities`.
- Component file names: `PascalCase.vue`.
- Event names: `kebab-case`, verb-noun (`item-selected`, `form-submitted`), not `submit`.
- Order of `<script>` blocks: imports → props/emits → reactive state → computed → methods → lifecycle.
- Always type the emit signatures.

### TypeScript discipline

- No `any`. Use `unknown` at trust boundaries (server input, JSON.parse output) and narrow.
- Prefer interfaces for data shapes, types for unions and aliases.
- Avoid `as Type` casts unless validating. Prefer Zod for runtime narrowing.
- Component props are typed; emit signatures are typed; composable returns are typed.

---

## 11. What to read after this project

In order of marginal value once you've finished:

1. **The official Vue style guide** — `vuejs.org/style-guide`. Don't read it before; read it after you've written the project, then check your code against it. You'll find a dozen small things to clean up. That cleanup pass is the most concentrated learning of the whole exercise.

2. **The Nuxt docs on server routes and middleware** — `nuxt.com/docs/guide/directory-structure/server`. You only scratched server routes (one POST handler). Reading the full surface area unlocks patterns like authenticated routes, server middleware, route rules.

3. **VueUse** — `vueuse.org`. A library of composables for common needs (localStorage, intersection observer, media queries, etc.). Read the source of two or three; they're excellent reference implementations of the composable pattern.

4. **Pinia docs on plugins** — when you have time. Persistence plugins, undo/redo, state debugging. Vue equivalent of Redux DevTools.

5. **One large open-source Vue codebase** — pick one (Element Plus, Vitest's own UI, the Nuxt UI library) and read for an afternoon. Don't try to understand everything — just notice how component folders are organized, how composables are named, how stores split.

6. **The Anthony Fu Vue ecosystem** (Pinia, VueUse, Vitest, Vite, Slidev) — Anthony Fu's libraries are the best-quality examples of "what good Vue looks like" in 2026. The TypeScript discipline alone is worth studying.

---

## Appendix A — What this project *deliberately* avoided teaching

These are real Vue topics that I cut from this project. You'll want to learn them eventually:

- **Vue Router beyond Nuxt's file convention** — if you ever work in a plain Vue + Vite project (no Nuxt), you'll need to configure routes manually. Vue Router is what underlies Nuxt's routing.
- **SSR vs SSG vs CSR tradeoffs** — this project is SSG. If you build a personalized app, you'll need to understand the hydration mismatch class of bugs.
- **`provide` / `inject`** — Vue's dependency injection. Useful for deeply-nested component trees that need shared state without Pinia. We didn't need it; you should know it exists.
- **Render functions and JSX** — Vue can be written in JSX or imperatively with `h()`. Templates are the default; render functions are an escape hatch.
- **Suspense and async components** — Vue's built-in primitive for async loading states. Nuxt mostly handles this for you.
- **Teleport** — for portals (modals, tooltips). Worth knowing exists.
- **Animation transitions via `<Transition>` and `<TransitionGroup>`** — Vue's built-in animation hooks. We used Motion One and View Transitions instead, but `<Transition>` is the framework-native option for entering/leaving elements.

---

## Appendix B — Mental-model translations from React

If you're coming from React, these one-to-one mappings will accelerate you.

| React | Vue 3 |
|---|---|
| `useState(0)` | `ref(0)` |
| `useMemo(() => x * 2, [x])` | `computed(() => x.value * 2)` |
| `useEffect(() => fn(), [x])` | `watch(x, fn)` or `watchEffect(fn)` |
| `useCallback(fn, [deps])` | Not needed — Vue's reactivity tracks reads automatically |
| Custom hook `useFoo` | Composable `useFoo` (same name convention) |
| `<Component prop={x} />` | `<Component :prop="x" />` |
| `<button onClick={fn}>` | `<button @click="fn">` |
| `{children}` | `<slot />` |
| `useContext` | `provide`/`inject` or Pinia |
| React Context for global state | Pinia store |
| `key={item.id}` in lists | `:key="item.id"` in `v-for` (same idea) |
| `useRef` for DOM refs | `const el = ref<HTMLElement \| null>(null)` + `ref="el"` on element |
| React Router `useNavigate` | `useRouter()` from Vue Router / Nuxt |
| React Router `useParams` | `useRoute().params` |
| Next `getStaticProps` | Nuxt `useAsyncData` (or static imports for fixtures) |
| Zustand store | Pinia store (functionally near-identical) |

The biggest conceptual shift: in React, you write a function component that runs again on every render. In Vue, you write a setup that runs once; everything downstream is reactive and observed. Many of the React rituals around memoization, dependency arrays, and effect cleanup don't have Vue counterparts — they're handled by the reactivity graph.

---

## Appendix C — A short checklist when you finish each component

Before you commit a new component:

- [ ] Multi-word file name (`VenueCard.vue`, not `Card.vue`).
- [ ] `<script setup lang="ts">` at the top.
- [ ] Props typed with `defineProps<{ ... }>()`. Required vs optional explicit.
- [ ] Emits typed with `defineEmits<{ (e: '...', payload: T): void }>()`.
- [ ] No `any` types.
- [ ] No `console.log` left in.
- [ ] All interactive elements keyboard-accessible (focus-visible style, ARIA labels where needed).
- [ ] All images have `alt`.
- [ ] All form fields have `<label>` associated by `for`/`id`.
- [ ] `v-for` has a stable `:key`.
- [ ] No logic in template beyond simple expressions — move complexity to `<script>`.
- [ ] If reusable, extracted to `components/base/`.

If you can answer yes to every box, the component is portfolio-ready.

---

## Closing note

The biggest mistake you can make on this project is to treat the plan as a sequence to execute without thinking. Every step is also a teaching moment — when you write `const venues = ref<Venue[]>(venuesData as Venue[])`, stop and ask yourself why we wrap it in a `ref` even though it's never reassigned. (Answer: so its consumers — components, computed values — register as reactive dependents. The reactivity graph doesn't care that it never changes; it only cares about the *capability*.)

Read the plan slowly. Type each block by hand the first time you see a new pattern, not by copy-paste. By the time you reach the deploy step, you should be able to explain every line of the project without looking at this document.

Good luck. Ship it.
