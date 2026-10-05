# Harbour.Space — Data Science Apprenticeship Landing Page

A responsive, production-quality landing page built as part of the Harbour.Space 
Frontend Challenge. The page dynamically renders scholarship data from the 
Harbour.Space API and focuses on clean architecture, reusable components, 
accessible interactions, and pixel-accurate visual design.

**🔗 Live Demo:** https://harbour-frontend-challenge.vercel.app

**👤 Author:** Baligh Lassoued — (https://github.com/Baligh-dev)

---

## 📋 Challenge Context

**Option 1 — Architecture, State Management & Unit Testing**

The challenge asked for an adapted version of the Harbour.Space scholarship 
page template, including micro-interactions, a carousel, and buttons. Option 1 
focuses on API integration, state management, and a full unit test suite that 
proves the code works as expected.

---

## 🛠️ Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | React 18 + TypeScript | Industry standard, strong typing, strict mode catches bugs early |
| **Build tool** | Vite | Fast HMR, minimal config, native ESM |
| **State management** | Zustand | Lightweight (~1KB), no boilerplate, easy to test in isolation |
| **Data fetching** | Native `fetch` + Vite proxy | Avoids adding Axios for a single endpoint; proxy solves CORS in dev |
| **Styling** | SCSS Modules | Scoped classnames, variables/mixins support, zero runtime cost |
| **Testing** | Vitest + React Testing Library | Vite-native test runner, fast, mirrors Jest's API |
| **Linting** | ESLint (`typescript-eslint` + `react-hooks`) | Runs clean with `npm run lint` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
npm install
npm run dev      # http://localhost:5173
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once (CI-friendly) |
| `npm run lint` | Run ESLint across the project |

---

## 🏗️ Architecture

The project uses a **feature-based structure** so that new features can be 
added without touching unrelated code.

```
src/
├── app/
│   ├── store.ts                        # Zustand store (state + actions)
│   └── store.test.ts                   # Store unit tests
├── features/
│   └── scholarship/
│       ├── api/
│       │   └── scholarshipService.ts   # API layer + typed response
│       └── components/
│           ├── ScholarshipPage.tsx     # Top-level orchestrator
│           ├── ScholarshipPage.test.tsx
│           ├── HeaderSection.tsx       # Sticky nav
│           ├── InteractionSection.tsx  # Hero + countdown + details
│           ├── AboutSection.tsx        # Description + commitment cards
│           ├── Testimonials.tsx        # Infinite carousel
│           ├── FAQSection.tsx          # Accordion + category filter
│           ├── StickyBar.tsx           # Fixed footer with live countdown
│           └── *.module.scss           # Co-located styles per component
├── styles/
│   ├── _variables.scss                 # Colors, fonts, breakpoints, patterns
│   └── main.scss                       # Global imports
├── assets/
│   └── images/                         # SVG patterns, logos, portraits
├── test/
│   └── setup.ts                        # RTL + jsdom setup
├── index.css                           # Global reset + font import
└── main.tsx                            # React entry point
```

### Key architectural decisions

**1. Layered data flow** — Components never call the API directly. The flow is:
`Component → Zustand store → Service layer → fetch()`. This makes each layer 
independently testable.

**2. Service layer for API calls** — `scholarshipService.ts` owns the URL and 
the response type. If the endpoint changes, only one file needs updating.

**3. Store-level deduplication** — `fetchData` checks for existing data or an 
in-flight request before calling the API, preventing redundant requests 
(including React 18 StrictMode double-mounts in dev).

**4. CSS Modules per component** — Every component has its own `.module.scss`. 
No global class collisions. Shared tokens live in `_variables.scss`.

---

## 🧪 Testing

**10 unit tests** covering the highest-risk logic:

```
✓ src/app/store.test.ts                                     (6 tests)
✓ src/features/scholarship/components/ScholarshipPage.test.tsx (4 tests)
```

### What's covered

**Store (`store.test.ts`)**
- Initial state (null data, not loading, no error)
- Loading state toggles correctly during fetch
- Successful fetch populates `data` and clears `isLoading`
- Failed fetch sets `error` and clears `isLoading`
- **Deduplication guard** — does not refetch when data already exists
- **Deduplication guard** — does not trigger concurrent fetches while one is in flight

**ScholarshipPage (`ScholarshipPage.test.tsx`)**
- Renders loading state
- Renders error state
- Renders "no data" empty state
- Renders all child sections when data is present

### Run tests

```bash
npm run test:run
```

---

## 📝 Design Decisions

### Typography
The Figma design uses **Apercu Pro**, a licensed commercial font. To keep the 
project freely distributable, I substituted **[Inter](https://fonts.google.com/specimen/Inter)** 
(Google Fonts, SIL Open Font License) — a near-identical open-source alternative 
with similar proportions and character shapes. The `$font-main` variable leads 
with Inter and falls back to system fonts.

### API Proxy
During development, Vite's `server.proxy` forwards `/api/*` to `https://harbour.space` 
to bypass browser CORS restrictions. In production, Vercel's `vercel.json` 
rewrites provide the same behavior so the deployed site works identically.

### Carousel approach
Rather than pulling in Swiper or Embla (~30-50KB each), the carousel is built 
with CSS Scroll Snap + a small React state layer. This keeps the bundle lean 
and demonstrates a solid understanding of native browser APIs. Trade-off: 
requires a bit more manual logic for the infinite loop and drag handling.

### SCSS over Tailwind
SCSS Modules were chosen to keep styles colocated with components and to 
support design tokens via variables. Tailwind would have been faster for 
small components but harder to organize for a page with this many distinct 
sections and patterns.

---

## 🔮 Future Improvements

Given more time, the next priorities would be:

1. **Mobile-first SCSS refactor** — currently desktop-first (`max-width` queries). 
   A `_mixins.scss` with `min-width` breakpoints was drafted; migrating would 
   improve cascade clarity.
2. **Additional test coverage** — carousel loop logic, FAQ filter behavior, 
   countdown timer edge cases.
3. **E2E tests** — Playwright for critical user flows (apply, filter, navigate).
4. **Accessibility audit** — keyboard navigation for carousel and FAQ, 
   ARIA live regions for countdown updates.
5. **Lottie animation** — the API returns a `json_logo` field with an embedded 
   Lottie animation; could be rendered with `lottie-react` for the program icon.
6. **Storybook** — for isolated component development and visual documentation.

---

## 📄 License

This project was created as a technical challenge submission and is not 
intended for commercial use.

---

## 🙏 Ressources

- Design: Harbour.Space Figma challenge file
- API: Harbour.Space Scholarship API
- Icons & patterns: from the provided Figma file