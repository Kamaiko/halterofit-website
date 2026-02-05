# Claude Instructions - Halterofit Portfolio Website

> **Last Updated**: 2026-02-05
> **Purpose**: AI agent project briefing for the portfolio website

---

## What This Is

Personal portfolio website for Patrick Patenaude, hosted on **halterofit.ca** via Cloudflare Pages. Single-page React app with bilingual FR/EN support.

---

## Tech Stack

| Techno | Version | Role |
|---|---|---|
| **TypeScript** | 5.9 | Language (strict mode) |
| **React** | 19.2 | UI framework |
| **Vite** | 7.x | Build tool + dev server |
| **Tailwind CSS** | 4.x | Styling (utility classes, CSS-first config) |
| **Framer Motion** | 12.x | Scroll animations, transitions |
| **react-i18next** | 16.x | Bilingual FR/EN |
| **Lucide React** | 0.563 | Icons |
| **clsx** | 2.x | className concatenation (via `cn()` utility) |
| **Lenis** | latest | Smooth scrolling |

---

## Quick Commands

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # TypeScript check + production build (outputs to dist/)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

---

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root component, assembles all sections
├── index.css                   # Tailwind import + CityScene CSS animations
├── utils/
│   └── cn.ts                   # Re-exports clsx as cn() — use for all className logic
├── constants/
│   ├── layout.ts               # Named constants (NAV_HEIGHT, thresholds, timings)
│   ├── styles.ts               # Shared card styles (CARD_BASE, CARD_SHADOW)
│   └── visual-effects.ts       # Radial gradients (GRADIENT.*) + NOISE_SVG data URI
├── data/
│   ├── about.ts                # stackItems, interests, journeySteps
│   ├── city-scene.ts           # CityScene palette, dimensions, buildings, stars
│   ├── contact.ts              # socialLinks[], CONTACT_EMAIL, CV_PATH
│   ├── projects.ts             # Project interface + project list
│   └── skills.ts               # row1Skills, row2Skills
├── hooks/
│   └── useIsMobile.ts          # Media query hook
├── i18n/
│   ├── index.ts                # i18next config (default: FR)
│   ├── fr.json                 # French translations
│   └── en.json                 # English translations
└── components/
    ├── Navbar.tsx               # Fixed nav + FR/EN toggle + mobile menu + scroll spy
    ├── Hero.tsx                 # Name, title, scroll indicator (word-by-word reveal)
    ├── Section.tsx              # Reusable section wrapper (title + scroll reveal)
    ├── About.tsx                # Bio, journey, stack, interests (card grid)
    ├── Projects.tsx             # Project card grid layout
    ├── ProjectCard.tsx          # Individual project card (screenshots, tech, links)
    ├── ScreenshotFan.tsx        # 3-image fan hover effect for project cards
    ├── ScrollReveal.tsx         # IntersectionObserver fade-in wrapper
    ├── Skills.tsx               # Dual marquee rows of skill badges
    ├── CityScene.tsx            # Animated SVG city skyline (pure CSS animations)
    ├── Contact.tsx              # Email, CV download, social links
    └── Footer.tsx               # Copyright
```

---

## Architecture Conventions

### Data separation
- **Components** contain only rendering logic — no inline data arrays
- **`src/data/`** holds all static data (arrays, configs, coordinates)
- **`src/constants/`** holds shared tokens (layout values, style classes, gradient strings)

### className handling
- Always use `cn()` from `src/utils/cn.ts` for conditional or concatenated classNames
- Never use template literals for className concatenation

### Shared styles
- Card styles use `CARD_BASE`, `CARD_SHADOW`, `CARD_SHADOW_LIGHT` from `src/constants/styles.ts`
- Gradient values use `GRADIENT.*` from `src/constants/visual-effects.ts`
- Magic numbers use named constants from `src/constants/layout.ts`

### CityScene
- All building coordinates, palette, dimensions live in `src/data/city-scene.ts`
- CSS animations (scroll, twinkle, pulse) live in `src/index.css`
- The `-800px` keyframe value in CSS must stay in sync with `W` from `city-scene.ts`

---

## Deployment

- **Hosting**: Cloudflare Pages
- **Domain**: halterofit.ca
- **Auto-deploy**: `git push` to `main` triggers build
- **Build settings**: command = `npm run build`, output = `dist`
- **Preview URLs**: Non-main branches deploy to `<branch>.halterofit-website.pages.dev`
- **Git workflow**: Work on `dev`, merge into `main` to deploy

---

## Design System

- **Theme**: Dark mode (slate-950 background, slate-100 text)
- **Accent**: cyan-400 / cyan-500
- **Font**: Inter (Google Fonts, loaded in index.html)
- **Animations**: Framer Motion for scroll reveals + hover; pure CSS for CityScene
- **Layout**: Max-width 5xl (1024px), centered

---

## Internationalization

- Default language: French (FR)
- Toggle in Navbar switches FR/EN
- All user-facing text lives in `src/i18n/fr.json` and `src/i18n/en.json`
- Keys follow `section.key` pattern (e.g. `hero.title`, `projects.halterofit.description`)
- When adding new text: add to BOTH json files

---

## Adding a New Project

1. Add translation keys in `fr.json` and `en.json` under `projects.<slug>`
2. Add entry in `src/data/projects.ts`
3. Optionally add 3 screenshots in `public/images/` for the fan effect

---

## Known TODOs

- [ ] Add real CV PDF to `public/cv-patrick-patenaude.pdf`
- [ ] Add project screenshots in `public/images/`
- [ ] Add custom favicon
- [ ] Configure Cloudflare Email Routing for contact@halterofit.ca
- [ ] Submit site to Google Search Console for indexing

---

## Development Standards

- TypeScript strict mode, no `any` types
- Tailwind utility classes for all styling (no CSS files beyond `index.css`)
- All user-facing text must be internationalized (no hardcoded strings in components)
- Use `cn()` for all className logic — no template literals
- Data arrays belong in `src/data/`, not inline in components
- Keep dependencies minimal
