# Prompt d'audit — Halterofit Portfolio

> Copier-coller ce prompt dans une nouvelle conversation Claude Code pour lancer l'audit.
> Derniere mise a jour : 2026-02-08

---

Lance un audit complet de mon portfolio Halterofit en déployant 4 agents Explore en PARALLÈLE (un seul message, 4 tool calls). Chaque agent doit produire un rapport structuré avec des findings concrets (fichier:ligne) et une priorité (HIGH / MEDIUM / LOW).

Contexte : Portfolio single-page React (TypeScript strict, Tailwind 4, Framer Motion 12, Three.js/R3F, react-i18next). Les conventions sont documentées dans `.claude/CLAUDE.md`. Le playground (`?playground=true`) contient 11 demos (4 Framer, 6 Three.js, 1 Canvas 2D) et pourrait être lourd.

## Agent 1 — Accessibilité (a11y)

Auditer l'accessibilité de TOUT le site (pas le playground).

Vérifier :
- **Navigation clavier** : est-ce que tous les éléments interactifs (liens, boutons, cards) sont atteignables au Tab et activables au Enter/Space ?
- **Focus visible** : y a-t-il des `focus-visible:ring-*` ou équivalents sur tous les éléments cliquables ? Vérifier spécifiquement `SpotlightCard.tsx`, `ProjectCard.tsx`, `ScreenshotFan.tsx`, `Navbar.tsx`
- **Attributs ARIA** : `aria-label` sur les boutons icon-only, `aria-hidden` sur le décoratif, `role` appropriés. Vérifier le toggle langue, le burger mobile, les liens sociaux dans `Contact.tsx`
- **Alt text** : qualité des alt sur les images. Est-ce descriptif ou générique ? Vérifier `ProjectCard.tsx`, `ScreenshotFan.tsx`
- **Sémantique HTML** : utilisation correcte de `<nav>`, `<main>`, `<section>`, `<footer>`, headings hiérarchiques (h1→h2→h3, pas de saut)
- **Reduced motion** : CHAQUE animation respecte-t-elle `prefers-reduced-motion` ? Vérifier TOUTES les animations dans `index.css` (keyframes), les composants Framer Motion, les effets Three.js. Cross-référencer avec le tableau dans CLAUDE.md
- **Contraste couleurs** : les textes `text-slate-400` et `text-slate-500` sur `bg-slate-950` passent-ils le ratio WCAG AA (4.5:1) ? Vérifier les textes les plus faibles visuellement
- **Skip link** : y a-t-il un lien "skip to content" pour sauter la nav ?

Fichiers à examiner en priorité : `Navbar.tsx`, `Hero.tsx`, `About.tsx`, `Projects.tsx`, `Skills.tsx`, `Contact.tsx`, `ProjectCard.tsx`, `SpotlightCard.tsx`, `ScreenshotFan.tsx`, `ScrollReveal.tsx`, `Section.tsx`, `index.css`

## Agent 2 — Performance & Bundle

Auditer la performance du site ET du playground.

Vérifier :
- **Bundle size** : lire la sortie de `npm run build` et analyser les chunks. Le Three.js chunk fait ~874KB — est-ce qu'on peut réduire avec du tree-shaking ou des imports sélectifs ?
- **Lazy loading** : est-ce que tout ce qui est lourd est lazy-loaded ? Vérifier : Three.js (HeroParticles), Playground, NotFound3D. Y a-t-il d'autres candidats ?
- **Vite config** : lire `vite.config.ts` — est-ce qu'il manque des optimizations (manual chunks, compression, source maps en prod) ?
- **Playground poids** : 11 demos dont 6 Three.js — les Framer demos (1-4) sont importées en STATIC (pas lazy). Est-ce un problème ? Calcule le poids approximatif
- **Re-renders inutiles** : y a-t-il des composants qui re-render sans raison ? Chercher des `useState` dans des composants qui pourraient utiliser `useRef`, des callbacks non-memoizés passés en props, des objets/arrays créés inline dans le JSX
- **Images & assets** : vérifier les tailles dans `public/`. Y a-t-il des images non-optimisées (PNG au lieu de WebP, images > 200KB) ?
- **CSS** : y a-t-il des animations CSS qui tournent en permanence même hors viewport ? Vérifier les keyframes `marquee`, `city-scroll`, `star-twinkle` dans `index.css`
- **Three.js perf** : dans `HeroParticles.tsx`, vérifier l'allocation mémoire dans `useFrame` (zéro allocation par frame ?). Vérifier le dispose des textures/géométries au unmount
- **Lenis** : est-ce que le smooth scroll ajoute un overhead mesurable ?

Fichiers à examiner en priorité : `vite.config.ts`, `package.json`, `HeroParticles.tsx`, `Playground.tsx`, `Hero.tsx`, `CityScene.tsx`, `Skills.tsx`, `index.css`, dossier `public/`

## Agent 3 — Patterns de code & robustesse

Auditer la cohérence et la robustesse du code.

Vérifier :
- **Conventions CLAUDE.md** : est-ce que TOUT le code respecte les conventions documentées ? Vérifier : `cn()` partout (aucun template literal pour className), deep Lucide imports, SCREAMING_SNAKE pour constants, données dans `data/`, pas de strings hardcodées
- **Dead code** : imports inutilisés, fichiers orphelins, exports jamais consommés, composants jamais rendus. Chercher dans `src/` avec grep
- **Error handling** : est-ce que `ErrorBoundary` est utilisé partout où du code peut crasher (WebGL, lazy imports) ? Y a-t-il des `try/catch` manquants ?
- **TypeScript** : chercher tout `any`, `@ts-ignore`, `@ts-expect-error`, `as unknown as`, ou types trop permissifs. Vérifier les types des props de composants
- **Consistance des patterns** : est-ce que tous les composants de section suivent le même pattern (Section wrapper, ScrollReveal, etc.) ? Y a-t-il des incohérences ?
- **Edge cases** : que se passe-t-il si i18n ne charge pas ? Si matchMedia n'est pas supporté ? Si WebGL n'est pas disponible ? Si le réseau est lent ?
- **Code smell** : fonctions trop longues (>80 lignes), composants trop gros, duplication de logique, couplage excessif entre composants
- **Console.log** : y en a-t-il qui traînent en production ?
- **Dépendances** : y a-t-il des dépendances inutilisées dans `package.json` ? Des dépendances qui pourraient être remplacées par du code natif ?

Fichiers à examiner : TOUS les fichiers dans `src/` (components, constants, data, hooks, utils, types, i18n)

## Agent 4 — Couverture de tests

Auditer les tests existants et proposer un plan de tests.

Vérifier :
- **Tests existants** : lire `src/__tests__/app.test.tsx` et `src/__tests__/setup.ts`. Qu'est-ce qui est testé ? Qu'est-ce qui NE L'EST PAS ?
- **Setup** : les mocks (Three.js, matchMedia, IntersectionObserver, ResizeObserver) sont-ils corrects et complets ?
- **Gaps critiques** : lister les composants/hooks/utils qui n'ont AUCUN test. Prioriser par risque (un composant qui fait du calcul > un composant qui fait du rendu statique)
- **Proposition de tests** : pour chaque gap identifié, proposer 2-3 cas de test concrets avec des descriptions claires. Exemples :
  - `useIsMobile`: teste le hook avec différentes largeurs de viewport
  - `ScrollReveal`: teste que les éléments apparaissent quand IntersectionObserver les détecte
  - `Navbar`: teste le scroll spy, le toggle langue, le menu mobile
  - `cn()`: teste la fusion de classes conditionnelles
- **Tests d'intégration** : quels flows utilisateur méritent des tests end-to-end ?
- **Configuration** : est-ce que `vitest.config.ts` est bien configuré ? Manque-t-il un coverage reporter ?

Fichiers à examiner : `src/__tests__/`, `vitest.config.ts`, puis TOUS les composants dans `src/components/` et `src/hooks/`

---

Après avoir reçu les 4 rapports, CONSOLIDE les résultats en un seul document `docs/AUDIT-REPORT.md` avec :

1. **Résumé exécutif** (5 lignes max)
2. **Findings HIGH** — tout ce qui est bloquant ou risqué en production
3. **Findings MEDIUM** — améliorations recommandées
4. **Findings LOW** — nice-to-have, perfectionnisme
5. **Plan d'action** — liste ordonnée des corrections à faire, groupées par priorité, avec les fichiers concernés

Ne modifie AUCUN fichier de code. Cet audit est en lecture seule.
