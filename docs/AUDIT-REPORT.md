# Audit Report — Halterofit Portfolio

> **Date** : 2026-02-08
> **Scope** : Portfolio single-page React (excl. playground pour a11y)

---

## Progression du cleanup

| Groupe | Statut | Commit |
|--------|--------|--------|
| **Groupe 2 — Performance** | DONE | `46ebd61` |
| **Groupe 3 — Tests** | **A FAIRE** | — |
| **Groupe 1 — Accessibilite** | A faire | — |
| **Groupe 4 — Polish** | A faire | — |

### Corrections d'audit
- **M5 (Highlight inline)** : FAUX POSITIF — `Highlight` est deja au module scope (ligne 34), `About()` commence ligne 79. Rien a faire.
- **H4 (photo.png)** : `public/sim/` est une page standalone non referencee par l'app React. Impact bundle = nul, mais pese sur le deploiement.

---

## Resume executif

Le codebase est **exceptionnellement propre** : 0 `any`, 0 `console.log`, 0 `@ts-ignore`, conventions CLAUDE.md respectees a ~98%, reduced-motion couvert a 100%. Les 3 axes d'amelioration principaux :

1. ~~**Performance**~~ — DONE (commit `46ebd61`)
2. **Tests** — couverture < 5% (3 smoke tests sur ~2000 lignes de code)
3. **Accessibilite** — `focus-visible` absent sur tous les elements interactifs, pas de skip link

**Total** : 12 HIGH | 10 MEDIUM | 8 LOW

---

## Groupe 2 — Performance : DONE

Les findings suivants ont ete corriges dans le commit `46ebd61` :

| Finding | Correction |
|---------|------------|
| **H4** photo.png 646KB | Converti en WebP (38KB, -94%) |
| **H5** Vite config minimale | Ajout `manualChunks` (react-vendor, i18n, framer-motion) |
| **H6** Three.js `import *` | Imports selectifs dans HeroParticles.tsx |
| **H7** Framer demos statiques | Lazy-loaded via `React.lazy()` dans Playground.tsx |
| **M4** Marquee tourne hors viewport | `useInView` + `animationPlayState` dans Skills.tsx |
| **M5** Highlight inline | FAUX POSITIF — deja au module scope |
| **M6** PARTIE_IVH.png | Converti en WebP (10KB, -29%) |

**Resultats build** :
- Main bundle : 443KB → 249KB app + 129KB FM + 65KB i18n + 4KB react (meilleur cache)
- Playground : 14.6KB → 4.5KB (Framer demos en chunks separes)
- Images : -608KB total (PNG → WebP)

---

## Groupe 3 — Tests : A FAIRE (prochain)

### H8. Couverture tests < 5%
**Fichier** : `src/__tests__/app.test.tsx`
3 smoke tests seulement. ~25 tests prioritaires recommandes (voir plan ci-dessous).

### H9. Navbar non testee
**Fichier** : `Navbar.tsx:22-56`
Logique critique : scroll spy, cooldown 1200ms, detection bottom, toggle langue.
**Tests proposes** :
- Scroll spy : mocker `getBoundingClientRect`, simuler scroll, verifier `activeSection`
- Language toggle : cliquer Globe, verifier `i18n.changeLanguage` appele
- Mobile menu : toggle open/close, verifier className et aria-label
- Cooldown : cliquer nav link, verifier scroll spy desactive pendant 1200ms
- Bottom detection : scroll at bottom, verifier activeSection = "contact"

### H10. ErrorBoundary non teste
**Fichier** : `ErrorBoundary.tsx:16-18`
**Tests proposes** :
- Catch error : render un composant qui throw, verifier fallback affiche
- No error : render normal, verifier children affiches
- Multiple errors : throw 2 fois, verifier fallback stable

### H11. Pas de coverage reporter
**Fichier** : `vitest.config.ts`
**Fix** : Ajouter `coverage.provider: "v8"`, reporters `["text", "html"]`, exclusions (playground, types, constants).

### H12. useIsMobile non teste
**Fichier** : `useIsMobile.ts:13-17`
**Tests proposes** :
- SSR safety : `typeof window === "undefined"` retourne false
- Reactive update : changer matchMedia 1024px → 600px, verifier isMobile = true
- Cleanup : unmount hook, verifier removeEventListener appele
- Breakpoint edge case : tester exactement 767px

### M8. ScrollReveal non teste
**Fichier** : `ScrollReveal.tsx:32-39`
**Tests proposes** :
- Reduced motion : mocker `useReducedMotion() = true`, verifier opacity=1 immediatement
- IntersectionObserver trigger : mocker `isInView = true`, verifier opacity:1
- Transition cleanup : attendre timer, verifier style.transition = undefined

### M9. SpotlightCard non teste
**Fichier** : `SpotlightCard.tsx:30-40`
**Tests proposes** :
- Mobile mode : mocker isMobile=true, verifier spotlight layers absents
- Mouse move : simuler mousemove, verifier motionValue.set appele

### M10. CursorTrail non teste
**Fichier** : `CursorTrail.tsx:54-63`
**Tests proposes** :
- Mobile / no fine pointer : mocker isMobile=true, verifier null
- Reduced motion : mocker REDUCED_MOTION=true, verifier null

---

## Groupe 1 — Accessibilite : A faire

### H1. Aucun `focus-visible` sur les elements interactifs
| Element | Fichier | Lignes |
|---------|---------|--------|
| Nav buttons desktop | `Navbar.tsx` | 93-103 |
| Toggle langue | `Navbar.tsx` | 104-110 |
| Logo "PP" (scroll top) | `Navbar.tsx` | 82-88 |
| Burger mobile | `Navbar.tsx` | 114-120 |
| Liens "View code" / "View demo" | `ProjectCard.tsx` | 78-97 |
| Email, CV, liens sociaux | `Contact.tsx` | 18-46 |
**Fix** : Ajouter `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400`.

### H2. Pas de skip link
**Fichier** : `App.tsx` (avant `<Navbar />`)
**Fix** : Lien `sr-only focus:not-sr-only` pointant vers `#main`.

### H3. Alt text generique sur screenshots
| Fichier | Ligne | Alt actuel |
|---------|-------|------------|
| `ScreenshotFan.tsx` | 219 | `{projectName} – {index + 1}` |
| `ProjectCard.tsx` | 38 | `{projectName}` |
**Fix** : Ajouter champ `screenshotAlt: string[]` au type `Project`.

### M1. `aria-expanded` manquant sur burger mobile
**Fichier** : `Navbar.tsx:114-120`
**Fix** : `aria-expanded={menuOpen}` + `aria-controls="mobile-menu"`.

### M2. ScreenshotFan inaccessible au clavier
**Fichier** : `ScreenshotFan.tsx:145`
**Fix** : `tabIndex={0}` + `onFocus` handler.

### M3. NotFound "404" flat — contraste ~1.2:1
**Fichier** : `NotFound.tsx:14`
**Fix** : `aria-hidden="true"`.

---

## Groupe 4 — Polish : A faire

### M7. Lucide imports shallow dans playground
**Fichiers** : `ExpandCollapseDemo.tsx:3`, `MicroAnimationsDemo.tsx:2`
**Fix** : Convertir en deep imports ESM.

### LOW findings

| # | Cat. | Finding | Fichier |
|---|------|---------|---------|
| L1 | a11y | Hero pourrait etre `<header>` | `Hero.tsx:81` |
| L2 | a11y | ScrollReveal: `aria-hidden` dynamique pendant transition | `ScrollReveal.tsx:42-56` |
| L3 | a11y | Scroll indicator anime meme en reduced-motion | `Hero.tsx:169-206` |
| L4 | a11y | `text-slate-500` passe AA mais pas AAA | `About.tsx:148`, `Contact.tsx:43` |
| L5 | code | Inline data `navLinks` et `phoneConfig` | `Navbar.tsx:10`, `ScreenshotFan.tsx:31` |
| L6 | code | Pas de validation i18n keys a la compilation | `fr.json`, `en.json` |
| L7 | tests | `cn()` utility non testee | `utils/cn.ts` |
| L8 | tests | Data files sans validation de structure | `src/data/*.ts` |

---

## Points forts — Aucune action requise

- **Reduced-motion** : couverture 100% (CSS `@media` + JS `REDUCED_MOTION` + FM `useReducedMotion()`)
- **TypeScript strict** : 0 `any`, 0 `@ts-ignore`, 0 `@ts-expect-error`, 0 `as unknown as`
- **Error handling** : ErrorBoundary + Suspense + fallbacks sur tous les lazy loads R3F
- **i18n** : 100% coherence FR/EN, aucun texte hardcode
- **HeroParticles** : zero GC dans useFrame, pre-allocated objects, dispose propre
- **Semantique HTML** : `<nav>`, `<main>`, `<footer>`, `<section>`, headings h1->h2->h3 sans saut
- **Dead code** : aucun fichier orphelin, aucun export inutilise
- **Dependencies** : aucune inutilisee dans package.json
- **Console.log** : zero en production
- **Convention cn()** : 100% des className conditionnels utilisent `cn()`
- **Deep Lucide imports** : 100% en production (2 exceptions playground)
