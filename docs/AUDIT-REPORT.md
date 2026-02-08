# Audit Report — Halterofit Portfolio

> **Date** : 2026-02-08
> **Scope** : Portfolio single-page React (excl. playground pour a11y)
> **Mode** : Lecture seule — aucun code modifie

---

## Resume executif

Le codebase est **exceptionnellement propre** : 0 `any`, 0 `console.log`, 0 `@ts-ignore`, conventions CLAUDE.md respectees a ~98%, reduced-motion couvert a 100%. Les 3 axes d'amelioration principaux :

1. **Accessibilite** — `focus-visible` absent sur tous les elements interactifs, pas de skip link
2. **Performance** — image `photo.png` non optimisee (632 KB), config Vite minimale, Three.js `import *`
3. **Tests** — couverture < 5% (3 smoke tests sur ~2000 lignes de code)

**Total** : 12 HIGH | 10 MEDIUM | 8 LOW

---

## Findings HIGH — Bloquants / risques production

### H1. Aucun `focus-visible` sur les elements interactifs [a11y]

**Impact** : Un utilisateur clavier ne peut pas voir quel element est actif.

| Element | Fichier | Lignes |
|---------|---------|--------|
| Nav buttons desktop | `Navbar.tsx` | 93-103 |
| Toggle langue | `Navbar.tsx` | 104-110 |
| Logo "PP" (scroll top) | `Navbar.tsx` | 82-88 |
| Burger mobile | `Navbar.tsx` | 114-120 |
| Liens "View code" / "View demo" | `ProjectCard.tsx` | 78-97 |
| Email, CV, liens sociaux | `Contact.tsx` | 18-46 |

**Fix** : Ajouter `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400` sur tous les boutons/liens.

---

### H2. Pas de skip link [a11y]

**Impact** : L'utilisateur doit Tab 5-6 fois a travers la navbar avant d'atteindre le contenu.

**Fichier** : `App.tsx` (avant `<Navbar />`)

**Fix** : Ajouter un lien `sr-only focus:not-sr-only` pointant vers `#main`.

---

### H3. Alt text generique sur screenshots [a11y]

**Impact** : Screen readers annoncent "Halterofit - 1", "Halterofit - 2" — zero information utile.

| Fichier | Ligne | Alt actuel |
|---------|-------|------------|
| `ScreenshotFan.tsx` | 219 | `{projectName} – {index + 1}` |
| `ProjectCard.tsx` | 38 | `{projectName}` |

**Fix** : Ajouter un champ `screenshotAlt: string[]` au type `Project` dans `data/projects.ts`.

---

### H4. `photo.png` = 632 KB (PNG non optimise) [perf]

**Fichier** : `public/sim/photo.png`

**Fix** : Convertir en WebP (gain estime ~550 KB, soit ~87%).

---

### H5. Vite config minimale [perf]

**Fichier** : `vite.config.ts`

Config actuelle = 3 lignes (plugins seulement). Manquant :
- `build.sourcemap: false` (inutile en prod)
- `build.rollupOptions.output.manualChunks` (meilleure cache invalidation)
- Compression gzip/brotli

---

### H6. Three.js `import *` empeche tree-shaking [perf]

**Fichier** : `HeroParticles.tsx:4`

```tsx
import * as THREE from "three";  // Importe TOUT Three.js (~874 KB)
```

**Fix** : Imports selectifs (`import { Euler, Matrix4, Vector3, Color, ... } from "three"`). Gain estime ~15-20%.

---

### H7. Framer demos importees statiquement dans Playground [perf]

**Fichier** : `Playground.tsx:10-13`

Les 4 demos Framer sont en `import` statique (vs lazy pour les demos Three.js). Poids estime ~9.5 KB minifie.

**Fix** : `React.lazy(() => import(...))` comme les demos Three.js.

---

### H8. Couverture tests < 5% [tests]

**Fichier** : `src/__tests__/app.test.tsx`

3 smoke tests seulement :
- i18n defaults to French
- `useIsMobile` returns boolean
- App renders without crashing

~76 tests recommandes (voir section plan d'action).

---

### H9. Navbar non testee [tests]

**Fichier** : `Navbar.tsx:22-56`

Logique critique non testee : scroll spy, cooldown 1200ms, detection bottom, toggle langue.

---

### H10. ErrorBoundary non teste [tests]

**Fichier** : `ErrorBoundary.tsx:16-18`

`getDerivedStateFromError` et le rendu du fallback jamais verifies.

---

### H11. Pas de coverage reporter [tests]

**Fichier** : `vitest.config.ts`

Aucun `coverage.provider`, aucun seuil, aucun reporter.

---

### H12. useIsMobile non teste [tests]

**Fichier** : `useIsMobile.ts:13-17`

Hook reactif utilise dans CursorTrail, SpotlightCard, ScreenshotFan — reactive updates non verifiees.

---

## Findings MEDIUM — Ameliorations recommandees

### M1. `aria-expanded` manquant sur burger mobile [a11y]
**Fichier** : `Navbar.tsx:114-120`
**Fix** : Ajouter `aria-expanded={menuOpen}` + `aria-controls="mobile-menu"`.

### M2. ScreenshotFan inaccessible au clavier [a11y]
**Fichier** : `ScreenshotFan.tsx:145`
L'effet "fan spread" ne se declenche qu'au hover. Un utilisateur clavier ne le voit jamais.
**Fix** : Ajouter `tabIndex={0}` + `onFocus` handler.

### M3. NotFound "404" flat — contraste ~1.2:1 [a11y]
**Fichier** : `NotFound.tsx:14`
`text-cyan-400/20` sur dark bg — echec WCAG. Element decoratif mais pas marque comme tel.
**Fix** : Ajouter `aria-hidden="true"`.

### M4. Skills marquee tourne hors viewport [perf]
**Fichiers** : `Skills.tsx` + `index.css`
Animation CSS infinie meme quand la section n'est pas visible.
**Fix** : IntersectionObserver + `animation-play-state: paused`.

### M5. `Highlight` component inline dans About [perf]
**Fichier** : `About.tsx:35-41`
Re-cree a chaque render du parent. Impact faible mais violation de best practice.
**Fix** : Extraire au module scope.

### M6. `PARTIE_IVH.png` — seule image projet en PNG [perf]
**Fichier** : `public/images/projects/PARTIE_IVH.png` (14 KB)
Les 3 autres sont deja en WebP.
**Fix** : Convertir en WebP pour coherence.

### M7. Lucide imports shallow dans playground [code]
**Fichiers** : `ExpandCollapseDemo.tsx:3`, `MicroAnimationsDemo.tsx:2`
```tsx
import { Dumbbell } from "lucide-react";  // vs deep import
```
**Fix** : Convertir en deep imports ESM.

### M8. ScrollReveal non teste [tests]
**Fichier** : `ScrollReveal.tsx:32-39`
Timer cleanup, reduced motion skip — risque de memory leak non verifie.

### M9. SpotlightCard non teste [tests]
**Fichier** : `SpotlightCard.tsx:30-40`
Calcul gradient, mode mobile skip.

### M10. CursorTrail non teste [tests]
**Fichier** : `CursorTrail.tsx:54-63`
Hover detection, throttle `elementFromPoint`.

---

## Findings LOW — Nice-to-have

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

---

## Plan d'action — Corrections ordonnees

### Groupe 1 — Accessibilite (HIGH)
1. Ajouter `focus-visible` sur tous les elements interactifs (H1)
2. Implementer skip link dans `App.tsx` (H2)
3. Enrichir alt text screenshots — champ `screenshotAlt` (H3)
4. Ajouter `aria-expanded` sur burger mobile (M1)
5. Ajouter `aria-hidden="true"` sur "404" flat (M3)

### Groupe 2 — Performance (HIGH + MEDIUM)
6. Convertir `photo.png` -> WebP (H4)
7. Optimiser `vite.config.ts` — sourcemap, manual chunks (H5)
8. Three.js imports selectifs dans `HeroParticles.tsx` (H6)
9. Lazy-load Framer demos dans `Playground.tsx` (H7)
10. Convertir `PARTIE_IVH.png` -> WebP (M6)
11. Pause marquee Skills hors viewport (M4)
12. Extraire `Highlight` au module scope (M5)

### Groupe 3 — Tests (HIGH)
13. Configurer coverage reporter dans `vitest.config.ts` (H11)
14. Tests Navbar — scroll spy, toggle langue, mobile menu (H9)
15. Tests useIsMobile — SSR, reactive, cleanup (H12)
16. Tests ErrorBoundary — catch, fallback (H10)
17. Tests ScrollReveal — reduced motion, inView, cleanup (M8)
18. Tests SpotlightCard — mobile, gradient (M9)
19. Tests CursorTrail — mobile, reduced motion, hover (M10)

### Groupe 4 — Polish (LOW)
20. Lucide imports playground (M7)
21. Tests utilitaires — cn(), data validation (L7, L8)
22. Corrections a11y mineures (L1-L4)
