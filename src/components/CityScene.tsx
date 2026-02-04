import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════
   CityScene — Animated pixel-art city skyline
   5 parallax layers: MID → FG → FRONT → GROUND + sky elements
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Palette ─── */
const SKY = "#0c1222";
const MID_CLR = "#1e293b"; // slate-800  — distant buildings
const FG_CLR = "#283548"; // slate-700ish — windowed layer
const FRONT_CLR = "#0a1018"; // near-black  — closest silhouettes
const CYAN = "#22d3ee"; // cyan-400    — windows, accents
const STAR_CLR = "#e2e8f0"; // slate-200   — stars, moon

/* ─── Dimensions ─── */
const W = 800;
const H = 160;

/* ─── Scroll speeds (seconds per full loop) ─── */
const SPEED_MID = 300;
const SPEED_FG = 240;
const SPEED_FRONT = 55;

/* ─── Shared types ─── */
interface Bldg {
  x: number;
  w: number;
  h: number;
}

interface FgWin {
  x: number;
  y: number;
  pulse: boolean;
  delay: number;
}

interface SmallWin {
  x: number;
  y: number;
}

/* ═══════════════════════════════════════════════════════════════════
   Layer data — ordered back to front
   ═══════════════════════════════════════════════════════════════════ */

/* ─── MID layer — thin spires + wide low blocks, distinct from FG ─── */
const MID_BUILDINGS: Bldg[] = [
  { x: 10, w: 12, h: 65 },
  { x: 55, w: 10, h: 52 },
  { x: 90, w: 70, h: 28 },
  { x: 195, w: 14, h: 70 },
  { x: 240, w: 55, h: 22 },
  { x: 330, w: 11, h: 58 },
  { x: 355, w: 13, h: 38 },
  { x: 400, w: 65, h: 25 },
  { x: 500, w: 12, h: 62 },
  { x: 545, w: 60, h: 20 },
  { x: 640, w: 14, h: 55 },
  { x: 685, w: 50, h: 24 },
  { x: 760, w: 11, h: 60 },
];

/** Only wide MID buildings get faded cyan windows */
const MID_WIN_SOURCES: Bldg[] = [
  { x: 90, w: 70, h: 28 },
  { x: 240, w: 55, h: 22 },
  { x: 400, w: 65, h: 25 },
  { x: 545, w: 60, h: 20 },
  { x: 685, w: 50, h: 24 },
];

/** Thin MID buildings get small dark windows for texture */
const MID_THIN_SOURCES: Bldg[] = [
  { x: 10, w: 12, h: 65 },
  { x: 55, w: 10, h: 52 },
  { x: 195, w: 14, h: 70 },
  { x: 330, w: 11, h: 58 },
  { x: 355, w: 13, h: 38 },
  { x: 500, w: 12, h: 62 },
  { x: 640, w: 14, h: 55 },
  { x: 760, w: 11, h: 60 },
];

/* ─── FG layer — main buildings with windows + antennas ─── */
const FG_BUILDINGS: Bldg[] = [
  { x: 30, w: 40, h: 80 },
  { x: 95, w: 48, h: 100 },
  { x: 168, w: 36, h: 70 },
  { x: 228, w: 44, h: 105 },
  { x: 300, w: 40, h: 82 },
  { x: 370, w: 52, h: 115 },
  { x: 450, w: 42, h: 90 },
  { x: 520, w: 50, h: 108 },
  { x: 600, w: 38, h: 75 },
  { x: 660, w: 48, h: 95 },
  { x: 735, w: 44, h: 68 },
];

/** Indices into FG_BUILDINGS that get rooftop antennas */
const ANTENNA_INDICES = [1, 3, 5, 7, 9];

/* ─── FRONT layer — low silhouettes with varied rooflines ─── */
const FRONT_PATHS: string[] = [
  "M-5,160 V138 H10 V132 L22,125 L34,132 V138 H48 V160 Z",
  "M95,160 V140 H110 V135 H114 V140 H155 V160 Z",
  "M205,160 V142 H230 V148 H255 V160 Z",
  "M308,160 V144 H328 V160 Z M311,144 V136 H325 V144 Z M314,136 V131 H322 V136 Z",
  "M390,160 V145 H405 V140 H418 V135 H432 V140 H445 V160 Z",
  "M505,160 V148 H540 V160 Z M518,148 V138 H524 V148 Z",
  "M595,160 V140 L615,130 L635,140 V160 Z",
  "M695,160 V146 H720 V160 Z M732,160 V142 H752 V160 Z",
  "M790,160 V144 H808 V138 H815 V144 H830 V160 Z",
];

/* ─── Stars ─── */
const STARS = [
  { cx: 25, cy: 42, r: 0.7 },
  { cx: 80, cy: 58, r: 0.4 },
  { cx: 130, cy: 35, r: 0.5 },
  { cx: 175, cy: 50, r: 0.9 },
  { cx: 220, cy: 40, r: 0.4 },
  { cx: 270, cy: 55, r: 1.0 },
  { cx: 315, cy: 38, r: 0.6 },
  { cx: 370, cy: 48, r: 1.2 },
  { cx: 420, cy: 36, r: 0.5 },
  { cx: 465, cy: 52, r: 0.8 },
  { cx: 510, cy: 42, r: 0.3 },
  { cx: 555, cy: 60, r: 0.6 },
  { cx: 595, cy: 37, r: 1.1 },
  { cx: 640, cy: 50, r: 0.4 },
  { cx: 680, cy: 44, r: 0.7 },
  { cx: 720, cy: 56, r: 0.5 },
  { cx: 755, cy: 39, r: 0.9 },
  { cx: 50, cy: 62, r: 0.3 },
  { cx: 350, cy: 63, r: 0.3 },
  { cx: 620, cy: 64, r: 0.4 },
  { cx: 160, cy: 72, r: 0.4 },
  { cx: 390, cy: 78, r: 0.3 },
  { cx: 540, cy: 68, r: 0.5 },
  { cx: 700, cy: 75, r: 0.3 },
  { cx: 440, cy: 82, r: 0.4 },
];

/* ═══════════════════════════════════════════════════════════════════
   Pre-computed window data
   ═══════════════════════════════════════════════════════════════════ */

/** Deterministic pseudo-random building order for FG window animation */
function createBuildingDelayMap(): Map<number, number> {
  const indices = FG_BUILDINGS.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const seed = (i * 2654435761) >>> 0;
    const j = seed % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const map = new Map<number, number>();
  indices.forEach((bIdx, order) => map.set(bIdx, order));
  return map;
}

const BLDG_DELAY = createBuildingDelayMap();

function generateFgWindows(): FgWin[] {
  const wins: FgWin[] = [];
  FG_BUILDINGS.forEach((b, bIdx) => {
    const cols = Math.floor((b.w - 8) / 10);
    const rows = Math.floor((b.h - 10) / 12);
    const order = BLDG_DELAY.get(bIdx) ?? bIdx;
    const baseDelay = 0.5 + order * 0.25;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seed = (bIdx * 100 + r * 10 + c) * 2654435761;
        if ((seed >>> 0) % 100 > 30) continue;
        wins.push({
          x: b.x + 6 + c * 10,
          y: H - b.h + 8 + r * 12,
          pulse: (seed >>> 0) % 100 < 8,
          delay: baseDelay + r * 0.05,
        });
      }
    }
  });
  return wins;
}

function generateMidWindows(): SmallWin[] {
  const wins: SmallWin[] = [];
  MID_WIN_SOURCES.forEach((b, bIdx) => {
    const cols = Math.floor((b.w - 6) / 8);
    const rows = Math.floor((b.h - 8) / 10);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seed = (bIdx * 77 + r * 13 + c) * 2246822519;
        if ((seed >>> 0) % 100 > 28) continue;
        wins.push({
          x: b.x + 4 + c * 8,
          y: H - b.h + 6 + r * 10,
        });
      }
    }
  });
  return wins;
}

function generateMidThinWindows(): SmallWin[] {
  const wins: SmallWin[] = [];
  MID_THIN_SOURCES.forEach((b, bIdx) => {
    const rows = Math.floor((b.h - 6) / 10);
    for (let r = 0; r < rows; r++) {
      const seed = (bIdx * 53 + r * 17) * 1597334677;
      if ((seed >>> 0) % 100 > 15) continue; // ~1-2 windows per building
      wins.push({
        x: b.x + Math.floor(b.w / 2) - 1,
        y: H - b.h + 5 + r * 10,
      });
    }
  });
  return wins;
}

const FG_WINDOWS = generateFgWindows();
const MID_WINDOWS = generateMidWindows();
const MID_THIN_WINDOWS = generateMidThinWindows();

/* ═══════════════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════════════ */

/** Render Bldg[] as simple <rect> elements */
function Rects({ items, fill }: { items: Bldg[]; fill: string }) {
  return (
    <>
      {items.map((b, i) => (
        <rect key={i} x={b.x} y={H - b.h} width={b.w} height={b.h} fill={fill} />
      ))}
    </>
  );
}

/** Render SVG path silhouettes */
function Paths({ items, fill }: { items: string[]; fill: string }) {
  return (
    <>
      {items.map((d, i) => (
        <path key={i} d={d} fill={fill} />
      ))}
    </>
  );
}

/** Twinkling star field */
function StarField({ animate }: { animate: boolean }) {
  const reduced = useReducedMotion();
  return (
    <>
      {STARS.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill={STAR_CLR}
          initial={{ opacity: reduced ? 0.7 : 0 }}
          animate={
            animate
              ? { opacity: [0, 0.9, 0.25, 0.9] }
              : reduced
                ? { opacity: 0.7 }
                : undefined
          }
          transition={
            animate
              ? {
                  delay: 0.3 + i * 0.12,
                  duration: 2.5 + (i % 4),
                  repeat: Infinity,
                  repeatType: "mirror" as const,
                  ease: "easeInOut",
                }
              : undefined
          }
        />
      ))}
    </>
  );
}

/** Crescent moon with double cyan halo — fades in with the scene */
function Moon({ animate, showStatic }: { animate: boolean; showStatic: boolean }) {
  return (
    <motion.g
      initial={{ opacity: showStatic ? 1 : 0 }}
      animate={animate || showStatic ? { opacity: 1 } : undefined}
      transition={animate ? { delay: 0.8, duration: 1.2, ease: "easeOut" } : undefined}
    >
      <circle cx={590} cy={54} r={60} fill="url(#moon-outer-halo)" />
      <circle cx={590} cy={54} r={38} fill="url(#moon-halo)" />
      <circle cx={590} cy={54} r={7} fill={STAR_CLR} opacity={0.85} mask="url(#crescent-mask)" />
    </motion.g>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════════════════════ */

interface CitySceneProps {
  className?: string;
}

export default function CityScene({ className }: CitySceneProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const animate = isInView && !prefersReducedMotion;
  const showStatic = !!prefersReducedMotion;

  /* CSS scroll animations — GPU-accelerated translateX */
  const scroll = (seconds: number) =>
    animate ? { animation: `city-scroll ${seconds}s linear infinite` } : undefined;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      preserveAspectRatio="xMidYMax slice"
      overflow="hidden"
      aria-hidden="true"
    >
      {/* ─── Gradient definitions ─── */}
      <defs>
        <radialGradient id="moon-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CYAN} stopOpacity="0.12" />
          <stop offset="60%" stopColor={CYAN} stopOpacity="0.04" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moon-outer-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CYAN} stopOpacity="0.04" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mid-fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SKY} stopOpacity="0" />
          <stop offset="40%" stopColor={SKY} stopOpacity="0.2" />
          <stop offset="100%" stopColor={SKY} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="horizon-glow" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={CYAN} stopOpacity="0.06" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
        </linearGradient>
        <mask id="crescent-mask">
          <circle cx={590} cy={54} r={7} fill="white" />
          <circle cx={593.5} cy={52.5} r={6} fill="black" />
        </mask>
      </defs>

      {/* ─── Sky background ─── */}
      <rect width={W} height={H} fill={SKY} />

      {/* ─── Sky elements (static, no scroll) ─── */}
      <StarField animate={animate} />
      <Moon animate={animate} showStatic={showStatic} />

      {/* ─── MID layer — 300s scroll ─── */}
      <motion.g
        initial={{ opacity: showStatic ? 1 : 0 }}
        animate={animate || showStatic ? { opacity: 1 } : undefined}
        transition={animate ? { delay: 0.2, duration: 0.8 } : undefined}
      >
        <g style={scroll(SPEED_MID)}>
          <Rects items={MID_BUILDINGS} fill={MID_CLR} />
          {MID_WINDOWS.map((win, i) => (
            <rect
              key={i}
              x={win.x}
              y={win.y}
              width={3}
              height={4}
              rx={0.3}
              fill={CYAN}
              opacity={0.15}
            />
          ))}
          {MID_THIN_WINDOWS.map((win, i) => (
            <rect
              key={`t${i}`}
              x={win.x}
              y={win.y}
              width={3}
              height={4}
              rx={0.3}
              fill={CYAN}
              opacity={0.15}
            />
          ))}
          <g transform={`translate(${W}, 0)`}>
            <Rects items={MID_BUILDINGS} fill={MID_CLR} />
            {MID_WINDOWS.map((win, i) => (
              <rect
                key={i}
                x={win.x}
                y={win.y}
                width={3}
                height={4}
                rx={0.3}
                fill={CYAN}
                opacity={0.15}
              />
            ))}
            {MID_THIN_WINDOWS.map((win, i) => (
              <rect
                key={`t${i}`}
                x={win.x}
                y={win.y}
                width={2}
                height={3}
                fill="#141e2e"
                opacity={0.6}
              />
            ))}
          </g>
        </g>
      </motion.g>

      {/* ─── Atmospheric fog between MID and FG ─── */}
      <rect x={0} y={85} width={W} height={50} fill="url(#mid-fog)" />

      {/* ─── FG layer — 240s scroll, buildings + windows + antennas ─── */}
      <motion.g
        initial={{ opacity: showStatic ? 1 : 0 }}
        animate={animate || showStatic ? { opacity: 1 } : undefined}
        transition={animate ? { delay: 0.4, duration: 0.8 } : undefined}
      >
        <g style={scroll(SPEED_FG)}>
          {/* Primary set */}
          <Rects items={FG_BUILDINGS} fill={FG_CLR} />
          {ANTENNA_INDICES.map((idx) => {
            const b = FG_BUILDINGS[idx];
            const cx = b.x + b.w / 2;
            const top = H - b.h;
            return (
              <g key={idx}>
                <rect x={cx - 0.8} y={top - 12} width={1.6} height={12} fill={FG_CLR} />
                <circle cx={cx} cy={top - 13} r={1.2} fill={CYAN} opacity={0.6} />
              </g>
            );
          })}
          {FG_WINDOWS.map((win, i) =>
            win.pulse ? (
              <motion.rect
                key={i}
                x={win.x}
                y={win.y}
                width={5}
                height={7}
                rx={0.5}
                fill={CYAN}
                initial={{ opacity: showStatic ? 0.6 : 0 }}
                animate={
                  animate || showStatic
                    ? { opacity: [0.2, 0.85, 0.2] }
                    : undefined
                }
                transition={
                  animate
                    ? {
                        delay: win.delay + 0.5,
                        duration: 2.5 + (i % 3) * 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : undefined
                }
              />
            ) : (
              <motion.rect
                key={i}
                x={win.x}
                y={win.y}
                width={5}
                height={7}
                rx={0.5}
                fill={CYAN}
                initial={{ opacity: showStatic ? 0.6 : 0 }}
                animate={
                  animate
                    ? { opacity: 0.6 }
                    : showStatic
                      ? { opacity: 0.6 }
                      : undefined
                }
                transition={
                  animate ? { delay: win.delay, duration: 0.4 } : undefined
                }
              />
            ),
          )}

          {/* Duplicate set for seamless loop */}
          <g transform={`translate(${W}, 0)`}>
            <Rects items={FG_BUILDINGS} fill={FG_CLR} />
            {ANTENNA_INDICES.map((idx) => {
              const b = FG_BUILDINGS[idx];
              const cx = b.x + b.w / 2;
              const top = H - b.h;
              return (
                <g key={idx}>
                  <rect x={cx - 0.8} y={top - 12} width={1.6} height={12} fill={FG_CLR} />
                  <circle cx={cx} cy={top - 13} r={1.2} fill={CYAN} opacity={0.6} />
                </g>
              );
            })}
            {FG_WINDOWS.map((win, i) => (
              <rect
                key={i}
                x={win.x}
                y={win.y}
                width={5}
                height={7}
                rx={0.5}
                fill={CYAN}
                opacity={0.6}
              />
            ))}
          </g>
        </g>
      </motion.g>

      {/* ─── FRONT layer — 55s scroll, low silhouettes ─── */}
      <g style={scroll(SPEED_FRONT)}>
        <Paths items={FRONT_PATHS} fill={FRONT_CLR} />
        <g transform={`translate(${W}, 0)`}>
          <Paths items={FRONT_PATHS} fill={FRONT_CLR} />
        </g>
      </g>

      {/* ─── Ground line — thin static strip ─── */}
      <rect x={0} y={154} width={W} height={6} fill={FRONT_CLR} />

      {/* ─── Horizon glow ─── */}
      <rect x={0} y={H - 40} width={W} height={40} fill="url(#horizon-glow)" />
    </svg>
  );
}
