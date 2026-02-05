import { useRef, useState, useEffect } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Lock at final state after first reveal (default: true) */
  once?: boolean;
  /** Vertical offset in px to slide up from (default: 60, use 0 for opacity-only) */
  yOffset?: number;
  /** Delay in seconds before the reveal animation starts (default: 0) */
  delay?: number;
}

export default function ScrollReveal({
  children,
  className,
  once = true,
  yOffset = 60,
  delay = 0,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });
  const [transitionDone, setTransitionDone] = useState(false);

  const skip = prefersReducedMotion;
  const revealed = skip || isInView;

  useEffect(() => {
    if (revealed && !transitionDone) {
      const timer = setTimeout(
        () => setTransitionDone(true),
        (delay + 0.8) * 1000 + 100,
      );
      return () => clearTimeout(timer);
    }
  }, [revealed, transitionDone, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? undefined : `translateY(${yOffset}px)`,
        transition: transitionDone
          ? undefined
          : `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
