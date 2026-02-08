import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useIsMobile } from "../../hooks/useIsMobile";
import { cn } from "../../utils/cn";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/** Radius (px) of the inner spotlight gradient */
const SPOTLIGHT_RADIUS = 200;
/** Radius (px) of the outer border-glow gradient */
const BORDER_GLOW_RADIUS = 400;

export default function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = useIsMobile();

  function handleMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(${SPOTLIGHT_RADIUS}px circle at ${x}px ${y}px, rgba(34,211,238,0.04), transparent 70%)`,
  );

  const borderGlow = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(${BORDER_GLOW_RADIUS}px circle at ${x}px ${y}px, rgba(34,211,238,0.04), transparent 70%)`,
  );

  // Mobile: no spotlight, just render the card
  if (isMobile) {
    return <div className={cn("h-full", className)}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("group relative h-full overflow-hidden", className)}
    >
      {children}
      {/* Border glow — sits behind the border, bleeding outside by 1px */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: borderGlow }}
      />
      {/* Inner spotlight — soft radial fill inside the card */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />
    </div>
  );
}
